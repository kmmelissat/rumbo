"use client";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import type { Parada } from "../tipos";

const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

/** Modo presentador (tecla N): notas de la parada, siguiente parada y temporizador. */
export function Presentador({ actual, siguiente, indice, total, paso }: { paso: number; actual: Parada; siguiente?: Parada; indice: number; total: number }) {
  const [seg, setSeg] = useState(0);
  const [corre, setCorre] = useState(true);
  useEffect(() => {
    if (!corre) return;
    const t = setInterval(() => setSeg((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [corre]);

  return (
    <motion.aside data-nodrag initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}
      aria-label="Modo presentador" className="absolute bottom-4 right-4 z-40 w-[min(380px,calc(100vw-2rem))] rounded-2xl border-2 border-oceano bg-white p-4 text-tinta shadow-xl shadow-black/20">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-wide text-gris">Parada {indice + 1} de {total}{actual.pasos ? ` · paso ${paso + 1}/${actual.pasos}` : ""}</p>
        <div className="flex items-center gap-2">
          <span className="font-display text-2xl font-bold tabular-nums text-oceano" role="timer">{fmt(seg)}</span>
          <button onClick={() => setCorre(!corre)} className="min-h-[36px] rounded-lg border border-linea px-2 text-xs font-bold">{corre ? "Pausar" : "Seguir"}</button>
          <button onClick={() => { setSeg(0); setCorre(true); }} className="min-h-[36px] rounded-lg border border-linea px-2 text-xs font-bold">Reiniciar</button>
        </div>
      </div>
      <h2 className="mt-2 font-display text-lg font-bold">{actual.titulo}</h2>
      <p className="mt-1 max-h-[28vh] overflow-y-auto text-sm leading-relaxed text-tinta/85">{Array.isArray(actual.notas) ? actual.notas[Math.min(paso, actual.notas.length - 1)] : actual.notas}</p>
      <p className="mt-3 border-t border-linea pt-2 text-xs text-gris">Sigue: <strong className="text-tinta">{siguiente ? siguiente.titulo : "Fin del viaje"}</strong></p>
    </motion.aside>
  );
}
