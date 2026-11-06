"use client";
import Link from "next/link";
import { Art } from "./Art";
import { IconGuardados, IconPin } from "./Icons";
import { formatFecha, formatPrecio, type Evento } from "@/lib/data";
import { useStore } from "@/lib/store";

export function EventCard({ e, grande = false }: { e: Evento; grande?: boolean }) {
  const { guardados, toggleGuardado } = useStore();
  const guardado = guardados.includes(e.id);
  return (
    <article className={`relative overflow-hidden rounded-card bg-white shadow-[0_6px_20px_-10px_rgba(15,42,58,.35)] ${grande ? "w-[300px] shrink-0 snap-start" : ""}`}>
      <Link href={`/evento/${e.id}`} className="block">
        <div className={`relative ${grande ? "h-40" : "h-32"}`}>
          <Art kind={e.arte} className="h-full w-full" />
          <span className="absolute left-3 top-3 rounded-full bg-arena px-3 py-1 text-xs font-bold text-oceano">{e.categoria}</span>
        </div>
        <div className="space-y-1 p-4 pr-16">
          <p className="text-xs font-bold uppercase tracking-wide text-oceano">{formatFecha(e.fecha)} · {e.hora}</p>
          <h3 className="text-lg leading-tight">{e.titulo}</h3>
          <p className="flex items-center gap-1 text-sm text-tinta/70"><IconPin width={16} height={16} />{e.lugar}, {e.zona}</p>
          <p className="pt-1 text-sm font-bold">{formatPrecio(e.precio)}</p>
        </div>
      </Link>
      <button onClick={() => toggleGuardado(e.id)} aria-pressed={guardado} aria-label={guardado ? "Quitar de guardados" : "Guardar evento"}
        className={`absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-full ${guardado ? "bg-coral text-tinta" : "bg-arena text-oceano"}`}>
        <IconGuardados fill={guardado ? "currentColor" : "none"} />
      </button>
    </article>
  );
}
