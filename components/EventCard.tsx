"use client";
import Link from "next/link";
import { Foto } from "./Foto";
import { IconCorazon } from "./Icons";
import { formatFecha, formatPrecio, type Evento } from "@/lib/data";
import { useStore } from "@/lib/store";

export function Etiqueta({ children }: { children: React.ReactNode }) {
  return <span className="inline-block rounded bg-coral/15 px-2 py-0.5 text-[11px] font-semibold text-[#A8432A]">{children}</span>;
}

export function Corazon({ id, className = "" }: { id: string; className?: string }) {
  const { guardados, toggleGuardado } = useStore();
  const on = guardados.includes(id);
  return (
    <button onClick={() => toggleGuardado(id)} aria-pressed={on} aria-label={on ? "Quitar de guardados" : "Guardar evento"}
      className={`absolute flex h-11 w-11 items-center justify-center ${className}`}>
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-tinta">
        <IconCorazon width={18} height={18} className={on ? "fill-marca text-marca" : ""} />
      </span>
    </button>
  );
}

const etiqueta = (e: Evento) => (e.precio === 0 ? "Gratis" : e.categoria);

/** Tarjeta vertical para carruseles. */
export function TarjetaEvento({ e }: { e: Evento }) {
  return (
    <article className="relative w-[250px] shrink-0 snap-start">
      <Link href={`/evento/${e.id}`} className="block">
        <Foto src={e.foto} sizes="250px" className="h-[160px] w-full rounded-xl" />
        <div className="space-y-0.5 pt-2">
          <p className="text-xs font-medium capitalize text-marca">{formatFecha(e.fecha)} · {e.hora}</p>
          <h3 className="line-clamp-2 text-base leading-snug">{e.titulo}</h3>
          <p className="truncate text-sm text-gris">{e.lugar}, {e.zona}</p>
          <p className="flex items-center gap-2 pt-0.5 text-sm font-semibold">{formatPrecio(e.precio)} <Etiqueta>{etiqueta(e)}</Etiqueta></p>
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
      <Link href={`/evento/${e.id}`} className="flex gap-3">
        <Foto src={e.foto} sizes="104px" className="h-[104px] w-[104px] shrink-0 rounded-xl" />
        <div className="min-w-0 flex-1 space-y-0.5 py-0.5 pr-10">
          <p className="text-xs font-medium capitalize text-marca">{formatFecha(e.fecha)} · {e.hora}</p>
          <h3 className="line-clamp-2 text-base leading-snug">{e.titulo}</h3>
          <p className="truncate text-sm text-gris">{e.lugar}, {e.zona}</p>
          <p className="flex items-center gap-2 pt-0.5 text-sm font-semibold">{formatPrecio(e.precio)} <Etiqueta>{etiqueta(e)}</Etiqueta></p>
        </div>
      </Link>
      <Corazon id={e.id} className="right-0 top-0" />
    </article>
  );
}

export function SkeletonTarjeta() {
  return (
    <div className="w-[250px] shrink-0 space-y-2" aria-hidden>
      <div className="skeleton h-[160px] w-full rounded-xl" />
      <div className="skeleton h-3 w-1/2 rounded" /><div className="skeleton h-4 w-5/6 rounded" /><div className="skeleton h-3 w-2/3 rounded" />
    </div>
  );
}
export function SkeletonFila() {
  return (
    <div className="flex gap-3" aria-hidden>
      <div className="skeleton h-[104px] w-[104px] shrink-0 rounded-xl" />
      <div className="flex-1 space-y-2 py-1"><div className="skeleton h-3 w-1/2 rounded" /><div className="skeleton h-4 w-5/6 rounded" /><div className="skeleton h-3 w-2/3 rounded" /></div>
    </div>
  );
}
