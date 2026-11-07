"use client";
import { type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

const K = { noche: "#12303A", turquesa: "#0A7C7C", mostaza: "#F5B82E", coral: "#F28F6B", lima: "#C5E063", bosque: "#1E5E45", terracota: "#E2683F", crema: "#FAF6EF" };
const t = { fill: "none", stroke: K.noche, strokeWidth: 3.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;

/** Dibujos de los stickers (viewBox 48). */
export const DIBUJOS: Record<string, ReactNode> = {
  brujula: <g><circle {...t} cx="24" cy="24" r="17" fill={K.crema} /><path {...t} d="M30 18l-4 9-8 3 4-9z" fill={K.coral} /></g>,
  pin: <g><path {...t} d="M24 42S10 29 10 19a14 14 0 0 1 28 0c0 10-14 23-14 23z" fill={K.coral} /><circle {...t} cx="24" cy="19" r="5" fill="#fff" /></g>,
  volcan: <g><path {...t} d="M5 40L18 14h12l13 26z" fill={K.bosque} /><path {...t} d="M18 14l3 6 3-3 3 3 3-6" fill={K.terracota} /></g>,
  ola: <g><path d="M5 30q6-12 12 0t12 0 12 0M5 40q6-12 12 0t12 0 12 0" {...t} stroke={K.turquesa} /></g>,
  palmera: <g><path d="M24 42V22" {...t} /><path {...t} d="M24 22q-12-2-16 6M24 22q12-2 16 6M24 22q-6-10-14-9M24 22q6-10 14-9" fill="none" stroke={K.bosque} /></g>,
  sol: <g><circle {...t} cx="24" cy="24" r="9" fill={K.mostaza} /><path d="M24 5v6M24 37v6M5 24h6M37 24h6M10 10l4 4M34 34l4 4M38 10l-4 4M14 34l-4 4" {...t} /></g>,
  carita: <g><circle {...t} cx="24" cy="24" r="17" fill={K.mostaza} /><path d="M17 20v2M31 20v2M16 29q8 8 16 0" {...t} /></g>,
  mochila: <g><rect {...t} x="12" y="12" width="24" height="29" rx="9" fill={K.lima} /><path d="M18 12a6 6 0 0 1 12 0M17 30h14" {...t} /></g>,
  nota: <g><path d="M19 36V11l16-4v24" {...t} /><circle {...t} cx="14" cy="36" r="5" fill={K.coral} /><circle {...t} cx="30" cy="31" r="5" fill={K.coral} /></g>,
  pupusa: <g><ellipse {...t} cx="24" cy="26" rx="18" ry="13" fill={K.mostaza} /><path d="M14 24q4-4 8 0M26 28q4-4 8 0" {...t} /></g>,
  sello: <g><circle cx="24" cy="24" r="18" fill="none" stroke={K.turquesa} strokeWidth="3.5" strokeDasharray="3 4" /><circle cx="24" cy="24" r="12" fill="none" stroke={K.turquesa} strokeWidth="3" /><path d="M24 15l2.500 6.500 6.500 2.500-6.500 2.500L24 33l-2.500-6.500L15 24l6.500-2.500z" fill={K.turquesa} /></g>,
  estrella: <g><path {...t} d="M24 6l5.400 11 12 1.700-8.700 8.500 2.100 12L24 33.500 13.200 39.200l2.100-12L6.600 18.700l12-1.700z" fill={K.mostaza} /></g>,
  rayo: <g><path {...t} d="M27 5L11 27h11l-3 16 18-24H26z" fill={K.mostaza} /></g>,
};

/** Sticker die-cut: borde blanco grueso, sombra suave e inclinación. Se "pega" al entrar. */
export function Sticker({ dibujo, frase, rot = 0, size = 64, color = "#fff", visible = true, delay = 0 }: {
  dibujo?: string; frase?: string; rot?: number; size?: number; color?: string; visible?: boolean; delay?: number;
}) {
  const rm = useReducedMotion();
  return (
    <motion.span initial={false} className="inline-flex"
      animate={visible ? { opacity: 1, scale: 1, rotate: rot } : { opacity: 0, scale: rm ? 1 : 1.6, rotate: rm ? rot : rot + 14 }}
      transition={rm || !visible ? { duration: 0.2 } : { type: "spring", stiffness: 220, damping: 11, delay: 0.5 + delay }}>
      {dibujo ? (
        <span className="rounded-full p-1.5" style={{ background: "#fff", filter: "drop-shadow(0 4px 6px rgba(0,0,0,.25))" }}>
          <svg aria-hidden viewBox="0 0 48 48" width={size} height={size}>{DIBUJOS[dibujo]}</svg>
        </span>
      ) : (
        <span className="rounded-2xl border-[6px] border-white px-3 py-1 font-display text-[22px] font-bold leading-tight"
          style={{ background: color, color: K.noche, boxShadow: "0 4px 8px rgba(0,0,0,.25)" }}>{frase}</span>
      )}
    </motion.span>
  );
}
