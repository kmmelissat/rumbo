"use client";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { formatFecha, formatPrecio } from "@/lib/data";
import { Art } from "@/components/Art";
import { Encabezado, LinkPrimario, Vacio } from "@/components/Botones";

export default function Panel() {
  const { publicados, clics, guardados, boletos } = useStore();

  return (
    <div className="pb-4">
      <Encabezado titulo="Organizar" sub="Publica tus planes y mira cómo se mueven." />
      <div className="px-5 pb-5"><LinkPrimario href="/organizador/nuevo">Publicar evento</LinkPrimario></div>

      <section className="px-5" aria-label="Mis eventos">
        <h2 className="pb-2 text-xl">Mis eventos</h2>
        {publicados.length === 0 ? (
          <Vacio arte={<Art kind="ola" className="h-full w-full" />} titulo="Aún no publicas ningún evento" texto="Cuando publiques uno, aquí verás sus clics, guardados y entradas vendidas." />
        ) : (
          <ul className="space-y-4">
            {publicados.map((e) => {
              const stats = [
                { n: clics[e.id] ?? 0, t: "Clics" },
                { n: guardados.includes(e.id) ? 1 : 0, t: "Guardados" },
                { n: boletos.filter((b) => b.eventoId === e.id).reduce((a, b) => a + b.cantidad, 0), t: "Vendidas" },
              ];
              return (
                <li key={e.id} className="overflow-hidden rounded-card bg-white shadow-[0_6px_20px_-10px_rgba(15,42,58,.35)]">
                  <Link href={`/evento/${e.id}`} className="flex gap-3 p-3">
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl"><Art kind={e.arte} className="h-full w-full" /></div>
                    <div className="min-w-0 space-y-1">
                      <h3 className="truncate text-lg leading-tight">{e.titulo}</h3>
                      <p className="text-sm text-tinta/70">{formatFecha(e.fecha)} · {e.zona} · {formatPrecio(e.precio)}</p>
                      {e.destacado && <span className="inline-block rounded-full bg-lima px-2 py-0.5 text-xs font-bold">Destacado</span>}
                    </div>
                  </Link>
                  <dl className="grid grid-cols-3 border-t border-tinta/10 text-center">
                    {stats.map((s) => (
                      <div key={s.t} className="py-3">
                        <dd className="font-display text-2xl leading-none tabular-nums">{s.n}</dd>
                        <dt className="mt-1 text-xs text-tinta/60">{s.t}</dt>
                      </div>
                    ))}
                  </dl>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
