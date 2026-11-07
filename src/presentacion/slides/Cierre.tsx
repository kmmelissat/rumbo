"use client";
import { Caveat } from "next/font/google";
import { MotionConfig } from "motion/react";
import { Logo } from "@/src/components/Logo";
import { Ondulado } from "@/components/Marca";
import { Entra } from "../componentes/Entra";
import { Brujula } from "../componentes/Brujula";

/** Textos editables de la slide. */
const TITULO = "Encuentra tu";
const LINEA = "Rumbo conecta a los salvadoreños con lo que pasa en su país: aventura, conexión, emprendedurismo y bienestar.";
const PILARES = ["aventura", "conexión", "emprendedurismo", "bienestar"];
/** Rol vacío = no se muestra. */
const EQUIPO: { nombre: string; rol: string }[] = [
  { nombre: "Melissa Torres", rol: "" },
  { nombre: "Lucía Turcios", rol: "" },
  { nombre: "Masciel Fuentes", rol: "" },
];
const QUE_SIGUE = "Seguimos sumando organizadores y experiencias en todo El Salvador.";
const GRACIAS = "gracias";

const caveat = Caveat({ subsets: ["latin"], weight: "600" });
const C = { crema: "#FAF6EF", noche: "#12303A", turquesa: "#0FA3A3", mostaza: "#F5B82E" };

export function Cierre({ activa, paso }: { activa: boolean; paso: number }) {
  const p = activa ? paso : -1;
  return (
    <MotionConfig reducedMotion="user">
      <div className="flex h-full w-full flex-col items-center justify-between px-[100px] pb-12 pt-[90px]" style={{ background: C.crema, color: C.noche }}>
        {/* Paso 1: título, línea y logo */}
        <div className="flex flex-col items-center gap-6 text-center">
          <Entra activa={p >= 0} desde="escala">
            <Logo variant="principal" size={56} />
          </Entra>
          <Entra activa={p >= 0} retraso={0.15}>
            <h1 className="font-display text-[124px] font-bold leading-none">
              {TITULO}{" "}
              <span className="relative inline-block" style={{ color: C.turquesa }}>rumbo<Ondulado color="text-[#0FA3A3]" /></span>
            </h1>
          </Entra>
          <Entra activa={p >= 0} retraso={0.3}>
            <p className="max-w-[1180px] font-sans text-[30px] leading-snug opacity-85">{LINEA}</p>
          </Entra>
        </div>

        {/* Paso 2: pilares */}
        <ul className="flex flex-wrap justify-center gap-4">
          {PILARES.map((n, i) => (
            <li key={n}>
              <Entra activa={p >= 1} retraso={i * 0.1}>
                <span className="inline-block rounded-full border-2 px-6 py-2 font-sans text-[22px] font-bold" style={{ borderColor: C.turquesa, color: C.turquesa }}>{n}</span>
              </Entra>
            </li>
          ))}
        </ul>

        {/* Paso 3: equipo y qué sigue, con la brújula al final de la ruta */}
        <div className="flex w-full items-end justify-between gap-10">
          <div className="flex min-w-0 flex-1 flex-col gap-6">
            <ul className="grid grid-cols-3 gap-5">
              {EQUIPO.map((m, i) => (
                <li key={m.nombre}>
                  <Entra activa={p >= 2} retraso={i * 0.12}>
                    <div className="rounded-2xl bg-white px-6 py-4 text-center shadow-md shadow-black/10">
                      <p className="font-display text-[30px] font-bold leading-tight">{m.nombre}</p>
                      {m.rol && <p className="mt-1 font-sans text-[20px] opacity-75">{m.rol}</p>}
                    </div>
                  </Entra>
                </li>
              ))}
            </ul>
            <Entra activa={p >= 2} retraso={0.45}>
              <p className="flex items-center justify-center gap-3 font-sans text-[24px] font-medium">
                <span aria-hidden className="h-3 w-3 shrink-0 rounded-full" style={{ background: C.mostaza }} />
                {QUE_SIGUE}
              </p>
            </Entra>
          </div>
          <div className="flex shrink-0 flex-col items-center gap-1">
            <Entra activa={p >= 2} retraso={0.6} desde="giro">
              <span className={`${caveat.className} block -rotate-3 text-[40px] leading-none`} style={{ color: C.turquesa }}>{GRACIAS}</span>
            </Entra>
            <Brujula size={150} activa={p >= 2} grados={0} />
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}
