"use client";
import { useEffect, type ReactNode } from "react";
import { Caveat } from "next/font/google";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { Brujula } from "../componentes/Brujula";

/** Todo el contenido editable de la slide. Son perfiles construidos, no entrevistas. */
const CLIENTES_MERCADO_DATOS = {
  titulo: "Para quién es Rumbo",
  subtitulo: "(dos lados y un mercado)",
  perfiles: {
    asistente: {
      rol: "Quien descubre",
      nombre: "Andrea Salazar",
      edad: 25,
      piel: "#E9B98F",
      pelo: "#2B1D16",
      corto: "Gasta $15–$40 por salida",
      datos: ["Gasta $15–$40 por salida", "Instagram · TikTok · WhatsApp"],
      filas: [
        { etiqueta: "Quién es", texto: "Joven profesional de marketing, tecnología o finanzas en el área metropolitana de San Salvador." },
        { etiqueta: "Le duele", texto: "La información está vieja o hay fees sorpresa." },
        { etiqueta: "Rumbo le da", texto: "Todo en un lugar y compra con un solo QR." },
      ],
    },
    organizador: {
      rol: "Quien organiza",
      nombre: "Camila Rivas",
      edad: 29,
      piel: "#C98F65",
      pelo: "#1E1B18",
      corto: "Cobra $25–$50 por stand",
      datos: ["Cobra $25–$50 por stand", "Todo desde el celular"],
      filas: [
        { etiqueta: "Quién es", texto: "Productora independiente de ferias y mercaditos con 20 a 35 marcas." },
        { etiqueta: "Le duele", texto: "El alcance orgánico de Instagram baja y cada expositor pregunta lo mismo por DM." },
        { etiqueta: "Rumbo le da", texto: "Publicar en menos de 3 minutos, check-in por QR y métricas de clics, guardados y asistencia." },
      ],
    },
  },
  notaPerfiles: "Perfiles construidos para esta propuesta",
  lazo: "Más asistentes atraen más organizadores, y más organizadores atraen más asistentes",
  mercado: {
    unidad: "Personas de 21 a 32 años",
    tam: { etiqueta: "TAM", personas: [1_400_000] as number[], dinero: [257_000_000] as number[], donde: "En El Salvador", dineroTxt: "de gasto potencial en salidas al año" },
    sam: { etiqueta: "SAM", personas: [424_000] as number[], dinero: [76_000_000] as number[], donde: "En San Salvador y La Libertad, con acceso a internet", dineroTxt: "de gasto al año" },
    som: { etiqueta: "SOM", personas: [8_500, 21_000] as number[], dinero: [31_000, 76_000] as number[], donde: "Usuarios activos en el primer año: entre 2% y 5% del SAM", dineroTxt: "de ingreso por comisiones" },
    nota: "TAM y SAM son lo que la gente gasta en salidas, no ingreso de Rumbo; el ingreso de Rumbo es solo la comisión (el SOM).",
    fuente: "Fuente: Censo 2024 de El Salvador y ONU World Population Prospects 2024",
  },
};

const D = CLIENTES_MERCADO_DATOS;
const caveat = Caveat({ subsets: ["latin"], weight: "600" });
const C = { crema: "#FAF6EF", noche: "#12303A", turquesa: "#0A7C7C", mostaza: "#F5B82E", terracota: "#E2683F" };

/* ───────────── Formato y cifra animada ───────────── */

const unaCifra = (n: number) => {
  if (n >= 1e6) return `${+(n / 1e6).toFixed(1)} millones`;
  if (n >= 1e3) return `${+(n / 1e3).toFixed(1)} mil`;
  return `${Math.round(n)}`;
};
function fmt(a: number, b: number | undefined, dinero: boolean): string {
  const $ = dinero ? "$" : "";
  if (b == null) return `${$}${unaCifra(a)}`;
  if (a >= 1e3 && b >= 1e3 && b < 1e6) return `${$}${+(a / 1e3).toFixed(1)}–${+(b / 1e3).toFixed(1)} mil`;
  return `${$}${unaCifra(a)} – ${$}${unaCifra(b)}`;
}

function Cifra({ rango, dinero, activa, retraso, className, style }: { rango: number[]; dinero: boolean; activa: boolean; retraso: number; className?: string; style?: React.CSSProperties }) {
  const rm = useReducedMotion();
  const a = useMotionValue(0);
  const b = useMotionValue(0);
  const texto = useTransform([a, b], ([x, y]) => fmt(x as number, rango[1] != null ? (y as number) : undefined, dinero));
  const [min, max] = rango;
  useEffect(() => {
    if (!activa) { a.set(0); b.set(0); return; }
    if (rm) { a.set(min); b.set(max ?? 0); return; }
    const o = { duration: 1.6, delay: retraso, ease: "easeOut" as const };
    const c1 = animate(a, min, o);
    const c2 = animate(b, max ?? 0, o);
    return () => { c1.stop(); c2.stop(); };
  }, [activa, min, max, a, b, rm, retraso]);
  return <motion.p className={`${className ?? ""} tabular-nums leading-none`} style={style}>{texto}</motion.p>;
}

/* ───────────── Perfiles ───────────── */

type Perfil = typeof D.perfiles.asistente;

function Avatar({ piel, pelo, fondo, size = 80 }: { piel: string; pelo: string; fondo: string; size?: number }) {
  return (
    <svg aria-hidden viewBox="0 0 100 100" width={size} height={size} className="shrink-0 rounded-full" style={{ background: fondo }}>
      <path d="M14 100c2-26 18-36 36-36s34 10 36 36z" fill={C.noche} />
      <rect x="43" y="52" width="14" height="14" rx="5" fill={piel} />
      <path d="M28 44c-2-22 12-30 24-30s26 8 22 30c-2 4-4 4-6 0-6-6-22-6-34-2-4 4-6 4-6 2z" fill={pelo} />
      <ellipse cx="50" cy="44" rx="17" ry="19" fill={piel} />
      <path d="M31 40c2-14 14-20 26-18 8 2 12 8 12 18-8-8-24-10-38 0z" fill={pelo} />
      <circle cx="43" cy="46" r="2" fill={C.noche} />
      <circle cx="57" cy="46" r="2" fill={C.noche} />
      <path d="M43 55q7 6 14 0" fill="none" stroke={C.noche} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function TarjetaPerfil({ p, fondo, texto, acento, visible, desde }: { p: Perfil; fondo: string; texto: string; acento: string; visible: boolean; desde: number }) {
  const rm = useReducedMotion();
  return (
    <motion.article initial={false}
      animate={visible ? { opacity: 1, x: 0 } : { opacity: 0, x: rm ? 0 : desde }}
      transition={rm || !visible ? { duration: 0.25 } : { type: "spring", stiffness: 80, damping: 15, delay: 0.15 }}
      className="flex flex-col gap-3 rounded-[28px] px-7 py-6 shadow-2xl shadow-black/20" style={{ background: fondo, color: texto }}>
      <div className="flex items-center gap-5">
        <Avatar piel={p.piel} pelo={p.pelo} fondo={acento + "66"} />
        <div>
          <p className="text-[16px] font-bold uppercase tracking-[0.16em] opacity-85">{p.rol}</p>
          <h2 className="font-display text-[38px] font-bold leading-none">{p.nombre}</h2>
          <p className="mt-1 text-[19px] opacity-80">{p.edad} años</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {p.datos.map((d) => <span key={d} className="rounded-full px-3.5 py-1 text-[17px] font-semibold" style={{ background: texto + "22" }}>{d}</span>)}
      </div>
      <dl className="flex flex-col gap-2.5">
        {p.filas.map((f, i) => (
          <div key={f.etiqueta} className="grid grid-cols-[130px_1fr] items-baseline gap-4 border-t pt-2.5" style={{ borderColor: texto + "33" }}>
            <dt className="flex items-center gap-2 text-[14px] font-bold uppercase tracking-[0.12em] opacity-80">
              {i === 1 && <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: C.terracota }} />}{f.etiqueta}
            </dt>
            <dd className={`text-[20px] leading-[1.28] ${i === 2 ? "font-bold" : ""}`}>{f.texto}</dd>
          </div>
        ))}
      </dl>
    </motion.article>
  );
}

/* Línea con partículas entre los dos lados */
function Lazo({ visible }: { visible: boolean }) {
  const rm = useReducedMotion();
  const x0 = 70, x1 = 830;
  const ida = [0, 1, 2, 3, 4];
  return (
    <motion.div initial={false} animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 20 }} transition={{ duration: 0.5, delay: visible ? 0.2 : 0 }}
      className="flex flex-col items-center gap-2">
      <svg aria-hidden viewBox="0 0 900 64" className="w-[900px]">
        <line x1={x0} x2={x1} y1="32" y2="32" stroke={C.noche} strokeOpacity="0.25" strokeWidth="3" strokeDasharray="2 8" strokeLinecap="round" />
        <circle cx={x0} cy="32" r="22" fill={C.turquesa} />
        <circle cx={x1} cy="32" r="22" fill={C.mostaza} />
        {ida.map((i) => {
          const f = (i + 0.5) / ida.length;
          const dur = 3.2;
          return (
            <g key={i}>
              <motion.circle r="6" cy="24" fill={C.mostaza} initial={false}
                animate={visible && !rm ? { cx: [x0 + 24, x1 - 24], opacity: [0, 1, 1, 0] } : { cx: x0 + 24 + f * (x1 - x0 - 48), opacity: visible ? 1 : 0 }}
                transition={visible && !rm ? { duration: dur, repeat: Infinity, ease: "linear", delay: (i * dur) / ida.length } : { duration: 0.2 }} />
              <motion.circle r="6" cy="40" fill={C.turquesa} initial={false}
                animate={visible && !rm ? { cx: [x1 - 24, x0 + 24], opacity: [0, 1, 1, 0] } : { cx: x1 - 24 - f * (x1 - x0 - 48), opacity: visible ? 1 : 0 }}
                transition={visible && !rm ? { duration: dur, repeat: Infinity, ease: "linear", delay: (i * dur) / ida.length + 0.3 } : { duration: 0.2 }} />
            </g>
          );
        })}
      </svg>
      <p className="max-w-[1100px] text-center font-display text-[32px] font-bold leading-tight">{D.lazo}</p>
    </motion.div>
  );
}

function Perfiles({ p }: { p: number }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-[1fr_84px_1fr] items-center gap-4">
        <TarjetaPerfil p={D.perfiles.asistente} fondo={C.turquesa} texto={C.crema} acento={C.mostaza} visible={p >= 0} desde={-140} />
        <motion.div initial={false} animate={{ opacity: p >= 0 ? 1 : 0, scale: p >= 0 ? 1 : 0.4 }} transition={{ type: "spring", stiffness: 120, damping: 14, delay: p >= 0 ? 0.6 : 0 }}>
          <Brujula size={84} activa={p >= 0} grados={90} />
        </motion.div>
        <TarjetaPerfil p={D.perfiles.organizador} fondo={C.mostaza} texto={C.noche} acento={C.turquesa} visible={p >= 0} desde={140} />
      </div>
      <p className="text-center text-[17px] opacity-70">{D.notaPerfiles}</p>
      <Lazo visible={p === 1} />
    </div>
  );
}

/* ───────────── Mercado ───────────── */

function Compacta({ p, fondo, texto, acento, visible, i }: { p: Perfil; fondo: string; texto: string; acento: string; visible: boolean; i: number }) {
  const rm = useReducedMotion();
  return (
    <motion.div initial={false} animate={visible ? { opacity: 1, x: 0 } : { opacity: 0, x: rm ? 0 : 60 }}
      transition={rm || !visible ? { duration: 0.2 } : { type: "spring", stiffness: 90, damping: 15, delay: 0.1 + i * 0.12 }}
      className="flex items-center gap-4 rounded-[24px] px-5 py-4 shadow-xl shadow-black/15" style={{ background: fondo, color: texto }}>
      <Avatar piel={p.piel} pelo={p.pelo} fondo={acento + "66"} size={64} />
      <div>
        <p className="text-[14px] font-bold uppercase tracking-[0.14em] opacity-85">{p.rol}</p>
        <p className="font-display text-[28px] font-bold leading-none">{p.nombre}</p>
        <p className="mt-1 text-[17px] opacity-85">{p.corto}</p>
      </div>
    </motion.div>
  );
}

const CIRCULOS = [
  { k: "tam" as const, d: 620, fondo: "rgba(10,124,124,0.16)", borde: "rgba(10,124,124,0.5)", texto: C.noche, pers: "text-[50px]", ini: 0.3 },
  { k: "sam" as const, d: 420, fondo: "#0FA3A3", borde: "#0FA3A3", texto: "#fff", pers: "text-[42px]", ini: 1.2 },
  { k: "som" as const, d: 230, fondo: C.mostaza, borde: C.mostaza, texto: C.noche, pers: "text-[28px]", ini: 2.1 },
];

function Mercado({ visible }: { visible: boolean }) {
  const rm = useReducedMotion();
  const M = D.mercado;
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-[400px_1fr] items-center gap-10">
        <div className="flex flex-col gap-5">
          <Compacta p={D.perfiles.asistente} fondo={C.turquesa} texto={C.crema} acento={C.mostaza} visible={visible} i={0} />
          <Compacta p={D.perfiles.organizador} fondo={C.mostaza} texto={C.noche} acento={C.turquesa} visible={visible} i={1} />
        </div>
        <div className="grid grid-cols-[620px_1fr] items-center gap-8">
          <div className="grid" style={{ height: 620 }}>
            {CIRCULOS.map((c) => {
              const n = M[c.k];
              const som = c.k === "som";
              return (
                <motion.div key={c.k} initial={false} aria-label={`${n.etiqueta}: ${fmt(n.personas[0], n.personas[1], false)} personas`}
                  animate={visible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: rm ? 1 : 0.2 }}
                  transition={rm || !visible ? { duration: 0.2 } : { type: "spring", stiffness: 70, damping: 15, delay: c.ini }}
                  className={`flex flex-col items-center gap-1.5 rounded-full border-4 text-center ${som ? "justify-center" : "pt-6"}`}
                  style={{ gridArea: "1 / 1", alignSelf: "end", justifySelf: "center", width: c.d, height: c.d, background: c.fondo, borderColor: c.borde, color: c.texto, transformOrigin: "bottom center" }}>
                  <p className="text-[18px] font-bold uppercase tracking-[0.16em] opacity-85">{n.etiqueta}</p>
                  <Cifra rango={n.personas} dinero={false} activa={visible} retraso={c.ini + 0.3} className={`font-display font-bold ${c.pers}`} />
                  <Cifra rango={n.dinero} dinero activa={visible} retraso={c.ini + 0.3} className="text-[20px] font-semibold opacity-90" />
                </motion.div>
              );
            })}
          </div>
          <div className="flex flex-col gap-4">
            <motion.p initial={false} animate={{ opacity: visible ? 1 : 0 }} transition={{ duration: 0.4, delay: visible ? 0.2 : 0 }}
              className="font-display text-[28px] font-bold leading-tight" style={{ color: C.turquesa }}>{M.unidad}</motion.p>
            {CIRCULOS.map((c) => (
              <motion.div key={c.k} initial={false} animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 16 }} transition={{ duration: 0.4, delay: visible ? c.ini + 0.4 : 0 }}>
                <p className="text-[19px] font-bold leading-tight">{M[c.k].etiqueta}: <span className="font-normal">{M[c.k].donde}</span></p>
                <p className="text-[16px] leading-snug opacity-70">{M[c.k].dineroTxt}</p>
              </motion.div>
            ))}
            <motion.p initial={false} animate={{ opacity: visible ? 1 : 0 }} transition={{ duration: 0.4, delay: visible ? 2.6 : 0 }}
              className="rounded-2xl px-4 py-3 text-[16px] leading-snug" style={{ background: C.noche, color: C.crema }}>{M.nota}</motion.p>
          </div>
        </div>
      </div>
      <p className="text-center text-[16px] opacity-65">{M.fuente}</p>
    </div>
  );
}

export function ClientesMercado({ activa, paso }: { activa: boolean; paso: number }) {
  const rm = useReducedMotion();
  const p = activa ? paso : -1;
  const capa = (on: boolean) => ({ animate: { opacity: on ? 1 : 0 }, transition: { duration: rm ? 0.15 : 0.35, delay: on ? 0.2 : 0 }, style: { gridArea: "1 / 1", pointerEvents: on ? "auto" as const : "none" as const } });
  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: C.crema, color: C.noche }}>
      <div aria-hidden className="absolute -right-40 -top-48 h-[560px] w-[560px] rounded-full blur-3xl" style={{ background: C.turquesa + "1f" }} />
      <motion.div initial={false} animate={{ opacity: p >= 0 ? 1 : 0, y: p >= 0 ? 0 : -30 }} transition={{ duration: 0.5 }}
        className="absolute left-[100px] top-[30px] w-[1400px] text-center">
        <h1 className="font-display text-[62px] font-bold leading-[1.02]">{D.titulo}</h1>
        <p className={`${caveat.className} mt-1 text-[36px] leading-none`} style={{ color: C.terracota }}>{D.subtitulo}</p>
      </motion.div>
      {/* Escenario en flujo normal; debe terminar antes de y = 852 */}
      <div className="absolute left-[80px] top-[150px] grid w-[1440px]">
        <motion.div aria-hidden={p > 1} initial={false} {...capa(p >= 0 && p <= 1)}><Perfiles p={p} /></motion.div>
        <motion.div aria-hidden={p !== 2} initial={false} {...capa(p === 2)}><Mercado visible={p === 2} /></motion.div>
      </div>
    </div>
  );
}
