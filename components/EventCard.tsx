"use client";
import Link from "next/link";
import { Foto } from "./Foto";
import { IconCorazon } from "./Icons";
import { ChipCategoria, PestanaFecha, Sticker } from "./Marca";
import { formatPrecio, stickerDe, type Evento } from "@/lib/data";
import { useStore } from "@/lib/store";

export function Corazon({ id, className = "" }: { id: string; className?: string }) {
  const { guardados, toggleGuardado } = useStore();
  const on = guardados.includes(id);
  return (
    <button onClick={() => toggleGuardado(id)} aria-pressed={on} aria-label={on ? "Quitar de guardados" : "Guardar evento"}
      className={`absolute flex h-11 w-11 items-center justify-center ${className}`}>
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-tinta shadow-sm shadow-black/20">
        <IconCorazon width={18} height={18} className={on ? "fill-coral text-coral" : ""} />
      </span>
    </button>
  );
}

/** Foto con pestaña de fecha y un solo sticker. */
function FotoEvento({ e, sizes, className }: { e: Evento; sizes: string; className: string }) {
  const s = stickerDe(e);
  return (
    <div className="relative">
      <Foto src={e.foto} sizes={sizes} className={`${className} rounded-[20px]`} />
      <span className="absolute left-2.5 top-2.5"><PestanaFecha e={e} /></span>
      {s && <span className="absolute -bottom-1 left-1.5"><Sticker tipo={s} id={e.id} /></span>}
    </div>
  );
}

/** El precio solo se escribe si no hay sticker "Gratis" que ya lo diga. */
function Precio({ e }: { e: Evento }) {
  if (e.precio === 0) return stickerDe(e) === "Gratis" ? null : <p className="pt-0.5 text-sm font-bold text-[#0B7C7C]">Entrada libre</p>;
  return <p className="pt-0.5 text-base font-bold">{formatPrecio(e.precio)}</p>;
}

/** Tarjeta vertical para carruseles. */
export function TarjetaEvento({ e }: { e: Evento }) {
  return (
    <article className="relative w-[256px] shrink-0 snap-start">
      <Link href={`/prototipo/evento/${e.id}`} className="block">
        <FotoEvento e={e} sizes="256px" className="h-[176px] w-full" />
        <div className="space-y-1 pt-3">
          <ChipCategoria categoria={e.categoria} />
          <h3 className="line-clamp-2 text-lg leading-snug">{e.titulo}</h3>
          <p className="truncate text-sm text-gris">{e.hora} · {e.lugar}, {e.zona}</p>
          <Precio e={e} />
        </div>
      </Link>
      <Corazon id={e.id} className="right-0.5 top-0.5" />
    </article>
  );
}

/** Fila con foto cuadrada a la izquierda. */
export function FilaEvento({ e }: { e: Evento }) {
  return (
    <article className="relative">
      <Link href={`/prototipo/evento/${e.id}`} className="flex gap-3">
        <div className="w-[112px] shrink-0"><FotoEvento e={e} sizes="112px" className="h-[112px] w-full" /></div>
        <div className="min-w-0 flex-1 space-y-1 py-0.5 pr-10">
          <ChipCategoria categoria={e.categoria} />
          <h3 className="line-clamp-2 text-base leading-snug">{e.titulo}</h3>
          <p className="truncate text-sm text-gris">{e.hora} · {e.lugar}, {e.zona}</p>
          <Precio e={e} />
        </div>
      </Link>
      <Corazon id={e.id} className="right-0 top-0" />
    </article>
  );
}

export function SkeletonTarjeta() {
  return (
    <div className="w-[256px] shrink-0 space-y-2" aria-hidden>
      <div className="skeleton h-[176px] w-full rounded-[20px]" />
      <div className="skeleton h-3 w-1/4 rounded" /><div className="skeleton h-5 w-5/6 rounded" /><div className="skeleton h-3 w-2/3 rounded" />
    </div>
  );
}
export function SkeletonFila() {
  return (
    <div className="flex gap-3" aria-hidden>
      <div className="skeleton h-[112px] w-[112px] shrink-0 rounded-[20px]" />
      <div className="flex-1 space-y-2 py-1"><div className="skeleton h-3 w-1/4 rounded" /><div className="skeleton h-4 w-5/6 rounded" /><div className="skeleton h-3 w-2/3 rounded" /></div>
    </div>
  );
}
