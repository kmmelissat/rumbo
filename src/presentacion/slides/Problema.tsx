"use client";
import type { ComponentType, ReactNode } from "react";
import { Caveat } from "next/font/google";
import { motion, useReducedMotion } from "motion/react";

/**
 * Datos opcionales para respaldar el problema. NO hay cifras inventadas:
 * si un campo queda vacío, esa parte no se muestra.
 */
const PROBLEMA_DATOS: {
  /** % de personas que se enteran de los eventos por redes sociales. */
  porcentajeRedes?: number;
  /** % de personas que se enteran cuando el evento ya pasó o se agotó. */
  porcentajeLlegaTarde?: number;
  /** Fuente de los datos (encuesta propia, estudio, etc.). */
  fuente?: string;
} = {};

const caveat = Caveat({ subsets: ["latin"], weight: "600" });

const C = { crema: "#FAF6EF", noche: "#12303A", turquesa: "#0A7C7C", mostaza: "#F5B82E", terracota: "#C8553D" };

/* ───────────── Tarjetas del caos ───────────── */

type Tipo = "story" | "grupo" | "flyer" | "amiga";
interface CartaCaos { tipo: Tipo; v: 0 | 1; caos: { x: number; y: number; r: number }; pila: { x: number; y: number; r: number } }

const CARTAS: CartaCaos[] = [
  { tipo: "story", v: 0, caos: { x: 80, y: 210, r: -7 }, pila: { x: 300, y: 300, r: -4 } },
  { tipo: "grupo", v: 0, caos: { x: 410, y: 340, r: 5 }, pila: { x: 310, y: 296, r: 3 } },
  { tipo: "flyer", v: 0, caos: { x: 750, y: 200, r: -4 }, pila: { x: 306, y: 292, r: -2 } },
  { tipo: "amiga", v: 0, caos: { x: 1090, y: 300, r: 8 }, pila: { x: 312, y: 288, r: 4 } },
  { tipo: "story", v: 1, caos: { x: 1290, y: 580, r: -6 }, pila: { x: 304, y: 284, r: -3 } },
  { tipo: "grupo", v: 1, caos: { x: 190, y: 560, r: 6 }, pila: { x: 310, y: 280, r: 2 } },
  { tipo: "flyer", v: 1, caos: { x: 720, y: 570, r: -9 }, pila: { x: 308, y: 276, r: 0 } },
];

function CartaStory({ v }: { v: number }) {
  const textos = [["Mercadito este sábado", "escríbenos al DM"], ["Música en vivo", "últimos cupos, pregunta por aquí"]][v];
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[22px] p-4 text-white" style={{ background: `linear-gradient(160deg, ${C.turquesa}, ${C.noche})` }}>
      <div className="flex gap-1">{[0, 1, 2].map((i) => <span key={i} className="h-1 flex-1 rounded-full bg-white/70" style={{ opacity: i === 0 ? 1 : 0.4 }} />)}</div>
      <div className="mt-3 flex items-center gap-2">
        <span className="h-8 w-8 rounded-full border-2 border-white/80" style={{ background: C.mostaza }} />
        <span className="text-[15px] font-bold">@lugar.local</span>
      </div>
      <p className="mt-12 font-display text-[28px] font-bold leading-tight">{textos[0]}</p>
      <p className="mt-2 text-[17px] text-white/85">{textos[1]}</p>
      <p className="absolute inset-x-0 bottom-4 text-center text-[13px] text-white/70">desliza hacia arriba</p>
    </div>
  );
}

function CartaGrupo({ v }: { v: number }) {
  const msgs = [["¿Alguien sabe a qué hora es?", "Creo que el sábado…", "Pásame la ubicación porfa"], ["¿Ya no hay boletos?", "Pregunta por privado", "Yo me enteré hoy"]][v];
  return (
    <div className="h-full w-full overflow-hidden rounded-[22px] bg-white">
      <div className="px-4 py-3 text-[15px] font-bold text-white" style={{ background: C.turquesa }}>Grupo · Los de siempre</div>
      <div className="space-y-2.5 p-3" style={{ background: "#EEF3EE", height: "calc(100% - 44px)" }}>
        {msgs.map((m, i) => (
          <p key={m} className={`w-fit max-w-[88%] rounded-2xl px-3 py-2 text-[15px] leading-snug text-[#12303A] ${i === 1 ? "ml-auto bg-[#D6EBDD]" : "bg-white"}`}>{m}</p>
        ))}
        <span className="inline-block rounded-full px-3 py-1 text-[12px] font-bold text-[#12303A]" style={{ background: C.mostaza }}>23 mensajes sin leer</span>
      </div>
    </div>
  );
}

function CartaFlyer({ v }: { v: number }) {
  const t = [["CONCIERTO", "EN VIVO", "SÁB · 8 PM"], ["FERIA", "DE SABORES", "DOM · 10 AM"]][v];
  return (
    <div className="h-full w-full overflow-hidden rounded-[22px] p-4 text-center" style={{ background: "#F3E7CE", filter: "blur(2.4px) contrast(.95)" }}>
      <div className="h-full rounded-xl border-4 border-dashed p-3" style={{ borderColor: C.noche + "99" }}>
        <p className="font-display text-[34px] font-black leading-none text-[#12303A]">{t[0]}</p>
        <p className="mt-1 font-display text-[26px] font-black leading-none" style={{ color: C.turquesa }}>{t[1]}</p>
        <div className="mx-auto mt-5 h-16 w-16 rounded-full" style={{ background: C.mostaza }} />
        <p className="mt-4 text-[20px] font-bold text-[#12303A]">{t[2]}</p>
        <div className="mx-auto mt-3 h-2 w-3/4 rounded bg-[#12303A]/40" />
        <div className="mx-auto mt-2 h-2 w-1/2 rounded bg-[#12303A]/30" />
      </div>
    </div>
  );
}

function CartaAmiga() {
  return (
    <div className="relative h-full w-full rounded-[10px] p-5 pt-8" style={{ background: "#FFF1C7", boxShadow: "inset 0 -30px 40px -30px rgba(200,85,61,.18)" }}>
      <span className="absolute -top-2 left-1/2 h-6 w-20 -translate-x-1/2 rotate-[-4deg] rounded-sm" style={{ background: "rgba(10,124,124,.35)" }} />
      <p className={`${caveat.className} text-[32px] leading-[1.05] text-[#12303A]`}>Me contó una amiga que hay algo el sábado, creo que por Santa Tecla…</p>
    </div>
  );
}

function Carta({ c, i, paso }: { c: CartaCaos; i: number; paso: number }) {
  const rm = useReducedMotion();
  const pila = paso === 6;
  const base = pila ? c.pila : c.caos;
  const estado =
    paso < 1 ? { opacity: 0, scale: 0.6, x: c.caos.x, y: c.caos.y + 70, rotate: c.caos.r }
    : paso === 1 ? { opacity: 1, scale: 1, x: c.caos.x, y: c.caos.y, rotate: c.caos.r }
    : pila ? { opacity: 1, scale: 0.96, x: base.x, y: base.y, rotate: base.r }
    : { opacity: 0.12, scale: 0.92, x: c.caos.x, y: c.caos.y, rotate: c.caos.r };
  const retraso = paso === 1 ? 0.2 + i * 0.13 : pila ? 0.08 * i : 0;
  return (
    <motion.div aria-hidden initial={false} animate={estado} className="absolute left-0 top-0 h-[300px] w-[250px] shadow-xl shadow-black/15"
      style={{ borderRadius: 22, zIndex: pila ? i : 0 }}
      transition={rm ? { duration: 0.25 } : { type: "spring", stiffness: 70, damping: 13, delay: retraso }}>
      <motion.div className="h-full w-full" animate={paso === 1 && !rm ? { y: [0, -9, 0], rotate: [0, 1.4, 0] } : { y: 0, rotate: 0 }}
        transition={paso === 1 && !rm ? { duration: 4 + (i % 3) * 0.7, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 } : { duration: 0.4 }}>
        {c.tipo === "story" && <CartaStory v={c.v} />}
        {c.tipo === "grupo" && <CartaGrupo v={c.v} />}
        {c.tipo === "flyer" && <CartaFlyer v={c.v} />}
        {c.tipo === "amiga" && <CartaAmiga />}
      </motion.div>
    </motion.div>
  );
}

/* ───────────── Íconos animados ───────────── */

type Ico = ComponentType<{ vivo: boolean; color: string }>;
const caja = { transformBox: "fill-box", transformOrigin: "center" } as const;
const lazo = (d: number, delay = 0) => ({ duration: d, repeat: Infinity, ease: "easeInOut" as const, delay });

const IcoRegado: Ico = ({ vivo, color }) => (
  <svg viewBox="0 0 80 80" className="h-full w-full" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round">
    {[[6, 8], [46, 4], [24, 46]].map(([x, y], i) => (
      <motion.rect key={i} x={x} y={y} width="28" height="22" rx="5" fill={i === 1 ? C.mostaza : "none"} style={caja}
        animate={vivo ? { x: [0, i % 2 ? 7 : -7, 0], y: [0, i === 1 ? -6 : 6, 0], rotate: [-6, 8, -6] } : {}} transition={lazo(3 + i * 0.7, i * 0.3)} />
    ))}
  </svg>
);

const IcoReloj: Ico = ({ vivo, color }) => (
  <svg viewBox="0 0 80 80" className="h-full w-full" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round">
    <circle cx="40" cy="44" r="26" />
    <path d="M34 12h12" />
    <line x1="40" y1="44" x2="40" y2="31" strokeWidth="3.5" />
    <motion.line x1="40" y1="44" x2="40" y2="25" strokeWidth="3" style={{ transformOrigin: "40px 44px" }}
      animate={vivo ? { rotate: 360 } : {}} transition={{ duration: 5, repeat: Infinity, ease: "linear" }} />
    <motion.circle cx="66" cy="14" r="5" fill={C.terracota} stroke="none" style={caja}
      animate={vivo ? { scale: [1, 1.5, 1], opacity: [1, 0.5, 1] } : {}} transition={lazo(1.6)} />
  </svg>
);

const IcoDuda: Ico = ({ vivo, color }) => (
  <svg viewBox="0 0 80 80" className="h-full w-full" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="8" y="12" width="64" height="52" rx="8" strokeDasharray="2 7" />
    <path d="M14 56l16-18 12 12 8-8 16 14" opacity=".45" />
    <motion.text x="40" y="52" textAnchor="middle" fontSize="38" fontWeight="700" fill={C.mostaza} stroke="none" fontFamily="var(--font-fraunces)" style={caja}
      animate={vivo ? { y: [0, -5, 0], rotate: [-8, 8, -8] } : {}} transition={lazo(2.4)}>?</motion.text>
  </svg>
);

const IcoMegafono: Ico = ({ vivo, color }) => (
  <svg viewBox="0 0 80 80" className="h-full w-full" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 32l32-14v44L12 48z" fill={C.mostaza} />
    <path d="M18 48l5 18h9l-4-16" />
    {[0, 1].map((i) => (
      <motion.path key={i} d={i ? "M58 24q12 16 0 32" : "M52 32q7 8 0 16"} style={caja}
        animate={vivo ? { opacity: [0.2, 1, 0.2], x: [0, 3, 0] } : {}} transition={lazo(1.8, i * 0.4)} />
    ))}
  </svg>
);

const IcoMoneda: Ico = ({ vivo, color }) => (
  <svg viewBox="0 0 80 80" className="h-full w-full" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="8" y="8" width="38" height="56" rx="6" opacity=".55" />
    <path d="M15 22h24M15 32h18M15 42h22" strokeWidth="3" opacity=".55" />
    <motion.g style={caja} animate={vivo ? { scaleX: [1, 0.15, 1] } : {}} transition={lazo(2.4)}>
      <circle cx="54" cy="52" r="18" fill={C.mostaza} />
      <text x="54" y="60" textAnchor="middle" fontSize="22" fontWeight="700" fill={color} stroke="none" fontFamily="var(--font-fraunces)">$</text>
    </motion.g>
  </svg>
);

const IcoGente: Ico = ({ vivo, color }) => (
  <svg viewBox="0 0 80 80" className="h-full w-full" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round">
    {[16, 40, 64].map((x, i) => (
      <motion.g key={x} style={caja} strokeDasharray={i === 1 ? "3 6" : undefined}
        animate={vivo && i === 1 ? { opacity: [1, 0.2, 1] } : {}} transition={lazo(2)}>
        <circle cx={x} cy="30" r="8" fill={i === 1 ? "none" : color} fillOpacity={i === 1 ? 0 : 0.18} />
        <path d={`M${x - 11} 62q0-16 11-16t11 16`} />
      </motion.g>
    ))}
    <motion.text x="40" y="20" textAnchor="middle" fontSize="18" fontWeight="700" fill={C.terracota} stroke="none" fontFamily="var(--font-fraunces)" style={caja}
      animate={vivo ? { y: [0, -3, 0] } : {}} transition={lazo(1.6)}>?</motion.text>
  </svg>
);

/* ───────────── Dolores ───────────── */

interface Dolor { titulo: string; texto: string; Icono: Ico }

const ASISTENTE: Dolor[] = [
  { titulo: "Está regado", texto: "La información vive en stories, grupos y voz a voz.", Icono: IcoRegado },
  { titulo: "Llegas tarde", texto: "Te enteras cuando ya pasó o ya se agotó.", Icono: IcoReloj },
  { titulo: "No sabes si vale la pena", texto: "Sin fotos reales, precio claro ni opiniones.", Icono: IcoDuda },
];
const ORGANIZADOR: Dolor[] = [
  { titulo: "Publicar cuesta", texto: "Dependen de redes y del voz a voz para llenar el evento.", Icono: IcoMegafono },
  { titulo: "Cobrar es incómodo", texto: "Transferencias, capturas de pantalla y listas en Excel.", Icono: IcoMoneda },
  { titulo: "No saben quién viene", texto: "Sin boletos ni QR, sin datos para volver a convocar.", Icono: IcoGente },
];

function Dato({ n, texto, fuente }: { n: number; texto: string; fuente?: string }) {
  return (
    <div>
      <p className="flex items-baseline gap-2">
        <span className="font-display text-[56px] font-bold leading-none" style={{ color: C.turquesa }}>{n}%</span>
        <span className="text-[19px] leading-tight text-[#12303A]">{texto}</span>
      </p>
      {fuente && <p className="mt-1 text-[14px] text-[#12303A]/60">Fuente: {fuente}</p>}
    </div>
  );
}

function TarjetaDolor({ d, i, visible, antes, lado, acento, extra }: {
  d: Dolor; i: number; visible: boolean; antes: boolean; lado: "asiste" | "organiza"; acento: string; extra?: ReactNode;
}) {
  const rm = useReducedMotion();
  const oculto = lado === "organiza" ? { x: 140, y: 0, rotate: 2 } : antes ? { x: 0, y: 60, rotate: 0 } : { x: -120, y: 0, rotate: 0 };
  return (
    <motion.div initial={false} animate={visible ? { opacity: 1, x: 0, y: 0, rotate: 0 } : { opacity: 0, ...oculto }}
      transition={rm ? { duration: 0.2 } : visible ? { type: "spring", stiffness: lado === "organiza" ? 170 : 110, damping: 15, delay: lado === "organiza" ? 0.35 + i * 0.1 : 0.1 } : { duration: 0.3 }}
      className="relative flex h-[470px] w-[440px] flex-col rounded-[28px] bg-white p-9 shadow-xl shadow-black/10">
      <div className="h-[112px] w-[112px] rounded-full p-5" style={{ background: acento + "22" }}>
        <d.Icono vivo={visible && !rm} color={C.noche} />
      </div>
      <h3 className="mt-7 font-display text-[40px] font-bold leading-[1.05] text-[#12303A]">{d.titulo}</h3>
      <span className="mt-4 block h-1.5 w-14 rounded-full" style={{ background: acento }} />
      <p className="mt-5 text-[26px] leading-snug text-[#12303A]/80">{d.texto}</p>
      {extra && <div className="mt-auto">{extra}</div>}
    </motion.div>
  );
}

function BrujulaMini({ visible, grados, etiqueta }: { visible: boolean; grados: number; etiqueta: string }) {
  const rm = useReducedMotion();
  return (
    <motion.div aria-hidden initial={false} animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.6 }} transition={{ duration: 0.4 }}
      className="absolute right-[100px] top-[96px] flex w-[120px] flex-col items-center">
      <svg viewBox="0 0 120 120" className="h-[110px] w-[110px] drop-shadow-md">
        <circle cx="60" cy="60" r="56" fill="#fff" stroke={C.noche} strokeWidth="4" />
        {[0, 90, 180, 270].map((a) => <line key={a} x1="60" y1="8" x2="60" y2="18" stroke={C.noche} strokeWidth="3" strokeLinecap="round" transform={`rotate(${a} 60 60)`} />)}
        <motion.g initial={false} animate={{ rotate: grados }} style={{ transformOrigin: "60px 60px" }}
          transition={rm ? { duration: 0.2 } : { type: "spring", stiffness: 40, damping: 6 }}>
          <polygon points="60,16 69,60 51,60" fill={C.turquesa} />
          <polygon points="60,104 69,60 51,60" fill={C.mostaza} />
          <circle cx="60" cy="60" r="6" fill={C.noche} />
        </motion.g>
      </svg>
      <p className="mt-1 text-[14px] font-bold uppercase tracking-wider text-[#12303A]/70">{etiqueta}</p>
    </motion.div>
  );
}

/* ───────────── Slide ───────────── */

export function Problema({ activa, paso }: { activa: boolean; paso: number }) {
  const rm = useReducedMotion();
  const p = activa ? paso : -1;
  const { porcentajeRedes, porcentajeLlegaTarde, fuente } = PROBLEMA_DATOS;
  const titulo = p === 0 ? { opacity: 1, y: 270, scale: 1 } : p === 1 ? { opacity: 1, y: 64, scale: 0.55 } : { opacity: 0, y: p < 0 ? 300 : 20, scale: 0.5 };
  const organiza = p === 5;
  const enPanel = p >= 2 && p <= 5;

  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: C.crema, color: C.noche }}>
      <div aria-hidden className="absolute -right-40 -top-48 h-[620px] w-[620px] rounded-full blur-3xl" style={{ background: C.turquesa + "22" }} />
      <motion.div aria-hidden initial={false} animate={{ opacity: organiza ? 1 : 0 }} transition={{ duration: 0.8 }}
        className="absolute -bottom-56 -left-40 h-[640px] w-[640px] rounded-full blur-3xl" style={{ background: C.mostaza + "40" }} />

      {CARTAS.map((c, i) => <Carta key={i} c={c} i={i} paso={p} />)}

      {/* Título */}
      <motion.div initial={false} animate={titulo} transition={rm ? { duration: 0.2 } : { type: "spring", stiffness: 70, damping: 16 }}
        className="absolute left-[250px] top-0 w-[1100px] origin-top text-center" style={{ zIndex: 5 }}>
        <h1 className="font-display text-[76px] font-bold leading-[1.02]">
          Hay mucho que hacer.<br />Lo difícil es <span className="relative inline-block" style={{ color: C.turquesa }}>enterarse.
            <svg aria-hidden viewBox="0 0 300 14" className="absolute -bottom-2 left-0 h-3.5 w-full" preserveAspectRatio="none"><path d="M2 8q18-10 36 0t36 0 36 0 36 0 36 0 36 0 36 0 36 0" fill="none" stroke={C.mostaza} strokeWidth="5" strokeLinecap="round" /></svg>
          </span>
        </h1>
        <motion.p initial={false} animate={{ opacity: p === 0 ? 1 : 0 }} transition={{ duration: 0.4, delay: p === 0 ? 0.9 : 0 }}
          className={`${caveat.className} mt-8 text-[44px]`} style={{ color: C.noche + "cc" }}>(y no perderse el evento por llegar tarde)</motion.p>
      </motion.div>

      {/* Dato opcional del caos */}
      {porcentajeRedes != null && (
        <motion.div initial={false} animate={{ opacity: p === 1 ? 1 : 0, y: p === 1 ? 0 : 16 }} transition={{ delay: p === 1 ? 1.2 : 0, duration: 0.5 }}
          className="absolute left-[60px] top-[84px] w-[380px]" style={{ zIndex: 6 }}>
          <Dato n={porcentajeRedes} texto="se entera de los eventos por redes sociales" fuente={fuente} />
        </motion.div>
      )}

      {/* Dolores */}
      <motion.div aria-hidden={!enPanel} initial={false} animate={{ opacity: enPanel ? 1 : 0, y: enPanel ? 0 : -16 }} transition={{ duration: 0.4 }}
        className="absolute left-[100px] top-[96px]" style={{ zIndex: 5 }}>
        <p className="text-[18px] font-bold uppercase tracking-[0.18em]" style={{ color: organiza ? C.terracota : C.turquesa }}>
          {organiza ? "Para quien organiza" : "Para quien asiste"}
        </p>
        <h2 className="mt-2 font-display text-[54px] font-bold leading-none">{organiza ? "Llenar un evento es cuesta arriba" : "Ir a un evento no debería ser tan difícil"}</h2>
      </motion.div>

      <BrujulaMini visible={enPanel} grados={organiza ? 270 : 90} etiqueta={organiza ? "Organizador" : "Asistente"} />

      <div className="absolute left-[100px] top-[300px] flex gap-[40px]" style={{ zIndex: 5 }}>
        {ASISTENTE.map((d, i) => (
          <TarjetaDolor key={d.titulo} d={d} i={i} lado="asiste" acento={C.turquesa} visible={p >= 2 + i && p <= 4} antes={p < 2 + i}
            extra={i === 1 && porcentajeLlegaTarde != null ? <Dato n={porcentajeLlegaTarde} texto="se entera cuando ya pasó" fuente={fuente} /> : undefined} />
        ))}
      </div>
      <div className="absolute left-[100px] top-[300px] flex gap-[40px]" style={{ zIndex: 5 }}>
        {ORGANIZADOR.map((d, i) => (
          <TarjetaDolor key={d.titulo} d={d} i={i} lado="organiza" acento={C.mostaza} visible={organiza} antes={false} />
        ))}
      </div>

      {/* Cierre */}
      <motion.div initial={false} animate={{ opacity: p === 6 ? 1 : 0, x: p === 6 ? 0 : 60 }}
        transition={rm ? { duration: 0.2 } : { type: "spring", stiffness: 70, damping: 16, delay: p === 6 ? 0.9 : 0 }}
        className="absolute left-[800px] top-[270px] w-[700px]" style={{ zIndex: 20 }}>
        <p className="font-display text-[68px] font-bold leading-[1.05]">
          ¿Y si todo estuviera en <span className="relative inline-block" style={{ color: C.turquesa }}>un solo lugar?
            <svg aria-hidden viewBox="0 0 300 14" className="absolute -bottom-2 left-0 h-3.5 w-full" preserveAspectRatio="none"><path d="M2 8q18-10 36 0t36 0 36 0 36 0 36 0 36 0 36 0 36 0" fill="none" stroke={C.mostaza} strokeWidth="5" strokeLinecap="round" /></svg>
          </span>
        </p>
        <p className={`${caveat.className} mt-10 flex items-center gap-3 text-[40px]`} style={{ color: C.terracota }}>
          la solución
          <svg aria-hidden viewBox="0 0 60 24" className="h-6 w-14"><path d="M2 12h50m-10-9l10 9-10 9" fill="none" stroke={C.terracota} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </p>
      </motion.div>
    </div>
  );
}
