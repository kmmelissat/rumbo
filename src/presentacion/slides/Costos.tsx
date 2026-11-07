"use client";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { Caveat } from "next/font/google";
import { animate, motion, useReducedMotion } from "motion/react";

/** Cifras editables. Los resultados se calculan abajo, no se escriben a mano. */
const COSTOS_DATOS = {
  titulo: "¿Cuánto cuesta y cuándo se paga solo?",
  subtitulo: "(la cuenta, sin humo)",
  costos: [
    { icono: "empresa", nombre: "Constituir la empresa", cifra: "$1", nota: "Unas 2 horas, como sociedad por acciones simplificada (S.A.S.)." },
    { icono: "codigo", nombre: "Desarrollo", cifra: "$0", nota: "En efectivo, porque lo construye el equipo. El costo real es el tiempo del equipo." },
    { icono: "nube", nombre: "Hosting y base de datos", cifra: "$0 o $25", nota: "Plan gratis, o $25 al mes en Supabase Pro." },
    { icono: "mega", nombre: "Marketing", cifra: "$100 al mes", nota: "Orgánico, con contenido y organizadores aliados; una partida pequeña de promoción en el ejemplo." },
    { icono: "tarjeta", nombre: "Pasarela de pago", cifra: "3.4% a 3.6%", nota: "Por transacción, más 0.1% a 0.2% de Rumbo. Lo paga el asistente, no Rumbo." },
    { icono: "libro", nombre: "Contador", cifra: "Según honorarios", nota: "Incluye resolver el IVA." },
  ],
  entrada: { precio: 12, comision: 0.08, fijo: 0.3 },
  fijos: { hosting: 25, promocion: 100 },
  maxEntradas: 300,
  palancas: [
    { nombre: "Precio promedio de la entrada", texto: "Una entrada más cara deja más por venta y baja el equilibrio." },
    { nombre: "Entradas por evento", texto: "Más entradas en cada evento acercan el equilibrio con los mismos organizadores." },
    { nombre: "Costos fijos del mes", texto: "Menos hosting o promoción, menos entradas necesarias." },
  ],
  cierre: { frase: "Pocas entradas al mes bastan para cubrir la operación", salida: "¿Y qué podría salir mal? Vamos con eso" },
  nota: "Sin contar contador ni sueldos. Ejemplo con supuestos, no una previsión de ventas.",
};

const D = COSTOS_DATOS;
const comisionVar = D.entrada.precio * D.entrada.comision;
const porEntrada = comisionVar + D.entrada.fijo;
const costosFijos = D.fijos.hosting + D.fijos.promocion;
const eqExacto = costosFijos / porEntrada;
const equilibrio = Math.ceil(eqExacto);
const $ = (n: number) => `$${n.toFixed(2)}`;

const caveat = Caveat({ subsets: ["latin"], weight: "600" });
const C = { crema: "#FAF6EF", noche: "#12303A", turquesa: "#0A7C7C", mostaza: "#F5B82E", terracota: "#E2683F" };

const t = { fill: "none", stroke: "currentColor", strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round" } as const;
const ICONOS: Record<string, ReactNode> = {
  empresa: <g {...t}><path d="M8 42V14l14-8v36M22 42h18V22H22" /><path d="M14 20h2M14 28h2M14 36h2M29 29h4M29 36h4" /></g>,
  codigo: <g {...t}><path d="M17 14L7 24l10 10M31 14l10 10-10 10M27 8l-6 32" /></g>,
  nube: <g {...t}><path d="M13 36a8 8 0 0 1-1-16 11 11 0 0 1 21-2 9 9 0 0 1 2 18z" /></g>,
  mega: <g {...t}><path d="M7 20v8h6l14 8V12L13 20z" /><path d="M35 18a8 8 0 0 1 0 12" /></g>,
  tarjeta: <g {...t}><rect x="5" y="11" width="38" height="26" rx="5" /><path d="M5 20h38M12 30h8" /></g>,
  libro: <g {...t}><path d="M9 7h26a4 4 0 0 1 4 4v30H13a4 4 0 0 1-4-4z" /><path d="M16 16h16M16 23h16M16 30h9" /></g>,
};
const Icono = ({ n, size = 44 }: { n: string; size?: number }) => <svg aria-hidden viewBox="0 0 48 48" width={size} height={size}>{ICONOS[n]}</svg>;

function Item({ visible, i = 0, base = 0.2, className, style, children }: { visible: boolean; i?: number; base?: number; className?: string; style?: CSSProperties; children: ReactNode }) {
  const rm = useReducedMotion();
  return (
    <motion.div initial={false} className={className} style={style}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: rm ? 0 : 30 }}
      transition={rm || !visible ? { duration: 0.2 } : { type: "spring", stiffness: 90, damping: 15, delay: base + i * 0.14 }}>{children}</motion.div>
  );
}

/* Gráfica SVG: costos fijos planos e ingresos que suben con las entradas. */
const W = 860, H = 500, ML = 90, MR = 30, MT = 30, MB = 70, YMAX = 400;
const sx = (v: number) => ML + (v / D.maxEntradas) * (W - ML - MR);
const sy = (v: number) => MT + (1 - v / YMAX) * (H - MT - MB);

function Grafica({ visible, n, llegado }: { visible: boolean; n: number; llegado: boolean }) {
  const rm = useReducedMotion();
  const ingresos = n * porEntrada;
  const cubre = ingresos >= costosFijos;
  const dib = (delay: number) => ({
    initial: false as const,
    animate: { pathLength: visible ? 1 : 0, opacity: visible ? 1 : 0 },
    transition: rm ? { duration: 0.2 } : { duration: 1, delay: visible ? delay : 0 },
  });
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`Gráfica: costos fijos de ${$(costosFijos)} e ingresos que los alcanzan en ${equilibrio} entradas al mes`}>
      {[0, 100, 200, 300, 400].map((v) => (
        <g key={v}>
          <line x1={ML} x2={W - MR} y1={sy(v)} y2={sy(v)} stroke={C.noche} strokeOpacity={v === 0 ? 0.6 : 0.12} strokeWidth={v === 0 ? 2 : 1} />
          <text x={ML - 12} y={sy(v) + 7} textAnchor="end" fontSize="20" fill={C.noche}>${v}</text>
        </g>
      ))}
      {[0, 100, 200, 300].map((v) => (
        <text key={v} x={sx(v)} y={H - MB + 30} textAnchor="middle" fontSize="20" fill={C.noche}>{v}</text>
      ))}
      <text x={(ML + W - MR) / 2} y={H - 12} textAnchor="middle" fontSize="21" fontWeight="600" fill={C.noche}>Entradas vendidas al mes</text>
      <line x1={ML} x2={ML} y1={MT} y2={sy(0)} stroke={C.noche} strokeOpacity="0.6" strokeWidth="2" />
      <motion.line x1={sx(0)} y1={sy(costosFijos)} x2={sx(D.maxEntradas)} y2={sy(costosFijos)} stroke={C.noche} strokeWidth="5" strokeLinecap="round" strokeDasharray="1" {...dib(0.2)} />
      <motion.line x1={sx(0)} y1={sy(0)} x2={sx(D.maxEntradas)} y2={sy(D.maxEntradas * porEntrada)} stroke={C.turquesa} strokeWidth="6" strokeLinecap="round" {...dib(0.5)} />
      <text x={W - MR} y={sy(costosFijos) - 14} textAnchor="end" fontSize="21" fontWeight="700" fill={C.noche}>Costos fijos {$(costosFijos)}</text>
      <text x={sx(190)} y={sy(190 * porEntrada) + 38} textAnchor="start" fontSize="21" fontWeight="700" fill={C.turquesa}>Ingresos</text>
      {visible && (
        <g>
          <line x1={sx(n)} x2={sx(n)} y1={sy(ingresos)} y2={sy(0)} stroke={C.mostaza} strokeWidth="3" strokeDasharray="6 6" />
          <circle cx={sx(n)} cy={sy(ingresos)} r={llegado ? 17 : 12} fill={cubre ? C.mostaza : "#fff"} stroke={C.noche} strokeWidth="4" />
          {llegado && (
            <text x={sx(n) + 26} y={sy(ingresos) + 42} fontSize="24" fontWeight="800" fill={C.noche}>equilibrio</text>
          )}
        </g>
      )}
    </svg>
  );
}

/* Paso 1 */
function PasoCostos({ visible }: { visible: boolean }) {
  return (
    <div className="grid grid-cols-3 gap-6">
      {D.costos.map((c, i) => (
        <Item key={c.nombre} visible={visible} i={i * 1.6} className="flex min-h-[300px] flex-col gap-3 rounded-[26px] bg-white px-7 py-6 shadow-xl shadow-black/10">
          <div className="flex items-center gap-4">
            <span className="flex h-[64px] w-[64px] shrink-0 items-center justify-center rounded-2xl" style={{ background: i % 2 ? C.mostaza + "99" : C.turquesa, color: i % 2 ? C.noche : "#fff" }}><Icono n={c.icono} /></span>
            <h3 className="font-display text-[28px] font-bold leading-tight">{c.nombre}</h3>
          </div>
          <p className="font-display text-[46px] font-bold leading-none" style={{ color: C.turquesa }}>{c.cifra}</p>
          <p className="text-[21px] leading-snug">{c.nota}</p>
        </Item>
      ))}
    </div>
  );
}

/* Paso 2 */
function PasoEntrada({ visible }: { visible: boolean }) {
  const filas = [
    { a: `${$(D.entrada.precio)} × ${D.entrada.comision * 100}%`, b: $(comisionVar), nota: "comisión" },
    { a: "+ fijo por entrada", b: $(D.entrada.fijo), nota: "" },
  ];
  return (
    <div className="flex flex-col items-center gap-8">
      <Item visible={visible} className="rounded-full px-10 py-4 font-display text-[40px] font-bold" style={{ background: C.mostaza, color: C.noche }}>
        Una entrada de {$(D.entrada.precio)}
      </Item>
      <div className="flex w-[1000px] flex-col gap-4">
        {filas.map((f, i) => (
          <Item key={f.a} visible={visible} i={i + 2} className="flex items-center justify-between rounded-[24px] bg-white px-10 py-6 shadow-lg shadow-black/10">
            <span className="text-[34px]">{f.a}{f.nota && <span className="opacity-60"> ({f.nota})</span>}</span>
            <span className="font-display text-[48px] font-bold">{f.b}</span>
          </Item>
        ))}
        <Item visible={visible} i={6} className="flex items-center justify-between rounded-[24px] px-10 py-7 shadow-xl shadow-black/10" style={{ background: C.turquesa, color: "#fff" }}>
          <span className="text-[36px] font-semibold">Para Rumbo</span>
          <span className="font-display text-[72px] font-bold leading-none">{$(porEntrada)}</span>
        </Item>
      </div>
      <Item visible={visible} i={8}><p className="text-[24px] opacity-70">El procesamiento de pago va aparte: lo paga el asistente.</p></Item>
    </div>
  );
}

/* Paso 3 */
function PasoEquilibrio({ visible }: { visible: boolean }) {
  const rm = useReducedMotion();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!visible) { setN(0); return; }
    if (rm) { setN(eqExacto); return; }
    const c = animate(0, eqExacto, { duration: 3, delay: 1.2, ease: "easeInOut", onUpdate: setN });
    return () => c.stop();
  }, [visible, rm]);
  const llegado = n >= eqExacto - 0.01;
  return (
    <div className="grid grid-cols-[860px_1fr] items-center gap-12">
      <Grafica visible={visible} n={n} llegado={llegado} />
      <div className="flex flex-col gap-5">
        <Item visible={visible} className="rounded-[24px] bg-white px-7 py-5 shadow-lg shadow-black/10">
          <p className="text-[24px] leading-snug">Costos fijos: {$(D.fijos.hosting)} de hosting + {$(D.fijos.promocion)} de promoción = <b>{$(costosFijos)} al mes</b></p>
          <p className="mt-2 text-[24px] leading-snug">{$(costosFijos)} ÷ {$(porEntrada)} por entrada</p>
        </Item>
        <Item visible={visible} i={2} className="rounded-[28px] px-8 py-6 text-center shadow-xl shadow-black/10" style={{ background: C.turquesa, color: "#fff" }}>
          <p className="font-display text-[110px] font-bold leading-none tabular-nums">{llegado ? equilibrio : Math.round(n)}</p>
          <p className="mt-1 text-[28px] font-semibold">entradas al mes</p>
        </Item>
        <Item visible={visible} i={3}><p className="text-[19px] leading-snug opacity-70">{D.nota}</p></Item>
      </div>
    </div>
  );
}

/* Paso 4 */
function PasoPalancas({ visible }: { visible: boolean }) {
  const [n, setN] = useState(equilibrio);
  const ingresos = n * porEntrada;
  const cubre = ingresos >= costosFijos;
  return (
    <div className="grid grid-cols-[860px_1fr] items-start gap-12">
      <div className="flex flex-col gap-2">
        <Grafica visible={visible} n={n} llegado={n === equilibrio} />
        <label className="flex items-center gap-5 px-4">
          <span className="shrink-0 text-[22px] font-semibold">Entradas por mes</span>
          <input type="range" min={0} max={D.maxEntradas} step={1} value={n} onChange={(e) => setN(Number(e.target.value))}
            aria-label="Entradas por mes" className="h-11 w-full cursor-pointer" style={{ accentColor: C.turquesa }} />
          <span className="w-[70px] shrink-0 text-right font-display text-[34px] font-bold tabular-nums">{n}</span>
        </label>
      </div>
      <div className="flex flex-col gap-4">
        {D.palancas.map((p, i) => (
          <Item key={p.nombre} visible={visible} i={i} className="rounded-[22px] bg-white px-6 py-4 shadow-lg shadow-black/10">
            <h3 className="font-display text-[26px] font-bold leading-tight" style={{ color: C.turquesa }}>{p.nombre}</h3>
            <p className="text-[20px] leading-snug">{p.texto}</p>
          </Item>
        ))}
        <Item visible={visible} i={4} className="rounded-[22px] px-6 py-4" style={{ background: cubre ? C.mostaza : C.noche, color: cubre ? C.noche : "#fff" }}>
          <p className="text-[22px] leading-snug tabular-nums">Ingresos {$(ingresos)} · Costos {$(costosFijos)}</p>
          <p className="font-display text-[30px] font-bold leading-tight">{cubre ? "Cubre los costos fijos" : `Faltan ${$(costosFijos - ingresos)}`}</p>
        </Item>
      </div>
    </div>
  );
}

/* Paso 5 */
function PasoCierre({ visible }: { visible: boolean }) {
  return (
    <div className="flex flex-col items-center gap-12 pt-16 text-center">
      <Item visible={visible} i={1}><h2 className="max-w-[1200px] font-display text-[78px] font-bold leading-[1.05]">{D.cierre.frase}</h2></Item>
      <Item visible={visible} i={4}><p className={`${caveat.className} text-[52px] leading-none`} style={{ color: C.terracota }}>{D.cierre.salida}</p></Item>
    </div>
  );
}

export function Costos({ activa, paso }: { activa: boolean; paso: number }) {
  const rm = useReducedMotion();
  const p = activa ? paso : -1;
  const titulo = p === 0 ? { opacity: 1, x: 0, y: 330, scale: 1 } : p > 0 ? { opacity: 1, x: 0, y: 36, scale: 0.55 } : { opacity: 0, x: 0, y: 340, scale: 0.5 };
  const capa = (on: boolean) => ({ animate: { opacity: on ? 1 : 0 }, transition: { duration: rm ? 0.15 : 0.35, delay: on ? 0.15 : 0 }, style: { gridArea: "1 / 1", pointerEvents: on ? "auto" as const : "none" as const } });
  const pasos = [PasoCostos, PasoEntrada, PasoEquilibrio, PasoPalancas, PasoCierre];
  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: C.crema, color: C.noche }}>
      <div aria-hidden className="absolute -right-40 -top-48 h-[560px] w-[560px] rounded-full blur-3xl" style={{ background: C.turquesa + "1f" }} />
      <motion.div initial={false} animate={titulo} transition={rm ? { duration: 0.2 } : { type: "spring", stiffness: 70, damping: 16 }}
        className="absolute left-[100px] top-0 w-[1400px] origin-top text-center" style={{ zIndex: 20 }}>
        <h1 className="font-display text-[80px] font-bold leading-[1.02]">{D.titulo}</h1>
        <p className={`${caveat.className} mt-4 text-[44px]`} style={{ color: C.terracota }}>{D.subtitulo}</p>
      </motion.div>
      {/* Escenario: capas en una sola celda; debe terminar antes de y = 852 */}
      <div className="absolute left-[80px] top-[150px] grid w-[1440px]">
        {pasos.map((Paso, i) => (
          <motion.div key={i} aria-hidden={p !== i + 1} initial={false} {...capa(p === i + 1)}><Paso visible={p === i + 1} /></motion.div>
        ))}
      </div>
    </div>
  );
}
