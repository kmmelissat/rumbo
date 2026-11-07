"use client";
import { type ReactNode } from "react";
import { Caveat } from "next/font/google";
import { motion, useReducedMotion } from "motion/react";

/** Datos del modelo: quién paga qué. */
const MODELO_DATOS = {
  grupos: [
    { id: "organizadores", nombre: "Organizadores" },
    { id: "marcas", nombre: "Marcas y negocios" },
    { id: "combos", nombre: "Combos" },
  ],
  lineas: [
    { grupo: "organizadores", icono: "boleto", nombre: "Comisión por entradas" },
    { grupo: "organizadores", icono: "stand", nombre: "Comisión por reservas y stands" },
    { grupo: "organizadores", icono: "estrella", nombre: "Eventos destacados" },
    { grupo: "organizadores", icono: "panel", nombre: "Plan profesional" },
    { grupo: "marcas", icono: "cartel", nombre: "Promociones comerciales" },
    { grupo: "marcas", icono: "regalo", nombre: "Combos patrocinados" },
    { grupo: "combos", icono: "combo", nombre: "Comisión por combos (el precio ya la incluye)" },
  ],
  datosClave: [
    { quien: "Organizador", texto: "8% + $0.30 por entrada, y publicar es gratis" },
    { quien: "Asistente", texto: "Sin cargo de servicio de Rumbo" },
    { quien: "Pago al organizador", texto: "3 días hábiles después del evento" },
  ],
};

const caveat = Caveat({ subsets: ["latin"], weight: "600" });
const C = { crema: "#FAF6EF", noche: "#12303A", turquesa: "#0A7C7C", mostaza: "#F5B82E", terracota: "#E2683F" };
const COLOR_GRUPO: Record<string, string> = { organizadores: C.turquesa, marcas: C.mostaza, combos: C.noche };

const t = { fill: "none", stroke: "currentColor", strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round" } as const;
const ICONOS: Record<string, ReactNode> = {
  estrella: <g {...t}><path d="M24 6l5.4 11 12 1.7-8.7 8.5 2.1 12L24 33.500 13.200 39.200l2.100-12L6.600 18.700l12-1.700z" /></g>,
  cartel: <g {...t}><path d="M7 20v8h6l14 8V12L13 20z" /><path d="M35 18a8 8 0 0 1 0 12M13 28l3 10h5l-2-8" /></g>,
  boleto: <g {...t}><path d="M6 15h36v7a4 4 0 0 0 0 8v7H6v-7a4 4 0 0 0 0-8z" /><path d="M31 15v22" strokeDasharray="2 4" /></g>,
  stand: <g {...t}><path d="M6 20l4-12h28l4 12" /><path d="M6 20a6 6 0 0 0 12 0 6 6 0 0 0 12 0 6 6 0 0 0 12 0" /><path d="M10 25v15h28V25M20 40V31h8v9" /></g>,
  panel: <g {...t}><rect x="6" y="7" width="36" height="34" rx="5" /><path d="M14 33V25M24 33V17M34 33V21" /></g>,
  combo: <g {...t}><path d="M10 18h28l-3 22H13z" /><path d="M17 18a7 7 0 0 1 14 0" /><path d="M19 28h10" /></g>,
  regalo: <g {...t}><rect x="7" y="19" width="34" height="9" rx="2" /><path d="M10 28v12h28V28M24 19v21" /><path d="M24 19c-6 0-10-2-10-6a4 4 0 0 1 8 0zM24 19c6 0 10-2 10-6a4 4 0 0 0-8 0z" /></g>,
};
const Icono = ({ n, size = 34 }: { n: string; size?: number }) => <svg aria-hidden viewBox="0 0 48 48" width={size} height={size}>{ICONOS[n]}</svg>;

function Entra({ visible, i = 0, base = 0.2, step = 0.1, className, style, children }: { visible: boolean; i?: number; base?: number; step?: number; className?: string; style?: React.CSSProperties; children: ReactNode }) {
  const rm = useReducedMotion();
  return (
    <motion.div initial={false} className={className} style={style}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: rm ? 0 : 30 }}
      transition={rm || !visible ? { duration: 0.2 } : { type: "spring", stiffness: 90, damping: 15, delay: base + i * step }}>{children}</motion.div>
  );
}

function Grupos({ visible }: { visible: boolean }) {
  let k = 0;
  return (
    <div className="grid grid-cols-3 items-start gap-8">
      {MODELO_DATOS.grupos.map((g) => {
        const color = COLOR_GRUPO[g.id];
        const oscuro = g.id !== "marcas";
        return (
          <div key={g.id} className="flex flex-col gap-3">
            <Entra visible={visible} i={k++}>
              <h2 className="inline-block rounded-full px-6 py-2 font-display text-[34px] font-bold leading-none" style={{ background: color, color: oscuro ? "#fff" : C.noche }}>{g.nombre}</h2>
            </Entra>
            {MODELO_DATOS.lineas.filter((l) => l.grupo === g.id).map((l) => (
              <Entra key={l.nombre} visible={visible} i={k++} className="flex items-center gap-4 rounded-[20px] border-2 bg-white px-5 py-3 shadow-lg shadow-black/10" style={{ borderColor: color }}>
                <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl" style={{ background: color, color: oscuro ? "#fff" : C.noche }}><Icono n={l.icono} /></span>
                <h3 className="text-[25px] font-semibold leading-tight">{l.nombre}</h3>
              </Entra>
            ))}
          </div>
        );
      })}
    </div>
  );
}

function DatosClave({ visible }: { visible: boolean }) {
  return (
    <div className="grid grid-cols-3 gap-6">
      {MODELO_DATOS.datosClave.map((d, i) => (
        <Entra key={d.quien} visible={visible} i={i * 3} base={0.2} step={0.25}
          className="flex flex-col gap-2 rounded-[24px] px-7 py-5 shadow-xl shadow-black/10"
          style={{ background: [C.turquesa, C.mostaza, C.noche][i], color: i === 1 ? C.noche : "#fff" }}>
          <h3 className="flex items-center gap-2 text-[19px] font-bold uppercase tracking-[0.14em]">
            <span aria-hidden className="h-2.5 w-2.5 rounded-full" style={{ background: C.terracota }} />{d.quien}
          </h3>
          <p className="font-display text-[30px] font-bold leading-tight">{d.texto}</p>
        </Entra>
      ))}
    </div>
  );
}

export function ModeloNegocio({ activa, paso }: { activa: boolean; paso: number }) {
  const rm = useReducedMotion();
  const p = activa ? paso : -1;
  const titulo = p === 0 ? { opacity: 1, x: 0, y: 330, scale: 1 } : p > 0 ? { opacity: 1, x: 0, y: 36, scale: 0.55 } : { opacity: 0, x: 0, y: 340, scale: 0.5 };
  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: C.crema, color: C.noche }}>
      <div aria-hidden className="absolute -right-40 -top-48 h-[560px] w-[560px] rounded-full blur-3xl" style={{ background: C.turquesa + "1f" }} />
      <motion.div initial={false} animate={titulo} transition={rm ? { duration: 0.2 } : { type: "spring", stiffness: 70, damping: 16 }}
        className="absolute left-[100px] top-0 w-[1400px] origin-top text-center" style={{ zIndex: 20 }}>
        <h1 className="font-display text-[80px] font-bold leading-[1.02]">Así gana Rumbo</h1>
        <p className={`${caveat.className} mt-4 text-[44px]`} style={{ color: C.terracota }}>(7 formas, una sola plataforma)</p>
      </motion.div>
      {/* Escenario en flujo normal; termina antes de y = 852 */}
      <div className="absolute left-[80px] top-[170px] flex w-[1440px] flex-col gap-8">
        <Grupos visible={p >= 1} />
        <DatosClave visible={p >= 2} />
      </div>
    </div>
  );
}
