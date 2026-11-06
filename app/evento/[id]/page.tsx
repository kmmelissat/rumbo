"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { formatFecha, formatPrecio } from "@/lib/data";
import { Art } from "@/components/Art";
import { LinkPrimario } from "@/components/Botones";
import { IconAtras, IconCalendario, IconCoche, IconCompartir, IconFamilia, IconGuardados, IconNavegar, IconPata, IconPin, IconReloj, IconVerificado } from "@/components/Icons";

export default function Detalle() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { eventos, guardados, toggleGuardado, registrarClic } = useStore();
  useEffect(() => { registrarClic(id); }, [id, registrarClic]);

  const e = eventos.find((x) => x.id === id);
  if (!e) {
    return (
      <div className="space-y-4 p-6 pt-16 text-center">
        <h1 className="text-2xl">No encontramos este evento</h1>
        <LinkPrimario href="/">Volver a explorar</LinkPrimario>
      </div>
    );
  }

  const gratis = e.precio === 0;
  const guardado = guardados.includes(e.id);
  const direccion = encodeURIComponent(`${e.lugar}, ${e.zona}, El Salvador`);
  const url = typeof window !== "undefined" ? window.location.href : "";
  const wa = `https://wa.me/?text=${encodeURIComponent(`${e.titulo} · ${formatFecha(e.fecha)} · ${e.lugar}, ${e.zona}\n${url}`)}`;

  const circ = "flex h-11 w-11 items-center justify-center rounded-full bg-arena/95 text-tinta shadow";
  const dato = (Icon: typeof IconPin, txt: string) => (
    <li className="flex items-center gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-turquesa/15 text-oceano"><Icon width={20} height={20} /></span>{txt}</li>
  );
  const chipInfo = (Icon: typeof IconPin, si: boolean, txtSi: string, txtNo: string) => (
    <li className={`flex min-h-[40px] items-center gap-2 rounded-full px-3 text-sm font-medium ${si ? "bg-lima/60" : "bg-tinta/5 text-tinta/55 line-through decoration-1"}`}>
      <Icon width={18} height={18} />{si ? txtSi : txtNo}
    </li>
  );
  const enlace = "flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-full border-2 border-oceano px-4 font-bold text-oceano";

  return (
    <div className="flex min-h-full flex-col">
      <div className="relative h-60 shrink-0">
        <Art kind={e.arte} className="h-full w-full" />
        <button onClick={() => router.back()} aria-label="Volver" className={`absolute left-4 top-4 ${circ}`}><IconAtras /></button>
        <div className="absolute right-4 top-4 flex gap-2">
          <a href={wa} target="_blank" rel="noopener noreferrer" aria-label="Compartir por WhatsApp" className={circ}><IconCompartir /></a>
          <button onClick={() => toggleGuardado(e.id)} aria-pressed={guardado} aria-label={guardado ? "Quitar de guardados" : "Guardar evento"} className={`${circ} ${guardado ? "!bg-coral" : ""}`}>
            <IconGuardados fill={guardado ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      <div className="-mt-6 flex-1 space-y-6 rounded-t-[28px] bg-arena px-5 pb-6 pt-6">
        <div>
          <span className="rounded-full bg-lima px-3 py-1 text-xs font-bold">{e.categoria} · {e.pilar}</span>
          <h1 className="mt-3 text-3xl leading-tight">{e.titulo}</h1>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-tinta/80">
            Organiza <strong>{e.organizador}</strong>
            {e.verificado && <span className="inline-flex items-center gap-1 rounded-full bg-turquesa/20 px-2 py-0.5 text-xs font-bold text-oceano"><IconVerificado width={14} height={14} />Verificado</span>}
          </p>
        </div>

        <ul className="space-y-3 text-sm">
          {dato(IconCalendario, formatFecha(e.fecha, true))}
          {dato(IconReloj, e.hora)}
          {dato(IconPin, `${e.lugar}, ${e.zona}`)}
        </ul>

        <ul className="flex flex-wrap gap-2" aria-label="Detalles">
          {chipInfo(IconCoche, e.parqueo, "Parqueo", "Sin parqueo")}
          {chipInfo(IconPata, e.mascotas, "Mascotas", "Sin mascotas")}
          {chipInfo(IconFamilia, e.familias, "Familias", "Solo adultos")}
        </ul>

        <p className="leading-relaxed text-tinta/85">{e.descripcion}</p>

        <section aria-labelledby="como-llegar" className="space-y-3 rounded-card bg-white p-4">
          <h2 id="como-llegar" className="text-xl">Cómo llegar</h2>
          <p className="text-sm text-tinta/70">{e.lugar}, {e.zona}</p>
          <div className="flex gap-2">
            <a className={enlace} target="_blank" rel="noopener noreferrer" href={`https://waze.com/ul?q=${direccion}&navigate=yes`}><IconNavegar width={18} height={18} />Waze</a>
            <a className={enlace} target="_blank" rel="noopener noreferrer" href={`https://www.google.com/maps/search/?api=1&query=${direccion}`}><IconPin width={18} height={18} />Google Maps</a>
          </div>
        </section>

        <p className="text-xs text-tinta/60">Información confirmada por el organizador · actualizada el {formatFecha(e.actualizado)}</p>
      </div>

      <div className="sticky bottom-0 z-10 border-t border-tinta/10 bg-arena/95 px-5 pb-[max(env(safe-area-inset-bottom),16px)] pt-3 backdrop-blur">
        <div className="flex items-center gap-4">
          <div className="shrink-0">
            <p className="text-xs text-tinta/60">{gratis ? "Entrada" : "Desde"}</p>
            <p className="font-display text-2xl leading-none">{formatPrecio(e.precio)}</p>
          </div>
          <Link href={`/checkout/${e.id}`} className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-full bg-oceano px-6 font-bold text-white shadow-[0_8px_18px_-8px_rgba(14,90,138,.8)]">
            {gratis ? "Guardar mi lugar" : "Comprar entradas"}
          </Link>
        </div>
      </div>
    </div>
  );
}
