"use client";
import { useEffect, type ReactNode } from "react";
import { Caveat } from "next/font/google";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";

/**
 * Datos del modelo. Los montos de las líneas son ejemplos.
 * Las cifras del cálculo (630, 216, 414) se derivan de `ejemploProcesamiento` y la comisión.
 */
const MODELO_DATOS = {
  grupos: [
    { id: "organizadores", nombre: "Organizadores" },
    { id: "marcas", nombre: "Marcas y negocios" },
    { id: "combos", nombre: "Combos" },
  ],
  lineas: [
    { n: 1, grupo: "organizadores", icono: "boleto", nombre: "Comisión por entradas", quienPaga: "Se descuenta al organizador", ejemplo: "120 entradas de $10 con 8% + $0.30 dan $132." },
    { n: 2, grupo: "organizadores", icono: "stand", nombre: "Comisión por reservas y stands", quienPaga: "Se descuenta al organizador", ejemplo: "25 stands de $40 con 8% dan $80, o 12 cupos de $25 dan $24." },
    { n: 3, grupo: "organizadores", icono: "estrella", nombre: "Eventos destacados", quienPaga: "Paga el organizador", ejemplo: "Camila paga $30 por destacar su mercadito." },
    { n: 4, grupo: "organizadores", icono: "panel", nombre: "Plan profesional", quienPaga: "Paga el organizador recurrente", ejemplo: "$15 a $25 al mes por estadísticas, gestión de stands y reportes." },
    { n: 5, grupo: "marcas", icono: "cartel", nombre: "Promociones comerciales", quienPaga: "Paga la marca o negocio", ejemplo: "Una cafetería paga $60 por una semana." },
    { n: 6, grupo: "marcas", icono: "regalo", nombre: "Combos patrocinados", quienPaga: "Paga la marca", ejemplo: "Una bebida regalada por $150, con 90 canjes." },
    { n: 7, grupo: "combos", icono: "combo", nombre: "Comisión por combos", quienPaga: "El precio ya incluye la comisión", ejemplo: "80 combos de $15 con 10% dan $120." },
  ],
  comision: { porcentaje: 8, fijo: 0.3 },
  procesamiento: { pasarela: [3.4, 3.6] as [number, number], rumbo: [0.1, 0.2] as [number, number], totalAprox: 3.8 },
  ejemploProcesamiento: { entradas: 500, precio: 12, procesamientoPct: 3.6 },
  pagoOrganizador: "3 días hábiles después del evento",
};

const caveat = Caveat({ subsets: ["latin"], weight: "600" });
const C = { crema: "#FAF6EF", noche: "#12303A", turquesa: "#0A7C7C", marca: "#0FA3A3", mostaza: "#F5B82E", terracota: "#C8553D" };
const COLOR_GRUPO: Record<string, string> = { organizadores: C.turquesa, marcas: C.mostaza, combos: C.noche };

/* ───────────── Cálculos y formato ───────────── */

const usd = (n: number) => `$${Number.isInteger(n) ? n.toLocaleString("en-US") : n.toFixed(2)}`;
const rango = (r: [number, number]) => `${r[0]}% a ${r[1]}%`;

const { entradas, precio, procesamientoPct } = MODELO_DATOS.ejemploProcesamiento;
const VENTAS = entradas * precio; // 6,000
const POR_PORCENTAJE = (VENTAS * MODELO_DATOS.comision.porcentaje) / 100; // 480
const POR_FIJO = entradas * MODELO_DATOS.comision.fijo; // 150
const BRUTO = POR_PORCENTAJE + POR_FIJO; // 630
const ABSORBIDO = Math.round((VENTAS * procesamientoPct) / 100); // 216
const NETO = BRUTO - ABSORBIDO; // 414

/* ───────────── Íconos propios ───────────── */

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

/* ───────────── Pasos 1-3: líneas por quién paga ───────────── */

type Linea = (typeof MODELO_DATOS.lineas)[number];

function TarjetaLinea({ l, visible, i }: { l: Linea; visible: boolean; i: number }) {
  const rm = useReducedMotion();
  const color = COLOR_GRUPO[l.grupo];
  return (
    <motion.article aria-hidden={!visible} initial={false}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={rm ? { duration: 0.2 } : visible ? { type: "spring", stiffness: 90, damping: 15, delay: 0.3 + i * 0.18 } : { duration: 0.2 }}
      className="flex gap-3 rounded-[20px] border-2 bg-white px-4 py-3 shadow-lg shadow-black/10" style={{ borderColor: color }}>
      <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl" style={{ background: color, color: l.grupo === "marcas" ? C.noche : "#fff" }}>
        <Icono n={l.icono} />
      </span>
      <div>
        <h3 className="font-display text-[22px] font-bold leading-tight">{l.n}. {l.nombre}</h3>
        <p className="text-[15px] font-bold uppercase leading-tight tracking-[0.06em]" style={{ color: l.grupo === "marcas" ? C.terracota : color }}>{l.quienPaga}</p>
        <p className="mt-1 text-[17px] leading-[1.25]">{l.ejemplo}</p>
      </div>
    </motion.article>
  );
}

function Grupos({ p }: { p: number }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 items-start gap-6">
        {MODELO_DATOS.grupos.map((g, gi) => {
          const visible = p >= gi + 1;
          const lineas = MODELO_DATOS.lineas.filter((l) => l.grupo === g.id);
          return (
            <div key={g.id} className="flex flex-col gap-3">
              <motion.h2 initial={false} animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : -20 }} transition={{ duration: 0.4, delay: visible ? 0.15 : 0 }}
                className="font-display text-[32px] font-bold leading-none">
                <span className="inline-block rounded-full px-4 py-1.5" style={{ background: COLOR_GRUPO[g.id], color: g.id === "marcas" ? C.noche : "#fff" }}>{g.nombre}</span>
              </motion.h2>
              {lineas.map((l, i) => <TarjetaLinea key={l.n} l={l} visible={visible} i={i} />)}
            </div>
          );
        })}
      </div>
      <p className="text-[15px] opacity-60">Montos de ejemplo; las cifras de uso se miden en la validación</p>
    </div>
  );
}

/* ───────────── Paso 5: quién paga qué ───────────── */

function Columna({ visible, color, texto, titulo, grande, subgrande, items, desde }: {
  visible: boolean; color: string; texto: string; titulo: string; grande: string; subgrande: string; items: string[]; desde: number;
}) {
  const rm = useReducedMotion();
  return (
    <motion.div initial={false} animate={visible ? { opacity: 1, x: 0 } : { opacity: 0, x: desde }}
      transition={rm ? { duration: 0.2 } : visible ? { type: "spring", stiffness: 80, damping: 15, delay: 0.2 } : { duration: 0.2 }}
      className="flex flex-col gap-5 rounded-[28px] px-9 py-8 shadow-xl shadow-black/10" style={{ background: color, color: texto }}>
      <h2 className="text-[20px] font-bold uppercase tracking-[0.18em] opacity-85">{titulo}</h2>
      <div>
        <p className="font-display text-[84px] font-bold leading-none">{grande}</p>
        <p className="mt-2 text-[24px] font-semibold leading-snug">{subgrande}</p>
      </div>
      <ul className="flex flex-col gap-3 border-t-2 pt-5" style={{ borderColor: texto + "44" }}>
        {items.map((it) => <li key={it} className="flex gap-3 text-[22px] leading-snug"><span aria-hidden className="mt-[0.55em] h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: texto }} />{it}</li>)}
      </ul>
    </motion.div>
  );
}

function QuienPaga({ visible }: { visible: boolean }) {
  const { comision, procesamiento: pr } = MODELO_DATOS;
  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-display text-[46px] font-bold leading-none">Quién paga qué</h2>
      <div className="grid grid-cols-2 gap-8">
        <Columna visible={visible} desde={-60} color={C.turquesa} texto={C.crema} titulo="Organizador"
          grande={`${comision.porcentaje}% + ${usd(comision.fijo)}`} subgrande="por entrada, se descuenta de su pago"
          items={["Eventos gratuitos: sin comisión ni fees", `Recibe su pago ${MODELO_DATOS.pagoOrganizador}`]} />
        <Columna visible={visible} desde={60} color={C.mostaza} texto={C.noche} titulo="Asistente"
          grande={`≈ ${pr.totalAprox}%`} subgrande="solo el procesamiento de pago, como línea aparte y visible antes de pagar"
          items={[`Pasarela: ${rango(pr.pasarela)}, más Rumbo: ${rango(pr.rumbo)}`, "Sin cargo de servicio de Rumbo"]} />
      </div>
    </div>
  );
}

/* ───────────── Paso 6: por qué se pasa al asistente ───────────── */

function Barras({ visible }: { visible: boolean }) {
  const rm = useReducedMotion();
  const v = useMotionValue(BRUTO);
  const resto = useTransform(v, (x) => `${(x / BRUTO) * 100}%`);
  const corte = useTransform(v, (x) => `${((BRUTO - x) / BRUTO) * 100}%`);
  const cifra = useTransform(v, (x) => usd(Math.round(x)));
  useEffect(() => {
    if (!visible) { v.set(BRUTO); return; }
    if (rm) { v.set(NETO); return; }
    const c = animate(v, NETO, { duration: 1.6, delay: 1.6, ease: "easeInOut" });
    return () => c.stop();
  }, [visible, rm, v]);

  const fila = "grid grid-cols-[330px_1fr] items-center gap-6";
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="font-display text-[44px] font-bold leading-none">Por qué el procesamiento se pasa al asistente</h2>
        <p className="mt-3 text-[24px] leading-snug">{entradas} entradas de {usd(precio)} al mes ({usd(VENTAS)} vendidos), con comisión de {MODELO_DATOS.comision.porcentaje}% + {usd(MODELO_DATOS.comision.fijo)}.</p>
      </div>

      <motion.div initial={false} animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 20 }} transition={{ duration: 0.5, delay: visible ? 0.3 : 0 }} className={fila}>
        <div>
          <p className="text-[18px] font-bold uppercase tracking-[0.1em]" style={{ color: C.turquesa }}>La plataforma factura</p>
          <p className="font-display text-[56px] font-bold leading-none">{usd(BRUTO)}</p>
          <p className="text-[18px]">brutos para la plataforma</p>
        </div>
        <div className="flex h-[84px] overflow-hidden rounded-2xl">
          <div className="flex items-center justify-center text-center" style={{ width: `${(POR_PORCENTAJE / BRUTO) * 100}%`, background: C.turquesa, color: C.crema }}>
            <p className="font-display text-[30px] font-bold leading-none">{usd(POR_PORCENTAJE)}<span className="block text-[16px] font-sans font-medium">{MODELO_DATOS.comision.porcentaje}% de {usd(VENTAS)}</span></p>
          </div>
          <div className="flex items-center justify-center text-center" style={{ width: `${(POR_FIJO / BRUTO) * 100}%`, background: C.mostaza, color: C.noche }}>
            <p className="font-display text-[30px] font-bold leading-none">{usd(POR_FIJO)}<span className="block text-[16px] font-sans font-medium">{usd(MODELO_DATOS.comision.fijo)} × {entradas}</span></p>
          </div>
        </div>
      </motion.div>

      <motion.div initial={false} animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 20 }} transition={{ duration: 0.5, delay: visible ? 0.9 : 0 }} className={fila}>
        <div>
          <p className="text-[18px] font-bold uppercase tracking-[0.1em]" style={{ color: C.terracota }}>Si Rumbo absorbiera {procesamientoPct}%</p>
          <motion.p className="font-display text-[56px] font-bold leading-none tabular-nums">{cifra}</motion.p>
          <p className="text-[18px]">antes de reembolsos, IVA, disputas y operación</p>
        </div>
        <div className="flex h-[84px] overflow-hidden rounded-2xl">
          <motion.div className="flex items-center justify-center" style={{ width: resto, background: C.turquesa, color: C.crema }}>
            <p className="whitespace-nowrap font-display text-[30px] font-bold leading-none">{usd(NETO)}</p>
          </motion.div>
          <motion.div className="flex items-center justify-center overflow-hidden" style={{ width: corte, background: `repeating-linear-gradient(135deg, ${C.terracota}33 0 8px, ${C.terracota}1a 8px 16px)`, color: C.terracota }}>
            <p className="whitespace-nowrap font-display text-[26px] font-bold leading-none">−{usd(ABSORBIDO)}</p>
          </motion.div>
        </div>
      </motion.div>

      <p className={`${caveat.className} text-[32px] leading-none`} style={{ color: C.terracota }}>cómo está pensado el cobro</p>
    </div>
  );
}

/* ───────────── Paso 7: cierre ───────────── */

function Cierre({ visible }: { visible: boolean }) {
  const rm = useReducedMotion();
  return (
    <motion.div initial={false} animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 30 }}
      transition={rm ? { duration: 0.2 } : visible ? { type: "spring", stiffness: 70, damping: 16, delay: 0.3 } : { duration: 0.2 }}
      className="flex min-h-[560px] flex-col items-center justify-center gap-8 text-center">
      <p className="font-display text-[84px] font-bold leading-[1.05]">
        Y todo esto <span className="relative inline-block" style={{ color: C.turquesa }}>ya se puede ver funcionando
          <svg aria-hidden viewBox="0 0 300 14" className="absolute -bottom-3 left-0 h-3.5 w-full" preserveAspectRatio="none"><path d="M2 8q18-10 36 0t36 0 36 0 36 0 36 0 36 0 36 0 36 0" fill="none" stroke={C.mostaza} strokeWidth="5" strokeLinecap="round" /></svg>
        </span>
      </p>
      <svg aria-hidden viewBox="0 0 60 24" className="h-8 w-20"><path d="M2 12h50m-10-9l10 9-10 9" fill="none" stroke={C.terracota} strokeWidth="3.500" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </motion.div>
  );
}

/* ───────────── Slide ───────────── */

export function ModeloNegocio({ activa, paso }: { activa: boolean; paso: number }) {
  const rm = useReducedMotion();
  const p = activa ? paso : -1;
  // Zona segura (lienzo 1600x900): 80 px arriba para la barra de ruta; el contenido termina antes de y = 810.
  const titulo = p === 0 ? { opacity: 1, x: 0, y: 280, scale: 1 } : p > 0 ? { opacity: 1, x: -565, y: 80, scale: 0.5 } : { opacity: 0, x: 0, y: 300, scale: 0.5 };
  const capa = (on: boolean) => ({ animate: { opacity: on ? 1 : 0 }, transition: { duration: rm ? 0.15 : 0.35, delay: on ? 0.15 : 0 }, style: { gridArea: "1 / 1", pointerEvents: on ? "auto" as const : "none" as const } });

  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: C.crema, color: C.noche }}>
      <div aria-hidden className="absolute -right-40 -top-48 h-[560px] w-[560px] rounded-full blur-3xl" style={{ background: C.turquesa + "1f" }} />

      <motion.div initial={false} animate={titulo} transition={rm ? { duration: 0.2 } : { type: "spring", stiffness: 70, damping: 16 }}
        className="absolute left-[100px] top-0 w-[1400px] origin-top text-center" style={{ zIndex: 20 }}>
        <h1 className="font-display text-[76px] font-bold leading-[1.02]">Así gana Rumbo</h1>
        <p className={`${caveat.className} mt-6 text-[44px]`} style={{ color: C.terracota }}>(7 formas, una sola plataforma)</p>
      </motion.div>

      {/* Escenario: las pantallas comparten la misma celda, sin posiciones absolutas internas */}
      <div className="absolute left-[60px] top-[188px] grid w-[1480px]">
        <motion.div aria-hidden={p < 1 || p > 3} initial={false} {...capa(p >= 1 && p <= 3)}><Grupos p={p} /></motion.div>
        <motion.div aria-hidden={p !== 4} initial={false} {...capa(p === 4)}><QuienPaga visible={p === 4} /></motion.div>
        <motion.div aria-hidden={p !== 5} initial={false} {...capa(p === 5)}><Barras visible={p === 5} /></motion.div>
        <motion.div aria-hidden={p !== 6} initial={false} {...capa(p === 6)}><Cierre visible={p === 6} /></motion.div>
      </div>
    </div>
  );
}
