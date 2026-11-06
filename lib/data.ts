export type Pilar = "Aventura" | "Conexión" | "Emprendedurismo" | "Bienestar";
export type Categoria = "Mercado" | "Música" | "Comida" | "Taller";

export const PILARES: { id: Pilar; texto: string; foto: string }[] = [
  { id: "Aventura", texto: "Rutas, volcanes y playas", foto: "/images/caminata.jpg" },
  { id: "Conexión", texto: "Música y buena compañía", foto: "/images/luces.jpg" },
  { id: "Emprendedurismo", texto: "Mercaditos y talento local", foto: "/images/mercado.jpg" },
  { id: "Bienestar", texto: "Movimiento y pausas", foto: "/images/yoga.jpg" },
];

export type FiltroCategoria = "todo" | "mercado" | "musica" | "comida" | "taller" | "gratis";
export const FILTROS: { id: FiltroCategoria; label: string }[] = [
  { id: "todo", label: "Todo" }, { id: "mercado", label: "Mercados" }, { id: "musica", label: "Música" },
  { id: "comida", label: "Comida" }, { id: "taller", label: "Talleres" }, { id: "gratis", label: "Gratis" },
];

export interface Evento {
  id: string;
  titulo: string;
  categoria: Categoria;
  pilar: Pilar;
  fecha: string; // YYYY-MM-DD
  hora: string;
  lugar: string;
  zona: string;
  precio: number; // 0 = gratis
  parqueo: boolean;
  mascotas: boolean;
  organizador: string;
  verificado: boolean;
  actualizado: string; // YYYY-MM-DD
  foto: string;
  descripcion: string;
}

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
export const enDias = (n: number) => { const d = new Date(); d.setDate(d.getDate() + n); return iso(d); };
export const hoyISO = () => iso(new Date());
const dow = new Date().getDay();
const SAB = (6 - dow + 7) % 7;
const DOM = (7 - dow) % 7;
/** Rango [desde, hasta] de "este finde": sáb-dom próximos, o lo que quede si ya es finde. */
export function rangoFinde(): [string, string] {
  const d = new Date().getDay();
  if (d === 0) return [enDias(0), enDias(0)];
  if (d === 6) return [enDias(0), enDias(1)];
  return [enDias(SAB), enDias(DOM)];
}

export const ZONAS: { nombre: string; lat: number; lng: number }[] = [
  { nombre: "San Salvador", lat: 13.69, lng: -89.19 },
  { nombre: "Santa Tecla", lat: 13.68, lng: -89.28 },
  { nombre: "La Libertad", lat: 13.49, lng: -89.32 },
  { nombre: "Santa Ana", lat: 13.99, lng: -89.56 },
  { nombre: "Juayúa", lat: 13.84, lng: -89.75 },
  { nombre: "San Miguel", lat: 13.48, lng: -88.18 },
];
export function distancia(desde: string, hasta: string) {
  const a = ZONAS.find((z) => z.nombre === desde), b = ZONAS.find((z) => z.nombre === hasta);
  if (!a || !b) return 999;
  return Math.hypot(a.lat - b.lat, a.lng - b.lng);
}

export const EVENTOS: Evento[] = [
  { id: "e1", titulo: "Mercadito del Volcán", categoria: "Mercado", pilar: "Emprendedurismo", fecha: enDias(SAB), hora: "9:00 a. m.", lugar: "Parque Cafetalón", zona: "Santa Tecla", precio: 0, parqueo: true, mascotas: true, organizador: "Manos del Valle", verificado: true, actualizado: enDias(-2), foto: "/images/mercado.jpg", descripcion: "Más de 40 emprendimientos locales con café de altura, artesanías y plantas, con el volcán de fondo." },
  { id: "e2", titulo: "Atardecer con ritmos de la costa", categoria: "Música", pilar: "Conexión", fecha: enDias(DOM), hora: "4:30 p. m.", lugar: "Playa El Sunzal", zona: "La Libertad", precio: 12, parqueo: true, mascotas: false, organizador: "Costa Sonora", verificado: true, actualizado: enDias(-1), foto: "/images/concierto.jpg", descripcion: "Tres bandas en vivo frente al mar. Lleva tu toalla y llega temprano para ver caer el sol." },
  { id: "e3", titulo: "Ruta de pupusas y café", categoria: "Comida", pilar: "Bienestar", fecha: enDias(SAB + 7), hora: "10:00 a. m.", lugar: "Ruta de las Flores", zona: "Juayúa", precio: 18, parqueo: true, mascotas: true, organizador: "Sabores del Cielo", verificado: true, actualizado: enDias(-3), foto: "/images/comida.jpg", descripcion: "Recorrido guiado por cinco paradas de comida típica, con degustación incluida." },
  { id: "e4", titulo: "Taller de cerámica con añil", categoria: "Taller", pilar: "Bienestar", fecha: enDias(2), hora: "2:00 p. m.", lugar: "Casa Añil", zona: "San Salvador", precio: 25, parqueo: false, mascotas: false, organizador: "Casa Añil", verificado: false, actualizado: enDias(-1), foto: "/images/ceramica.jpg", descripcion: "Aprende a moldear y teñir con añil natural. Te llevas tu pieza a casa." },
  { id: "e5", titulo: "Caminata al amanecer: Cerro Verde", categoria: "Taller", pilar: "Aventura", fecha: enDias(SAB + 14), hora: "5:30 a. m.", lugar: "Parque Nacional Cerro Verde", zona: "Santa Ana", precio: 15, parqueo: true, mascotas: true, organizador: "Rumbo Trekkers", verificado: true, actualizado: enDias(-4), foto: "/images/caminata.jpg", descripcion: "Sube con guía hasta el mirador y desayuna viendo el Izalco. Nivel fácil a medio." },
  { id: "e6", titulo: "Noche de food trucks", categoria: "Comida", pilar: "Conexión", fecha: enDias(DOM), hora: "6:00 p. m.", lugar: "Plaza Gerardo Barrios", zona: "San Salvador", precio: 0, parqueo: false, mascotas: true, organizador: "Ruedas y Sabor", verificado: true, actualizado: enDias(-1), foto: "/images/parrilla.jpg", descripcion: "Doce food trucks, música de fondo y mesas compartidas en pleno centro." },
  { id: "e7", titulo: "Feria de diseño hecho aquí", categoria: "Mercado", pilar: "Emprendedurismo", fecha: enDias(4), hora: "11:00 a. m.", lugar: "Museo Marte", zona: "San Salvador", precio: 5, parqueo: true, mascotas: false, organizador: "Colectivo Cuscatlán", verificado: true, actualizado: enDias(-2), foto: "/images/tienda.jpg", descripcion: "Moda, ilustración y objetos de diseñadores salvadoreños. Conoce a quienes los crean." },
  { id: "e8", titulo: "Yoga frente al lago", categoria: "Taller", pilar: "Bienestar", fecha: enDias(DOM + 7), hora: "7:00 a. m.", lugar: "Lago de Coatepeque", zona: "Santa Ana", precio: 10, parqueo: true, mascotas: true, organizador: "Respira SV", verificado: true, actualizado: enDias(-5), foto: "/images/yoga.jpg", descripcion: "Una clase abierta para todos los niveles con vista al lago. Trae tu tapete." },
];

export function formatFecha(f: string, largo = false) {
  const d = new Date(f + "T12:00:00");
  return d.toLocaleDateString("es-SV", largo ? { weekday: "long", day: "numeric", month: "long" } : { weekday: "short", day: "numeric", month: "short" });
}
export const formatPrecio = (p: number) => (p === 0 ? "Gratis" : `$${p.toFixed(2)}`);
