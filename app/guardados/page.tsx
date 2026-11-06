"use client";
import { useStore } from "@/lib/store";
import { EventCard } from "@/components/EventCard";
import { Encabezado, LinkPrimario, Vacio } from "@/components/Botones";
import { Art } from "@/components/Art";

export default function Guardados() {
  const { eventos, guardados } = useStore();
  const lista = eventos.filter((e) => guardados.includes(e.id));
  return (
    <div>
      <Encabezado titulo="Guardados" sub="Lo que te late, para no perderlo de vista." />
      {lista.length === 0 ? (
        <Vacio arte={<Art kind="brujula" className="h-full w-full" />} titulo="Aún no guardas ningún plan" texto="Toca el marcador en cualquier evento y lo verás aquí.">
          <LinkPrimario href="/">Explorar eventos</LinkPrimario>
        </Vacio>
      ) : (
        <div className="space-y-4 px-5">{lista.map((e) => <EventCard key={e.id} e={e} />)}</div>
      )}
    </div>
  );
}
