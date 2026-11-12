"use client";
import { type ReactNode } from "react";
import { Caveat } from "next/font/google";
import { motion, useReducedMotion } from "motion/react";
import { Entra as EntraMarca } from "../componentes/Entra";
import { Brujula } from "../componentes/Brujula";
import { Flecha } from "../componentes/Garabatos";
import { LogoIcon } from "../../components/Logo";

/** Datos del modelo: quién paga qué. */
const MODELO_DATOS = {
  grupos: [
    { id: "organizadores", nombre: "Organizadores" },
    { id: "marcas", nombre: "Marcas y negocios" },
    { id: "combos", nombre: "Combos" },
  ],
  lineas: [
    { grupo: "organizadores", icono: "boleto", corto: "Entradas", nombre: "Comisión por entradas" },
    { grupo: "organizadores", icono: "stand", corto: "Reservas y stands", nombre: "Comisión por reservas y stands" },
    { grupo: "organizadores", icono: "estrella", corto: "Eventos destacados", nombre: "Eventos destacados", etiqueta: "$30" },
    { grupo: "organizadores", icono: "panel", corto: "Plan profesional", nombre: "Plan profesional" },
    { grupo: "marcas", icono: "cartel", corto: "Promociones", nombre: "Promociones comerciales" },
    { grupo: "marcas", icono: "regalo", corto: "Combos patrocinados", nombre: "Combos patrocinados" },
    { grupo: "combos", icono: "combo", corto: "Comisión por combos", nombre: "Comisión por combos (el precio ya la incluye)" },
  ],
  datosClave: [
    { quien: "Organizador", texto: "8% + $0.30 por entrada, y publicar es gratis" },
    { quien: "Asistente", texto: "Sin cargo de servicio de Rumbo" },
    { quien: "Pago al organizador", texto: "3 días hábiles después del evento" },
  ],
};

/* Ejemplo de una entrada: las cifras se calculan, no se escriben. */
const PRECIO_EJEMPLO = 12;
const COMISION_PCT = 0.08;
const COMISION_FIJA = 0.3;
const PARTE_PCT = PRECIO_EJEMPLO * COMISION_PCT;
const COMISION_RUMBO = PARTE_PCT + COMISION_FIJA;
const RECIBE_ORGANIZADOR = PRECIO_EJEMPLO - COMISION_RUMBO;
const dolar = (n: number) => `$${Number.isInteger(n) ? n : n.toFixed(2)}`;
const VERSION_ANTERIOR = false; // la versión anterior (Grupos y DatosClave) se conserva sin renderizar

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
                {"etiqueta" in l && <span className="ml-auto shrink-0 rounded-full px-3 py-1 text-[18px] font-bold leading-none" style={{ background: C.noche + "14" }}>{l.etiqueta}</span>}
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

const CIFRAS = [
  { cifra: `${Math.round(COMISION_PCT * 100)}% + ${dolar(COMISION_FIJA)}`, texto: "por entrada, lo paga el organizador; publicar es gratis", color: C.turquesa, claro: false },
  { cifra: "$0", texto: "cargo de servicio de Rumbo para el asistente", color: C.mostaza, claro: true },
  { cifra: "3 días hábiles", texto: "después del evento, el organizador cobra", color: C.noche, claro: false },
];

function Cifras({ visible }: { visible: boolean }) {
  return (
    <div className="grid grid-cols-3 gap-8">
      {CIFRAS.map((c, i) => (
        <Entra key={c.cifra} visible={visible} i={i} base={0.2} step={0.2}
          className="flex min-h-[300px] flex-col justify-center gap-5 rounded-[28px] px-9 py-8 shadow-xl shadow-black/10"
          style={{ background: c.color, color: c.claro ? C.noche : "#fff" }}>
          <p className="font-display text-[72px] font-bold leading-none">{c.cifra}</p>
          <p className="text-[28px] font-medium leading-snug">{c.texto}</p>
        </Entra>
      ))}
    </div>
  );
}

function Flujo({ visible }: { visible: boolean }) {
  const pasos = [
    { quien: "Asistente paga", monto: dolar(PRECIO_EJEMPLO), nota: "más el costo de procesamiento del pago", bg: "#fff", fg: C.noche, borde: C.noche + "22" },
    { quien: "Rumbo se queda", monto: dolar(COMISION_RUMBO), nota: `${dolar(PARTE_PCT)} + ${dolar(COMISION_FIJA)}`, bg: C.turquesa, fg: "#fff", borde: C.turquesa },
    { quien: "Organizador recibe", monto: dolar(RECIBE_ORGANIZADOR), nota: "3 días hábiles después del evento", bg: C.mostaza, fg: C.noche, borde: C.mostaza },
  ];
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex w-full items-stretch gap-4">
        {pasos.map((x, i) => (
          <div key={x.quien} className="flex flex-1 items-center gap-4">
            <Entra visible={visible} i={i * 2} base={0.2} step={0.3} className="flex min-h-[300px] flex-1 flex-col justify-center gap-3 rounded-[28px] border-2 px-8 py-8 shadow-xl shadow-black/10"
              style={{ background: x.bg, color: x.fg, borderColor: x.borde }}>
              <p className="text-[22px] font-bold uppercase tracking-[0.12em] opacity-80">{x.quien}</p>
              <p className="font-display text-[96px] font-bold leading-none">{x.monto}</p>
              <p className="text-[22px] leading-snug opacity-90">{x.nota}</p>
            </Entra>
            {i < pasos.length - 1 && (
              <Entra visible={visible} i={i * 2 + 1} base={0.2} step={0.3} className="shrink-0">
                <svg aria-hidden viewBox="0 0 48 24" width={48} height={24} fill="none" stroke={C.noche} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h38M32 4l10 8-10 8" /></svg>
              </Entra>
            )}
          </div>
        ))}
      </div>
      <p className="text-[24px] font-semibold uppercase tracking-[0.12em] opacity-70">ejemplo con una entrada de {dolar(PRECIO_EJEMPLO)}</p>
    </div>
  );
}

function Lineas({ visible }: { visible: boolean }) {
  let k = 0;
  return (
    <div className="flex flex-col items-center gap-14">
      <div className="flex w-full items-start justify-center gap-10">
        {MODELO_DATOS.grupos.map((g) => {
          const color = COLOR_GRUPO[g.id];
          const oscuro = g.id !== "marcas";
          const ls = MODELO_DATOS.lineas.filter((l) => l.grupo === g.id);
          return (
            <div key={g.id} className="flex flex-col items-center gap-5">
              <Entra visible={visible} i={k++}>
                <p className="rounded-full px-5 py-2 text-[20px] font-bold uppercase tracking-[0.1em]" style={{ background: color, color: oscuro ? "#fff" : C.noche }}>{g.nombre}</p>
              </Entra>
              <div className="flex items-start gap-4">
                {ls.map((l) => (
                  <Entra key={l.nombre} visible={visible} i={k++} className="flex w-[130px] flex-col items-center gap-3 text-center">
                    <span className="relative flex h-[84px] w-[84px] items-center justify-center rounded-3xl" style={{ background: color, color: oscuro ? "#fff" : C.noche }}>
                      <Icono n={l.icono} size={46} />
                      {"etiqueta" in l && <span className="absolute -right-3 -top-3 rounded-full bg-white px-3 py-1 text-[18px] font-bold leading-none shadow-md" style={{ color: C.noche }}>{l.etiqueta}</span>}
                    </span>
                    <p className="text-[19px] font-semibold leading-tight">{l.corto}</p>
                  </Entra>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <Entra visible={visible} i={9} className="text-center">
        <p className="font-display text-[38px] font-bold leading-tight"><span className="rounded px-3" style={{ background: C.mostaza + "55" }}>Hoy contamos 2 en la proyección: entradas y eventos destacados</span></p>
      </Entra>
    </div>
  );
}

/* ───────────── Rediseño creativo (V3): boleto, ruta y brújula ───────────── */

/** Línea ondulada de marca (local: no existía en los componentes compartidos). */
function Ondulado({ color, visible }: { color: string; visible: boolean }) {
  const rm = useReducedMotion();
  return (
    <svg aria-hidden viewBox="0 0 240 16" width={240} height={16} fill="none" stroke={color} strokeWidth={4} strokeLinecap="round">
      <motion.path d="M2 8 Q22 -2 42 8 T82 8 T122 8 T162 8 T202 8 T238 8" initial={false}
        animate={{ pathLength: visible ? 1 : 0, opacity: visible ? 1 : 0 }}
        transition={rm ? { duration: 0.2 } : { duration: 0.9, delay: visible ? 0.4 : 0 }} />
    </svg>
  );
}

/** Nota manuscrita (Caveat), solo para acotaciones. */
function Nota({ className = "", style, children }: { className?: string; style?: React.CSSProperties; children: ReactNode }) {
  return <p className={`${caveat.className} ${className}`} style={style}>{children}</p>;
}

const Calendario = () => (
  <svg aria-hidden viewBox="0 0 48 48" width={64} height={64} fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
    <rect x="7" y="10" width="34" height="31" rx="5" /><path d="M7 20h34M16 6v8M32 6v8M16 29h4M24 29h4M16 35h4" />
  </svg>
);

const muesca = (cls: string) => <span aria-hidden className={`absolute h-[44px] w-[44px] rounded-full ${cls}`} style={{ background: C.crema }} />;

function BoletoGigante({ visible }: { visible: boolean }) {
  const perf = { borderRight: `4px dashed ${C.noche}33` };
  return (
    <div className="flex flex-col gap-4">
      <EntraMarca activa={visible} rot={-2}>
        <div className="grid min-h-[330px] grid-cols-[1.9fr_1.15fr_1fr] rounded-[32px] bg-white shadow-2xl shadow-black/15">
          <section className="relative flex flex-col justify-center gap-4 px-12 py-8" style={perf}>
            {muesca("-left-[22px] top-1/2 -translate-y-1/2")}
            {muesca("-right-[22px] -top-[22px]")}
            {muesca("-bottom-[22px] -right-[22px]")}
            <p className="whitespace-nowrap font-display text-[104px] font-bold leading-none" style={{ color: C.turquesa }}>{CIFRAS[0].cifra}</p>
            <p className="text-[30px] font-medium leading-snug">{CIFRAS[0].texto}</p>
          </section>
          <section className="relative flex flex-col items-center justify-center gap-4 px-6 py-8" style={perf}>
            {muesca("-right-[22px] -top-[22px]")}
            {muesca("-bottom-[22px] -right-[22px]")}
            <div className="flex h-[210px] w-[210px] items-center justify-center rounded-full p-3" style={{ background: C.mostaza, transform: "rotate(7deg)" }}>
              <div className="flex h-full w-full items-center justify-center rounded-full" style={{ border: `4px dashed ${C.noche}`, color: C.noche }}>
                <span className="font-display text-[104px] font-bold leading-none">{CIFRAS[1].cifra}</span>
              </div>
            </div>
            <p className="text-center text-[24px] font-medium leading-snug">{CIFRAS[1].texto}</p>
          </section>
          <section className="relative flex flex-col items-center justify-center gap-3 px-6 py-8" style={{ color: C.noche }}>
            {muesca("-right-[22px] top-1/2 -translate-y-1/2")}
            <span style={{ color: C.terracota }}><Calendario /></span>
            <p className="text-center font-display text-[52px] font-bold leading-[1.05]">{CIFRAS[2].cifra}</p>
            <p className="text-center text-[24px] font-medium leading-snug">{CIFRAS[2].texto}</p>
          </section>
        </div>
      </EntraMarca>
      <div className="grid grid-cols-[1.9fr_1.15fr_1fr]">
        <span />
        <EntraMarca activa={visible} retraso={0.7} desde="izq" className="flex items-start justify-center gap-2">
          <Flecha className="mt-1 h-[56px] w-[130px] shrink-0" style={{ color: C.terracota, transform: "scaleX(-1) rotate(30deg)" }} />
          <Nota className="mt-6 whitespace-nowrap text-[38px] leading-none" style={{ color: C.terracota }}>esto no lo paga el asistente</Nota>
        </EntraMarca>
        <span />
      </div>
    </div>
  );
}

function Sticker({ texto, bg, fg, rot, lado }: { texto: string; bg: string; fg: string; rot: number; lado: "der" | "izq" | "ninguno" }) {
  return (
    <div className="inline-block rounded-[22px] px-7 py-2 font-display text-[80px] font-bold leading-none shadow-lg shadow-black/20"
      style={{ background: bg, color: fg, transform: `rotate(${rot}deg)`, border: "7px solid #fff", ...(lado === "der" ? { borderRightStyle: "dashed" } : lado === "izq" ? { borderLeftStyle: "dashed" } : {}) }}>
      {texto}
    </div>
  );
}

const Flechita = () => (
  <svg aria-hidden viewBox="0 0 48 24" width={44} height={22} fill="none" stroke={C.noche} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h38M32 4l10 8-10 8" /></svg>
);

function RutaBoleto({ visible }: { visible: boolean }) {
  const rm = useReducedMotion();
  const tarjeta = "flex flex-1 flex-col items-center gap-3 rounded-[28px] border-2 bg-white px-6 py-7 text-center shadow-xl shadow-black/10";
  return (
    <div className="flex w-full flex-col gap-5">
      {/* Ruta punteada con la brújula viajando */}
      <div className="relative h-[60px]">
        <div aria-hidden className="absolute inset-x-[16.66%] top-1/2 -translate-y-1/2 border-t-[5px] border-dotted" style={{ borderColor: C.turquesa }} />
        <div className="relative grid h-full grid-cols-3 items-center">
          {[0, 1, 2].map((i) => <span key={i} className="mx-auto block h-7 w-7 rounded-full border-[5px] bg-[#FAF6EF]" style={{ borderColor: i === 2 ? C.mostaza : C.turquesa }} />)}
        </div>
        <motion.div aria-hidden initial={false} className="absolute top-0 -ml-[28px]"
          animate={visible ? { left: rm ? "50%" : ["16.66%", "50%", "83.33%"], opacity: 1 } : { left: "16.66%", opacity: 0 }}
          transition={rm ? { duration: 0.2 } : { duration: 3, delay: visible ? 0.8 : 0, times: [0, 0.5, 1], ease: "easeInOut" }}>
          <Brujula size={56} activa={visible} grados={90} />
        </motion.div>
      </div>
      <div className="flex items-center gap-4">
        <EntraMarca activa={visible} className={tarjeta} style={{ borderColor: C.noche + "22" }}>
          <p className="text-[22px] font-bold uppercase tracking-[0.12em] opacity-75">Asistente paga</p>
          <Sticker texto={dolar(PRECIO_EJEMPLO)} bg="#FFF3D1" fg={C.noche} rot={-4} lado="der" />
          <p className="text-[22px] leading-snug opacity-85">más el costo de procesamiento del pago</p>
        </EntraMarca>
        <Flechita />
        <EntraMarca activa={visible} retraso={0.5} className={tarjeta} style={{ borderColor: C.turquesa }}>
          <LogoIcon size={56} />
          <p className="text-[22px] font-bold uppercase tracking-[0.12em]" style={{ color: C.turquesa }}>Rumbo se queda</p>
          <Sticker texto={dolar(COMISION_RUMBO)} bg={C.turquesa} fg="#fff" rot={3} lado="izq" />
          <p className="text-[22px] leading-snug opacity-85">{dolar(PARTE_PCT)} + {dolar(COMISION_FIJA)}</p>
        </EntraMarca>
        <Flechita />
        <EntraMarca activa={visible} retraso={1} className={tarjeta} style={{ borderColor: C.mostaza }}>
          <span className="flex h-[56px] w-[56px] items-center justify-center rounded-2xl" style={{ background: C.mostaza, color: C.noche }}><Icono n="stand" size={36} /></span>
          <p className="text-[22px] font-bold uppercase tracking-[0.12em] opacity-75">Organizador recibe</p>
          <Sticker texto={dolar(RECIBE_ORGANIZADOR)} bg={C.mostaza} fg={C.noche} rot={-3} lado="izq" />
          <p className="text-[22px] leading-snug opacity-85">3 días hábiles después del evento</p>
        </EntraMarca>
      </div>
      <p className="text-center text-[24px] font-semibold uppercase tracking-[0.12em] opacity-70">ejemplo con una entrada de {dolar(PRECIO_EJEMPLO)}</p>
    </div>
  );
}

/** Las 7 líneas, en el orden en que se reparten alrededor de la brújula (Entradas arriba). */
const EN_PROYECCION = new Set(["boleto", "estrella"]);

function BrujulaLineas({ visible }: { visible: boolean }) {
  const rm = useReducedMotion();
  const W = 1440, H = 500, CX = W / 2, CY = 262, RX = 360, RY = 168;
  const items = MODELO_DATOS.lineas.map((l, i) => {
    const a = ((-90 + (i * 360) / 7) * Math.PI) / 180;
    const x = CX + RX * Math.cos(a), y = CY + RY * Math.sin(a);
    const lado = Math.cos(a) > 0.3 ? "der" : Math.cos(a) < -0.3 ? "izq" : "arriba";
    return { l, a, x, y, lado, color: COLOR_GRUPO[l.grupo], oscuro: l.grupo !== "marcas", destacada: EN_PROYECCION.has(l.icono) };
  });
  return (
    <div className="flex flex-col items-center gap-2">
      <svg aria-hidden viewBox={`0 0 ${W} ${H}`} className="w-full">
        {items.map(({ l, a, x, y, color }, i) => (
          <motion.line key={`r${l.nombre}`} x1={CX + 104 * Math.cos(a)} y1={CY + 104 * Math.sin(a)} x2={x - 50 * Math.cos(a)} y2={y - 50 * Math.sin(a)}
            stroke={color} strokeWidth={5} strokeLinecap="round" initial={false}
            animate={visible ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
            transition={rm ? { duration: 0.2 } : { duration: 0.6, delay: visible ? 0.9 + i * 0.1 : 0 }} />
        ))}
        <foreignObject x={CX - 120} y={CY - 120} width={240} height={240} style={{ overflow: "visible" }}><div className="flex h-full w-full items-center justify-center"><Brujula size={190} activa={visible} grados={0} /></div></foreignObject>
        {items.map(({ l, x, y, lado, color, oscuro, destacada }, i) => {
          const anchor = lado === "der" ? "start" : lado === "izq" ? "end" : "middle";
          const tx = lado === "der" ? x + 64 : lado === "izq" ? x - 64 : x;
          const ty = lado === "arriba" ? y - 66 : y + 2;
          return (
            <motion.g key={l.nombre} initial={false} animate={{ opacity: visible ? (destacada ? 1 : 0.55) : 0 }} transition={{ duration: rm ? 0.2 : 0.5, delay: visible ? 1.2 + i * 0.1 : 0 }}>
              {destacada && <circle cx={x} cy={y} r={58} fill={C.mostaza} opacity={0.35} />}
              <circle cx={x} cy={y} r={44} fill={color} />
              <g transform={`translate(${x - 26} ${y - 26}) scale(1.08)`} style={{ color: oscuro ? "#fff" : C.noche }}>{ICONOS[l.icono]}</g>
              {"etiqueta" in l && <g><rect x={x + 18} y={y - 60} width={56} height={30} rx={15} fill="#fff" /><text x={x + 46} y={y - 39} textAnchor="middle" fontSize={20} fontWeight={700} fill={C.noche}>{l.etiqueta}</text></g>}
              <text x={tx} y={ty} textAnchor={anchor} fontSize={25} fontWeight={700} fill={C.noche}>{l.corto}</text>
              {destacada && (
                <g>
                  <rect x={lado === "der" ? tx : lado === "izq" ? tx - 188 : x + 62} y={lado === "arriba" ? y - 14 : ty + 12} width={188} height={30} rx={15} fill={C.noche} />
                  <text x={(lado === "der" ? tx : lado === "izq" ? tx - 188 : x + 62) + 94} y={(lado === "arriba" ? y - 14 : ty + 12) + 21} textAnchor="middle" fontSize={16} fontWeight={700} fill="#fff" letterSpacing={1.5}>EN LA PROYECCIÓN</text>
                </g>
              )}
            </motion.g>
          );
        })}
      </svg>
      <EntraMarca activa={visible} retraso={1.8}>
        <Nota className="text-[44px] leading-none" style={{ color: C.terracota }}>hoy contamos 2, las otras 5 son margen</Nota>
      </EntraMarca>
    </div>
  );
}

export function ModeloNegocio({ activa, paso }: { activa: boolean; paso: number }) {
  const p = activa ? paso : -1;
  const capa = (on: boolean) => ({ animate: { opacity: on ? 1 : 0 }, transition: { duration: 0.35, delay: on ? 0.15 : 0 }, style: { gridArea: "1 / 1", pointerEvents: on ? ("auto" as const) : ("none" as const) } });
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden px-[80px] pb-[48px] pt-[72px]" style={{ background: C.crema, color: C.noche }}>
      <div aria-hidden className="absolute -right-40 -top-48 h-[560px] w-[560px] rounded-full blur-3xl" style={{ background: C.turquesa + "1f" }} />
      <EntraMarca activa={p >= 0} desde="arriba" className="relative flex flex-col items-center">
        <h1 className="font-display text-[68px] font-bold leading-[1.02]">Cómo gana Rumbo</h1>
        <div className="mt-1"><Ondulado color={C.turquesa} visible={p >= 0} /></div>
        <Nota className="mt-1 text-[40px] leading-none" style={{ color: C.terracota }}>(sin cobrarle de más al asistente)</Nota>
      </EntraMarca>
      <div className="relative mt-4 grid flex-1 items-center">
        <motion.div aria-hidden={p !== 0} initial={false} {...capa(p === 0)}><BoletoGigante visible={p === 0} /></motion.div>
        <motion.div aria-hidden={p !== 1} initial={false} {...capa(p === 1)}><RutaBoleto visible={p === 1} /></motion.div>
        <motion.div aria-hidden={p !== 2} initial={false} {...capa(p === 2)}><BrujulaLineas visible={p === 2} /></motion.div>
      </div>
    </div>
  );
}

/* Versión anterior (V2: tres tarjetas, flujo y fila de íconos). Se conserva sin renderizar. */
export function ModeloNegocioV2({ activa, paso }: { activa: boolean; paso: number }) {
  const p = activa ? paso : -1;
  const capa = (on: boolean) => ({ animate: { opacity: on ? 1 : 0 }, transition: { duration: 0.35, delay: on ? 0.15 : 0 }, style: { gridArea: "1 / 1", pointerEvents: on ? ("auto" as const) : ("none" as const) } });
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden px-[80px] pb-[48px] pt-[72px]" style={{ background: C.crema, color: C.noche }}>
      <div aria-hidden className="absolute -right-40 -top-48 h-[560px] w-[560px] rounded-full blur-3xl" style={{ background: C.turquesa + "1f" }} />
      <Entra visible={p >= 0} base={0} className="relative text-center">
        <h1 className="font-display text-[72px] font-bold leading-[1.02]">Cómo gana Rumbo</h1>
        <p className={`${caveat.className} mt-3 text-[40px]`} style={{ color: C.terracota }}>(7 formas, una sola plataforma)</p>
      </Entra>
      <div className="relative grid flex-1 items-center">
        <motion.div aria-hidden={p !== 0} initial={false} {...capa(p === 0)}><Cifras visible={p === 0} /></motion.div>
        <motion.div aria-hidden={p !== 1} initial={false} {...capa(p === 1)}><Flujo visible={p === 1} /></motion.div>
        <motion.div aria-hidden={p !== 2} initial={false} {...capa(p === 2)}><Lineas visible={p === 2} /></motion.div>
      </div>
      {VERSION_ANTERIOR && <div hidden><Grupos visible={false} /><DatosClave visible={false} /></div>}
    </div>
  );
}

/* Versión anterior de la slide (título animado + grupos + datos clave). Se conserva sin renderizar. */
export function ModeloNegocioAnterior({ activa, paso }: { activa: boolean; paso: number }) {
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
