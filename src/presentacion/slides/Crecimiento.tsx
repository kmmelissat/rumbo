"use client";
import { type CSSProperties, type ReactNode } from "react";
import { Caveat } from "next/font/google";
import { motion, useReducedMotion } from "motion/react";

/**
 * Textos editables. "resultado" va vacío a propósito: si está vacío se muestra
 * "en medición". Escríbelo solo cuando exista una medición real.
 */
const CRECIMIENTO_DATOS = {
  titulo: "Cómo crece Rumbo",
  subtitulo: "(un experimento por etapa)",
  etapas: [
    {
      letra: "A",
      etapa: "Adquisición",
      experimento: {
        hipotesis: "Si publicamos cada semana \"3 rumbos para este finde\" en Instagram y TikTok, más gente entra a la web, con un impulso pequeño al contenido.",
        cambio: "Guía semanal con enlace a Rumbo.",
        metrica: "Visitas a la web desde redes por semana.",
        guardrail: "Que el crecimiento siga siendo orgánico, sin depender de anuncios.",
        resultado: "",
      },
    },
    {
      letra: "A",
      etapa: "Activación",
      experimento: {
        hipotesis: "Si se puede abrir y guardar un evento sin registrarse, más visitantes guardan su primer plan.",
        cambio: "Guardar sin crear cuenta.",
        metrica: "Porcentaje de visitantes que guardan al menos un evento en su primera sesión.",
        guardrail: "Que el tiempo en la página y los errores no empeoren.",
        resultado: "",
      },
    },
    {
      letra: "R",
      etapa: "Retención",
      experimento: {
        hipotesis: "Si recordamos por WhatsApp los planes guardados, más personas vuelven la semana siguiente.",
        cambio: "Recordatorio del plan guardado.",
        metrica: "Usuarios activos semanales que vuelven a la semana siguiente.",
        guardrail: "Que no suban las bajas ni las quejas de mensajes.",
        resultado: "",
      },
    },
    {
      letra: "R",
      etapa: "Ingresos",
      experimento: {
        hipotesis: "Si el evento destacado muestra clics y guardados, los organizadores pagan por destacar.",
        cambio: "Cobrar un primer evento destacado de $30, a mano, con dinero real.",
        metrica: "Organizadores que pagan por destacar.",
        guardrail: "Que el organizador reporte que valió la pena y que los eventos no destacados no pierdan visibilidad.",
        resultado: "",
      },
    },
    {
      letra: "R",
      etapa: "Referidos",
      experimento: {
        hipotesis: "Si compartir un evento por WhatsApp envía una ficha clara (horario, precio, ubicación), más gente llega por recomendación.",
        cambio: "Botón de compartir con ficha del evento.",
        metrica: "Eventos compartidos por usuario y visitas que llegan desde esos enlaces.",
        guardrail: "Nada de mensajes automáticos a contactos.",
        resultado: "",
      },
    },
  ],
  medimos: {
    titulo: "Cómo medimos",
    metricas: [
      "Organizadores activos",
      "Eventos confirmados por semana",
      "Usuarios activos semanales",
      "Eventos guardados y compartidos",
      "Entradas vendidas",
      "Ingresos por organizador",
    ],
    nota: "Con poco tráfico no hacemos A/B formal: comparamos una semana contra otra con el mismo tipo de evento y cambiamos una sola cosa a la vez.",
  },
  cierre: {
    frase: "Una hipótesis a la vez, y los números deciden",
  },
};

const FILAS = [
  { clave: "hipotesis", nombre: "Hipótesis" },
  { clave: "cambio", nombre: "Cambio" },
  { clave: "metrica", nombre: "Métrica" },
  { clave: "guardrail", nombre: "Guardrail" },
] as const;

const caveat = Caveat({ subsets: ["latin"], weight: "600" });
const C = { crema: "#FAF6EF", noche: "#12303A", turquesa: "#0A7C7C", mostaza: "#F5B82E", terracota: "#E2683F" };
const COLOR_FILA: Record<string, string> = { hipotesis: C.turquesa, cambio: C.mostaza, metrica: C.noche, guardrail: C.noche };

/* Embudo: 5 fichas de 268 px separadas 25 px = 1440 px. */
const FICHA = 268;
const PASO_X = FICHA + 25;
const BRUJULA = 44;
const posX = (i: number) => i * PASO_X + (FICHA - BRUJULA) / 2;
const N = CRECIMIENTO_DATOS.etapas.length;
const AVANCE = 0.6; // segundos entre etapa y etapa en el paso 1
const INICIO = 0.4;

function Item({ visible, i = 0, base = 0.2, className, style, children }: { visible: boolean; i?: number; base?: number; className?: string; style?: CSSProperties; children: ReactNode }) {
  const rm = useReducedMotion();
  return (
    <motion.div initial={false} className={className} style={style}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: rm ? 0 : 30 }}
      transition={rm || !visible ? { duration: 0.2 } : { type: "spring", stiffness: 90, damping: 15, delay: base + i * 0.14 }}>{children}</motion.div>
  );
}

function Aguja({ size = BRUJULA }: { size?: number }) {
  return (
    <svg aria-hidden viewBox="0 0 48 48" width={size} height={size}>
      <circle cx="24" cy="24" r="21" fill="#fff" stroke={C.noche} strokeWidth="3" />
      <polygon points="24,7 30,24 18,24" fill={C.terracota} />
      <polygon points="24,41 30,24 18,24" fill={C.noche} />
      <circle cx="24" cy="24" r="3.500" fill={C.mostaza} />
    </svg>
  );
}

/* Pasos 1 a 6: embudo + tarjeta del experimento activo */
function Embudo({ p }: { p: number }) {
  const rm = useReducedMotion();
  const activo = p >= 2 && p <= 6 ? p - 2 : -1;
  const dur = rm ? 0.2 : 0.4;

  const brujula =
    p === 1
      ? { opacity: 1, x: rm ? posX(N - 1) : Array.from({ length: N }, (_, i) => posX(i)) }
      : p >= 2 && p <= 6
        ? { opacity: 1, x: posX(p - 2) }
        : { opacity: 0, x: posX(0) };
  const trBrujula =
    p === 1 && !rm
      ? { x: { duration: AVANCE * (N - 1), delay: INICIO, ease: "easeInOut" as const }, opacity: { duration: 0.3 } }
      : rm
        ? { duration: 0.2 }
        : { type: "spring" as const, stiffness: 90, damping: 15 };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-[25px]">
        {CRECIMIENTO_DATOS.etapas.map((e, i) => {
          const encendida = p >= 1;
          const esActiva = activo === i;
          const delay = p === 1 && !rm ? INICIO + i * AVANCE : 0;
          return (
            <motion.div key={e.etapa} initial={false} className="flex h-[88px] items-center gap-4 rounded-[22px] border-2 px-5"
              style={{ width: FICHA }}
              animate={{
                opacity: encendida ? 1 : 0.4,
                backgroundColor: esActiva ? C.turquesa : "#ffffff",
                borderColor: esActiva ? C.turquesa : encendida ? C.turquesa : C.noche + "22",
                color: esActiva ? "#ffffff" : C.noche,
              }}
              transition={{ duration: dur, delay }}>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-display text-[26px] font-bold"
                style={{ background: esActiva ? C.mostaza : encendida ? C.mostaza + "88" : C.noche + "14", color: C.noche }}>{e.letra}</span>
              <h3 className="font-display text-[30px] font-bold leading-none">{e.etapa}</h3>
            </motion.div>
          );
        })}
      </div>
      <div className="h-[44px]" style={{ width: 1440 }}>
        <motion.div initial={false} animate={brujula} transition={trBrujula} style={{ width: BRUJULA }}><Aguja /></motion.div>
      </div>
      {/* Tarjetas en una sola celda: la más alta marca el alto */}
      <div className="grid">
        {CRECIMIENTO_DATOS.etapas.map((e, i) => (
          <Tarjeta key={e.etapa} etapa={e} visible={activo === i} />
        ))}
      </div>
    </div>
  );
}

function Tarjeta({ etapa, visible }: { etapa: (typeof CRECIMIENTO_DATOS.etapas)[number]; visible: boolean }) {
  const rm = useReducedMotion();
  const x = etapa.experimento;
  return (
    <motion.div initial={false} aria-hidden={!visible} style={{ gridArea: "1 / 1", transformOrigin: "top center", pointerEvents: visible ? "auto" : "none" }}
      className="flex flex-col rounded-[28px] bg-white px-9 py-5 shadow-xl shadow-black/10"
      animate={visible ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: rm ? 1 : 0.94, y: rm ? 0 : -16 }}
      transition={rm || !visible ? { duration: 0.2 } : { type: "spring", stiffness: 110, damping: 16, delay: 0.1 }}>
      <div className="flex items-baseline justify-between border-b-2 pb-2" style={{ borderColor: C.noche + "14" }}>
        <h2 className="font-display text-[38px] font-bold leading-none" style={{ color: C.turquesa }}>{etapa.etapa}</h2>
        <p className="text-[17px] font-bold uppercase tracking-[0.14em] opacity-60">Un experimento</p>
      </div>
      {FILAS.map((f) => (
        <div key={f.clave} className="grid grid-cols-[170px_1fr] items-start gap-6 border-b py-2.5" style={{ borderColor: C.noche + "12" }}>
          <span className="mt-0.5 flex items-center gap-2 text-[19px] font-bold uppercase tracking-[0.1em]" style={{ color: f.clave === "metrica" || f.clave === "guardrail" ? C.noche : C.turquesa }}>
            {f.clave === "guardrail" && <span aria-hidden className="h-2.5 w-2.5 rounded-full" style={{ background: C.terracota }} />}
            {f.nombre}
          </span>
          <p className="text-[24px] leading-[1.28]" style={{ color: COLOR_FILA[f.clave] === C.mostaza ? C.noche : C.noche }}>{x[f.clave]}</p>
        </div>
      ))}
      <div className="flex items-center gap-6 pt-3">
        <span className="w-[170px] shrink-0 text-[19px] font-bold uppercase tracking-[0.1em] opacity-60">Resultado</span>
        {x.resultado.trim() ? (
          <p className="font-display text-[30px] font-bold leading-none">{x.resultado}</p>
        ) : (
          <p className={`${caveat.className} text-[32px] leading-none`} style={{ color: C.terracota }}>en medición</p>
        )}
      </div>
    </motion.div>
  );
}

/* Paso 7 */
function PasoMedimos({ visible }: { visible: boolean }) {
  const rm = useReducedMotion();
  const d = CRECIMIENTO_DATOS.medimos;
  const t = (i: number) => ({ duration: rm ? 0.2 : 0.4, delay: visible ? 0.3 + i * 0.3 : 0 });
  return (
    <div className="flex flex-col gap-6">
      <Item visible={visible}><h2 className="font-display text-[48px] font-bold leading-none">{d.titulo}</h2></Item>
      <div className="flex flex-wrap gap-4">
        {d.metricas.map((m, i) => (
          <motion.div key={m} initial={false} className="flex items-center gap-4 rounded-full border-2 bg-white px-7 py-4"
            animate={visible ? { opacity: 1, borderColor: C.turquesa } : { opacity: 0.35, borderColor: C.noche + "22" }}
            transition={t(i)}>
            <motion.span initial={false} className="h-5 w-5 shrink-0 rounded-full"
              animate={visible ? { background: C.mostaza, boxShadow: `0 0 0 7px ${C.mostaza}55` } : { background: C.noche + "22", boxShadow: "0 0 0 0px #0000" }}
              transition={t(i)} />
            <span className="text-[27px] font-semibold leading-tight">{m}</span>
          </motion.div>
        ))}
      </div>
      <Item visible={visible} base={0.3 + d.metricas.length * 0.3} className="rounded-[26px] px-9 py-7" style={{ background: C.noche, color: "#fff" }}>
        <p className="font-display text-[34px] font-semibold leading-snug">{d.nota}</p>
      </Item>
    </div>
  );
}

/* Paso 8 */
function PasoCierre({ visible }: { visible: boolean }) {
  const rm = useReducedMotion();
  const d = CRECIMIENTO_DATOS.cierre;
  return (
    <div className="flex flex-col items-center gap-10 pt-10 text-center">
      <motion.div initial={false} animate={visible ? { opacity: 1, rotate: 0 } : { opacity: 0, rotate: rm ? 0 : -120 }}
        transition={rm || !visible ? { duration: 0.2 } : { type: "spring", stiffness: 40, damping: 9, delay: 0.2 }}>
        <Aguja size={150} />
      </motion.div>
      <Item visible={visible} i={1}><h2 className="max-w-[1200px] font-display text-[78px] font-bold leading-[1.05]">{d.frase}</h2></Item>
    </div>
  );
}

export function Crecimiento({ activa, paso }: { activa: boolean; paso: number }) {
  const rm = useReducedMotion();
  const p = activa ? paso : -1;
  const titulo = p === 0 ? { opacity: 1, x: 0, y: 330, scale: 1 } : p > 0 ? { opacity: 1, x: 0, y: 36, scale: 0.55 } : { opacity: 0, x: 0, y: 340, scale: 0.5 };
  const capa = (on: boolean) => ({ animate: { opacity: on ? 1 : 0 }, transition: { duration: rm ? 0.15 : 0.35, delay: on ? 0.15 : 0 }, style: { gridArea: "1 / 1", pointerEvents: on ? "auto" as const : "none" as const } });

  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: C.crema, color: C.noche }}>
      <div aria-hidden className="absolute -right-40 -top-48 h-[560px] w-[560px] rounded-full blur-3xl" style={{ background: C.turquesa + "1f" }} />
      <motion.div initial={false} animate={titulo} transition={rm ? { duration: 0.2 } : { type: "spring", stiffness: 70, damping: 16 }}
        className="absolute left-[100px] top-0 w-[1400px] origin-top text-center" style={{ zIndex: 20 }}>
        <h1 className="font-display text-[80px] font-bold leading-[1.02]">{CRECIMIENTO_DATOS.titulo}</h1>
        <p className={`${caveat.className} mt-4 text-[44px]`} style={{ color: C.terracota }}>{CRECIMIENTO_DATOS.subtitulo}</p>
      </motion.div>
      {/* Escenario: capas en una sola celda; debe terminar antes de y = 852 */}
      <div className="absolute left-[80px] top-[150px] grid w-[1440px]">
        <motion.div aria-hidden={p < 1 || p > 6} initial={false} {...capa(p >= 1 && p <= 6)}><Embudo p={p} /></motion.div>
        <motion.div aria-hidden={p !== 7} initial={false} {...capa(p === 7)}><PasoMedimos visible={p === 7} /></motion.div>
        <motion.div aria-hidden={p !== 8} initial={false} {...capa(p === 8)}><PasoCierre visible={p === 8} /></motion.div>
      </div>
    </div>
  );
}
