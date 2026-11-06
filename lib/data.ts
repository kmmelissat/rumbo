export type Pilar = "Aventura" | "Conexión" | "Emprendedurismo" | "Bienestar";
export type Categoria = "Mercado" | "Música" | "Comida" | "Taller";
export type ArteKind = "volcan" | "sol" | "ola" | "palmera" | "brujula";

export const PILARES: { id: Pilar; texto: string; arte: ArteKind }[] = [
  { id: "Aventura", texto: "Volcanes, playas y rutas por descubrir", arte: "volcan" },
  { id: "Conexión", texto: "Música y gente con quien compartir", arte: "ola" },
  { id: "Emprendedurismo", texto: "Mercaditos y talentos locales", arte: "brujula" },
  { id: "Bienestar", texto: "Pausas, movimiento y buena comida", arte: "palmera" },
];

export const CATEGORIAS: Categoria[] = ["Mercado", "Música", "Comida", "Taller"];

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
  destacado: boolean;
  arte: ArteKind;
  descripcion: string;
  familias: boolean;
  verificado: boolean;
  actualizado: string; // YYYY-MM-DD
}


const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const enDias = (n: number) => { const d = new Date(); d.setDate(d.getDate() + n); return iso(d); };
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

export const ZONA_DIST: Record<string, number> = { "San Salvador": 0, "Santa Tecla": 1, "La Libertad": 2, "Santa Ana": 3, "Juayúa": 4, "San Miguel": 5, "Otra": 6 };

export const EVENTOS: Evento[] = [
  { id: "e1", titulo: "Mercadito del Volcán", categoria: "Mercado", pilar: "Emprendedurismo", fecha: enDias(SAB), hora: "9:00 a. m.", lugar: "Parque Cafetalón", zona: "Santa Tecla", precio: 0, parqueo: true, mascotas: true, organizador: "Manos del Valle", destacado: true, arte: "volcan", descripcion: "Más de 40 emprendimientos locales con café de altura, artesanías y plantas, con el volcán de fondo.", familias: true, verificado: true, actualizado: enDias(-2) },
  { id: "e2", titulo: "Atardecer con ritmos de la costa", categoria: "Música", pilar: "Conexión", fecha: enDias(DOM), hora: "4:30 p. m.", lugar: "Playa El Sunzal", zona: "La Libertad", precio: 12, parqueo: true, mascotas: false, organizador: "Costa Sonora", destacado: true, arte: "sol", descripcion: "Tres bandas en vivo frente al mar. Lleva tu toalla y llega temprano para ver caer el sol.", familias: false, verificado: true, actualizado: enDias(-1) },
  { id: "e3", titulo: "Ruta de pupusas y café", categoria: "Comida", pilar: "Bienestar", fecha: enDias(SAB + 7), hora: "10:00 a. m.", lugar: "Ruta de las Flores", zona: "Juayúa", precio: 18, parqueo: true, mascotas: true, organizador: "Sabores del Cielo", destacado: false, arte: "palmera", descripcion: "Recorrido guiado por cinco paradas de comida típica, con degustación incluida.", familias: true, verificado: true, actualizado: enDias(-3) },
  { id: "e4", titulo: "Taller de cerámica con añil", categoria: "Taller", pilar: "Bienestar", fecha: enDias(DOM + 7), hora: "2:00 p. m.", lugar: "Casa Añil", zona: "San Salvador", precio: 25, parqueo: false, mascotas: false, organizador: "Casa Añil", destacado: false, arte: "ola", descripcion: "Aprende a moldear y teñir con añil natural. Te llevas tu pieza a casa.", familias: false, verificado: false, actualizado: enDias(-1) },
  { id: "e5", titulo: "Caminata al amanecer: Cerro Verde", categoria: "Taller", pilar: "Aventura", fecha: enDias(SAB + 14), hora: "5:30 a. m.", lugar: "Parque Nacional Cerro Verde", zona: "Santa Ana", precio: 15, parqueo: true, mascotas: true, organizador: "Rumbo Trekkers", destacado: true, arte: "volcan", descripcion: "Sube con guía hasta el mirador y desayuna viendo el Izalco. Nivel fácil a medio.", familias: true, verificado: true, actualizado: enDias(-4) },
  { id: "e6", titulo: "Noche de food trucks", categoria: "Comida", pilar: "Conexión", fecha: enDias(0), hora: "6:00 p. m.", lugar: "Plaza Gerardo Barrios", zona: "San Salvador", precio: 0, parqueo: false, mascotas: true, organizador: "Ruedas y Sabor", destacado: false, arte: "brujula", descripcion: "Doce food trucks, música de fondo y mesas compartidas en pleno centro.", familias: true, verificado: true, actualizado: enDias(-1) },
  { id: "e7", titulo: "Feria de diseño hecho aquí", categoria: "Mercado", pilar: "Emprendedurismo", fecha: enDias(SAB + 7), hora: "11:00 a. m.", lugar: "Museo Marte", zona: "San Salvador", precio: 5, parqueo: true, mascotas: false, organizador: "Colectivo Cuscatlán", destacado: false, arte: "sol", descripcion: "Moda, ilustración y objetos de diseñadores salvadoreños. Conoce a quienes los crean.", familias: false, verificado: true, actualizado: enDias(-2) },
  { id: "e8", titulo: "Yoga frente al lago", categoria: "Taller", pilar: "Bienestar", fecha: enDias(DOM + 14), hora: "7:00 a. m.", lugar: "Lago de Coatepeque", zona: "Santa Ana", precio: 10, parqueo: true, mascotas: true, organizador: "Respira SV", destacado: false, arte: "palmera", descripcion: "Una clase abierta para todos los niveles con vista al lago. Trae tu tapete.", familias: true, verificado: true, actualizado: enDias(-5) },
];

export const ZONAS = ["San Salvador", "Santa Tecla", "La Libertad", "Santa Ana", "Juayúa", "San Miguel", "Otra"];

export function formatFecha(f: string, largo = false) {
  const d = new Date(f + "T12:00:00");
  return d.toLocaleDateString("es-SV", largo ? { weekday: "long", day: "numeric", month: "long" } : { day: "numeric", month: "short" });
}
export const formatPrecio = (p: number) => (p === 0 ? "Gratis" : `$${p.toFixed(2)}`);
