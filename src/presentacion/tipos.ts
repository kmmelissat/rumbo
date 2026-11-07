import type { ComponentType } from "react";

/** Una parada del viaje. */
export interface Parada {
  id: string;
  titulo: string;
  /** Notas del modo presentador: un texto, o uno por paso si la parada tiene pasos. */
  notas: string | string[];
  /** Momentos internos que avanzan con → (por defecto 1). */
  pasos?: number;
  Componente: ComponentType<{ activa: boolean; paso: number }>;
}

/** Medidas del escenario: todo se diseña en 1600 x 900 y se escala. */
export const ANCHO = 1600;
export const ALTO = 900;
