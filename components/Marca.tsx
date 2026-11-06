import { COLOR_CAT, COLOR_STICKER, type Categoria, type Evento, type TipoSticker } from "@/lib/data";
import { IconComida, IconMercado, IconMusica, IconTaller } from "./Icons";

const ICONO_CAT = { Mercado: IconMercado, Música: IconMusica, Comida: IconComida, Taller: IconTaller };
const ROT = [-6, 4, -3, 6, -5, 3];
const rotDe = (id: string) => ROT[[...id].reduce((a, c) => a + c.charCodeAt(0), 0) % ROT.length];

/** Subrayado ondulado dibujado a mano. */
export function Ondulado({ color = "text-marca" }: { color?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 120 8" preserveAspectRatio="none" fill="none" className={`pointer-events-none absolute -bottom-2 left-0 h-2 w-full ${color}`}>
      <path d="M2 4 Q12 0 22 4 T42 4 T62 4 T82 4 T102 4 T118 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function TituloSeccion({ children, color }: { children: React.ReactNode; color?: string }) {
  return <h2 className="relative inline-block text-xl leading-tight">{children}<Ondulado color={color} /></h2>;
}

/** Acento juguetón: Bricolage Grotesque, inclinado como un garabato. */
export function Nota({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`font-mano text-[17px] font-extrabold leading-none tracking-tight ${className}`}>{children}</span>;
}

/** Sticker con borde blanco grueso e inclinación. */
export function Sticker({ tipo, id }: { tipo: TipoSticker; id: string }) {
  return (
    <span className={`inline-block rounded-lg border-[6px] border-white px-1.5 text-xs font-bold leading-5 shadow-md shadow-black/25 ${COLOR_STICKER[tipo]}`} style={{ transform: `rotate(${rotDe(id)}deg)` }}>
      {tipo}
    </span>
  );
}

/** Mini pestaña de calendario: mes pequeño, día grande. */
export function PestanaFecha({ e }: { e: Evento }) {
  const d = new Date(e.fecha + "T12:00:00");
  const mes = d.toLocaleDateString("es-SV", { month: "short" }).replace(".", "");
  return (
    <span className="flex w-11 flex-col items-center overflow-hidden rounded-lg bg-white text-center shadow-md shadow-black/20" aria-hidden>
      <span className={`w-full py-px text-[10px] font-bold uppercase leading-3 ${COLOR_CAT[e.categoria].banda}`}>{mes}</span>
      <span className="font-display text-xl font-bold leading-7 text-ink">{d.getDate()}</span>
    </span>
  );
}

export function ChipCategoria({ categoria }: { categoria: Categoria }) {
  const Icon = ICONO_CAT[categoria];
  return (
    <span className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-xs font-bold ${COLOR_CAT[categoria].chip}`}>
      <Icon width={12} height={12} />{categoria}
    </span>
  );
}

/** Línea punteada tipo ruta de mapa entre secciones. */
export function Ruta({ invertir = false }: { invertir?: boolean }) {
  const a = invertir ? 392 : 38, b = invertir ? 38 : 392;
  return (
    <svg aria-hidden viewBox="0 0 430 56" className="mt-3 block h-14 w-full text-marca" fill="none">
      <path d={`M${a} 6 C ${a} 38, ${b} 18, ${b} 50`} stroke="currentColor" strokeOpacity=".55" strokeWidth="3" strokeLinecap="round" strokeDasharray="0.1 9" />
      <circle cx={a} cy="5" r="4.5" fill="currentColor" /><circle cx={b} cy="51" r="4.5" fill="var(--color-sup)" stroke="currentColor" strokeWidth="3" />
    </svg>
  );
}
