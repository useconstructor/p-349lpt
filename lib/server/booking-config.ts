import type { BookingConfig, CatalogData, Resource } from './booking-engine';
type Offering = {id:string;nombre:string;descripcion:string;precio:number;recursos:Resource[]};
const dishes = [
 ['pastor','Pastor','Cerdo adobado, piña y cilantro.',35,'e548674ad5c7140466f283a4242f1b2c764b127b6239bf328c2c93cd5850e2e8'],
 ['suadero','Suadero','Suadero al comal, cebolla y cilantro.',40,'993fe98b0a691ba7a1affc0bf1d009a7575de92995a20a4a93b2ff3638d63cf5'],
 ['birria','Birria','Res guisada con chiles y especias; consomé para acompañar.',55,'65d02ca61e0ea9cf84475f8e25c6906470e00c63b94199f7867380130d1ca91b'],
 ['nopal','Nopal','Nopal asado, cebolla y salsa verde.',35,'24244d62549a5ebe0f758c5fbaee9dbba4687f2c38124f98bc30e117ddfcaeff'],
 ['quesadilla','Quesadilla','Tortilla de maíz y queso fundido.',50,'5f4318ef9c579a355be65fceeecde456562224ddba6778f7c5fc2d4fbd120725'],
 ['jamaica','Agua de jamaica','Flor de jamaica, agua y un toque dulce.',35,'026206d8d13a8ac9ed9bfd2614a0e257b33033db230508e58402c7d99e7670d5']
] as const;
const catalog: CatalogData & {oferta:Offering[]} = {
 version:1,presentacionVersion:1,moneda:'MXN',zonaHoraria:'America/Mexico_City',
 opciones:[{id:'mesa',nombre:'Mesa',descripcion:'Reserva sin cobro para 1 a 8 personas, por 30 minutos. Capacidad compartida de 16 lugares por turno; los platillos no forman parte de la reserva.',precio:0,duracionMinutos:30,recursos:[{id:'booking-context-1',version:1,url:'/images/booking-context-1-v1.jpg',sha256:'8faae1200b4ec4027d5b9139fb726ea6baf6f2efe858e2958c0ebd0215fdcdc5',alt:'Suadero sobre un comal: fotografía representativa de la preparación de tacos, no del local ficticio.',width:2832,height:2128}]}],
 politica:{diasSemana:[0,1,2,3,4,5,6],horas:['13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30','20:00','20:30','21:00'],minPersonas:1,maxPersonas:8,capacidad:16,capacidadCompartida:true},
 oferta:dishes.map(([id,nombre,descripcion,precio,sha256])=>({id,nombre,descripcion,precio,recursos:[{id:'menu-'+id,version:1,url:'/images/menu-'+id+'-v1.svg',sha256,alt:'Ilustración original de ejemplo: '+nombre+'. '+descripcion,width:480,height:320}]}))
};
export function getBookingConfig():BookingConfig {
 const appOrigin=process.env.APP_ORIGIN;
 if(!appOrigin) throw new Error('APP_ORIGIN is required');
 if(catalog.oferta.some(o=>o.recursos.some(r=>! /^[a-f0-9]{64}$/i.test(r.sha256)))) throw new Error('Menu asset hashes must be resolved by trusted staging before initialization');
 return {catalog,appOrigin,vercelUrl:process.env.VERCEL_URL || undefined,namespace:'booking'};
}
