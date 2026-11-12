"use client";
import type { ReactNode } from "react";
import { Caveat } from "next/font/google";
import { motion, useReducedMotion } from "motion/react";
import { Entra } from "../componentes/Entra";

/**
 * Datos editables. El porcentaje no se escribe: se calcula desde el monto y el total.
 * Cambia un monto y la barra y el porcentaje se ajustan solos.
 */
export const PRESUPUESTO_DATOS = {
  titulo: "Dónde ponemos cada dólar",
  subtitulo: "(y por qué en esas plataformas)",
  total: 100,
  etiquetaTotal: "mes 1 · piloto",
  unidadTotal: "al mes",
  fuente: "Fuente: NapoleonCat, usuarios de Instagram en El Salvador, sep 2026",
  filas: [
    {
      id: "impulso",
      concepto: "Impulso a Reels y TikTok",
      etiqueta: "Instagram y TikTok · Adquisición",
      monto: 40,
      porque: "Ahí está nuestro público: Instagram tiene 2.3 millones de usuarios en El Salvador y los de 18 a 34 años son cerca de dos tercios. El video corto es el formato de \"3 rumbos para este finde\".",
    },
    {
      id: "captacion",
      concepto: "Captación de organizadores",
      etiqueta: "Contacto directo · Ingresos",
      monto: 25,
      porque: "Cada organizador trae su propia audiencia, y de ahí salen los eventos destacados de $30.",
    },
    {
      id: "banners",
      concepto: "Banners QR en mercaditos",
      etiqueta: "Mercaditos · Activación",
      monto: 15,
      porque: "Llegamos a la gente donde ya está en un plan, y el QR lleva a la web móvil sin descargar nada.",
    },
    {
      id: "whatsapp",
      concepto: "Herramientas de WhatsApp",
      etiqueta: "WhatsApp · Retención y referidos",
      monto: 10,
      porque: "Es donde ya se coordinan los planes entre amigos; ahí recordamos y compartimos.",
    },
    {
      id: "experimentos",
      concepto: "Experimentos y contingencias",
      etiqueta: "Todas las etapas",
      monto: 10,
      porque: "Para probar un cambio a la vez y corregir rápido.",
    },
  ],
};

const caveat = Caveat({ subsets: ["latin"], weight: "600" });
const C = { crema: "#FAF6EF", noche: "#12303A", turquesa: "#0A7C7C", mostaza: "#F5B82E" };
const D = PRESUPUESTO_DATOS;
const pct = (monto: number) => Math.round((monto / D.total) * 100);

/* Íconos propios de la slide (trazo, sin marcas reales), uno por etapa. */
const ICONOS: Record<string, ReactNode> = {
  impulso: <><rect x="6" y="9" width="36" height="30" rx="6" /><path d="M20 17 L33 24 L20 31 Z" /></>,
  captacion: <><circle cx="19" cy="16" r="7" /><path d="M6 40 a13 13 0 0 1 26 0" /><path d="M37 16 V28 M31 22 H43" /></>,
  banners: <><rect x="7" y="7" width="14" height="14" rx="2" /><rect x="27" y="7" width="14" height="14" rx="2" /><rect x="7" y="27" width="14" height="14" rx="2" /><path d="M27 27 H33 V33 M41 27 V41 H27 V37" /></>,
  whatsapp: <><path d="M8 10 H40 V32 H22 L13 40 V32 H8 Z" /><path d="M16 18 H32 M16 24 H27" /></>,
  experimentos: <><path d="M19 6 H29 M21 6 V19 L9 39 a3 3 0 0 0 3 4 H36 a3 3 0 0 0 3 -4 L27 19 V6" /><path d="M15 31 H33" /></>,
};
const Icono = ({ id }: { id: string }) => (
  <svg aria-hidden viewBox="0 0 48 48" width={40} height={40} fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">{ICONOS[id]}</svg>
);

function Barra({ llena, mostaza, retraso, porcentaje }: { llena: boolean; mostaza: boolean; retraso: number; porcentaje: number }) {
  const rm = useReducedMotion();
  return (
    <div className="h-[14px] w-full overflow-hidden rounded-full" style={{ background: C.noche + "14" }}>
      <motion.div
        initial={false}
        className="h-full origin-left rounded-full"
        style={{ width: `${porcentaje}%`, background: mostaza ? C.mostaza : C.turquesa }}
        animate={{ scaleX: llena ? 1 : 0 }}
        transition={rm ? { duration: 0.2 } : { duration: 0.9, ease: "easeOut", delay: llena ? 0.55 + retraso : 0 }}
      />
    </div>
  );
}

export function Presupuesto({ activa, paso }: { activa: boolean; paso: number }) {
  const rm = useReducedMotion();
  const p = activa ? paso : -1;
  // Paso 0: el encabezado ocupa el centro; desde el paso 1 sube y deja sitio a las filas.
  const subeA = p === 0 ? 250 : 0;

  return (
    <div className="flex h-full w-full flex-col px-[80px] pb-[48px] pt-[64px]" style={{ background: C.crema, color: C.noche }}>
      <motion.div
        initial={false}
        animate={{ y: subeA }}
        transition={rm ? { duration: 0.2 } : { type: "spring", stiffness: 70, damping: 16 }}
        className="flex shrink-0 items-end justify-between gap-10"
      >
        <div>
          <Entra activa={p >= 0} desde="arriba">
            <h1 className="font-display text-[60px] font-bold leading-[1.05]">{D.titulo}</h1>
          </Entra>
          <Entra activa={p >= 0} retraso={0.15} desde="arriba">
            <p className={`${caveat.className} mt-1 text-[40px] leading-none`} style={{ color: C.turquesa }}>{D.subtitulo}</p>
          </Entra>
        </div>
        <Entra activa={p >= 0} retraso={0.3} desde="escala" className="text-right">
          <p className="font-display text-[112px] font-bold leading-none">
            ${D.total}<span className="ml-3 text-[40px] font-semibold">{D.unidadTotal}</span>
          </p>
          <p className="mt-2 text-[22px] font-bold uppercase tracking-[0.12em]" style={{ color: C.turquesa }}>{D.etiquetaTotal}</p>
        </Entra>
      </motion.div>

      <ul className="mt-6 flex min-h-0 flex-1 flex-col gap-[10px]" aria-hidden={p < 1}>
        {D.filas.map((f, i) => {
          const ingresos = f.id === "captacion";
          const mostrar = p >= 1;
          return (
            <li key={f.id} className="flex min-h-0 flex-1">
              <Entra activa={mostrar} retraso={i * 0.12} className="flex w-full">
                <div className="grid w-full grid-cols-[64px_345px_240px_1fr] items-center gap-6 rounded-[22px] border-2 bg-white px-5 py-2" style={{ borderColor: C.noche + "14" }}>
                  <span className="flex h-[64px] w-[64px] items-center justify-center rounded-2xl" style={{ background: (ingresos ? C.mostaza : C.turquesa) + (ingresos ? "40" : "1f"), color: C.noche }}>
                    <Icono id={f.id} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[15px] font-bold uppercase tracking-[0.05em]" style={{ color: ingresos ? "#8A6300" : C.turquesa }}>{f.etiqueta}</p>
                    <p className="text-[24px] font-bold leading-[1.15]">{f.concepto}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="flex items-baseline justify-between">
                      <span className="font-display text-[42px] font-bold leading-none">${f.monto}</span>
                      <span className="text-[22px] font-bold opacity-70">{pct(f.monto)}%</span>
                    </p>
                    <div className="mt-2"><Barra llena={mostrar} mostaza={ingresos} retraso={i * 0.12} porcentaje={pct(f.monto)} /></div>
                  </div>
                  <Entra activa={p >= 2} retraso={i * 0.12} desde="der" className="min-w-0">
                    <p className="text-[19px] leading-[1.3]">{f.porque}</p>
                  </Entra>
                </div>
              </Entra>
            </li>
          );
        })}
      </ul>

      <Entra activa={p >= 2} retraso={0.7} className="mt-3 shrink-0">
        <p className="text-[17px] opacity-70">{D.fuente}</p>
      </Entra>
    </div>
  );
}
