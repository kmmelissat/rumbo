"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { EVENTOS, hoyISO, type Evento, type Pilar } from "./data";

export interface Boleto { id: string; codigo: string; eventoId: string; cantidad: number; subtotal: number; procesamiento: number; total: number; contacto: string; comprado: string }
export interface Sello { eventoId: string; fecha: string }

interface Estado {
  guardados: string[];
  boletos: Boleto[];
  sellos: Sello[];
  publicados: Evento[];
  intereses: Pilar[];
  bienvenidaVista: boolean;
  clics: Record<string, number>;
}
const VACIO: Estado = { guardados: [], boletos: [], sellos: [], publicados: [], intereses: [], bienvenidaVista: false, clics: {} };
const KEY = "rumbo:v1";

interface Ctx extends Estado {
  listo: boolean;
  eventos: Evento[];
  toggleGuardado: (id: string) => void;
  comprar: (e: Evento, cantidad: number, contacto: string) => Boleto;
  publicar: (e: Omit<Evento, "id" | "verificado" | "actualizado">) => Evento;
  registrarClic: (id: string) => void;
  terminarBienvenida: (intereses: Pilar[]) => void;
}
const StoreCtx = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [estado, setEstado] = useState<Estado>(VACIO);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setEstado({ ...VACIO, ...JSON.parse(raw) });
    } catch {}
    setListo(true);
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

  const publicar = useCallback((e: Omit<Evento, "id" | "verificado" | "actualizado">): Evento => {
    const nuevo: Evento = { ...e, id: `p${Date.now()}`, verificado: false, actualizado: hoyISO() };
    setEstado((s) => ({ ...s, publicados: [nuevo, ...s.publicados] }));
    return nuevo;
  }, []);

  const registrarClic = useCallback((id: string) =>
    setEstado((s) => ({ ...s, clics: { ...s.clics, [id]: (s.clics[id] ?? 0) + 1 } })), []);

  const terminarBienvenida = useCallback((intereses: Pilar[]) =>
    setEstado((s) => ({ ...s, intereses, bienvenidaVista: true })), []);

  const eventos = useMemo(() => [...estado.publicados, ...EVENTOS], [estado.publicados]);

  return (
    <StoreCtx.Provider value={{ ...estado, listo, eventos, toggleGuardado, comprar, publicar, terminarBienvenida, registrarClic }}>
      {children}
    </StoreCtx.Provider>
  );
}

export function useStore() {
  const c = useContext(StoreCtx);
  if (!c) throw new Error("useStore fuera de StoreProvider");
  return c;
}
