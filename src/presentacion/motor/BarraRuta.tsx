"use client";
import { motion, useTransform, type MotionValue } from "motion/react";
import type { Parada } from "../tipos";

/** Barra de progreso en forma de ruta: paradas clicables y una brújula que avanza. */
export function BarraRuta({ paradas, indice, pos, ir }: { paradas: Parada[]; indice: number; pos: MotionValue<number>; ir: (n: number) => void }) {
  const n = paradas.length;
  const max = Math.max(1, n - 1);
  const izq = useTransform(pos, (p) => `${(p / max) * 100}%`);
  const relleno = useTransform(pos, (p) => Math.min(1, Math.max(0, p / max)));
  return (
    <nav aria-label="Ruta de la presentación" data-nodrag className="absolute left-1/2 top-4 z-30 w-[min(560px,70vw)] -translate-x-1/2">
      <div className="relative mx-4 h-11">
        <svg className="absolute inset-x-0 top-1/2 h-2 w-full -translate-y-1/2 text-marca" preserveAspectRatio="none" viewBox="0 0 100 2" aria-hidden>
          <line x1="0" y1="1" x2="100" y2="1" stroke="currentColor" strokeOpacity=".45" strokeWidth="3" strokeLinecap="round" strokeDasharray="0.1 5" vectorEffect="non-scaling-stroke" />
        </svg>
        <motion.div style={{ scaleX: relleno }} className="absolute inset-x-0 top-1/2 h-[3px] origin-left -translate-y-1/2 rounded bg-coral" />
        {paradas.map((p, i) => (
          <button key={p.id} onClick={() => ir(i)} aria-label={`Ir a la parada ${i + 1}: ${p.titulo}`} aria-current={i === indice ? "step" : undefined}
            className="group absolute top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center" style={{ left: `${(i / max) * 100}%` }}>
            <span className={`block h-4 w-4 rounded-full border-[3px] transition-colors ${i <= indice ? "border-coral bg-white" : "border-marca bg-white"}`} />
            <span className="pointer-events-none absolute top-full mt-0 whitespace-nowrap rounded bg-oceano px-2 py-0.5 text-xs font-bold text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">{p.titulo}</span>
          </button>
        ))}
        <motion.div style={{ left: izq }} className="pointer-events-none absolute top-1/2 -translate-x-1/2 -translate-y-1/2" aria-hidden>
          <svg width="34" height="34" viewBox="0 0 34 34">
            <circle cx="17" cy="17" r="15" fill="#fff" stroke="#0E5A8A" strokeWidth="3" />
            <polygon points="17,6 21,17 13,17" fill="#FF8A6B" /><polygon points="17,28 21,17 13,17" fill="#0E5A8A" />
            <circle cx="17" cy="17" r="2.5" fill="#C5E063" />
          </svg>
        </motion.div>
      </div>
    </nav>
  );
}
