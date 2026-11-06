"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { formatFecha, formatPrecio } from "@/lib/data";
import { Foto } from "@/components/Foto";
import { Corazon, Etiqueta } from "@/components/EventCard";
import { LinkPrimario, SECUNDARIO } from "@/components/Botones";
import { IconAtras, IconCalendario, IconCoche, IconCompartir, IconNavegar, IconPata, IconPin, IconReloj, IconVerificado } from "@/components/Icons";

export default function Detalle() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { eventos } = useStore();
  const e = eventos.find((x) => x.id === id);

  if (!e) {
    return (
      <div className="space-y-4 p-6 pt-16 text-center">
        <h1 className="text-xl">No encontramos este evento</h1>
        <LinkPrimario href="/">Volver a explorar</LinkPrimario>
      </div>
    );
  }

  const gratis = e.precio === 0;
  const direccion = encodeURIComponent(`${e.lugar}, ${e.zona}, El Salvador`);
  const url = typeof window !== "undefined" ? window.location.href : "";
  const wa = `https://wa.me/?text=${encodeURIComponent(`${e.titulo} · ${formatFecha(e.fecha)} · ${e.lugar}, ${e.zona}\n${url}`)}`;
  const circ = "flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-tinta";
  const fila = (Icon: typeof IconPin, titulo: string, sub?: string) => (
    <li className="flex items-start gap-3">
      <Icon width={22} height={22} className="mt-0.5 shrink-0 text-gris" />
      <span><span className="block font-medium capitalize-first">{titulo}</span>{sub && <span className="block text-sm text-gris">{sub}</span>}</span>
    </li>
  );

  return (
    <div className="flex min-h-full flex-col">
      <div className="relative">
        <Foto src={e.foto} priority sizes="430px" className="h-[300px] w-full" />
        <button onClick={() => (window.history.length > 1 ? router.back() : router.push("/"))} aria-label="Volver" className={`absolute left-4 top-4 ${circ}`}><IconAtras /></button>
        <div className="absolute right-4 top-4 flex gap-2">
          <a href={wa} target="_blank" rel="noopener noreferrer" aria-label="Compartir por WhatsApp" className={circ}><IconCompartir width={20} height={20} /></a>
          <div className="relative h-11 w-11"><Corazon id={e.id} className="inset-0" /></div>
        </div>
      </div>

      <div className="flex-1 space-y-6 px-4 pb-6 pt-5">
        <div className="space-y-2">
          <Etiqueta>{gratis ? "Gratis" : e.categoria}</Etiqueta>
          <h1 className="text-2xl leading-tight">{e.titulo}</h1>
          <p className="flex flex-wrap items-center gap-1.5 text-sm text-gris">
            Organiza <span className="font-medium text-tinta">{e.organizador}</span>
            {e.verificado && <span className="inline-flex items-center gap-1 text-marca"><IconVerificado width={16} height={16} />Verificado</span>}
          </p>
        </div>

        <ul className="space-y-4">
          {fila(IconCalendario, formatFecha(e.fecha, true))}
          {fila(IconReloj, e.hora)}
          {fila(IconPin, e.lugar, e.zona)}
          {fila(IconCoche, e.parqueo ? "Parqueo disponible" : "Sin parqueo")}
          {fila(IconPata, e.mascotas ? "Se aceptan mascotas" : "No se aceptan mascotas")}
        </ul>

        <div className="border-t border-linea pt-5">
          <h2 className="pb-2 text-lg">Acerca del evento</h2>
          <p className="leading-relaxed text-tinta/90">{e.descripcion}</p>
        </div>

        <section aria-labelledby="como-llegar" className="border-t border-linea pt-5">
          <h2 id="como-llegar" className="text-lg">Cómo llegar</h2>
          <p className="pb-3 text-sm text-gris">{e.lugar}, {e.zona}</p>
          <div className="flex gap-2">
            <a className={SECUNDARIO} target="_blank" rel="noopener noreferrer" href={`https://waze.com/ul?q=${direccion}&navigate=yes`}><IconNavegar width={18} height={18} />Waze</a>
            <a className={SECUNDARIO} target="_blank" rel="noopener noreferrer" href={`https://www.google.com/maps/search/?api=1&query=${direccion}`}><IconPin width={18} height={18} />Google Maps</a>
          </div>
        </section>

        <p className="text-xs text-gris">Información confirmada por el organizador · actualizada el {formatFecha(e.actualizado)}</p>
      </div>

      <div className="sticky bottom-0 z-10 flex items-center gap-4 border-t border-linea bg-white px-4 pb-[max(env(safe-area-inset-bottom),12px)] pt-3">
        <div className="shrink-0">
          <p className="text-xs text-gris">{gratis ? "Entrada" : "Desde"}</p>
          <p className="text-xl font-semibold leading-none">{formatPrecio(e.precio)}</p>
        </div>
        <Link href={`/checkout/${e.id}`} className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-xl bg-marca px-6 font-semibold text-white hover:bg-[#0c8e8e]">
          {gratis ? "Guardar mi lugar" : "Comprar entradas"}
        </Link>
      </div>
    </div>
  );
}
