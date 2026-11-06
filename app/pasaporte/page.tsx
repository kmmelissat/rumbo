"use client";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { formatFecha, formatPrecio } from "@/lib/data";
import { Encabezado, LinkPrimario, Vacio } from "@/components/Botones";
import { Art } from "@/components/Art";
import { IconBoleto } from "@/components/Icons";

const COLORES = ["bg-turquesa", "bg-coral", "bg-lima", "bg-oceano"];
const META = 5;

export default function Pasaporte() {
  const { eventos, sellos, boletos } = useStore();
  const get = (id: string) => eventos.find((e) => e.id === id);
  const n = sellos.length;
  const enCamino = n % META;
  const recompensas = Math.floor(n / META);
  const faltan = META - enCamino;

  return (
    <div className="pb-4">
      <Encabezado titulo="Pasaporte" sub="Cada evento al que vas te deja un sello." />

      <section className="mx-5 mb-6 rounded-card bg-oceano p-5 text-white" aria-label="Progreso">
        <div className="flex items-end justify-between">
          <div><p className="text-sm text-white/80">Sellos</p><p className="font-display text-5xl leading-none">{n}</p></div>
          <p className="text-right text-sm text-white/80">{recompensas} {recompensas === 1 ? "recompensa" : "recompensas"}<br />desbloqueadas</p>
        </div>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/20" role="progressbar" aria-valuemin={0} aria-valuemax={META} aria-valuenow={enCamino} aria-label="Progreso hacia la próxima recompensa">
          <div className="h-full rounded-full bg-lima transition-all duration-500" style={{ width: `${(enCamino / META) * 100}%` }} />
        </div>
        <p className="mt-2 text-sm">{enCamino === 0 && n > 0 ? "¡Recompensa desbloqueada! Empieza otra ronda." : `${enCamino} de ${META} · te ${faltan === 1 ? "falta 1 sello" : `faltan ${faltan} sellos`} para tu próxima recompensa.`}</p>
        <p className="mt-1 text-xs text-white/70">Cada {META} sellos ganas una recompensa.</p>
      </section>

      <section className="px-5" aria-label="Mis boletos">
        <h2 className="pb-2 text-xl">Mis boletos</h2>
        {boletos.length === 0 ? (
          <Vacio arte={<Art kind="sol" className="h-full w-full" />} titulo="Tu pasaporte está en blanco" texto="Compra tu primer boleto y gana tu primer sello.">
            <LinkPrimario href="/">Explorar eventos</LinkPrimario>
          </Vacio>
        ) : (
          <ul className="space-y-3">
            {boletos.map((b) => {
              const e = get(b.eventoId);
              if (!e) return null;
              return (
                <li key={b.id}>
                  <Link href={`/boleto/${b.id}`} className="flex min-h-[64px] items-center gap-3 rounded-card bg-white p-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-turquesa/20 text-oceano"><IconBoleto /></span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-bold leading-tight">{e.titulo}</span>
                      <span className="text-sm text-tinta/70">{formatFecha(e.fecha)} · {b.cantidad} {b.cantidad === 1 ? "entrada" : "entradas"}</span>
                    </span>
                    <span className="text-sm font-bold">{formatPrecio(b.total)}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {n > 0 && (
        <section className="mt-6 px-5" aria-label="Sellos">
          <h2 className="pb-2 text-xl">Mis sellos</h2>
          <ul className="grid grid-cols-3 gap-4">
            {sellos.map((s, i) => {
              const e = get(s.eventoId);
              if (!e) return null;
              return (
                <li key={s.eventoId} className="text-center">
                  <div className={`mx-auto aspect-square w-full overflow-hidden rounded-full border-4 border-dashed border-tinta/40 ${COLORES[i % 4]} ${i % 2 ? "rotate-3" : "-rotate-3"}`}>
                    <Art kind={e.arte} className="h-full w-full" />
                  </div>
                  <p className="mt-1 text-xs font-bold leading-tight">{e.categoria}</p>
                  <p className="text-[11px] text-tinta/60">{formatFecha(e.fecha)}</p>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
