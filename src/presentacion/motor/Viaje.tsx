"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";
import { PARADAS } from "../slides";
import { ALTO, ANCHO } from "../tipos";
import { FondoViaje, RutaMundo } from "./Capas";
import { BarraRuta } from "./BarraRuta";
import { Presentador } from "./Presentador";

const limitar = (n: number, max: number) => Math.min(max, Math.max(0, n));
const desdeHash = () => {
  const n = parseInt(window.location.hash.slice(1), 10);
  return Number.isFinite(n) ? limitar(n - 1, PARADAS.length - 1) : 0;
};

/** Contenedor de una parada: se desvanece y escala según qué tan lejos está la cámara. */
function Escena({ i, pos, activa, children }: { i: number; pos: MotionValue<number>; activa: boolean; children: React.ReactNode }) {
  const opacity = useTransform(pos, (p) => Math.max(0, 1 - Math.abs(p - i) * 1.5));
  const scale = useTransform(pos, (p) => 0.9 + 0.1 * Math.max(0, 1 - Math.abs(p - i)));
  return (
    <motion.section aria-hidden={!activa} aria-label={PARADAS[i].titulo} style={{ opacity, scale, left: i * ANCHO, width: ANCHO, height: ALTO }}
      className="absolute top-0 will-change-transform">
      {children}
    </motion.section>
  );
}

export function Viaje() {
  const total = PARADAS.length;
  const [indice, setIndice] = useState(0);
  const [paso, setPaso] = useState(0);
  const [listo, setListo] = useState(false);
  const [presentador, setPresentador] = useState(false);
  const [vp, setVp] = useState({ w: 1280, h: 720 });
  const objetivo = useMotionValue(0);
  const pos = useSpring(objetivo, { stiffness: 60, damping: 17, mass: 1 });
  const trackX = useTransform(pos, (p) => -p * ANCHO);
  const toque = useRef<{ x: number; y: number } | null>(null);

  const pasosDe = (i: number) => PARADAS[i].pasos ?? 1;

  const ir = useCallback((n: number, pasoFinal = 0) => {
    const i = limitar(n, total - 1);
    setIndice(i);
    setPaso(pasoFinal);
    objetivo.set(i);
    if (window.location.hash !== `#${i + 1}`) window.history.replaceState(null, "", `#${i + 1}`);
  }, [objetivo, total]);

  const avanzar = useCallback(() => {
    if (paso < (PARADAS[indice].pasos ?? 1) - 1) setPaso(paso + 1);
    else if (indice < total - 1) ir(indice + 1);
  }, [paso, indice, total, ir]);
  const retroceder = useCallback(() => {
    if (paso > 0) setPaso(paso - 1);
    else if (indice > 0) ir(indice - 1, (PARADAS[indice - 1].pasos ?? 1) - 1);
  }, [paso, indice, ir]);

  // Arranque: lee el hash, sin animar desde la parada 0 si viene con #n.
  useEffect(() => {
    const i = desdeHash();
    setIndice(i); objetivo.jump(i); pos.jump(i);
    setListo(true);
    const alHash = () => { const j = desdeHash(); setIndice(j); setPaso(0); objetivo.set(j); };
    window.addEventListener("hashchange", alHash);
    return () => window.removeEventListener("hashchange", alHash);
  }, [objetivo, pos]);

  useEffect(() => {
    const medir = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    medir();
    window.addEventListener("resize", medir);
    return () => window.removeEventListener("resize", medir);
  }, []);

  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key;
      if (k === "ArrowRight" || k === "PageDown" || (k === " " && !e.shiftKey)) { e.preventDefault(); avanzar(); }
      else if (k === "ArrowLeft" || k === "PageUp" || (k === " " && e.shiftKey)) { e.preventDefault(); retroceder(); }
      else if (k === "Home") ir(0);
      else if (k === "End") ir(total - 1);
      else if (k === "f" || k === "F") {
        if (document.fullscreenElement) void document.exitFullscreen();
        else void document.documentElement.requestFullscreen?.();
      } else if (k === "n" || k === "N") setPresentador((v) => !v);
    };
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  }, [avanzar, retroceder, ir, total]);

  const escala = Math.min(vp.w / ANCHO, vp.h / ALTO);
  const ancho = vp.w;

  return (
    <div className="fixed inset-0 select-none overflow-hidden bg-arena touch-none" style={{ opacity: listo ? 1 : 0, transition: "opacity .3s" }}
      onPointerDown={(e) => { toque.current = { x: e.clientX, y: e.clientY }; }}
      onPointerUp={(e) => {
        const t = toque.current; toque.current = null;
        if (!t || (e.target as HTMLElement).closest("[data-nodrag]")) return;
        const dx = e.clientX - t.x, dy = e.clientY - t.y;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) (dx < 0 ? avanzar : retroceder)();
        else if (Math.abs(dx) < 10 && Math.abs(dy) < 10) avanzar();
      }}>
      <FondoViaje pos={pos} total={total} ancho={ancho} />

      <div className="absolute left-0 top-0 origin-top-left" style={{ width: ANCHO, height: ALTO, transform: `translate(${(vp.w - ANCHO * escala) / 2}px, ${(vp.h - ALTO * escala) / 2}px) scale(${escala})` }}>
        <motion.div style={{ x: trackX, width: ANCHO * total, height: ALTO }} className="absolute left-0 top-0">
          <RutaMundo total={total} />
          {PARADAS.map((p, i) => (
            <Escena key={p.id} i={i} pos={pos} activa={i === indice}>
              <p.Componente activa={listo && i === indice} paso={i === indice ? paso : 0} />
            </Escena>
          ))}
        </motion.div>
      </div>

      <BarraRuta paradas={PARADAS} indice={indice} pos={pos} ir={ir} />

      <p className="pointer-events-none absolute bottom-3 left-4 z-30 text-xs font-bold text-oceano/70" aria-hidden>
        {indice + 1} / {total}{pasosDe(indice) > 1 ? ` · paso ${paso + 1}/${pasosDe(indice)}` : ""} · ← → navegar · F pantalla completa · N presentador
      </p>

      <AnimatePresence>
        {presentador && <Presentador paso={paso} actual={PARADAS[indice]} siguiente={PARADAS[indice + 1]} indice={indice} total={total} />}
      </AnimatePresence>
    </div>
  );
}
