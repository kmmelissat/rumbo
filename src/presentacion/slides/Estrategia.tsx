"use client";
import { type CSSProperties, type ReactNode } from "react";
import { Caveat } from "next/font/google";
import { motion, useReducedMotion } from "motion/react";
import { Entra } from "../componentes/Entra";
import { Brujula } from "../componentes/Brujula";

/** Textos y cifras editables.  */
const ESTRATEGIA_DATOS = {
  titulo: "Cómo llega Rumbo a la gente",
  subtitulo: "(orgánico primero, con un impulso pequeño)",
  porQue: {
    a: { cifra: "Contenido", texto: "Los planes de la semana, donde el público ya está" },
    b: { cifra: "Organizadores", texto: "Comparten su evento con su propia audiencia" },
    mensaje: "El crecimiento es orgánico: los usuarios llegan por contenido, por organizadores que comparten su evento y por alianzas.",
  },
  embudo: [
    { etapa: "Descubre", icono: "lupa", texto: "Instagram y TikTok con los planes de la semana, y la guía semanal de planes." },
    { etapa: "Guarda", icono: "marca", texto: "La web móvil, sin descargar nada, con eventos guardados." },
    { etapa: "Comparte", icono: "enviar", texto: "Enlace por WhatsApp a amigos." },
    { etapa: "Compra", icono: "boleto", texto: "Un solo enlace y un solo QR." },
    { etapa: "Vuelve", icono: "vuelta", texto: "Guía semanal y eventos que se actualizan." },
  ],
  canales: [
    { icono: "movil", nombre: "Web móvil y QR en mercaditos", texto: "Canal principal para descubrir, guardar y comprar, sin descargar nada." },
    { icono: "video", nombre: "Instagram y TikTok", texto: "Contenido de los planes de la semana, donde el público ya está." },
    { icono: "chat", nombre: "WhatsApp", texto: "Contacto directo con organizadores para publicar y con usuarios para compartir eventos." },
    { icono: "guia", nombre: "Guía semanal de planes", texto: "Los planes de la semana, reunidos en un solo lugar." },
    { icono: "mega", nombre: "Los propios organizadores", texto: "Comparten su evento en Rumbo con su audiencia." },
  ],
  relaciones: [
    { quien: "Asistentes", texto: "Autoservicio en la web, con eventos guardados." },
    { quien: "Organizadores", texto: "Atención personal por WhatsApp al inicio y panel de autoservicio después." },
    { quien: "Marcas y lugares", texto: "Trato directo y acuerdos por campaña." },
  ],
  arranque: {
    frase: "Un tipo de evento, una zona, y organizadores aliados antes de abrir al público.",
    zonas: ["San Salvador", "La Libertad"],
    alianzas: ["Farmer's Market", "Sivar Emprende", "Lugares", "Marcas"],
  },
  metricas: [
    { nombre: "Organizadores activos", mide: "Si hay oferta suficiente" },
    { nombre: "Eventos confirmados por semana", mide: "Si el calendario es útil" },
    { nombre: "Usuarios activos semanales", mide: "Si vuelven" },
    { nombre: "Eventos guardados y compartidos", mide: "Si hay interés" },
    { nombre: "Reservas o entradas vendidas", mide: "Si hay intención de compra" },
    { nombre: "Ingresos por organizador", mide: "Si se puede monetizar" },
  ],
  cierre: "¿Cómo se ve eso en redes? Mira",
};

const caveat = Caveat({ subsets: ["latin"], weight: "600" });
const C = { crema: "#FAF6EF", noche: "#12303A", turquesa: "#0A7C7C", mostaza: "#F5B82E", terracota: "#E2683F" };

const t = { fill: "none", stroke: "currentColor", strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round" } as const;
const ICONOS: Record<string, ReactNode> = {
  lupa: <g {...t}><circle cx="21" cy="21" r="13" /><path d="M31 31l11 11" /></g>,
  marca: <g {...t}><path d="M12 6h24v36L24 33 12 42z" /></g>,
  enviar: <g {...t}><path d="M42 6L21 27M42 6l-12 36-9-15-15-9z" /></g>,
  boleto: <g {...t}><path d="M6 15h36v7a4 4 0 0 0 0 8v7H6v-7a4 4 0 0 0 0-8z" /><path d="M31 15v22" strokeDasharray="2 4" /></g>,
  vuelta: <g {...t}><path d="M40 24a16 16 0 1 1-5-11.500M40 6v8h-8" /></g>,
  movil: <g {...t}><rect x="13" y="5" width="22" height="38" rx="5" /><path d="M21 37h6" /></g>,
  video: <g {...t}><rect x="6" y="10" width="36" height="28" rx="6" /><path d="M20 18l10 6-10 6z" /></g>,
  chat: <g {...t}><path d="M8 10h32v22H22l-9 8v-8H8z" /><path d="M16 19h16M16 25h10" /></g>,
  guia: <g {...t}><rect x="9" y="6" width="30" height="36" rx="4" /><path d="M16 16h16M16 24h16M16 32h9" /></g>,
  mega: <g {...t}><path d="M7 20v8h6l14 8V12L13 20z" /><path d="M35 18a8 8 0 0 1 0 12" /></g>,
};
const Icono = ({ n, size = 40 }: { n: string; size?: number }) => <svg aria-hidden viewBox="0 0 48 48" width={size} height={size}>{ICONOS[n]}</svg>;

function Item({ visible, i = 0, base = 0.2, className, style, children }: { visible: boolean; i?: number; base?: number; className?: string; style?: CSSProperties; children: ReactNode }) {
  const rm = useReducedMotion();
  return (
    <motion.div initial={false} className={className} style={style}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: rm ? 0 : 30 }}
      transition={rm || !visible ? { duration: 0.2 } : { type: "spring", stiffness: 90, damping: 15, delay: base + i * 0.14 }}>{children}</motion.div>
  );
}

/* Paso 1 */
function PasoPorQue({ visible }: { visible: boolean }) {
  const rm = useReducedMotion();
  const d = ESTRATEGIA_DATOS.porQue;
  const choque = (desde: number) => ({
    initial: false as const,
    animate: visible ? { opacity: 1, x: 0 } : { opacity: 0, x: rm ? 0 : desde },
    transition: rm || !visible ? { duration: 0.2 } : { type: "spring" as const, stiffness: 110, damping: 11, delay: 0.25 },
  });
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex items-center gap-8">
        <motion.div {...choque(-240)} className="w-[560px] rounded-[30px] px-10 py-9 text-center shadow-xl shadow-black/10" style={{ background: C.turquesa, color: "#fff" }}>
          <p className="font-display text-[64px] font-bold leading-none">{d.a.cifra}</p>
          <p className="mt-3 text-[30px] font-semibold leading-snug">{d.a.texto}</p>
        </motion.div>
        <span className="font-display text-[40px] font-bold" style={{ color: C.terracota }}>+</span>
        <motion.div {...choque(240)} className="w-[560px] rounded-[30px] px-10 py-9 text-center shadow-xl shadow-black/10" style={{ background: C.mostaza, color: C.noche }}>
          <p className="font-display text-[64px] font-bold leading-none">{d.b.cifra}</p>
          <p className="mt-3 text-[30px] font-semibold leading-snug">{d.b.texto}</p>
        </motion.div>
      </div>
      <Item visible={visible} base={0.9} className="flex max-w-[1100px] flex-col items-center gap-3 text-center">
        <p className="font-display text-[38px] font-semibold leading-snug">{d.mensaje}</p>
      </Item>
    </div>
  );
}

/* Paso 2 */
function PasoEmbudo({ visible }: { visible: boolean }) {
  const n = ESTRATEGIA_DATOS.embudo.length;
  return (
    <div className="flex flex-col items-center gap-4">
      {ESTRATEGIA_DATOS.embudo.map((e, i) => (
        <Item key={e.etapa} visible={visible} i={i} className="flex items-center gap-5 rounded-[24px] px-7 py-4 shadow-lg shadow-black/10"
          style={{ width: `${100 - i * (44 / (n - 1))}%`, background: i % 2 ? C.mostaza : C.turquesa, color: i % 2 ? C.noche : "#fff" }}>
          <span className="shrink-0"><Icono n={e.icono} size={48} /></span>
          <h3 className="w-[170px] shrink-0 font-display text-[36px] font-bold leading-none">{e.etapa}</h3>
          <p className="text-[24px] leading-snug">{e.texto}</p>
        </Item>
      ))}
    </div>
  );
}

/* Paso 3 */
function PasoCanales({ visible }: { visible: boolean }) {
  return (
    <div className="grid grid-cols-5 gap-5">
      {ESTRATEGIA_DATOS.canales.map((c, i) => (
        <Item key={c.nombre} visible={visible} i={i} className="flex min-h-[400px] flex-col gap-4 rounded-[26px] bg-white px-6 py-7 shadow-xl shadow-black/10">
          <span className="flex h-[72px] w-[72px] items-center justify-center rounded-2xl" style={{ background: i === 0 ? C.turquesa : C.mostaza + "88", color: i === 0 ? "#fff" : C.noche }}><Icono n={c.icono} size={44} /></span>
          <h3 className="font-display text-[29px] font-bold leading-tight">{c.nombre}</h3>
          <p className="text-[21px] leading-snug">{c.texto}</p>
        </Item>
      ))}
    </div>
  );
}

/* Paso 4 */
function PasoRelaciones({ visible }: { visible: boolean }) {
  return (
    <div className="flex flex-col gap-6">
      {ESTRATEGIA_DATOS.relaciones.map((r, i) => (
        <Item key={r.quien} visible={visible} i={i * 1.5} className="flex items-center gap-8 rounded-full px-10 py-7 shadow-lg shadow-black/10"
          style={{ background: [C.turquesa, C.mostaza, C.noche][i], color: i === 1 ? C.noche : "#fff" }}>
          <h3 className="w-[360px] shrink-0 font-display text-[44px] font-bold leading-none">{r.quien}</h3>
          <p className="text-[30px] leading-snug">{r.texto}</p>
        </Item>
      ))}
    </div>
  );
}

/* Paso 5 */
function PasoArranque({ visible }: { visible: boolean }) {
  const rm = useReducedMotion();
  const a = ESTRATEGIA_DATOS.arranque;
  return (
    <div className="grid grid-cols-[360px_1fr] items-center gap-16">
      <motion.svg aria-hidden viewBox="0 0 200 200" className="w-[360px]" initial={false}
        animate={visible ? { opacity: 1, rotate: 0 } : { opacity: 0, rotate: rm ? 0 : -140 }}
        transition={rm || !visible ? { duration: 0.2 } : { type: "spring", stiffness: 40, damping: 9, delay: 0.2 }}>
        <circle cx="100" cy="100" r="92" fill="#fff" stroke={C.noche} strokeWidth="6" />
        <circle cx="100" cy="100" r="60" fill="none" stroke={C.turquesa} strokeWidth="3" strokeDasharray="4 8" />
        <polygon points="100,28 114,100 86,100" fill={C.terracota} /><polygon points="100,172 114,100 86,100" fill={C.noche} />
        <circle cx="100" cy="100" r="9" fill={C.mostaza} />
      </motion.svg>
      <div className="flex flex-col gap-8">
        <Item visible={visible} i={1}><p className="font-display text-[46px] font-bold leading-tight">{a.frase}</p></Item>
        <Item visible={visible} i={2} className="flex flex-wrap gap-3">
          {a.zonas.map((z) => <span key={z} className="rounded-full px-6 py-2 font-display text-[30px] font-bold" style={{ background: C.turquesa, color: "#fff" }}>{z}</span>)}
        </Item>
        <Item visible={visible} i={3} className="flex flex-col gap-3">
          <p className="text-[18px] font-bold uppercase tracking-[0.14em]" style={{ color: C.turquesa }}>Alianzas</p>
          <div className="flex flex-wrap gap-3">
            {a.alianzas.map((x) => <span key={x} className="rounded-full px-5 py-2 text-[26px] font-bold" style={{ background: C.mostaza, color: C.noche }}>{x}</span>)}
          </div>
        </Item>
      </div>
    </div>
  );
}

/* Paso 6 */
function PasoMetricas({ visible }: { visible: boolean }) {
  const rm = useReducedMotion();
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
        {ESTRATEGIA_DATOS.metricas.map((m, i) => (
          <motion.div key={m.nombre} initial={false} className="flex items-center gap-5 rounded-[22px] border-2 bg-white px-6 py-4"
            animate={visible ? { opacity: 1, borderColor: C.turquesa } : { opacity: 0.35, borderColor: C.noche + "22" }}
            transition={{ duration: rm ? 0.2 : 0.4, delay: visible ? 0.3 + i * 0.35 : 0 }}>
            <motion.span initial={false} className="h-6 w-6 shrink-0 rounded-full"
              animate={visible ? { background: C.mostaza, boxShadow: `0 0 0 8px ${C.mostaza}55` } : { background: C.noche + "22", boxShadow: "0 0 0 0px #0000" }}
              transition={{ duration: rm ? 0.2 : 0.4, delay: visible ? 0.3 + i * 0.35 : 0 }} />
            <div>
              <h3 className="font-display text-[27px] font-bold leading-tight">{m.nombre}</h3>
              <p className="text-[21px] leading-snug opacity-80">{m.mide}</p>
            </div>
          </motion.div>
        ))}
      </div>
      <Item visible={visible} base={0.3 + ESTRATEGIA_DATOS.metricas.length * 0.35}>
        <p className={`${caveat.className} text-[44px] leading-none`} style={{ color: C.terracota }}>{ESTRATEGIA_DATOS.cierre}</p>
      </Item>
    </div>
  );
}

/* ───────────── Rediseño (V2): estrategia + crecimiento en 3 pasos ───────────── */

/** Textos editables. Hipótesis, guardrails y demás van en las notas del presentador. */
const ESTRATEGIA_V2 = {
  titulo: "Cómo llega y cómo crece Rumbo",
  subtitulo: "(orgánico primero, con un impulso pequeño)",
  etapas: [
    { letra: "A", etapa: "Adquisición", icono: "video", canal: "Instagram y TikTok", experimento: "Guía semanal \"3 rumbos para este finde\"", metrica: "Visitas a la web desde redes por semana" },
    { letra: "A", etapa: "Activación", icono: "movil", canal: "Web móvil y QR en mercaditos", experimento: "Guardar sin crear cuenta", metrica: "% que guarda un plan en su primera visita" },
    { letra: "R", etapa: "Retención", icono: "chat", canal: "WhatsApp y guía semanal", experimento: "Recordatorio del plan guardado", metrica: "Usuarios que regresan la semana siguiente" },
    { letra: "R", etapa: "Ingresos", icono: "boleto", canal: "Los organizadores", experimento: "Cobrar a mano un evento destacado de $30", metrica: "Organizadores que pagan" },
    { letra: "R", etapa: "Referidos", icono: "enviar", canal: "WhatsApp (botón compartir)", experimento: "Ficha clara del evento al compartir", metrica: "Eventos compartidos y visitas desde esos enlaces" },
  ],
  arranque: "Un tipo de evento, en San Salvador y La Libertad, con organizadores aliados antes de abrir al público",
  frase: "Una hipótesis a la vez, y los números deciden",
};

function NotaCaveat({ className = "", style, children }: { className?: string; style?: CSSProperties; children: ReactNode }) {
  return <p className={`${caveat.className} ${className}`} style={style}>{children}</p>;
}

const FICHA_V2 = 268, PASO_V2 = FICHA_V2 + 25, BR_V2 = 64;
const posV2 = (i: number) => i * PASO_V2 + (FICHA_V2 - BR_V2) / 2;

function EmbudoV2({ visible }: { visible: boolean }) {
  const rm = useReducedMotion();
  const et = ESTRATEGIA_V2.etapas;
  const N = et.length;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-[25px]">
        {et.map((e, i) => (
          <motion.div key={e.etapa} initial={false} className="flex h-[150px] flex-col justify-center gap-3 rounded-[24px] border-2 px-6 shadow-lg shadow-black/10"
            style={{ width: FICHA_V2, borderColor: C.turquesa, background: "#fff" }}
            animate={{ opacity: visible ? 1 : 0.35 }}
            transition={{ duration: rm ? 0.2 : 0.4, delay: visible && !rm ? 0.6 + i * 0.6 : 0 }}>
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-display text-[28px] font-bold" style={{ background: C.mostaza, color: C.noche }}>{e.letra}</span>
              <span style={{ color: C.turquesa }}><Icono n={e.icono} size={40} /></span>
            </div>
            <h3 className="font-display text-[34px] font-bold leading-none">{e.etapa}</h3>
          </motion.div>
        ))}
      </div>
      {/* Ruta punteada con la brújula recorriendo las cinco etapas */}
      <div className="relative h-[72px]" style={{ width: 1440 }}>
        <div aria-hidden className="absolute top-1/2 -translate-y-1/2 border-t-[5px] border-dotted" style={{ left: FICHA_V2 / 2, right: FICHA_V2 / 2, borderColor: C.turquesa }} />
        <div className="relative flex h-full gap-[25px]">
          {et.map((e) => <span key={e.etapa} className="flex items-center justify-center" style={{ width: FICHA_V2 }}><span className="block h-6 w-6 rounded-full border-[5px]" style={{ borderColor: C.turquesa, background: C.crema }} /></span>)}
        </div>
        <motion.div aria-hidden initial={false} className="absolute left-0 top-1" style={{ width: BR_V2 }}
          animate={visible ? { opacity: 1, x: rm ? posV2(N - 1) : et.map((_, i) => posV2(i)) } : { opacity: 0, x: posV2(0) }}
          transition={rm ? { duration: 0.2 } : visible ? { x: { duration: 0.6 * (N - 1), delay: 0.6, ease: "easeInOut" }, opacity: { duration: 0.3 } } : { duration: 0.2 }}>
          <Brujula size={BR_V2} activa={visible} grados={90} />
        </motion.div>
      </div>
    </div>
  );
}

function TarjetasV2({ visible }: { visible: boolean }) {
  const et = ESTRATEGIA_V2.etapas;
  const campo = "text-[15px] font-bold uppercase tracking-[0.12em]";
  return (
    <ul className="flex h-full min-h-0 flex-col gap-[10px]">
      {et.map((e, i) => (
        <li key={e.etapa} className="flex min-h-0 flex-1">
          <Entra activa={visible} retraso={i * 0.12} className="flex w-full">
            <div className="grid w-full grid-cols-[250px_1fr_1.2fr_1.15fr] items-center gap-8 rounded-[22px] border-2 bg-white px-6 py-2" style={{ borderColor: C.noche + "14" }}>
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-display text-[26px] font-bold" style={{ background: C.mostaza, color: C.noche }}>{e.letra}</span>
                <h3 className="font-display text-[30px] font-bold leading-none">{e.etapa}</h3>
              </div>
              <div><p className={campo} style={{ color: C.turquesa }}>Canal</p><p className="text-[22px] font-semibold leading-tight">{e.canal}</p></div>
              <div><p className={campo} style={{ color: C.turquesa }}>Experimento</p><p className="text-[22px] font-semibold leading-tight">{e.experimento}</p></div>
              <div><p className={campo} style={{ color: C.turquesa }}>Métrica</p><p className="text-[22px] font-semibold leading-tight">{e.metrica}</p></div>
            </div>
          </Entra>
        </li>
      ))}
    </ul>
  );
}

function ArranqueV2({ visible }: { visible: boolean }) {
  return (
    <div className="grid grid-cols-[260px_1fr] items-center gap-14">
      <Entra activa={visible} desde="escala"><Brujula size={260} activa={visible} grados={90} /></Entra>
      <div className="flex flex-col gap-10">
        <Entra activa={visible} retraso={0.2}><p className="font-display text-[52px] font-bold leading-[1.12]">{ESTRATEGIA_V2.arranque}</p></Entra>
        <Entra activa={visible} retraso={0.8}>
          <p className="font-display text-[40px] font-bold leading-tight" style={{ color: C.turquesa }}>
            <span className="rounded px-3" style={{ background: C.mostaza + "55" }}>{ESTRATEGIA_V2.frase}</span>
          </p>
        </Entra>
      </div>
    </div>
  );
}

export function Estrategia({ activa, paso }: { activa: boolean; paso: number }) {
  const rm = useReducedMotion();
  const p = activa ? paso : -1;
  const capa = (on: boolean) => ({ animate: { opacity: on ? 1 : 0 }, transition: { duration: rm ? 0.15 : 0.35, delay: on ? 0.15 : 0 }, style: { gridArea: "1 / 1", pointerEvents: on ? ("auto" as const) : ("none" as const) } });
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden px-[80px] pb-[48px] pt-[72px]" style={{ background: C.crema, color: C.noche }}>
      <div aria-hidden className="absolute -right-40 -top-48 h-[560px] w-[560px] rounded-full blur-3xl" style={{ background: C.turquesa + "1f" }} />
      <Entra activa={p >= 0} desde="arriba" className="relative flex flex-col items-center">
        <h1 className="font-display text-[68px] font-bold leading-[1.02]">{ESTRATEGIA_V2.titulo}</h1>
        <NotaCaveat className="mt-2 text-[42px] leading-none" style={{ color: C.terracota }}>{ESTRATEGIA_V2.subtitulo}</NotaCaveat>
      </Entra>
      <div className="relative mt-6 grid min-h-0 flex-1 items-center">
        <motion.div aria-hidden={p !== 0} initial={false} {...capa(p === 0)}><EmbudoV2 visible={p === 0} /></motion.div>
        <motion.div aria-hidden={p !== 1} initial={false} className="h-full" {...capa(p === 1)}><TarjetasV2 visible={p === 1} /></motion.div>
        <motion.div aria-hidden={p !== 2} initial={false} {...capa(p === 2)}><ArranqueV2 visible={p === 2} /></motion.div>
      </div>
    </div>
  );
}

/* Versión anterior (6 pasos). Se conserva sin renderizar. */
export function EstrategiaAnterior({ activa, paso }: { activa: boolean; paso: number }) {
  const rm = useReducedMotion();
  const p = activa ? paso : -1;
  const titulo = p === 0 ? { opacity: 1, x: 0, y: 330, scale: 1 } : p > 0 ? { opacity: 1, x: 0, y: 40, scale: 0.55 } : { opacity: 0, x: 0, y: 340, scale: 0.5 };
  const capa = (on: boolean) => ({ animate: { opacity: on ? 1 : 0 }, transition: { duration: rm ? 0.15 : 0.35, delay: on ? 0.15 : 0 }, style: { gridArea: "1 / 1", pointerEvents: on ? "auto" as const : "none" as const } });
  const pasos = [PasoPorQue, PasoEmbudo, PasoCanales, PasoRelaciones, PasoArranque, PasoMetricas];

  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: C.crema, color: C.noche }}>
      <div aria-hidden className="absolute -right-40 -top-48 h-[560px] w-[560px] rounded-full blur-3xl" style={{ background: C.turquesa + "1f" }} />
      <motion.div initial={false} animate={titulo} transition={rm ? { duration: 0.2 } : { type: "spring", stiffness: 70, damping: 16 }}
        className="absolute left-[100px] top-0 w-[1400px] origin-top text-center" style={{ zIndex: 20 }}>
        <h1 className="font-display text-[80px] font-bold leading-[1.02]">{ESTRATEGIA_DATOS.titulo}</h1>
        <p className={`${caveat.className} mt-4 text-[44px]`} style={{ color: C.terracota }}>{ESTRATEGIA_DATOS.subtitulo}</p>
      </motion.div>
      {/* Escenario: capas en una sola celda; termina antes de y = 850 */}
      <div className="absolute left-[80px] top-[190px] grid w-[1440px]">
        {pasos.map((Paso, i) => (
          <motion.div key={i} aria-hidden={p !== i + 1} initial={false} {...capa(p === i + 1)}><Paso visible={p === i + 1} /></motion.div>
        ))}
      </div>
    </div>
  );
}
