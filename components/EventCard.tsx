"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "motion/react";
import { Foto } from "./Foto";
import { IconCorazon, IconPin } from "./Icons";
import { ChipCategoria, PestanaFecha, Sticker } from "./Marca";
import { distancia, formatPrecio, stickerDe, type Evento } from "@/lib/data";
import { useStore } from "@/lib/store";
import { haptico } from "@/lib/haptico";
import { navegarConFoto } from "@/lib/transicion";

const RAFAGA = [0, 60, 120, 180, 240, 300];

/** Corazón con rebote, ráfaga de chispas y vibración suave. */
export function Corazon({ id, className = "" }: { id: string; className?: string }) {
  const { guardados, toggleGuardado } = useStore();
  const on = guardados.includes(id);
  const [rafaga, setRafaga] = useState(0);
  return (
    <button onClick={() => { toggleGuardado(id); haptico(on ? 6 : 14); if (!on) setRafaga((k) => k + 1); }} aria-pressed={on}
      aria-label={on ? "Quitar de guardados" : "Guardar evento"} className={`absolute flex h-11 w-11 items-center justify-center ${className}`}>
      <motion.span key={`${on}`} initial={{ scale: on ? 0.6 : 1 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 12 }}
        className="relative flex h-8 w-8 items-center justify-center rounded-full bg-sup/90 text-tinta shadow-suave backdrop-blur-md">
        <IconCorazon width={18} height={18} className={on ? "fill-coral text-coral" : ""} />
        {rafaga > 0 && on && RAFAGA.map((a) => (
          <motion.i key={`${rafaga}-${a}`} aria-hidden className="pointer-events-none absolute h-1.5 w-1.5 rounded-full bg-coral"
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: Math.cos((a * Math.PI) / 180) * 20, y: Math.sin((a * Math.PI) / 180) * 20, opacity: 0, scale: 0.3 }}
            transition={{ duration: 0.5, ease: "easeOut" }} />
        ))}
      </motion.span>
    </button>
  );
}

/** Foto con pestaña de fecha y un solo sticker. */
function FotoEvento({ e, sizes, className, degradado = false }: { e: Evento; sizes: string; className: string; degradado?: boolean }) {
  const s = stickerDe(e);
  return (
    <div className="relative rounded-3xl" data-foto>
      <Foto src={e.foto} sizes={sizes} degradado={degradado} className={`${className} rounded-3xl shadow-suave`} />
      <span className="absolute left-3 top-3"><PestanaFecha e={e} /></span>
      {s && <span className="absolute -bottom-1 left-2"><Sticker tipo={s} id={e.id} /></span>}
    </div>
  );
}

/** Chips de contexto: distancia desde tu zona y pilar. */
function Contexto({ e, pilar = true }: { e: Evento; pilar?: boolean }) {
  const { zona } = useStore();
  const d = distancia(zona, e.zona);
  const km = Math.round(d * 111);
  const chip = "inline-flex items-center gap-1 rounded-md bg-fondo px-1.5 py-0.5 text-xs font-bold text-gris";
  return (
    <>
      <span className={chip}><IconPin width={12} height={12} />{km < 3 ? "En tu zona" : `a ${km} km`}</span>
      {pilar && <span className={chip}>{e.pilar}</span>}
    </>
  );
}

/** El precio solo se escribe si no hay sticker "Gratis" que ya lo diga. */
function Precio({ e }: { e: Evento }) {
  if (e.precio === 0) return stickerDe(e) === "Gratis" ? null : <p className="pt-0.5 text-sm font-bold text-marca2">Entrada libre</p>;
  return <p className="pt-0.5 text-base font-bold">{formatPrecio(e.precio)}</p>;
}

const entrada = (i: number) => ({
  initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 },
  transition: { type: "spring" as const, stiffness: 260, damping: 26, delay: Math.min(i, 6) * 0.06 },
});

function useIr(e: Evento) {
  const router = useRouter();
  const href = `/prototipo/evento/${e.id}`;
  return { href, onClick: (ev: React.MouseEvent<HTMLAnchorElement>) => navegarConFoto(ev, router.push, href, e.id) };
}

/** Tarjeta vertical para carruseles. */
export function TarjetaEvento({ e, i = 0 }: { e: Evento; i?: number }) {
  const ir = useIr(e);
  return (
    <motion.article {...entrada(i)} whileTap={{ scale: 0.97 }} className="relative w-[256px] shrink-0 snap-start">
      <Link {...ir} className="block">
        <FotoEvento e={e} sizes="256px" className="h-[176px] w-full" />
        <div className="space-y-1.5 pt-3">
          <div className="flex flex-wrap gap-1.5"><ChipCategoria categoria={e.categoria} /><Contexto e={e} /></div>
          <h3 className="line-clamp-2 text-[18px] leading-snug">{e.titulo}</h3>
          <p className="truncate text-sm text-gris">{e.hora} · {e.lugar}, {e.zona}</p>
          <Precio e={e} />
        </div>
      </Link>
      <Corazon id={e.id} className="right-0.5 top-0.5" />
    </motion.article>
  );
}

/** Tarjeta grande del carrusel destacado, con el texto sobre la foto. */
export function TarjetaDestacada({ e, i = 0 }: { e: Evento; i?: number }) {
  const ir = useIr(e);
  return (
    <motion.article {...entrada(i)} whileTap={{ scale: 0.98 }} className="relative w-[320px] shrink-0 snap-center">
      <Link {...ir} className="block">
        <div className="relative rounded-[28px]" data-foto>
          <Foto src={e.foto} sizes="320px" degradado priority={i === 0} className="h-[240px] w-full rounded-[28px] shadow-capas" />
          <span className="absolute left-3 top-3"><PestanaFecha e={e} /></span>
          <div className="absolute inset-x-4 bottom-4 space-y-1 text-white">
            <ChipCategoria categoria={e.categoria} />
            <h3 className="line-clamp-2 text-[24px] leading-tight text-white">{e.titulo}</h3>
            <p className="truncate text-sm text-white/90">{e.hora} · {e.lugar}</p>
          </div>
          {stickerDe(e) && <span className="absolute -top-1 right-12"><Sticker tipo={stickerDe(e)!} id={e.id} /></span>}
        </div>
      </Link>
      <Corazon id={e.id} className="right-0.5 top-0.5" />
    </motion.article>
  );
}

/** Fila con foto cuadrada a la izquierda. */
export function FilaEvento({ e, i = 0 }: { e: Evento; i?: number }) {
  const ir = useIr(e);
  return (
    <motion.article {...entrada(i)} whileTap={{ scale: 0.98 }} className="relative">
      <Link {...ir} className="flex gap-3">
        <div className="w-[112px] shrink-0"><FotoEvento e={e} sizes="112px" className="h-[112px] w-full" /></div>
        <div className="min-w-0 flex-1 space-y-1.5 py-0.5 pr-10">
          <div className="flex flex-wrap gap-1.5"><ChipCategoria categoria={e.categoria} /><Contexto e={e} pilar={false} /></div>
          <h3 className="line-clamp-2 text-base leading-snug">{e.titulo}</h3>
          <p className="truncate text-sm text-gris">{e.hora} · {e.lugar}, {e.zona}</p>
          <Precio e={e} />
        </div>
      </Link>
      <Corazon id={e.id} className="right-0 top-0" />
    </motion.article>
  );
}

export function SkeletonTarjeta() {
  return (
    <div className="w-[256px] shrink-0 space-y-2" aria-hidden>
      <div className="skeleton h-[176px] w-full rounded-3xl" />
      <div className="skeleton h-3 w-1/4 rounded" /><div className="skeleton h-5 w-5/6 rounded" /><div className="skeleton h-3 w-2/3 rounded" />
    </div>
  );
}
export function SkeletonFila() {
  return (
    <div className="flex gap-3" aria-hidden>
      <div className="skeleton h-[112px] w-[112px] shrink-0 rounded-3xl" />
      <div className="flex-1 space-y-2 py-1"><div className="skeleton h-3 w-1/4 rounded" /><div className="skeleton h-4 w-5/6 rounded" /><div className="skeleton h-3 w-2/3 rounded" /></div>
    </div>
  );
}
export function SkeletonDestacada() {
  return <div className="skeleton h-[240px] w-[320px] shrink-0 rounded-[28px]" aria-hidden />;
}
