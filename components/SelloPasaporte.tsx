import { useId } from "react";
import type { Categoria } from "@/lib/data";

const TINTA: Record<Categoria, string> = {
  Mercado: "#5E7F14",
  Música: "#0E5A8A",
  Comida: "#D9542F",
  Taller: "#0B8585",
};

/** Glifo por categoría, dibujado en un cuadro de 40x40 centrado en (0,0). */
function Glifo({ c }: { c: Categoria }) {
  const p = { fill: "none", stroke: "currentColor", strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  switch (c) {
    case "Mercado": // toldo
      return <g {...p}><path d="M-14 -4 L-10 -14 H10 L14 -4 Z" /><path d="M-11 -4 V12 H11 V-4" /><path d="M-3 12 V4 H3 V12" /></g>;
    case "Música": // nota
      return <g {...p}><path d="M-6 10 V-12 L10 -15 V7" /><circle cx="-10" cy="10" r="4" fill="currentColor" /><circle cx="6" cy="7" r="4" fill="currentColor" /></g>;
    case "Comida": // tenedor y cuchara
      return <g {...p}><path d="M-8 -14 V-2 Q-8 3 -4 3 Q0 3 0 -2 V-14 M-4 -14 V14" /><path d="M9 14 V-14 Q15 -8 15 0 Q15 4 9 4" /></g>;
    case "Taller": // chispa
      return <g {...p}><path d="M0 -15 L4 -4 L15 0 L4 4 L0 15 L-4 4 L-15 0 L-4 -4 Z" fill="currentColor" /></g>;
  }
}

/** Sello de pasaporte: anillo punteado, texto circular, glifo de categoría y fecha. */
export function SelloPasaporte({ categoria, fecha, indice = 0 }: { categoria: Categoria; fecha: string; indice?: number }) {
  const id = useId().replace(/:/g, "");
  const giro = [-7, 5, -3, 8, -9, 3][indice % 6];
  const texto = `${categoria.toUpperCase()} · RUMBO · ${categoria.toUpperCase()} · RUMBO · `;
  return (
    <svg viewBox="0 0 100 100" role="img" aria-label={`Sello de ${categoria}, ${fecha}`}
      className="mx-auto block w-full" style={{ color: TINTA[categoria], transform: `rotate(${giro}deg)`, opacity: 0.92 }}>
      <defs><path id={id} d="M50 50 m-37 0 a37 37 0 1 1 74 0 a37 37 0 1 1 -74 0" /></defs>
      <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" strokeWidth="3" />
      <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 3" />
      <text fontSize="8.5" fontWeight="800" letterSpacing="1.6" fill="currentColor" style={{ fontFamily: "var(--font-mano, inherit)" }}>
        <textPath href={`#${id}`} startOffset="0">{texto}</textPath>
      </text>
      <circle cx="50" cy="50" r="27" fill="currentColor" opacity="0.1" />
      <g transform="translate(50 46) scale(0.8)"><Glifo c={categoria} /></g>
      <rect x="27" y="63" width="46" height="13" rx="3" fill="currentColor" />
      <text x="50" y="72.5" textAnchor="middle" fontSize="8" fontWeight="800" fill="#fff" style={{ fontFamily: "var(--font-mano, inherit)" }}>{fecha}</text>
    </svg>
  );
}
