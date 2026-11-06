import type { ComponentType } from "react";

/** Una parada del viaje. */
export interface Parada {
  id: string;
  titulo: string;
  notas: string;
  Componente: ComponentType<{ activa: boolean }>;
}

/** Medidas del escenario: todo se diseña en 1600 x 900 y se escala. */
export const ANCHO = 1600;
export const ALTO = 900;
