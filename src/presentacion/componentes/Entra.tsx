"use client";
import { motion, useReducedMotion } from "motion/react";
import type { CSSProperties, ReactNode } from "react";

const DESDE = {
  abajo: { y: 50 }, arriba: { y: -50 }, izq: { x: -80 }, der: { x: 80 },
  escala: { scale: 0.5 }, giro: { scale: 0.6, rotate: -18 },
} as const;

/** Elemento que entra escalonado cuando la parada está activa y sale cuando no. */
export function Entra({ activa, retraso = 0, desde = "abajo", rot = 0, className, style, children }: {
  activa: boolean; retraso?: number; desde?: keyof typeof DESDE; rot?: number;
  className?: string; style?: CSSProperties; children?: ReactNode;
}) {
  const rm = useReducedMotion();
  const fuera = rm ? { opacity: 0, rotate: rot } : { opacity: 0, rotate: rot, ...DESDE[desde] };
  return (
    <motion.div
      className={className}
      style={style}
      initial={false}
      animate={activa ? { opacity: 1, x: 0, y: 0, scale: 1, rotate: rot } : fuera}
      transition={rm ? { duration: 0.2 } : activa ? { type: "spring", stiffness: 120, damping: 15, delay: 0.25 + retraso } : { duration: 0.25 }}
    >
      {children}
    </motion.div>
  );
}
