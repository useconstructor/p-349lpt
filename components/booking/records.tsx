'use client';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BrandPage, BrandNotice, WorkshopEdge } from '@/components/brand';
import { useBookingController } from '@/lib/client/booking/use-booking-controller';
import { useNativeBookingDialog } from '@/lib/client/booking/presentation';
import { detailHref, formatDate, loadOwnedCode } from '@/lib/client/booking/business';
import type { Reservation } from '@/lib/client/booking/types';
import { Action, ContextMedia, PhotoCredit, textLinkClass } from './primitives';
import { DraftConflictPanel, RecoveryPanel, SessionProblem } from './feedback';

const timestamp = (value: string) => new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/Mexico_City' }).format(new Date(value));

type AuthorizedSnapshot = { identity: string; rows: Reservation[]; record: Reservation | null };
type ReadState = { identity: string; status: 'loading' | 'verified' | 'error'; error: string };

export function PrivateRecords({ mode, id = '', codigo = '' }: { mode: 'history' | 'detail' | 'confirmation'; id?: string; codigo?: string }) {
  const { state, controller } = useBookingController();
  const router = useRouter();
  const identity = JSON.stringify([mode, id, codigo]);
  const activeIdentity = useRef(identity); activeIdentity.current = identity;
  const [snapshot, setSnapshot] = useState<AuthorizedSnapshot | null>(null);
  const [read, setRead] = useState<ReadState>({ identity, status: 'loading', error: '' });
  const visibleSnapshot = snapshot?.identity === identity ? snapshot : null;
  const rows = visibleSnapshot?.rows ?? [];
  const record = visibleSnapshot?.record ?? null;
  const loading = read.identity !== identity || read.status === 'loading';
  const error = read.identity === identity ? read.error : '';
  const verified = read.identity === identity && read.status === 'verified';
  const authorizedRead = useRef<{ identity: string; id: string } | null>(null);
  const openedRecord = useRef<{ identity: string; id: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [copyMessage, setCopyMessage] = useState<{ id: string; message: string } | null>(null);
  const lock = useRef(false);
  const sequence = useRef(0);
  const trigger = useRef<HTMLButtonElement>(null);
  const dialog = useNativeBookingDialog({ triggerRef: trigger });
  const reload = useCallback(async () => {
    const ticket = ++sequence.current;
    const current = () => ticket === sequence.current && activeIdentity.current === identity;
    authorizedRead.current = null;
    setSnapshot(previous => previous?.identity === identity ? previous : null);
    setRead({ identity, status: 'loading', error: '' });
    try {
      await controller.start();
      if (!current()) return;
      if (mode === 'history') {
        const result = await controller.loadReservations();
        if (current()) { setSnapshot({ identity, rows: result, record: null }); setRead({ identity, status: 'verified', error: '' }); }
      } else {
        const result = codigo ? await loadOwnedCode(controller, codigo) : await controller.loadRecord(id);
        if (current()) {
          setSnapshot({ identity, rows: [], record: result });
          authorizedRead.current = { identity, id: result.id };
          setRead({ identity, status: 'verified', error: '' });
        }
      }
    } catch (issue) {
      if (current()) setRead({ identity, status: 'error', error: issue instanceof Error ? issue.message : 'No pudimos consultar tus reservas.' });
    }
  }, [controller, mode, id, codigo, identity]);
  useEffect(() => { void reload(); return () => { sequence.current++; }; }, [reload]);
  useEffect(() => { openedRecord.current = null; dialog.close(); }, [identity, dialog.close]);
  const canCancel = !!record && record.estado === 'activa' && verified && !busy && !state.pending;
  const openCancellation = () => {
    const authorization = authorizedRead.current;
    if (!canCancel || !record || activeIdentity.current !== identity || authorization?.identity !== identity || authorization.id !== record.id) return;
    openedRecord.current = { identity, id: record.id };
    dialog.open();
  };
  const cancel = async () => {
    const authorization = authorizedRead.current;
    if (!canCancel || !record || lock.current || activeIdentity.current !== identity || authorization?.identity !== identity || authorization.id !== record.id || openedRecord.current?.identity !== identity || openedRecord.current.id !== record.id) return;
    const ticket = ++sequence.current;
    const current = () => ticket === sequence.current && activeIdentity.current === identity;
    authorizedRead.current = null;
    lock.current = true; setBusy(true); setRead({ identity, status: 'loading', error: '' });
    try {
      const result = await controller.cancel(record.id);
      if (current()) {
        if (result && result.id === record.id) {
          setSnapshot({ identity, rows: [], record: result });
          authorizedRead.current = { identity, id: result.id };
          setRead({ identity, status: 'verified', error: '' });
        } else setRead({ identity, status: 'error', error: 'No pudimos confirmar la cancelación. Comprueba el resultado antes de volver a actuar.' });
        dialog.close();
      }
    } catch (issue) { if (current()) { setRead({ identity, status: 'error', error: issue instanceof Error ? issue.message : 'No pudimos confirmar la cancelación.' }); dialog.close(); } }
    finally { lock.current = false; setBusy(false); }
  };
  const recoveryPanel = <RecoveryPanel state={state} controller={controller} onRecovered={result => { if (mode === 'history' || result.id === record?.id || result.id === id || result.codigo === codigo) void reload(); else router.push(detailHref(result)); }} onNewIntent={() => void reload()} />;
  return <BrandPage title={mode === 'history' ? 'Tus reservas' : 'Tu mesa en Comal Vivo'} subtitle={mode === 'history' ? 'Las mesas que has reservado en esta sesión, con su estado y sus detalles.' : 'Un lugar para reunirnos alrededor del comal.'}>
    <div className="max-w-4xl pb-8">
      <SessionProblem state={state} controller={controller} />
      <DraftConflictPanel state={state} controller={controller} />
      {state.pending && recoveryPanel}
      {state.problem && !state.pending && state.phase !== 'session-blocked' && <BrandNotice kind="error" title="La consulta necesita tu atención"><p>{state.problem.message}</p></BrandNotice>}
      {loading && <p role="status" className="py-5">Buscando tu reserva…</p>}
      {error && <BrandNotice kind="error" title={visibleSnapshot ? "No pudimos actualizar el registro" : "No pudimos mostrar el registro"} action={<Action secondary disabled={loading} onClick={() => void reload()}>Reintentar consulta</Action>}><p>{error}</p></BrandNotice>}
      {visibleSnapshot && !verified && <BrandNotice kind="info" title="Última lectura verificada"><p>{error ? 'Mostramos los datos consultados anteriormente; no pudimos actualizarlos.' : 'Conservamos los datos consultados anteriormente mientras comprobamos la actualización.'} Su estado actual debe volver a verificarse.{record?.estado === 'activa' ? ' La cancelación estará disponible cuando termine una consulta correcta.' : ''}</p></BrandNotice>}
      {visibleSnapshot && mode === 'history' && (rows.length ? <ul className="space-y-5">{rows.map(row => <li key={row.id}><WorkshopEdge serviceName={row.opcionNombre} status={row.estado === 'cancelada' ? 'cancelled' : 'neutral'}><p>{formatDate(row.fecha)} · {row.hora} · Hora de Ciudad de México</p><p className="mt-2">{row.personas} personas · <strong>{row.estado === 'activa' ? 'Activa' : 'Cancelada'}</strong></p><p className="mt-2 text-sm">Código {row.codigo} · Reserva de mesa gratuita · 0 MXN</p><Link href={detailHref(row)} className={textLinkClass + ' mt-2'}>Abrir detalle y gestionar reserva</Link></WorkshopEdge></li>)}</ul> : <section className="border-y border-[var(--brand-primary)]/30 py-8"><h2 className="font-[family-name:var(--brand-font-heading)] text-3xl text-[var(--brand-primary)]">Todavía no hay reservas aquí.</h2><p className="mt-3">{verified ? 'Esta sesión no tiene registros guardados.' : 'La última consulta verificada no tenía registros guardados.'} Puedes consultar el menú; revisarlo no crea una reserva de mesa.</p><Link className={textLinkClass + ' mt-4'} href="/menu">Explorar el menú →</Link></section>)}
      {record && <div data-booking-record-id={record.id} data-booking-read-state={verified ? 'verified' : loading ? 'refreshing' : 'stale'}>
        <section aria-label="Resumen de tu reserva" className="border-y-2 border-[var(--brand-text)] py-6 sm:py-8">
          {verified ? <p role="status" className="mb-4 text-base font-semibold text-[var(--brand-primary)]">{record.estado === 'activa' ? 'Tu mesa está reservada.' : 'Esta reserva está cancelada.'}</p> : <p className="mb-4 font-semibold text-[var(--brand-muted)]">Tu mesa en la última lectura verificada</p>}
          <div className="flex items-start justify-between gap-4"><h2 className="font-[family-name:var(--brand-font-heading)] text-4xl font-black italic leading-none sm:text-5xl">{record.opcionNombre}</h2><svg aria-hidden="true" viewBox="0 0 64 64" fill="none" className="h-12 w-12 shrink-0 text-[var(--brand-primary)]"><path d="M25 21c-7-8 8-9 3-17M38 21c-6-7 8-10 4-16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><ellipse cx="32" cy="37" rx="25" ry="13" stroke="currentColor" strokeWidth="2"/><path d="M7 37v7c0 8 11 14 25 14s25-6 25-14v-7M2 37h5m50 0h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></div>
          <p className="mt-4 font-[family-name:var(--brand-font-heading)] text-2xl font-bold leading-tight sm:text-3xl">{formatDate(record.fecha)}</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums">{record.hora} <span className="px-1 text-[var(--brand-primary)]">·</span> {record.personas} personas</p>
          <p className="mt-2 text-sm text-[var(--brand-muted)]">Hora de Ciudad de México · {record.duracionMinutos} minutos</p>
          <p className="mt-5 border-t border-[var(--brand-text)]/30 pt-4 text-lg font-semibold">Reserva gratuita · 0 MXN</p><p className="mt-1 text-sm">Sin cobro por reservar; los platillos se eligen aparte.</p>
          <p className="mt-4 text-sm">{verified ? 'Estado' : 'Último estado verificado'}: <strong>{record.estado === 'activa' ? 'Activa' : 'Cancelada'}</strong> · Código <span className="font-semibold">{record.codigo}</span></p>
          <div className="mt-3"><Action secondary disabled={!verified || busy} onClick={async () => { const saved = record; try { await navigator.clipboard.writeText(saved.codigo); setCopyMessage({ id: saved.id, message: 'Código copiado.' }); } catch { setCopyMessage({ id: saved.id, message: 'No pudimos copiarlo. Puedes seleccionar el código que aparece arriba.' }); } }}>Copiar código</Action>{copyMessage?.id === record.id && <p role="status" className="mt-2 text-sm">{copyMessage.message}</p>}</div>
        </section>
        <div className="my-5 grid grid-cols-[112px_1fr] gap-4 sm:grid-cols-[180px_1fr]">{record.recursos[0] && <ContextMedia resource={record.recursos[0]} variant="compact" />}<div><p>{record.opcionDescripcion}</p><p className="mt-2 text-sm text-[var(--brand-muted)]">Imagen representativa de Comal Vivo; no muestra tu mesa ni a sus comensales.</p></div></div>
        <section className="mt-8 border-t border-[var(--brand-text)]/40 pt-5"><h2 className="mb-5 font-[family-name:var(--brand-font-heading)] text-2xl font-bold">Los datos de tu visita</h2><dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-5 gap-y-4 text-base [&_dt]:text-[var(--brand-muted)] [&_dd]:whitespace-pre-wrap [&_dd]:break-words">
          <dt>Nombre</dt><dd>{record.nombre}</dd><dt>Email</dt><dd>{record.email}</dd><dt>Teléfono</dt><dd>{record.telefono}</dd><dt>Notas</dt><dd>{record.notas === '' ? 'Sin notas' : record.notas}</dd></dl></section>
        <details className="mt-4 border-y border-[var(--brand-text)]/30 py-1"><summary className="min-h-11 cursor-pointer py-3 text-sm font-semibold underline underline-offset-4">Fechas de tu reserva</summary><dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-5 gap-y-3 text-base [&_dt]:text-[var(--brand-muted)] [&_dd]:break-words"><dt>Guardada</dt><dd><time dateTime={record.createdAt}>{timestamp(record.createdAt)}</time></dd><dt>Actualizada</dt><dd><time dateTime={record.updatedAt}>{timestamp(record.updatedAt)}</time></dd>{record.cancelledAt && <><dt>Cancelada</dt><dd><time dateTime={record.cancelledAt}>{timestamp(record.cancelledAt)}</time></dd></>}</dl><details className="mt-3"><summary className="min-h-11 cursor-pointer py-3 text-sm underline underline-offset-4">Ver fechas exactas guardadas</summary><dl className="grid gap-2 text-base [&_dd]:break-all [&_dd]:whitespace-pre-wrap"><dt>Guardada</dt><dd>{record.createdAt}</dd><dt>Actualizada</dt><dd>{record.updatedAt}</dd>{record.cancelledAt && <><dt>Cancelada</dt><dd>{record.cancelledAt}</dd></>}</dl></details></details>
        {record.estado === 'activa' ? <div className="mt-5"><Action ref={trigger} secondary disabled={!canCancel} onClick={openCancellation}>Cancelar reserva</Action><p className="mt-2 text-sm">Te pediremos confirmación antes de cancelar. Tus {record.personas} lugares se liberarán cuando la cancelación quede guardada.</p></div> : <p role="status" className="mt-5 font-semibold">{verified ? 'Cancelación guardada. Esta reserva ya no ocupa plazas.' : 'En la última lectura verificada, esta reserva figuraba cancelada.'}</p>}
        <PhotoCredit className="mt-6" />
      </div>}
      <nav aria-label="Opciones de tus reservas" className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[var(--brand-text)]/30 pt-4"><button type="button" disabled={loading || busy} onClick={() => void reload()} className={textLinkClass + ' text-sm disabled:opacity-50'}>{loading ? 'Actualizando…' : mode === 'history' ? 'Actualizar mis reservas' : 'Actualizar reserva'}</button><Link href="/menu" className={textLinkClass + ' text-sm'}>Ver el menú</Link>{mode !== 'history' && <Link href="/mis-reservas" className={textLinkClass + ' text-sm'}>Mis reservas</Link>}</nav>
      {!state.pending && <div className="mt-5">{recoveryPanel}</div>}
      <dialog ref={dialog.dialogRef} aria-labelledby="cancel-title" className="m-auto w-[calc(100%-40px)] max-w-lg border-2 border-[var(--brand-primary)] bg-[var(--brand-background)] p-6 text-[var(--brand-text)] backdrop:bg-black/60"><h2 id="cancel-title" className="font-[family-name:var(--brand-font-heading)] text-3xl text-[var(--brand-primary)]">¿Cancelar tu reserva de mesa?</h2><p className="my-4">Cancelarás la reserva {record?.codigo} de {record?.opcionNombre}, del {record ? formatDate(record.fecha) : ''} a las {record?.hora}. Se liberarán las {record?.personas} plazas de tu grupo solo cuando el servidor confirme la cancelación.</p><div className="flex flex-wrap gap-3"><Action autoFocus secondary disabled={busy} onClick={() => dialog.close()}>Conservar reserva</Action><Action disabled={!canCancel} onClick={() => void cancel()}>{busy ? 'Comprobando cancelación…' : 'Sí, cancelar reserva'}</Action></div></dialog>
    </div>
  </BrandPage>;
}
