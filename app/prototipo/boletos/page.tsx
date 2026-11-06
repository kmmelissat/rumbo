"use client";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { formatFecha, formatPrecio } from "@/lib/data";
import { Foto } from "@/components/Foto";
import { Encabezado, LinkPrimario, Vacio } from "@/components/Botones";
import { IconBoleto, IconDerecha } from "@/components/Icons";

export default function Boletos() {
  const { eventos, boletos } = useStore();
  return (
    <div className="pb-6">
      <Encabezado titulo="Rumbo al plan" sub="Tus boletos, listos para mostrar el QR." color="text-oceano" />
      {boletos.length === 0 ? (
        <Vacio icono={<IconBoleto width={28} height={28} />} titulo="Todavía no hay plan" texto="Cuando compres entradas las verás aquí con su QR. ¿Te animas?">
          <LinkPrimario href="/prototipo">Explorar eventos</LinkPrimario>
        </Vacio>
      ) : (
        <ul className="space-y-3 px-4">
          {boletos.map((b) => {
            const e = eventos.find((x) => x.id === b.eventoId);
            if (!e) return null;
            return (
              <li key={b.id}>
                <Link href={`/prototipo/boleto/${b.id}`} className="flex min-h-[88px] items-center gap-3 rounded-[20px] border border-linea bg-white p-3">
                  <Foto src={e.foto} sizes="64px" className="h-16 w-16 shrink-0 rounded-2xl" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{e.titulo}</span>
                    <span className="block text-sm capitalize text-gris">{formatFecha(e.fecha)} · {e.hora}</span>
                    <span className="block text-sm text-gris">{b.cantidad} {b.cantidad === 1 ? "entrada" : "entradas"} · {formatPrecio(b.total)}</span>
                  </span>
                  <IconDerecha className="shrink-0 text-gris" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
