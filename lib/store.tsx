"use client";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { EVENTOS, type Evento, type Pilar } from "./data";

export interface Boleto { id: string; codigo: string; eventoId: string; cantidad: number; subtotal: number; procesamiento: number; total: number; contacto: string; comprado: string }
export interface Sello { eventoId: string; fecha: string }

interface Estado {
  guardados: string[];
  boletos: Boleto[];
  sellos: Sello[];
  intereses: Pilar[];
  bienvenidaVista: boolean;
  zona: string;
  notificaciones: boolean;
}
const VACIO: Estado = { guardados: [], boletos: [], sellos: [], intereses: [], bienvenidaVista: false, zona: "San Salvador", notificaciones: true };
const KEY = "rumbo:v2";

/** Lee y valida el estado guardado; solo toma las claves conocidas. */
function leer(): Estado | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const p = JSON.parse(raw);
    const e = { ...VACIO };
    (Object.keys(VACIO) as (keyof Estado)[]).forEach((k) => { if (p[k] !== undefined) (e as Record<string, unknown>)[k] = p[k]; });
    return e;
  } catch { return null; }
}

interface Ctx extends Estado {
  listo: boolean;
  eventos: Evento[];
  toggleGuardado: (id: string) => void;
  comprar: (e: Evento, cantidad: number, contacto: string) => Boleto;
  terminarBienvenida: (intereses: Pilar[]) => void;
  setZona: (z: string) => void;
  toggleInteres: (p: Pilar) => void;
  setNotificaciones: (v: boolean) => void;
  reiniciar: () => void;
}
const StoreCtx = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [estado, setEstado] = useState<Estado>(VACIO);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    const e = leer();
    if (e) setEstado(e);
    setListo(true);
    // Sincroniza en vivo con otras pestañas o iframes del mismo origen.
    // (El evento "storage" solo se dispara en los demás documentos, así que no hay bucles.)
    const alCambiar = (ev: StorageEvent) => {
      if (ev.key !== null && ev.key !== KEY) return;
      setEstado(leer() ?? VACIO);
    };
    window.addEventListener("storage", alCambiar);
    return () => window.removeEventListener("storage", alCambiar);
  }, []);

  useEffect(() => {
    if (!listo) return;
    try { localStorage.setItem(KEY, JSON.stringify(estado)); } catch {}
  }, [estado, listo]);

  const toggleGuardado = useCallback((id: string) =>
    setEstado((s) => ({ ...s, guardados: s.guardados.includes(id) ? s.guardados.filter((g) => g !== id) : [...s.guardados, id] })), []);

  const comprar = useCallback((e: Evento, cantidad: number, contacto: string): Boleto => {
    const ahora = new Date();
    const subtotal = Math.round(e.precio * cantidad * 100) / 100;
    const procesamiento = Math.round(subtotal * 0.038 * 100) / 100;
    const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
    const boleto: Boleto = {
      id: `b${ahora.getTime()}`, codigo: `RMB-${rand}`, eventoId: e.id, cantidad, subtotal, procesamiento,
      total: Math.round((subtotal + procesamiento) * 100) / 100, contacto, comprado: ahora.toISOString(),
    };
    setEstado((s) => ({
      ...s,
      boletos: [boleto, ...s.boletos],
      sellos: s.sellos.some((x) => x.eventoId === e.id) ? s.sellos : [...s.sellos, { eventoId: e.id, fecha: boleto.comprado }],
    }));
    return boleto;
  }, []);

  const terminarBienvenida = useCallback((intereses: Pilar[]) => setEstado((s) => ({ ...s, intereses, bienvenidaVista: true })), []);
  const setZona = useCallback((zona: string) => setEstado((s) => ({ ...s, zona })), []);
  const toggleInteres = useCallback((p: Pilar) =>
    setEstado((s) => ({ ...s, intereses: s.intereses.includes(p) ? s.intereses.filter((x) => x !== p) : [...s.intereses, p] })), []);
  const setNotificaciones = useCallback((notificaciones: boolean) => setEstado((s) => ({ ...s, notificaciones })), []);
  const reiniciar = useCallback(() => setEstado(VACIO), []);

  return (
    <StoreCtx.Provider value={{ ...estado, listo, eventos: EVENTOS, toggleGuardado, comprar, terminarBienvenida, setZona, toggleInteres, setNotificaciones, reiniciar }}>
      {children}
    </StoreCtx.Provider>
  );
}

export function useStore() {
  const c = useContext(StoreCtx);
  if (!c) throw new Error("useStore fuera de StoreProvider");
  return c;
}
