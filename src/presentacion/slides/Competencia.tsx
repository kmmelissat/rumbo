"use client";
import type { ReactNode } from "react";
import { Caveat } from "next/font/google";
import { motion, useReducedMotion } from "motion/react";
import { LogoIcon } from "../../components/Logo";

/**
 * Textos de la slide. Sin cifras: todo es descriptivo.
 * `aliado: true` marca a los organizadores como aliados (otro color y lazo de alianza).
 */
const COMPETENCIA_DATOS = {
  grupos: [
    {
      id: "boleterias", icono: "boleto", aliado: false, nombre: "Boleterías",
      ejemplos: "Fun Capital, TodoTicket, Smart Ticket",
      queHace: "Venden boletos de conciertos y eventos masivos.",
      etiquetaPorQue: "Por qué Rumbo es mejor",
      porQue: "Reúne los planes locales (mercaditos, ferias, talleres y eventos gratis) con filtros por zona y presupuesto, precio claro antes de pagar y boleto con QR confirmado por correo y WhatsApp.",
    },
    {
      id: "agendas", icono: "agenda", aliado: false, nombre: "Agendas",
      ejemplos: "Medios como elsalvador.com y la agenda turística del gobierno (MOPT)",
      queHace: "Publican planes en artículos semanales o anuncian programación en espacios públicos.",
      etiquetaPorQue: "Por qué Rumbo es mejor",
      porQue: "Es un calendario vivo: filtros por fecha, zona y presupuesto, guardar y compartir por WhatsApp. El organizador actualiza su evento con fecha de última actualización, y suma también planes privados (mercaditos, cafeterías, talleres).",
    },
    {
      id: "redes", icono: "redes", aliado: false, nombre: "Redes sociales",
      ejemplos: "Instagram, TikTok, Facebook y WhatsApp",
      queHace: "Es donde hoy se promociona casi todo.",
      etiquetaPorQue: "Por qué Rumbo es mejor",
      porQue: "Junta en una sola ficha lo que está repartido entre cuentas: horario, precio, ubicación y enlace compartible.",
    },
    {
      id: "organizadores", icono: "aliado", aliado: true, nombre: "Organizadores",
      ejemplos: "Sivar Emprende, Farmer's Market",
      queHace: "Hacen ferias de emprendedores y mercados en parques de San Salvador.",
      etiquetaPorQue: "Por qué son aliados",
      porQue: "Son aliados, no competencia: Rumbo les da más visibilidad, un panel para publicar en menos de 3 minutos y métricas de clics y guardados.",
    },
  ],
  sellos: [
    { icono: "pines", texto: "Planes pequeños y locales en un solo calendario." },
    { icono: "check", texto: "Información confirmada por el organizador." },
    { icono: "qr", texto: "Del plan a la reserva con un solo enlace y un solo QR." },
    { icono: "panel", texto: "Herramientas para el organizador: publica rápido y ve clics y guardados." },
  ],
  defensa: {
    titulo: "Un calendario se copia fácil.",
    cuerpo: "La ventaja está en la red de organizadores y alianzas (Farmer's Market, Sivar Emprende, lugares y marcas) y en los datos de qué eventos funcionan.",
    prioridad: "Por eso la primera prioridad es construir esa red.",
    nodos: [
      { texto: "Datos de qué funciona", tipo: "datos" },
      { texto: "Farmer's Market", tipo: "aliado" },
      { texto: "Sivar Emprende", tipo: "aliado" },
      { texto: "Lugares", tipo: "aliado" },
      { texto: "Marcas", tipo: "aliado" },
    ],
  },
};

const caveat = Caveat({ subsets: ["latin"], weight: "600" });
const C = { crema: "#FAF6EF", noche: "#12303A", turquesa: "#0A7C7C", marca: "#0FA3A3", mostaza: "#F5B82E", terracota: "#C8553D" };

/* ───────────── Íconos propios (sin marcas reales) ───────────── */

const trazo = { fill: "none", stroke: "currentColor", strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round" } as const;

const ICONOS: Record<string, ReactNode> = {
  boleto: <g {...trazo}><path d="M6 15h36v7a4 4 0 0 0 0 8v7H6v-7a4 4 0 0 0 0-8z" /><path d="M31 15v22" strokeDasharray="2 4" /></g>,
  agenda: <g {...trazo}><rect x="7" y="10" width="34" height="31" rx="5" /><path d="M7 20h34M16 6v8M32 6v8M16 29h4M28 29h4" /></g>,
  redes: <g {...trazo}><path d="M6 10h24a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H16l-8 6v-6H6a4 4 0 0 1-4-4V14a4 4 0 0 1 4-4z" transform="translate(2 0)" /><path d="M38 20h2a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4h-1v6l-7-6h-8a4 4 0 0 1-4-4" /></g>,
  aliado: <g {...trazo}><path d="M20 28l-4 4a6 6 0 0 1-9-9l6-6a6 6 0 0 1 9 0" /><path d="M28 20l4-4a6 6 0 0 1 9 9l-6 6a6 6 0 0 1-9 0" /><path d="M19 29l10-10" /></g>,
  pines: <g {...trazo}><path d="M16 40s-9-9-9-17a9 9 0 0 1 18 0c0 8-9 17-9 17z" /><circle cx="16" cy="23" r="3" /><path d="M32 42s-6-6-6-11a6 6 0 0 1 12 0c0 5-6 11-6 11z" /></g>,
  check: <g {...trazo}><path d="M24 5l14 5v11c0 10-6 17-14 21C16 38 10 31 10 21V10z" /><path d="M17 23l5 5 9-10" /></g>,
  qr: <g {...trazo}><rect x="6" y="6" width="14" height="14" rx="2" /><rect x="28" y="6" width="14" height="14" rx="2" /><rect x="6" y="28" width="14" height="14" rx="2" /><path d="M28 28h5v5M42 28v14h-7M28 38v4" /></g>,
  panel: <g {...trazo}><rect x="6" y="7" width="36" height="34" rx="5" /><path d="M14 33V25M24 33V17M34 33V21" /></g>,
};

function Icono({ n, size = 36 }: { n: string; size?: number }) {
  return <svg aria-hidden viewBox="0 0 48 48" width={size} height={size}>{ICONOS[n]}</svg>;
}

/* ───────────── Paso 2: mapa de competidores ───────────── */

const MOSTRAR_POR_QUE = false;
const MOSTRAR_RUTA = false;

type Grupo = (typeof COMPETENCIA_DATOS.grupos)[number];

function Tarjeta({ g, visible }: { g: Grupo; visible: boolean }) {
  const rm = useReducedMotion();
  const color = g.aliado ? C.mostaza : C.turquesa;
  return (
    <motion.article aria-hidden={!visible} initial={false}
      animate={visible ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.94 }}
      transition={rm ? { duration: 0.2 } : visible ? { type: "spring", stiffness: 90, damping: 15, delay: 0.2 } : { duration: 0.25 }}
      className="flex flex-col rounded-[24px] border-2 px-6 py-6 shadow-xl shadow-black/10"
      style={{ background: g.aliado ? "#FFF3D1" : "#FFFFFF", borderColor: color, color: C.noche }}>
      <div className="flex items-center gap-3">
        <span className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-2xl" style={{ background: color, color: g.aliado ? C.noche : "#fff" }}>
          <Icono n={g.icono} size={36} />
        </span>
        <div>
          <h3 className="font-display text-[28px] font-bold leading-none">{g.nombre}</h3>
          {g.aliado && <p className={`${caveat.className} mt-1 text-[22px] leading-none`} style={{ color: C.terracota }}>alianza</p>}
        </div>
      </div>
      <p className="mt-4 text-[17px] font-semibold leading-snug opacity-75">{g.ejemplos}</p>
      <p className="mt-4 text-[13px] font-bold uppercase tracking-[0.14em] opacity-60">Qué hace hoy</p>
      <p className="text-[19px] leading-[1.3]">{g.queHace}</p>
      {/* Se conserva pero no se renderiza: el "por qué Rumbo es mejor" va en las notas del presentador. */}
      {MOSTRAR_POR_QUE && (
        <>
          <p className="mt-3 text-[13px] font-bold uppercase tracking-[0.14em]" style={{ color: g.aliado ? C.terracota : C.turquesa }}>{g.etiquetaPorQue}</p>
          <p className="text-[18px] font-medium leading-[1.3]">{g.porQue}</p>
        </>
      )}
    </motion.article>
  );
}

function Mapa({ p }: { p: number }) {
  const rm = useReducedMotion();
  const n = p >= 1 ? 4 : 0; // las 4 tarjetas aparecen juntas
  return (
    <div className="flex flex-col gap-3 pt-10">
      {/* Ruta: la línea se llena con cada paso */}
      <div className="relative" hidden={!MOSTRAR_RUTA}>
        <div className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 rounded" style={{ background: C.turquesa + "33" }} />
        <motion.div initial={false} animate={{ scaleX: n >= 1 ? (n - 0.5) / 4 : 0 }} transition={rm ? { duration: 0.2 } : { duration: 0.8 }}
          className="absolute inset-x-0 top-1/2 h-[3px] origin-left -translate-y-1/2 rounded" style={{ background: C.mostaza }} />
        <div className="relative grid grid-cols-4 gap-6">
          {COMPETENCIA_DATOS.grupos.map((g, i) => (
            <div key={g.id} className="flex justify-center">
              <motion.span initial={false} animate={{ scale: n > i ? 1 : 0.6, backgroundColor: n > i ? (g.aliado ? C.mostaza : C.turquesa) : "#FAF6EF" }}
                className="block h-6 w-6 rounded-full border-[3px]" style={{ borderColor: g.aliado ? C.mostaza : C.turquesa }} />
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-4 items-stretch gap-6">
        {COMPETENCIA_DATOS.grupos.map((g, i) => <Tarjeta key={g.id} g={g} visible={n > i} />)}
      </div>
    </div>
  );
}

/* ───────────── Paso 3: sellos ───────────── */

const COLORES_SELLO = [C.turquesa, C.mostaza, C.marca, C.noche];

function Sellos({ visible }: { visible: boolean }) {
  const rm = useReducedMotion();
  return (
    <div className="flex flex-col gap-8 pt-10">
      <h2 className="text-center font-display text-[56px] font-bold leading-none">
        <span className="rounded px-3" style={{ background: C.mostaza + "55" }}>Lo que nos hace distintos</span>
      </h2>
      <div className="grid grid-cols-2 gap-8">
        {COMPETENCIA_DATOS.sellos.map((s, i) => {
          const color = COLORES_SELLO[i];
          return (
            <motion.div key={s.texto} initial={false}
              animate={visible ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0.7, rotate: i % 2 ? 6 : -6 }}
              transition={rm ? { duration: 0.2 } : visible ? { type: "spring", stiffness: 110, damping: 13, delay: 0.3 + i * 0.35 } : { duration: 0.2 }}
              className="flex items-center gap-8 rounded-[28px] bg-white px-9 py-9 shadow-xl shadow-black/10">
              <span className="relative flex h-[120px] w-[120px] shrink-0 items-center justify-center" style={{ color: color === C.mostaza ? C.noche : "#fff" }}>
                <svg aria-hidden viewBox="0 0 100 100" className="absolute inset-0">
                  <path fill={color} d={Array.from({ length: 16 }, (_, k) => { const a = (k / 16) * Math.PI * 2; const r = k % 2 ? 40 : 48; return `${k ? "L" : "M"}${(50 + r * Math.cos(a)).toFixed(1)} ${(50 + r * Math.sin(a)).toFixed(1)}`; }).join("") + "Z"} />
                </svg>
                <span className="relative"><Icono n={s.icono} size={56} /></span>
              </span>
              <p className="font-display text-[38px] font-semibold leading-[1.12]">{s.texto}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ───────────── Paso 4: cómo nos defendemos ───────────── */

const CX = 350, CY = 300, RX = 235, RY = 215;
const POS = [-90, -18, 54, 126, 198].map((g) => {
  const a = (g * Math.PI) / 180;
  return { x: CX + RX * Math.cos(a), y: CY + RY * Math.sin(a) };
});

function Red({ visible }: { visible: boolean }) {
  const rm = useReducedMotion();
  const nodos = COMPETENCIA_DATOS.defensa.nodos;
  return (
    <svg aria-hidden viewBox="0 0 700 600" className="h-[600px] w-[700px]">
      {/* Anillo entre vecinos */}
      {POS.map((a, i) => {
        const b = POS[(i + 1) % POS.length];
        return <motion.line key={`r${i}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={C.turquesa} strokeOpacity={0.35} strokeWidth={2} strokeDasharray="3 7" strokeLinecap="round"
          initial={false} animate={{ opacity: visible ? 1 : 0 }} transition={{ duration: 0.6, delay: visible ? 1.4 : 0 }} />;
      })}
      {/* Radios hacia el logo */}
      {POS.map((a, i) => (
        <motion.line key={`l${i}`} x1={CX} y1={CY} x2={a.x} y2={a.y} stroke={nodos[i].tipo === "datos" ? C.mostaza : C.turquesa} strokeWidth={4} strokeLinecap="round"
          initial={false} animate={visible ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={rm ? { duration: 0.2 } : visible ? { duration: 0.7, delay: 0.5 + i * 0.2 } : { duration: 0.2 }} />
      ))}
      {/* Centro */}
      <motion.g initial={false} animate={{ scale: visible ? 1 : 0.5, opacity: visible ? 1 : 0 }} style={{ transformOrigin: `${CX}px ${CY}px` }}
        transition={rm ? { duration: 0.2 } : { type: "spring", stiffness: 110, damping: 14, delay: visible ? 0.2 : 0 }}>
        <circle cx={CX} cy={CY} r={78} fill={C.crema} stroke={C.turquesa} strokeWidth={5} />
        <g transform={`translate(${CX - 44} ${CY - 44})`}><LogoIcon size={88} /></g>
      </motion.g>
      {/* Nodos */}
      {nodos.map((n, i) => {
        const w = 214, h = 54, { x, y } = POS[i];
        const datos = n.tipo === "datos";
        return (
          <motion.g key={n.texto} initial={false} animate={{ scale: visible ? 1 : 0.4, opacity: visible ? 1 : 0 }} style={{ transformOrigin: `${x}px ${y}px` }}
            transition={rm ? { duration: 0.2 } : visible ? { type: "spring", stiffness: 120, damping: 13, delay: 0.9 + i * 0.2 } : { duration: 0.2 }}>
            <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={27} fill={datos ? C.mostaza : "#fff"} stroke={datos ? C.mostaza : C.turquesa} strokeWidth={3} />
            <text x={x} y={y + 7} textAnchor="middle" fontSize={20} fontWeight={700} fill={C.noche}>{n.texto}</text>
          </motion.g>
        );
      })}
    </svg>
  );
}

function Defensa({ visible }: { visible: boolean }) {
  const rm = useReducedMotion();
  const d = COMPETENCIA_DATOS.defensa;
  return (
    <div className="grid grid-cols-[1fr_700px] items-center gap-10">
      <motion.div initial={false} animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : -40 }}
        transition={rm ? { duration: 0.2 } : visible ? { type: "spring", stiffness: 80, damping: 16, delay: 0.2 } : { duration: 0.2 }}
        className="flex flex-col gap-6">
        <h2 className="font-display text-[54px] font-bold leading-[1.05]">{d.titulo}</h2>
        <p className="text-[28px] leading-snug">{d.cuerpo}</p>
        <p className="font-display text-[36px] font-bold leading-[1.1]" style={{ color: C.turquesa }}>
          <span className="rounded px-1" style={{ background: C.mostaza + "55" }}>{d.prioridad}</span>
        </p>
      </motion.div>
      <Red visible={visible} />
    </div>
  );
}

/* ───────────── Slide ───────────── */

export function Competencia({ activa, paso }: { activa: boolean; paso: number }) {
  const rm = useReducedMotion();
  const p = activa ? paso : -1;
  // Zona segura (lienzo 1600x900): 80 px arriba para la barra de ruta; el contenido termina antes de y = 810.
  const titulo = p === 0 ? { opacity: 1, x: 0, y: 280, scale: 1 } : p > 0 ? { opacity: 1, x: -415, y: 80, scale: 0.5 } : { opacity: 0, x: 0, y: 300, scale: 0.5 };
  const capa = (on: boolean) => ({ animate: { opacity: on ? 1 : 0 }, transition: { duration: rm ? 0.15 : 0.35, delay: on ? 0.15 : 0 }, style: { gridArea: "1 / 1", pointerEvents: on ? "auto" as const : "none" as const } });

  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: C.crema, color: C.noche }}>
      <div aria-hidden className="absolute -right-40 -top-48 h-[560px] w-[560px] rounded-full blur-3xl" style={{ background: C.turquesa + "1f" }} />

      <motion.div initial={false} animate={titulo} transition={rm ? { duration: 0.2 } : { type: "spring", stiffness: 70, damping: 16 }}
        className="absolute left-[100px] top-0 w-[1400px] origin-top text-center" style={{ zIndex: 20 }}>
        <h1 className="font-display text-[76px] font-bold leading-[1.02]">¿Con quién compartimos el camino?</h1>
        <p className={`${caveat.className} mt-6 text-[44px]`} style={{ color: C.terracota }}>(hoy está todo repartido)</p>
      </motion.div>

      {/* Escenario: las pantallas comparten la misma celda de la cuadrícula */}
      <div className="absolute left-[60px] top-[188px] grid w-[1480px]">
        <motion.div aria-hidden={p !== 1} initial={false} {...capa(p === 1)}><Mapa p={p === 1 ? 1 : p > 1 ? 1 : 0} /></motion.div>
        <motion.div aria-hidden={p !== 2} initial={false} {...capa(p === 2)}><Sellos visible={p === 2} /></motion.div>
        <motion.div aria-hidden={p !== 3} initial={false} {...capa(p === 3)}><Defensa visible={p === 3} /></motion.div>
      </div>
    </div>
  );
}
