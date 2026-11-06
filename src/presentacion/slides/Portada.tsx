"use client";
import { motion } from "motion/react";
import { Foto } from "@/components/Foto";
import { ChipCategoria, Ondulado } from "@/components/Marca";
import { EVENTOS, formatPrecio, type Evento } from "@/lib/data";
import { Entra } from "../componentes/Entra";

/** Wordmark animado: las letras rebotan y la "o" es una brújula que busca el norte. */
function LogoVivo({ activa }: { activa: boolean }) {
  const letras = ["R", "u", "m", "b"];
  const colores = ["text-tinta", "text-marca", "text-tinta", "text-oceano"];
  return (
    <div className="relative inline-flex items-center font-display text-[64px] font-bold leading-none tracking-tight">
      {letras.map((l, i) => (
        <motion.span
          key={l}
          className={`inline-block ${colores[i]}`}
          initial={false}
          animate={activa ? { y: [40, -12, 0], rotate: [-12, 5, i % 2 ? -3 : 3], opacity: 1 } : { y: 40, opacity: 0 }}
          transition={{ duration: 0.7, delay: 0.5 + i * 0.09, ease: "easeOut" }}
        >
          {l}
        </motion.span>
      ))}
      <motion.span
        className="relative ml-1 inline-block h-[54px] w-[54px] rounded-full bg-coral shadow-lg shadow-black/20"
        initial={false}
        animate={activa ? { scale: [0, 1.25, 1], rotate: [-90, 0] } : { scale: 0 }}
        transition={{ duration: 0.7, delay: 0.9 }}
      >
        <motion.svg viewBox="0 0 100 100" className="absolute inset-0" animate={activa ? { rotate: [0, 200, 40, 70, 55] } : {}} transition={{ duration: 3, delay: 1.5, ease: "easeInOut" }}>
          <path d="M50 14 L62 50 L50 46 L38 50 Z" fill="#fff" />
          <path d="M50 86 L62 50 L50 54 L38 50 Z" fill="#111827" opacity=".35" />
          <circle cx="50" cy="50" r="5" fill="#111827" />
        </motion.svg>
      </motion.span>
      <motion.svg
        viewBox="0 0 40 40" className="absolute -right-9 -top-5 h-8 w-8 text-lima"
        initial={false}
        animate={activa ? { scale: [0, 1.3, 1], rotate: [0, 90] } : { scale: 0 }}
        transition={{ duration: 0.6, delay: 1.4 }}
      >
        <path d="M20 2 L24 16 L38 20 L24 24 L20 38 L16 24 L2 20 L16 16 Z" fill="currentColor" />
      </motion.svg>
    </div>
  );
}

function Plan({ e }: { e: Evento }) {
  return (
    <div className="w-[210px] shrink-0 rounded-[24px] bg-white p-2.5 shadow-xl shadow-black/15">
      <Foto src={e.foto} alt={e.titulo} sizes="210px" className="h-[140px] w-full rounded-[16px]" />
      <div className="space-y-1.5 px-1 pb-1 pt-2.5">
        <ChipCategoria categoria={e.categoria} />
        <p className="line-clamp-2 font-display text-[17px] font-bold leading-tight text-tinta">{e.titulo}</p>
        <p className="text-[14px] font-bold text-marca2">{formatPrecio(e.precio)}</p>
      </div>
    </div>
  );
}

/** Columna de planes que sube sin parar. */
function Columna({ lista, activa, duracion, sube, className }: { lista: Evento[]; activa: boolean; duracion: number; sube: boolean; className: string }) {
  const doble = [...lista, ...lista];
  return (
    <motion.div
      className={`absolute flex flex-col gap-5 ${className}`}
      animate={activa ? { y: sube ? ["0%", "-50%"] : ["-50%", "0%"] } : { y: "0%" }}
      transition={{ duration: duracion, repeat: Infinity, ease: "linear" }}
    >
      {doble.map((e, i) => <Plan key={`${e.id}-${i}`} e={e} />)}
    </motion.div>
  );
}

export function Portada({ activa }: { activa: boolean }) {
  const [a, b, c, d, e, f, g, h] = EVENTOS;
  return (
    <div className="relative h-full w-full overflow-hidden">
      <div aria-hidden className="absolute -right-32 -top-40 h-[700px] w-[700px] rounded-full bg-marca/20 blur-3xl" />
      <div aria-hidden className="absolute -bottom-48 left-[120px] h-[520px] w-[520px] rounded-full bg-coral/25 blur-3xl" />

      {/* Planes en movimiento */}
      <Entra activa={activa} retraso={0.2} desde="der" className="absolute right-0 top-0 h-full w-[820px]">
        <div className="h-full w-full" style={{ maskImage: "linear-gradient(to bottom, transparent, black 14%, black 86%, transparent)", WebkitMaskImage: "linear-gradient(to bottom, transparent, black 14%, black 86%, transparent)" }}>
          <div className="h-full w-full" style={{ maskImage: "linear-gradient(to right, transparent, black 30%)", WebkitMaskImage: "linear-gradient(to right, transparent, black 30%)" }}>
            <div className="absolute inset-0 origin-center rotate-[-9deg] scale-105">
              <Columna lista={[a, c, e, g]} activa={activa} duracion={38} sube className="right-[500px] top-0" />
              <Columna lista={[b, d, f, h]} activa={activa} duracion={46} sube={false} className="right-[260px] top-0" />
              <Columna lista={[e, a, h, d]} activa={activa} duracion={42} sube className="right-[20px] top-0" />
            </div>
          </div>
        </div>
      </Entra>

      {/* Texto */}
      <div className="absolute left-[110px] top-[110px] flex h-[680px] w-[720px] flex-col justify-between">
        <Entra activa={activa} retraso={0.1}>
          <LogoVivo activa={activa} />
        </Entra>

        <div>
          <Entra activa={activa} retraso={0.4} desde="izq">
            <h1 className="font-display text-[76px] font-bold leading-[0.96] text-tinta">
              Tu fin de
              <br />
              semana, <span className="relative inline-block text-marca">resuelto<Ondulado color="text-coral" /></span>
            </h1>
          </Entra>
          <Entra activa={activa} retraso={0.7} className="mt-12">
            <p className="max-w-[560px] text-[32px] leading-snug text-tinta/75">Todo lo que pasa en El Salvador, en un solo lugar</p>
          </Entra>
          <Entra activa={activa} retraso={1} rot={-4} className="mt-8 inline-block">
            <span className="inline-block rounded-2xl border-[7px] border-white bg-lima px-6 py-2 text-[34px] font-bold text-tinta shadow-xl shadow-black/20">¡ya hay plan!</span>
          </Entra>
        </div>

        <Entra activa={activa} retraso={1.2}>
          <p className="text-[24px] font-bold text-tinta">Karla Melissa Torres · Lucía Turcios · Masciel Fuentes</p>
          <p className="mt-1 text-[22px] text-tinta/60">Plan de negocio · ESEN</p>
        </Entra>
      </div>
    </div>
  );
}
