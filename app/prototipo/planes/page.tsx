"use client";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { formatFecha, formatPrecio } from "@/lib/data";
import { Foto } from "@/components/Foto";
import { Encabezado, LinkPrimario, SECUNDARIO, Vacio } from "@/components/Botones";
import { IconCerrar, IconCompartir, IconPlanes } from "@/components/Icons";

export default function Planes() {
  const { eventos, planes, toggleEnPlan, renombrarPlan, borrarPlan } = useStore();
  return (
    <div className="pb-6">
      <Encabezado titulo="Planes de finde" sub="Arma tu ruta: mercadito en la mañana, concierto en la noche." color="text-acento" />
      {planes.length === 0 ? (
        <Vacio icono={<IconPlanes width={28} height={28} />} titulo="Aún no armas ningún plan" texto="Abre un evento y toca “Agregar a un plan” para empezar tu ruta.">
          <LinkPrimario href="/prototipo">Explorar eventos</LinkPrimario>
        </Vacio>
      ) : (
        <div className="space-y-8 px-4">
          {planes.map((p) => {
            const lista = p.eventos.map((id) => eventos.find((x) => x.id === id)).filter((x) => !!x).sort((a, b) => (a!.fecha + a!.hora).localeCompare(b!.fecha + b!.hora));
            const total = lista.reduce((t, x) => t + x!.precio, 0);
            const texto = `${p.nombre}\n${lista.map((x, i) => `${i + 1}. ${x!.titulo} · ${formatFecha(x!.fecha)} ${x!.hora} · ${x!.lugar}`).join("\n")}`;
            return (
              <section key={p.id} aria-label={p.nombre} className="space-y-3">
                <div className="flex items-center gap-2">
                  <input aria-label="Nombre del plan" value={p.nombre} onChange={(ev) => renombrarPlan(p.id, ev.target.value)} className="min-h-[44px] min-w-0 flex-1 bg-transparent font-display text-xl font-bold" />
                  <button onClick={() => borrarPlan(p.id)} aria-label={`Borrar ${p.nombre}`} className="flex h-11 w-11 items-center justify-center rounded-full text-gris"><IconCerrar width={20} height={20} /></button>
                </div>
                {lista.length === 0 ? <p className="text-sm text-gris">Plan vacío. Agrega eventos desde su ficha.</p> : (
                  <ol className="relative space-y-4 border-l-2 border-dashed border-marca/50 pl-6">
                    {lista.map((x, i) => (
                      <li key={x!.id} className="relative">
                        <span className="absolute -left-[37px] top-4 flex h-6 w-6 items-center justify-center rounded-full bg-marca text-xs font-bold text-white">{i + 1}</span>
                        <div className="flex items-center gap-3 rounded-2xl bg-sup p-2 shadow-suave ring-1 ring-linea">
                          <Link href={`/prototipo/evento/${x!.id}`} className="flex min-w-0 flex-1 items-center gap-3">
                            <Foto src={x!.foto} sizes="80px" className="h-16 w-16 shrink-0 rounded-xl" />
                            <span className="min-w-0"><span className="block truncate font-medium">{x!.titulo}</span><span className="block truncate text-xs text-gris"><span className="capitalize">{formatFecha(x!.fecha)}</span> · {x!.hora}</span><span className="block text-xs font-medium">{formatPrecio(x!.precio)}</span></span>
                          </Link>
                          <button onClick={() => toggleEnPlan(p.id, x!.id)} aria-label={`Quitar ${x!.titulo}`} className="flex h-11 w-11 shrink-0 items-center justify-center text-gris"><IconCerrar width={18} height={18} /></button>
                        </div>
                      </li>
                    ))}
                  </ol>
                )}
                {lista.length > 0 && (
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-gris">Total aprox. <span className="font-semibold text-tinta">{formatPrecio(total)}</span></p>
                    <a className={`${SECUNDARIO} !w-auto !min-h-[44px]`} target="_blank" rel="noopener noreferrer" href={`https://wa.me/?text=${encodeURIComponent(texto)}`}><IconCompartir width={18} height={18} />Compartir plan</a>
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
