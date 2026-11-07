"use client";
import { useEffect } from "react";
import { Caveat } from "next/font/google";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { Brujula } from "../componentes/Brujula";

/**
 * Datos del mercado. Si un campo queda vacío, esa parte muestra "por validar".
 * Los rangos son [mínimo, máximo?]: con un solo número se muestra una cifra fija.
 * - `personas`: cuántas personas (o usuarios) tiene el nivel.
 * - `dinero`: dólares al año. En TAM y SAM es gasto de las personas en salidas; en SOM es ingreso de Rumbo por comisiones.
 * - `supuestos`: gasto y comisión por persona son aproximados, derivados de los totales
 *   ($359 M / 2.0 M de personas; $43-106 mil / 12-30 mil usuarios).
 */
type Rango = [number, number?];
interface Nivel { etiqueta: string; personas?: Rango; dinero?: Rango }

const MERCADO_DATOS: {
  tam: Nivel; sam: Nivel; som: Nivel;
  supuestos: { gastoAnualPorPersona?: number; porcentajeSom?: Rango; comisionPorUsuario?: number };
  fuente: { texto: string; fecha: string };
} = {
  tam: { etiqueta: "TAM", personas: [2_000_000], dinero: [359_000_000] },
  sam: { etiqueta: "SAM", personas: [590_000], dinero: [106_000_000] },
  som: { etiqueta: "SOM", personas: [12_000, 30_000], dinero: [43_000, 106_000] },
  supuestos: { gastoAnualPorPersona: 180, porcentajeSom: [2, 5], comisionPorUsuario: 3.5 },
  fuente: { texto: "Censo 2024 de El Salvador y datos de mercado", fecha: "consultados el 20 de octubre de 2026" },
};

const NOTA_ALCANCE = "TAM y SAM son lo que las personas gastan en salidas, no ingreso de Rumbo. El ingreso de Rumbo es solo la comisión: el SOM.";

const caveat = Caveat({ subsets: ["latin"], weight: "600" });
const C = { crema: "#FAF6EF", noche: "#12303A", turquesa: "#0A7C7C", marca: "#0FA3A3", mostaza: "#F5B82E", terracota: "#C8553D" };

/* ───────────── Formato ───────────── */

const corto = (n: number) => (n >= 1e6 ? `${(n / 1e6).toFixed(1)} M` : n >= 1e3 ? `${Math.round(n / 1e3)} mil` : `${Math.round(n)}`);

/** Formatea una cifra o un rango (en dólares si `dinero`). Con rango en miles: "$43–106 mil". */
function fmtRango(a: number, b: number | undefined, dinero: boolean): string {
  const $ = dinero ? "$" : "";
  if (b == null) return `${$}${corto(a)}`;
  if (a >= 1e3 && b >= 1e3 && a < 1e6 && b < 1e6) return `${$}${Math.round(a / 1e3)}–${Math.round(b / 1e3)} mil`;
  return `${$}${corto(a)} – ${$}${corto(b)}`;
}

/* ───────────── Cifra animada ───────────── */

function Cifra({ rango, dinero, activa, size, className = "font-display font-bold" }: { rango?: Rango; dinero: boolean; activa: boolean; size: number; className?: string }) {
  const rm = useReducedMotion();
  const a = useMotionValue(0);
  const b = useMotionValue(0);
  const texto = useTransform([a, b], ([x, y]) => fmtRango(x as number, rango?.[1] != null ? (y as number) : undefined, dinero));
  const [min, max] = rango ?? [];
  useEffect(() => {
    if (min == null) return;
    if (!activa) { a.set(0); b.set(0); return; }
    if (rm) { a.set(min); b.set(max ?? 0); return; }
    const o = { duration: 1.6, delay: 0.5, ease: "easeOut" as const };
    const c1 = animate(a, min, o);
    const c2 = animate(b, max ?? 0, o);
    return () => { c1.stop(); c2.stop(); };
  }, [activa, min, max, a, b, rm]);

  if (min == null) return <p className={`${caveat.className} leading-none`} style={{ fontSize: size * 0.62 }}>por validar</p>;
  return <motion.p className={`${className} leading-none tabular-nums`} style={{ fontSize: size }}>{texto}</motion.p>;
}

/* ───────────── Círculos ───────────── */

const NIVELES = [
  { k: "tam" as const, d: 700, top: 34, size: 80, unidad: "personas de 18 a 34 años", fondo: "rgba(10,124,124,0.16)", borde: "rgba(10,124,124,0.45)", paso: 1 },
  { k: "sam" as const, d: 460, top: 30, size: 64, unidad: "personas con internet", fondo: C.marca, borde: C.marca, paso: 2 },
  { k: "som" as const, d: 250, top: 54, size: 36, unidad: "usuarios activos", fondo: C.mostaza, borde: C.mostaza, paso: 3 },
];

function Circulo({ n, p }: { n: (typeof NIVELES)[number]; p: number }) {
  const rm = useReducedMotion();
  const visible = p >= n.paso;
  const foco = n.k === "som" && p === 5;
  const dato = MERCADO_DATOS[n.k];
  const chico = n.k === "som";
  return (
    <motion.div aria-hidden={!visible} initial={false}
      animate={visible ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
      transition={rm ? { duration: 0.2 } : visible ? { type: "spring", stiffness: 80, damping: 14 } : { duration: 0.25 }}
      className="absolute bottom-0 left-1/2 rounded-full text-center"
      style={{ width: n.d, height: n.d, marginLeft: -n.d / 2, background: n.fondo, border: `3px solid ${n.borde}`, color: C.noche, zIndex: 1 + n.paso }}>
      <motion.div initial={false} animate={foco && !rm ? { scale: [1, 1.07, 1] } : { scale: 1 }}
        transition={foco && !rm ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 }}
        className="absolute inset-x-0 flex flex-col items-center" style={{ top: n.top }}>
        <p className="text-[20px] font-bold uppercase tracking-[0.18em]">{dato.etiqueta}</p>
        <div className="mt-2"><Cifra rango={dato.personas} dinero={false} activa={visible} size={n.size} /></div>
        <p className={chico ? "mt-1 text-[16px]" : "mt-2 text-[22px]"}>{n.unidad}</p>
        <div className={chico ? "mt-2" : "mt-3"}>
          <span className="inline-flex items-baseline gap-1.5 rounded-full px-3 py-1" style={{ background: "rgba(18,48,58,0.12)" }}>
            <span className={chico ? "text-[13px]" : "text-[16px]"}>{chico ? "ingreso" : "gasto"} ≈</span>
            <Cifra rango={dato.dinero} dinero activa={visible} size={chico ? 20 : 28} className="font-display font-bold" />
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ───────────── Textos ───────────── */

const FILAS = [
  { k: "tam" as const, color: "rgba(10,124,124,0.55)", titulo: "Mercado total", linea: "Personas de 18 a 34 años en El Salvador y lo que podrían gastar en salidas al año.", paso: 1 },
  { k: "sam" as const, color: C.marca, titulo: "Lo que Rumbo puede atender", linea: "San Salvador y La Libertad, con acceso a internet: eventos locales, mercaditos y experiencias que hoy se promocionan por redes.", paso: 2 },
  { k: "som" as const, color: C.mostaza, titulo: "Lo que capturamos en 12 meses", linea: "Entre 2% y 5% del SAM como usuarios activos. El ingreso es solo la comisión.", paso: 3 },
];

function Fila({ f, p }: { f: (typeof FILAS)[number]; p: number }) {
  const rm = useReducedMotion();
  const visible = p >= f.paso;
  return (
    <motion.div initial={false} animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : 50 }}
      transition={rm ? { duration: 0.2 } : visible ? { type: "spring", stiffness: 90, damping: 15, delay: 0.3 } : { duration: 0.2 }}
      className="flex gap-4">
      <span className="mt-1 w-3 shrink-0 self-stretch rounded-full" style={{ background: f.color }} />
      <div>
        <p className="text-[18px] font-bold uppercase tracking-[0.14em]" style={{ color: C.turquesa }}>{MERCADO_DATOS[f.k].etiqueta} · {f.titulo}</p>
        <p className="mt-0.5 text-[24px] leading-snug">{f.linea}</p>
      </div>
    </motion.div>
  );
}

/** Pieza de la fórmula: número en mostaza o "por validar". */
function Ficha({ etiqueta, texto }: { etiqueta: string; texto: string | null }) {
  return (
    <span className="inline-flex flex-col items-center rounded-xl px-2.5 py-1" style={{ background: "rgba(250,246,239,0.08)" }}>
      <span className={texto == null ? "text-[18px] font-semibold italic" : "font-display text-[26px] font-bold leading-tight"} style={{ color: texto == null ? C.crema + "aa" : C.mostaza }}>{texto ?? "por validar"}</span>
      <span className="text-[12px] uppercase tracking-wide" style={{ color: C.crema + "bb" }}>{etiqueta}</span>
    </span>
  );
}

const Op = ({ t }: { t: string }) => <span className="text-[24px]" style={{ color: C.crema + "88" }}>{t}</span>;
const dinero = (r?: Rango) => (r ? fmtRango(r[0], r[1], true) : null);
const personas = (r?: Rango) => (r ? fmtRango(r[0], r[1], false) : null);

function FormulaFila({ k }: { k: "tam" | "sam" | "som" }) {
  const { tam, sam, som, supuestos: s } = MERCADO_DATOS;
  const gasto = s.gastoAnualPorPersona != null ? `≈ $${s.gastoAnualPorPersona}` : null;
  return (
    <div className="flex items-center gap-2">
      <span className="w-[56px] text-[19px] font-bold tracking-[0.12em]" style={{ color: C.crema }}>{MERCADO_DATOS[k].etiqueta}</span>
      {k === "som" ? (
        <>
          <Ficha etiqueta="personas del SAM" texto={personas(sam.personas)} /><Op t="×" />
          <Ficha etiqueta="captura" texto={s.porcentajeSom ? `${s.porcentajeSom[0]}–${s.porcentajeSom[1]}%` : null} /><Op t="×" />
          <Ficha etiqueta="comisión por usuario" texto={s.comisionPorUsuario != null ? `≈ $${s.comisionPorUsuario}` : null} /><Op t="=" />
          <Ficha etiqueta="ingreso" texto={dinero(som.dinero)} />
        </>
      ) : (
        <>
          <Ficha etiqueta="personas" texto={personas((k === "tam" ? tam : sam).personas)} /><Op t="×" />
          <Ficha etiqueta="gasto anual por persona" texto={gasto} /><Op t="=" />
          <Ficha etiqueta="gasto potencial" texto={dinero((k === "tam" ? tam : sam).dinero)} />
        </>
      )}
    </div>
  );
}

/* ───────────── Slide ───────────── */

export function Mercado({ activa, paso }: { activa: boolean; paso: number }) {
  const rm = useReducedMotion();
  const p = activa ? paso : -1;
  const titulo = p === 0 ? { opacity: 1, y: 280, scale: 1 } : p > 0 ? { opacity: 1, y: 28, scale: 0.5 } : { opacity: 0, y: 300, scale: 0.5 };
  const { fuente } = MERCADO_DATOS;
  const textoFuente = fuente.texto ? `Fuente: ${fuente.texto}${fuente.fecha ? `, ${fuente.fecha}` : ""}.` : "Fuente: por validar";

  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: C.crema, color: C.noche }}>
      <div aria-hidden className="absolute -right-40 -top-48 h-[560px] w-[560px] rounded-full blur-3xl" style={{ background: C.turquesa + "1f" }} />

      {/* Título */}
      <motion.div initial={false} animate={titulo} transition={rm ? { duration: 0.2 } : { type: "spring", stiffness: 70, damping: 16 }}
        className="absolute left-[250px] top-0 w-[1100px] origin-top text-center" style={{ zIndex: 20 }}>
        <h1 className="font-display text-[76px] font-bold leading-[1.02]">¿Qué tan grande es el rumbo?</h1>
        <p className={`${caveat.className} mt-6 text-[44px]`} style={{ color: C.terracota }}>(de lo grande a lo que alcanzamos primero)</p>
      </motion.div>

      {/* Círculos concéntricos */}
      <div className="absolute left-[60px] top-[180px] h-[700px] w-[700px]">
        {NIVELES.map((n) => <Circulo key={n.k} n={n} p={p} />)}
      </div>

      {/* Qué incluye cada nivel */}
      <div className="absolute left-[820px] top-[170px] w-[750px] space-y-4" style={{ zIndex: 5 }}>
        {FILAS.map((f) => <Fila key={f.k} f={f} p={p} />)}
      </div>

      {/* Aclaración de alcance */}
      <motion.p initial={false} animate={{ opacity: p >= 1 ? 1 : 0 }} transition={{ duration: 0.5, delay: p === 1 ? 1 : 0 }}
        className="absolute left-[820px] top-[826px] w-[750px] border-l-4 pl-3 text-[18px] leading-snug"
        style={{ zIndex: 6, borderColor: C.terracota, color: C.noche + "d9" }}>{NOTA_ALCANCE}</motion.p>

      {/* De dónde sale */}
      <motion.div aria-hidden={p !== 4} initial={false} animate={{ opacity: p === 4 ? 1 : 0, y: p === 4 ? 0 : 30 }}
        transition={rm ? { duration: 0.2 } : p === 4 ? { type: "spring", stiffness: 90, damping: 16, delay: 0.2 } : { duration: 0.25 }}
        className="absolute left-[820px] top-[488px] w-[770px] rounded-[26px] p-5 shadow-2xl shadow-black/20" style={{ background: C.noche, color: C.crema, zIndex: 6 }}>
        <p className="font-display text-[28px] font-bold">De dónde sale</p>
        <div className="mt-3 space-y-2.5"><FormulaFila k="tam" /><FormulaFila k="sam" /><FormulaFila k="som" /></div>
        <p className="mt-3 text-[15px] leading-snug" style={{ color: C.crema + "aa" }}>{textoFuente}</p>
      </motion.div>

      {/* Cierre */}
      <motion.div initial={false} animate={{ opacity: p === 5 ? 1 : 0, x: p === 5 ? 0 : 50 }}
        transition={rm ? { duration: 0.2 } : p === 5 ? { type: "spring", stiffness: 80, damping: 16, delay: 0.9 } : { duration: 0.2 }}
        className="absolute left-[820px] top-[560px] w-[750px]" style={{ zIndex: 7 }}>
        <p className="font-display text-[62px] font-bold leading-none">
          <span className="relative inline-block">Empezamos aquí
            <svg aria-hidden viewBox="0 0 300 14" className="absolute -bottom-3 left-0 h-3.5 w-full" preserveAspectRatio="none"><path d="M2 8q18-10 36 0t36 0 36 0 36 0 36 0 36 0 36 0 36 0" fill="none" stroke={C.mostaza} strokeWidth="5" strokeLinecap="round" /></svg>
          </span>
        </p>
        <p className="mt-9 flex items-center gap-4 font-display text-[40px] font-semibold leading-tight" style={{ color: C.turquesa }}>
          ¿Y quién más está en este camino?
          <svg aria-hidden viewBox="0 0 60 24" className="h-6 w-14 shrink-0"><path d="M2 12h50m-10-9l10 9-10 9" fill="none" stroke={C.terracota} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </p>
      </motion.div>

      {/* Brújula apuntando al SOM */}
      <motion.div aria-hidden initial={false} animate={{ opacity: p === 5 ? 1 : 0, scale: p === 5 ? 1 : 0.4 }}
        transition={{ type: "spring", stiffness: 110, damping: 14, delay: p === 5 ? 0.3 : 0 }}
        className="absolute left-[690px] top-[690px]" style={{ zIndex: 12 }}>
        <Brujula size={120} activa={p === 5} grados={270} />
      </motion.div>
    </div>
  );
}
