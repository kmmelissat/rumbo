"use client";
import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { CATEGORIAS, ZONA_DIST, hoyISO, rangoFinde, type Categoria } from "@/lib/data";
import { EventCard } from "@/components/EventCard";
import { IconBuscar } from "@/components/Icons";

type Cuando = "todos" | "hoy" | "finde" | "gratis";
const CUANDO: { id: Cuando; label: string }[] = [
  { id: "todos", label: "Todos" }, { id: "hoy", label: "Hoy" }, { id: "finde", label: "Este finde" }, { id: "gratis", label: "Gratis" },
];

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

function saludo() {
  const h = new Date().getHours();
  return h < 12 ? "Buenos días" : h < 19 ? "Buenas tardes" : "Buenas noches";
}

export default function Explorar() {
  const { eventos } = useStore();
  const [q, setQ] = useState("");
  const [cuando, setCuando] = useState<Cuando>("todos");
  const [cat, setCat] = useState<Categoria | null>(null);

  const hoy = hoyISO();
  const [desde, hasta] = rangoFinde();
  const filtrando = q.trim() !== "" || cuando !== "todos" || cat !== null;

  const lista = useMemo(() => {
    const t = norm(q.trim());
    return eventos
      .filter((e) => e.fecha >= hoy)
      .filter((e) => !cat || e.categoria === cat)
      .filter((e) => {
        if (cuando === "hoy") return e.fecha === hoy;
        if (cuando === "finde") return e.fecha >= desde && e.fecha <= hasta;
        if (cuando === "gratis") return e.precio === 0;
        return true;
      })
      .filter((e) => !t || norm(`${e.titulo} ${e.lugar} ${e.zona} ${e.organizador} ${e.categoria} ${e.pilar}`).includes(t))
      .sort((a, b) => (ZONA_DIST[a.zona] ?? 9) - (ZONA_DIST[b.zona] ?? 9) || a.fecha.localeCompare(b.fecha));
  }, [eventos, q, cuando, cat, hoy, desde, hasta]);

  const destacados = eventos.filter((e) => e.destacado && e.fecha >= hoy);

  const chip = (activo: boolean) =>
    `min-h-[44px] shrink-0 rounded-full border px-4 text-sm font-medium ${activo ? "border-oceano bg-oceano text-white" : "border-tinta/15 bg-white text-tinta"}`;

  return (
    <div className="pb-4">
      <header className="px-5 pb-3 pt-8">
        <p className="text-sm font-medium text-oceano">{saludo()}</p>
        <h1 className="text-3xl leading-tight">¿Qué rumbo hoy?</h1>
      </header>

      <div className="px-5 pb-3">
        <label className="relative block">
          <span className="sr-only">Buscar eventos</span>
          <IconBuscar className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-tinta/50" />
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Busca por evento, lugar o zona"
            className="min-h-[48px] w-full rounded-full border border-tinta/15 bg-white pl-12 pr-4 text-base placeholder:text-tinta/50" />
        </label>
      </div>

      <div className="scroll-hide flex gap-2 overflow-x-auto px-5 pb-2" role="group" aria-label="Cuándo">
        {CUANDO.map((c) => <button key={c.id} className={chip(cuando === c.id)} aria-pressed={cuando === c.id} onClick={() => setCuando(c.id)}>{c.label}</button>)}
      </div>
      <div className="scroll-hide flex gap-2 overflow-x-auto px-5 pb-4" role="group" aria-label="Categoría">
        {CATEGORIAS.map((c) => (
          <button key={c} className={`${chip(cat === c)} !min-h-[44px] ${cat === c ? "" : "!border-turquesa/40"}`} aria-pressed={cat === c} onClick={() => setCat(cat === c ? null : c)}>{c}</button>
        ))}
      </div>

      {!filtrando && destacados.length > 0 && (
        <section aria-label="Destacados" className="mb-5">
          <h2 className="px-5 pb-2 text-xl">Destacados</h2>
          <div className="scroll-hide flex snap-x gap-3 overflow-x-auto px-5 pb-2">
            {destacados.map((e) => <EventCard key={e.id} e={e} grande />)}
          </div>
        </section>
      )}

      <section className="space-y-4 px-5" aria-label="Cerca de ti">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl">{filtrando ? "Resultados" : "Cerca de ti"}</h2>
          <span className="text-sm text-tinta/60" aria-live="polite">{lista.length} {lista.length === 1 ? "evento" : "eventos"}</span>
        </div>
        {lista.length === 0 && (
          <div className="rounded-card bg-white p-6 text-center">
            <p className="font-bold">No encontramos eventos con esa búsqueda.</p>
            <button onClick={() => { setQ(""); setCuando("todos"); setCat(null); }} className="mt-2 min-h-[44px] px-4 font-bold text-oceano underline">Limpiar filtros</button>
          </div>
        )}
        {lista.map((e) => <EventCard key={e.id} e={e} />)}
      </section>
    </div>
  );
}
