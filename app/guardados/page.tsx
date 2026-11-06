"use client";
import { useStore } from "@/lib/store";
import { FilaEvento } from "@/components/EventCard";
import { Encabezado, LinkPrimario, Vacio } from "@/components/Botones";
import { IconCorazon } from "@/components/Icons";

export default function Guardados() {
  const { eventos, guardados } = useStore();
  const lista = eventos.filter((e) => guardados.includes(e.id));
  return (
    <div className="pb-6">
      <Encabezado titulo="Guardados" />
      {lista.length === 0 ? (
        <Vacio icono={<IconCorazon width={28} height={28} />} titulo="Aún no guardas ningún plan" texto="Toca el corazón en cualquier evento y lo verás aquí.">
          <LinkPrimario href="/">Explorar eventos</LinkPrimario>
        </Vacio>
      ) : (
        <div className="space-y-4 px-4">{lista.map((e) => <FilaEvento key={e.id} e={e} />)}</div>
      )}
    </div>
  );
}
