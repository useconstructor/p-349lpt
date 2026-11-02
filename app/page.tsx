import Link from "next/link";

const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B72D24]";

const dishes = [
  { name: "Pastor", description: "Cerdo adobado, piña y cilantro.", price: 35 },
  { name: "Suadero", description: "Suadero al comal, cebolla y cilantro.", price: 40 },
  { name: "Birria", description: "Res guisada con chiles y especias.", price: 55 },
  { name: "Nopal", description: "Nopal asado, cebolla y salsa verde.", price: 35 },
  { name: "Quesadilla", description: "Tortilla de maíz y queso fundido.", price: 50 },
  { name: "Agua de jamaica", description: "Flor de jamaica, agua y un toque dulce.", price: 35 },
];

function ComalMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" className={className}>
      <path d="M25 21c-7-8 8-9 3-17M38 21c-6-7 8-10 4-16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="32" cy="37" rx="25" ry="13" stroke="currentColor" strokeWidth="3" />
      <path d="M7 37v7c0 8 11 14 25 14s25-6 25-14v-7M2 37h5m50 0h5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M19 36c3-9 18-11 26 0-7 7-19 7-26 0Z" fill="currentColor" />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-clip bg-[#FFF7DD] font-sans text-[#163C2D] selection:bg-[#F2BF4B] selection:text-[#163C2D]" style={{ backgroundImage: "radial-gradient(rgba(22,60,45,0.055) 0.6px, transparent 0.6px)", backgroundSize: "7px 7px" }}>
      <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%23FFF7DD'/%3E%3Cg fill='none' stroke='%23B72D24' stroke-width='3' stroke-linecap='round'%3E%3Cpath d='M25 21c-7-8 8-9 3-17M38 21c-6-7 8-10 4-16'/%3E%3Cellipse cx='32' cy='37' rx='25' ry='13'/%3E%3Cpath d='M7 37v7c0 8 11 14 25 14s25-6 25-14v-7M2 37h5m50 0h5'/%3E%3C/g%3E%3Cpath d='M19 36c3-9 18-11 26 0-7 7-19 7-26 0Z' fill='%23B72D24'/%3E%3C/svg%3E" />
      <a href="#contenido" className={`sr-only z-50 bg-[#FFF7DD] p-4 focus:not-sr-only focus:absolute focus:left-4 focus:top-4 ${focus}`}>Saltar al contenido</a>
      <header className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-x-5 gap-y-3 border-b border-[#163C2D]/25 px-5 py-4 sm:px-8 lg:px-14">
        <Link href="/" aria-label="Comal Vivo, inicio" className={`flex items-center gap-2 text-[#B72D24] ${focus}`}>
          <ComalMark className="h-10 w-10 sm:h-12 sm:w-12" />
          <span className="font-serif text-[27px] font-black italic leading-none tracking-[-0.06em] sm:text-3xl">Comal Vivo</span>
        </Link>
        <nav aria-label="Navegación principal" className="flex items-center gap-5 text-base sm:gap-7">
          <Link href="/menu" className={`inline-flex min-h-11 items-center decoration-[#B72D24] underline-offset-4 hover:underline ${focus}`}>Menú</Link>
          <Link href="/mis-reservas" className={`inline-flex min-h-11 items-center decoration-[#B72D24] underline-offset-4 hover:underline ${focus}`}>Mis reservas</Link>
          <Link href="/reservar" className={`hidden border-b-2 border-[#B72D24] font-semibold sm:inline ${focus}`}>Reservar ↗</Link>
        </nav>
      </header>

      <main id="contenido">
        <section aria-labelledby="hero-title" className="mx-auto max-w-[1440px] px-5 pt-7 sm:px-8 sm:pt-10 lg:px-14">
          <div className="flex items-center justify-between gap-4 text-sm sm:text-base">
            <div><p>Taquería · Roma Norte, CDMX</p><p className="mt-1 text-xs text-[#163C2D]/80">Demostración de una taquería ficticia</p></div>
            <span className="hidden italic sm:inline">Maíz, comal y buena mesa.</span>
          </div>
          <h1 id="hero-title" className="mt-3 font-serif text-[clamp(4.1rem,10.8vw,10rem)] font-black italic leading-[0.98] tracking-[-0.065em] text-[#B72D24]">El fuego <span className="inline-block">reúne.</span></h1>
          <div className="mb-6 mt-5 flex flex-col justify-between gap-5 md:flex-row md:items-end lg:mb-8">
            <p className="max-w-[31rem] text-lg leading-relaxed sm:text-xl">La tortilla caliente. La salsa al centro.<br className="hidden sm:block" /> Y ese primer taco que invita a quedarse.</p>
            <div className="flex flex-wrap items-center gap-5 sm:gap-7">
              <Link href="/reservar" className={`inline-flex min-h-12 items-center justify-center gap-6 rounded-[3px] bg-[#B72D24] px-6 py-3 text-base font-semibold text-[#FFF7DD] hover:bg-[#163C2D] ${focus}`}>Reservar mesa <span aria-hidden="true">↗</span></Link>
              <Link href="/menu" className={`py-3 text-base font-semibold underline decoration-[#B72D24] underline-offset-4 ${focus}`}>Explorar el menú</Link>
            </div>
          </div>
          <figure>
            <div className="relative overflow-hidden rounded-t-[38%_13%] rounded-b-[3px] bg-[#163C2D] sm:rounded-t-[42%_19%]">
              <img src="/images/booking-context-1-v1.jpg" alt="Suadero sobre un comal: la carne y la superficie de cocción protagonizan la escena." fetchPriority="high" decoding="async" className="h-[285px] w-full object-cover object-center sm:h-[420px] lg:h-[530px]" />
              <div className="absolute bottom-3 left-3 bg-[#F2BF4B] px-3 py-1.5 text-[#163C2D] sm:bottom-7 sm:left-7 sm:rotate-[-3deg] sm:px-6 sm:py-3">
                <p className="font-serif text-lg font-bold italic sm:text-3xl">Aquí empieza el antojo.</p>
                <p className="mt-1 text-sm">Suadero al comal</p>
              </div>
            </div>
            <figcaption className="mt-3 max-w-4xl text-xs leading-relaxed text-[#163C2D]/80 sm:text-sm">
              Foto representativa de suadero, recortada para esta portada. Pedro Sanchez · <a href="https://commons.wikimedia.org/wiki/File:Tacos_de_suadero.jpg" className={`underline underline-offset-2 ${focus}`}>Wikimedia Commons</a> · <a href="https://creativecommons.org/licenses/by-sa/3.0/" className={`underline underline-offset-2 ${focus}`}>CC BY-SA 3.0</a>. No representa los demás platillos.
            </figcaption>
          </figure>
        </section>

        <section aria-labelledby="story-title" className="mx-auto grid max-w-[1440px] gap-7 px-5 py-14 sm:px-8 sm:py-20 md:grid-cols-[1fr_1.1fr] md:gap-14 lg:px-14">
          <div>
            <p className="mb-4 text-base text-[#B72D24]">Nuestra idea de una taquería</p>
            <h2 id="story-title" className="max-w-lg font-serif text-4xl font-bold leading-[1.08] tracking-[-0.035em] sm:text-5xl">Un comal al centro.<br /><span className="italic">Lo demás se comparte.</span></h2>
          </div>
          <div className="max-w-xl space-y-5 text-lg leading-relaxed md:pt-9">
            <p>Comal Vivo nace de una idea sencilla: la mejor parte de sentarse a comer es hacerlo sin prisa. Una tortilla que recibe el guiso, un poco de cebolla, la salsa que cada quien elige.</p>
            <p>Imaginamos un rincón de Roma Norte donde el maíz marca el ritmo y el comal es punto de encuentro. Una carta corta para volver al antojo de siempre o probar algo distinto.</p>
          </div>
        </section>

        <section aria-labelledby="menu-title" className="border-y border-[#163C2D]/25 bg-[#F2BF4B]/20">
          <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 sm:py-16 lg:px-14">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
              <div>
                <p className="mb-3 text-base text-[#B72D24]">Del comal y para acompañar</p>
                <h2 id="menu-title" className="font-serif text-5xl font-black italic tracking-[-0.045em] sm:text-6xl">Seis buenos antojos.</h2>
              </div>
              <p className="text-sm">Precios de ejemplo · MXN</p>
            </div>
            <dl className="grid gap-x-12 md:grid-cols-2 lg:gap-x-20">
              {dishes.map((dish) => (
                <div key={dish.name} className="grid grid-cols-[1fr_auto] gap-x-4 border-t border-[#163C2D]/30 py-5 sm:py-6">
                  <dt className="font-serif text-2xl font-bold sm:text-3xl">{dish.name}</dt>
                  <dd className="self-center text-xl font-semibold tabular-nums">${dish.price}</dd>
                  <dd className="col-span-2 mt-2 text-base leading-relaxed">{dish.description}</dd>
                </div>
              ))}
            </dl>
            <Link href="/menu" className={`mt-7 inline-flex min-h-12 items-center gap-8 border-b-2 border-[#B72D24] text-lg font-semibold ${focus}`}>Conoce la carta completa <span aria-hidden="true">↗</span></Link>
          </div>
        </section>

        <section aria-labelledby="visit-title" className="mx-auto grid max-w-[1440px] gap-10 px-5 py-14 sm:px-8 sm:py-20 md:grid-cols-2 md:gap-14 lg:px-14">
          <div>
            <ComalMark className="mb-5 h-16 w-16 text-[#B72D24]" />
            <h2 id="visit-title" className="font-serif text-5xl font-bold leading-[1.05] tracking-[-0.04em] sm:text-6xl">Nos vemos<br /><span className="italic text-[#B72D24]">junto al comal.</span></h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed">Para una comida tranquila o un antojo de tarde. Hazle un espacio a la sobremesa.</p>
          </div>
          <div className="md:pt-4">
            <dl className="text-base">
              <div className="border-t border-[#163C2D]/30 py-5">
                <dt className="mb-2 font-semibold">Dónde nos imaginamos</dt>
                <dd className="font-serif text-2xl">Roma Norte, Ciudad de México</dd>
                <dd className="mt-2 leading-relaxed">Ubicación conceptual, sin dirección física.</dd>
              </div>
              <div className="border-t border-[#163C2D]/30 py-5">
                <dt className="mb-2 font-semibold">Horario de la taquería</dt>
                <dd className="font-serif text-2xl">Todos los días · 13:00–22:00</dd>
                <dd className="mt-2 leading-relaxed">Reservas de 1 a 8 personas. Turnos cada 30 minutos, de 13:00 a 21:00. Hora de Ciudad de México.</dd>
              </div>
            </dl>
            <Link href="/reservar" className={`mt-3 inline-flex min-h-12 items-center gap-8 rounded-[3px] bg-[#163C2D] px-6 py-3 font-semibold text-[#FFF7DD] hover:bg-[#B72D24] ${focus}`}>Elegir fecha y turno <span aria-hidden="true">↗</span></Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#163C2D]/25 px-5 py-7 sm:px-8 lg:px-14">
        <div className="mx-auto flex max-w-[1328px] flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <p className="font-serif text-3xl font-black italic tracking-[-0.05em] text-[#B72D24]">Comal Vivo</p>
          <p className="max-w-lg text-sm leading-relaxed sm:text-right">Demostración de una taquería ficticia. Ubicación, carta y precios de ejemplo. No se realizan pagos ni se envían mensajes.</p>
        </div>
      </footer>
    </div>
  );
}
