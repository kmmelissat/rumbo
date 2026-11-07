"use client";
import { type ReactNode } from "react";
import { Caveat } from "next/font/google";
import { motion, useReducedMotion } from "motion/react";
import { Logo, LogoIcon } from "@/src/components/Logo";

/** Textos editables de la slide. */
const MARCA_DATOS = {
  titulo: "Encuentra tu rumbo",
  subtitulo: "(la marca, en 5 detalles)",
  idea: "Rumbo es la brújula del fin de semana: no buscas planes, los descubres.",
  personalidad: ["aventurera", "juvenil", "cercana", "juguetona", "confiable al pagar"],
  noEs: ["corporativa", "una ticketera fría", "ni un collage caótico"],
  paleta: [
    { nombre: "Azul noche", hex: "#12303A" },
    { nombre: "Turquesa profundo", hex: "#0A7C7C" },
    { nombre: "Turquesa Rumbo", hex: "#0FA3A3" },
    { nombre: "Crema", hex: "#FAF6EF" },
    { nombre: "Mostaza", hex: "#F5B82E" },
    { nombre: "Verde bosque", hex: "#1E5E45" },
    { nombre: "Coral", hex: "#F28F6B" },
    { nombre: "Lima", hex: "#C5E063" },
    { nombre: "Terracota", hex: "#E2683F", nota: "solo acento" },
  ],
  notaPaleta: "El naranja nunca es el color principal",
  tipografias: [
    { nombre: "Fraunces", uso: "Títulos: cálida y con carácter", muestra: "Aparta tu lugar", clase: "font-display font-bold" },
    { nombre: "DM Sans", uso: "Interfaz y texto", muestra: "Quedan 12 entradas", clase: "font-sans font-medium" },
    { nombre: "Caveat", uso: "Toque a mano: solo en stickers y notas, nunca en botones ni precios", muestra: "este finde, a rumbear", clase: "caveat" },
  ],
  voz: "Tuteo neutral, amigable, directo y con humor ligero. Lo local viene del contenido, no de jerga forzada.",
  frases: ["Encuentra tu rumbo", "Aparta tu lugar", "Quedan 12 entradas", "Tu plan del sábado ya está listo"],
  palabras: ["rumbo", "rumbear", "finde", "plan", "apartar", "descubrir"],
  cinta: "Todo es local: el contexto de los 4 pilares",
  pilares: [
    { id: "aventura", nombre: "Aventura", frase: "Planes distintos para descubrir.", color: "#0A7C7C", texto: "#FFFFFF" },
    { id: "conexion", nombre: "Conexión", frase: "Ir acompañado, conocer gente, comunidad.", color: "#F28F6B", texto: "#12303A" },
    { id: "emprendedurismo", nombre: "Emprendedurismo", frase: "Apoyar a quienes crean lo local.", color: "#F5B82E", texto: "#12303A" },
    { id: "bienestar", nombre: "Bienestar", frase: "Planes para desconectar y cuidarte.", color: "#1E5E45", texto: "#FFFFFF" },
  ],
  cierre: "Y así se ve en la app",
};

const caveat = Caveat({ subsets: ["latin"], weight: "600" });
const C = { crema: "#FAF6EF", noche: "#12303A", turquesa: "#0A7C7C", mostaza: "#F5B82E", coral: "#F28F6B", lima: "#C5E063", bosque: "#1E5E45", terracota: "#E2683F" };

const t = { fill: "none", stroke: "currentColor", strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round" } as const;
const ICONOS: Record<string, ReactNode> = {
  aventura: <g {...t}><circle cx="24" cy="24" r="17" /><path d="M31 17l-5 10-10 5 5-10z" /></g>,
  conexion: <g {...t}><circle cx="17" cy="17" r="6" /><circle cx="33" cy="19" r="5" /><path d="M5 38c0-7 5-11 12-11s12 4 12 11M31 28c6 0 12 3 12 10" /></g>,
  emprendedurismo: <g {...t}><path d="M6 20l4-12h28l4 12" /><path d="M6 20a6 6 0 0 0 12 0 6 6 0 0 0 12 0 6 6 0 0 0 12 0" /><path d="M10 25v15h28V25M20 40V31h8v9" /></g>,
  bienestar: <g {...t}><path d="M24 40C10 31 7 21 12 15c4-4 10-3 12 2 2-5 8-6 12-2 5 6 2 16-12 25z" /></g>,
};
const Icono = ({ n, size = 64 }: { n: string; size?: number }) => <svg aria-hidden viewBox="0 0 48 48" width={size} height={size}>{ICONOS[n]}</svg>;

const Chispa = ({ size, color }: { size: number; color: string }) => (
  <svg aria-hidden viewBox="60 12 28 28" width={size} height={size}><path d="M74 16 L76.8 23.2 L84 26 L76.8 28.8 L74 36 L71.2 28.8 L64 26 L71.2 23.2 Z" fill={color} /></svg>
);

/** Entrada suave; con movimiento reducido solo hace fundido. */
function useEntrada(visible: boolean, i = 0, base = 0.2) {
  const rm = useReducedMotion();
  return {
    initial: false as const,
    animate: visible ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: rm ? 0 : 30, scale: rm ? 1 : 0.94 },
    transition: rm || !visible ? { duration: 0.2 } : { type: "spring" as const, stiffness: 90, damping: 15, delay: base + i * 0.12 },
  };
}
function Item({ visible, i = 0, className, style, children }: { visible: boolean; i?: number; className?: string; style?: React.CSSProperties; children: ReactNode }) {
  const e = useEntrada(visible, i);
  return <motion.div {...e} className={className} style={style}>{children}</motion.div>;
}

/* ───── Paso 1: logo ───── */
function PasoLogo({ visible }: { visible: boolean }) {
  const rm = useReducedMotion();
  const vars = [
    { n: "Principal", bg: "#FFFFFF", logo: <Logo variant="principal" size={52} /> },
    { n: "Invertida", bg: C.turquesa, logo: <Logo variant="invertida" size={52} /> },
    { n: "Mono", bg: C.mostaza, logo: <Logo variant="mono" size={52} color={C.noche} /> },
  ];
  return (
    <div className="flex flex-col items-center gap-9">
      <motion.div initial={false} animate={visible ? { opacity: 1, rotate: 0, scale: 1 } : { opacity: 0, rotate: rm ? 0 : -14, scale: rm ? 1 : 0.8 }}
        transition={rm ? { duration: 0.2 } : { type: "spring", stiffness: 70, damping: 12, delay: 0.2 }} className="flex items-center gap-6">
        <Logo variant="principal" size={170} />
        <motion.span initial={false} animate={visible && !rm ? { rotate: 360 } : { rotate: 0 }}
          transition={visible && !rm ? { duration: 2.4, ease: "easeInOut", delay: 0.5 } : { duration: 0 }}><Chispa size={56} color={C.mostaza} /></motion.span>
      </motion.div>
      <div className="grid grid-cols-3 gap-8">
        {vars.map((v, i) => (
          <Item key={v.n} visible={visible} i={i + 3} className="flex flex-col items-center gap-3">
            <div className="flex h-[130px] w-[340px] items-center justify-center rounded-[24px] shadow-lg shadow-black/10" style={{ background: v.bg }}>{v.logo}</div>
            <p className="text-[18px] font-bold uppercase tracking-[0.14em]">{v.n}</p>
          </Item>
        ))}
      </div>
    </div>
  );
}

/* ───── Paso 2: personalidad ───── */
const STICKERS = [
  { bg: C.mostaza, fg: C.noche, r: -4 }, { bg: C.coral, fg: C.noche, r: 3 }, { bg: C.turquesa, fg: "#fff", r: -2 },
  { bg: C.lima, fg: C.noche, r: 4 }, { bg: C.bosque, fg: "#fff", r: -3 },
];
function PasoPersonalidad({ visible }: { visible: boolean }) {
  return (
    <div className="flex flex-col items-center gap-10">
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-6">
        {MARCA_DATOS.personalidad.map((w, i) => (
          <Item key={w} visible={visible} i={i} style={{ rotate: `${STICKERS[i].r}deg` }}>
            <span className="inline-block rounded-full border-4 border-white px-8 py-4 font-display text-[44px] font-bold leading-none shadow-lg shadow-black/15"
              style={{ background: STICKERS[i].bg, color: STICKERS[i].fg }}>{w}</span>
          </Item>
        ))}
      </div>
      <div className="flex flex-col items-center gap-4">
        <p className={`${caveat.className} text-[40px] leading-none`} style={{ color: C.terracota }}>Lo que no es</p>
        <div className="flex flex-wrap justify-center gap-8">
          {MARCA_DATOS.noEs.map((w, i) => (
            <Item key={w} visible={visible} i={i + 6}>
              <span className="relative inline-block px-2 font-display text-[34px] font-semibold leading-tight opacity-70">
                {w}
                <svg aria-hidden viewBox="0 0 200 12" preserveAspectRatio="none" className="absolute left-0 top-1/2 h-3 w-full -translate-y-1/2"><path d="M2 7 Q50 1 100 6 T198 5" fill="none" stroke={C.terracota} strokeWidth="4" strokeLinecap="round" /></svg>
              </span>
            </Item>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ───── Paso 3: paleta en abanico ───── */
function PasoPaleta({ visible }: { visible: boolean }) {
  const rm = useReducedMotion();
  const n = MARCA_DATOS.paleta.length;
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="grid w-full grid-cols-9 gap-2">
        {MARCA_DATOS.paleta.map((c, i) => {
          const centro = i - (n - 1) / 2;
          return (
            <motion.div key={c.hex} initial={false}
              animate={visible ? { opacity: 1, rotate: 0, x: 0, y: 0 } : { opacity: 0, rotate: rm ? 0 : centro * 9, x: rm ? 0 : -centro * 120, y: rm ? 0 : 40 }}
              transition={rm || !visible ? { duration: 0.2 } : { type: "spring", stiffness: 60, damping: 13, delay: 0.2 + i * 0.07 }}
              style={{ transformOrigin: "50% 100%" }} className="flex flex-col items-center gap-3 text-center">
              <span className="block h-[120px] w-[120px] rounded-full border-4 border-white shadow-lg shadow-black/20" style={{ background: c.hex, width: c.nota ? 84 : 120, height: c.nota ? 84 : 120, marginTop: c.nota ? 18 : 0, marginBottom: c.nota ? 18 : 0 }} />
              <p className="text-[19px] font-bold leading-tight">{c.nombre}</p>
              <p className="text-[17px] tabular-nums opacity-70">{c.hex}{c.nota ? <><br />{c.nota}</> : null}</p>
            </motion.div>
          );
        })}
      </div>
      <Item visible={visible} i={10}>
        <p className="rounded-full px-8 py-3 font-display text-[30px] font-semibold" style={{ background: C.noche, color: C.crema }}>{MARCA_DATOS.notaPaleta}</p>
      </Item>
    </div>
  );
}

/* ───── Paso 4: tipografía ───── */
function PasoTipografia({ visible }: { visible: boolean }) {
  return (
    <div className="grid grid-cols-3 gap-8">
      {MARCA_DATOS.tipografias.map((f, i) => (
        <Item key={f.nombre} visible={visible} i={i * 2} className="flex flex-col gap-4 rounded-[28px] bg-white px-8 py-8 shadow-xl shadow-black/10">
          <p className="text-[18px] font-bold uppercase tracking-[0.14em]" style={{ color: C.turquesa }}>{f.nombre}</p>
          <p className={`${f.clase === "caveat" ? caveat.className : f.clase} min-h-[130px] text-[56px] leading-[1.05]`} style={f.clase === "caveat" ? { color: C.terracota } : undefined}>{f.muestra}</p>
          <p className="border-t-2 pt-4 text-[22px] leading-snug" style={{ borderColor: C.noche + "22" }}>{f.uso}</p>
        </Item>
      ))}
    </div>
  );
}

/* ───── Paso 5: voz ───── */
function PasoVoz({ visible }: { visible: boolean }) {
  return (
    <div className="grid grid-cols-[1fr_1fr] items-start gap-14">
      <div className="flex flex-col gap-4">
        {MARCA_DATOS.frases.map((f, i) => (
          <Item key={f} visible={visible} i={i} className={i % 2 ? "self-end" : "self-start"}>
            <p className="rounded-[26px] px-7 py-4 text-[32px] font-medium leading-snug shadow-md shadow-black/10"
              style={i % 2 ? { background: C.turquesa, color: "#fff", borderBottomRightRadius: 6 } : { background: "#fff", borderBottomLeftRadius: 6 }}>{f}</p>
          </Item>
        ))}
      </div>
      <div className="flex flex-col gap-8">
        <Item visible={visible} i={4}><p className="font-display text-[36px] font-semibold leading-snug">{MARCA_DATOS.voz}</p></Item>
        <Item visible={visible} i={5} className="flex flex-wrap gap-3">
          {MARCA_DATOS.palabras.map((w, i) => (
            <span key={w} className="rounded-full px-5 py-2 text-[26px] font-bold" style={{ background: [C.mostaza, C.lima, C.coral][i % 3], color: C.noche }}>{w}</span>
          ))}
        </Item>
      </div>
    </div>
  );
}

/* ───── Paso 6: pilares ───── */
function PasoPilares({ visible }: { visible: boolean }) {
  return (
    <div className="flex flex-col gap-7">
      <Item visible={visible} i={0}>
        <p className="rounded-full border-4 border-dashed px-8 py-3 text-center font-display text-[30px] font-bold" style={{ borderColor: C.terracota, color: C.noche, background: C.lima + "55" }}>{MARCA_DATOS.cinta}</p>
      </Item>
      <div className="grid grid-cols-4 gap-6">
        {MARCA_DATOS.pilares.map((p, i) => (
          <Item key={p.id} visible={visible} i={i + 2} className="flex min-h-[390px] flex-col gap-5 rounded-[30px] px-7 py-8 shadow-xl shadow-black/15" style={{ background: p.color, color: p.texto }}>
            <span className="flex h-[96px] w-[96px] items-center justify-center rounded-3xl" style={{ background: p.texto + "22" }}><Icono n={p.id} size={64} /></span>
            <h3 className="font-display text-[38px] font-bold leading-none">{p.nombre}</h3>
            <p className="text-[27px] leading-snug">{p.frase}</p>
          </Item>
        ))}
      </div>
    </div>
  );
}

/* ───── Paso 7: la app ───── */
function PasoApp({ visible, cargar }: { visible: boolean; cargar: boolean }) {
  return (
    <div className="flex items-center justify-center gap-20">
      <Item visible={visible} i={0} className="flex flex-col gap-6">
        <LogoIcon size={96} />
        <p className="font-display text-[68px] font-bold leading-[1.05]">{MARCA_DATOS.cierre}</p>
      </Item>
      <Item visible={visible} i={2}>
        <div className="flex h-[640px] w-[320px] flex-col overflow-hidden rounded-[44px] border-[10px] bg-white shadow-2xl shadow-black/30" style={{ borderColor: C.noche }}>
          {cargar && <iframe title="App de Rumbo con la marca aplicada" src="/prototipo?embed=1" className="block h-full w-full border-0" />}
        </div>
      </Item>
    </div>
  );
}

/* ───── Slide ───── */
export function Branding({ activa, paso }: { activa: boolean; paso: number }) {
  const rm = useReducedMotion();
  const p = activa ? paso : -1;
  const titulo = p === 0 ? { opacity: 1, x: 0, y: 280, scale: 1 } : p > 0 ? { opacity: 1, x: -565, y: 80, scale: 0.5 } : { opacity: 0, x: 0, y: 300, scale: 0.5 };
  const capa = (on: boolean) => ({ animate: { opacity: on ? 1 : 0 }, transition: { duration: rm ? 0.15 : 0.35, delay: on ? 0.15 : 0 }, style: { gridArea: "1 / 1", pointerEvents: on ? "auto" as const : "none" as const } });
  const pasos = [PasoLogo, PasoPersonalidad, PasoPaleta, PasoTipografia, PasoVoz, PasoPilares];

  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: C.crema, color: C.noche }}>
      <div aria-hidden className="absolute -right-32 -top-40 h-[520px] w-[520px] rounded-full blur-3xl" style={{ background: C.mostaza + "33" }} />
      <div aria-hidden className="absolute -bottom-48 -left-32 h-[480px] w-[480px] rounded-full blur-3xl" style={{ background: C.turquesa + "22" }} />

      <motion.div initial={false} animate={titulo} transition={rm ? { duration: 0.2 } : { type: "spring", stiffness: 70, damping: 16 }}
        className="absolute left-[100px] top-0 w-[1400px] origin-top text-center" style={{ zIndex: 20 }}>
        <h1 className="font-display text-[88px] font-bold leading-[1.02]">{MARCA_DATOS.titulo}</h1>
        <p className={`${caveat.className} mt-6 text-[44px]`} style={{ color: C.terracota }}>{MARCA_DATOS.subtitulo}</p>
        <p className="mt-6 text-[26px] opacity-80" style={{ opacity: p === 0 ? 0.8 : 0 }}>{MARCA_DATOS.idea}</p>
      </motion.div>

      {/* Escenario en una sola celda de grid; termina antes de y = 850 (48 px libres abajo) */}
      <div className="absolute left-[80px] top-[170px] grid w-[1440px]">
        {pasos.map((Paso, i) => (
          <motion.div key={i} aria-hidden={p !== i + 1} initial={false} {...capa(p === i + 1)}><Paso visible={p === i + 1} /></motion.div>
        ))}
        <motion.div aria-hidden={p !== 7} initial={false} {...capa(p === 7)}><PasoApp visible={p === 7} cargar={p >= 6} /></motion.div>
      </div>
    </div>
  );
}
