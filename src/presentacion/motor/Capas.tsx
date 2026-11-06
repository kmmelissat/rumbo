"use client";
import { motion, useTransform, type MotionValue } from "motion/react";
import { ALTO, ANCHO } from "../tipos";
import { Cruz, Espiral, Ola, Sol, Volcan } from "../componentes/Garabatos";

const COLORES = ["bg-marca", "bg-coral", "bg-lima", "bg-oceano"];
const TINTES = ["text-marca", "text-coral", "text-oceano", "text-lima"];

/** Capa de fondo que se desplaza a una fracción de la cámara (parallax). */
function Capa({ pos, total, ancho, factor, children }: { pos: MotionValue<number>; total: number; ancho: number; factor: number; children: (i: number) => React.ReactNode }) {
  const x = useTransform(pos, (p) => -p * ancho * factor);
  return (
    <motion.div style={{ x, width: ancho * (1 + (total - 1) * factor) }} className="pointer-events-none absolute inset-y-0 left-0">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="absolute inset-y-0" style={{ left: i * ancho * factor, width: ancho }}>{children(i)}</div>
      ))}
    </motion.div>
  );
}

export function FondoViaje({ pos, total, ancho }: { pos: MotionValue<number>; total: number; ancho: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-arena" aria-hidden>
      {/* Lejos: manchas de color y volcanes */}
      <Capa pos={pos} total={total} ancho={ancho} factor={0.25}>
        {(i) => (
          <>
            <div className={`absolute -right-[8%] -top-[18%] h-[70%] w-[48%] rounded-full opacity-[0.16] ${COLORES[i % 4]}`} />
            <div className={`absolute -bottom-[25%] left-[10%] h-[60%] w-[40%] rounded-full opacity-[0.12] ${COLORES[(i + 2) % 4]}`} />
            <Volcan className="absolute bottom-0 right-[6%] h-[34%] w-[40%] text-oceano/10" />
            <Volcan className="absolute bottom-0 left-[-4%] h-[22%] w-[28%] text-marca/10" />
          </>
        )}
      </Capa>
      {/* Medio: garabatos de mapa */}
      <Capa pos={pos} total={total} ancho={ancho} factor={0.6}>
        {(i) => (
          <>
            <Sol className={`absolute right-[42%] top-[8%] h-[8%] w-[6%] opacity-60 ${TINTES[(i + 1) % 4] === "text-lima" ? "text-coral" : TINTES[(i + 1) % 4]}`} />
            <Ola className="absolute bottom-[14%] left-[3%] h-[7%] w-[12%] text-marca opacity-50" />
            <Cruz className="absolute bottom-[26%] right-[4%] h-[5%] w-[3%] text-coral opacity-60" />
            <Espiral className="absolute left-[46%] top-[78%] h-[9%] w-[6%] text-oceano opacity-30" />
          </>
        )}
      </Capa>
    </div>
  );
}

/** Ruta punteada dibujada en el mundo: une todas las paradas, a la altura de las slides. */
export function RutaMundo({ total }: { total: number }) {
  const y = ALTO - 70;
  let d = `M ${200} ${y}`;
  for (let i = 0; i < total - 1; i++) {
    const x0 = i * ANCHO + 200, x1 = (i + 1) * ANCHO + 200;
    d += ` C ${x0 + 450} ${y - 90}, ${x1 - 450} ${y + 50}, ${x1} ${y}`;
  }
  return (
    <svg className="pointer-events-none absolute left-0 top-0" width={total * ANCHO} height={ALTO} aria-hidden>
      <path d={d} fill="none" stroke="#0FA3A3" strokeOpacity=".7" strokeWidth="6" strokeLinecap="round" strokeDasharray="0.1 18" />
      {Array.from({ length: total }, (_, i) => (
        <g key={i}>
          <circle cx={i * ANCHO + 200} cy={y} r="16" fill="#fff" stroke="#0FA3A3" strokeWidth="6" />
          <circle cx={i * ANCHO + 200} cy={y} r="5" fill="#FF8A6B" />
        </g>
      ))}
    </svg>
  );
}
