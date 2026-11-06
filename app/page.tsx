"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { FILTROS, ZONAS, distancia, enDias, hoyISO, rangoFinde, type Evento, type FiltroCategoria } from "@/lib/data";
import { FilaEvento, SkeletonFila, SkeletonTarjeta, TarjetaEvento } from "@/components/EventCard";
import { IconAtras, IconBuscar, IconChevron, IconComida, IconGratis, IconMercado, IconMusica, IconPin, IconTaller, IconTodo } from "@/components/Icons";

const ICONOS: Record<FiltroCategoria, typeof IconTodo> = { todo: IconTodo, mercado: IconMercado, musica: IconMusica, comida: IconComida, taller: IconTaller, gratis: IconGratis };
const CAT_DE: Record<string, FiltroCategoria> = { Mercado: "mercado", Música: "musica", Comida: "comida", Taller: "taller" };
type Vista = "semana" | "gratis" | "cerca" | null;

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

function Seccion({ titulo, onVer, children }: { titulo: string; onVer?: () => void; children: React.ReactNode }) {
  return (
    <section className="pt-5">
      <div className="flex items-center justify-between px-4 pb-3">
        <h2 className="text-lg">{titulo}</h2>
        {onVer && <button onClick={onVer} className="min-h-[44px] px-1 text-sm font-semibold text-marca">Ver todo</button>}
      </div>
      {children}
    </section>
  );
}

export default function Explorar() {
  const { eventos, zona, setZona } = useStore();
  const [q, setQ] = useState("");
  const [qDeb, setQDeb] = useState("");
  const [filtro, setFiltro] = useState<FiltroCategoria>("todo");
  const [vista, setVista] = useState<Vista>(null);
  const [menuZona, setMenuZona] = useState(false);
  const [cargando, setCargando] = useState(true);
  const primera = useRef(true);

  useEffect(() => { const t = setTimeout(() => setQDeb(q), 250); return () => clearTimeout(t); }, [q]);
  useEffect(() => {
    setCargando(true);
    const t = setTimeout(() => setCargando(false), primera.current ? 700 : 350);
    primera.current = false;
    return () => clearTimeout(t);
  }, [qDeb, filtro, zona, vista]);

  const hoy = hoyISO();
  const semanaFin = enDias(7);
  const [fDesde, fHasta] = rangoFinde();
  const buscando = qDeb.trim() !== "" || filtro !== "todo";

  const base = useMemo(() => {
    const t = norm(qDeb.trim());
    return eventos
      .filter((e) => e.fecha >= hoy)
      .filter((e) => filtro === "todo" || (filtro === "gratis" ? e.precio === 0 : CAT_DE[e.categoria] === filtro))
      .filter((e) => !t || norm(`${e.titulo} ${e.lugar} ${e.zona} ${e.organizador} ${e.categoria}`).includes(t));
  }, [eventos, qDeb, filtro, hoy]);

  const porFecha = (a: Evento, b: Evento) => a.fecha.localeCompare(b.fecha);
  const semana = base.filter((e) => e.fecha <= semanaFin).sort(porFecha);
  const gratis = base.filter((e) => e.precio === 0 && e.fecha >= fDesde && e.fecha <= fHasta).sort(porFecha);
  const cerca = [...base].sort((a, b) => distancia(zona, a.zona) - distancia(zona, b.zona) || porFecha(a, b));

  const filas = (lista: Evento[]) => (
    <div className="space-y-4 px-4">{lista.map((e) => <FilaEvento key={e.id} e={e} />)}</div>
  );
  const vacio = (txt: string) => <p className="px-4 pb-2 text-sm text-gris">{txt}</p>;
  const skFilas = <div className="space-y-4 px-4"><SkeletonFila /><SkeletonFila /><SkeletonFila /></div>;

  function contenido() {
    if (vista) {
      const lista = vista === "semana" ? semana : vista === "gratis" ? gratis : cerca;
      const titulo = vista === "semana" ? "Esta semana" : vista === "gratis" ? "Gratis este finde" : "Cerca de ti";
      return (
        <section className="pt-3">
          <div className="flex items-center gap-1 px-2 pb-3">
            <button onClick={() => setVista(null)} aria-label="Volver" className="flex h-11 w-11 items-center justify-center"><IconAtras /></button>
            <h2 className="text-lg">{titulo}</h2>
          </div>
          {cargando ? skFilas : lista.length ? filas(lista) : vacio("No hay eventos por ahora.")}
        </section>
      );
    }
    if (buscando) {
      return (
        <section className="pt-4">
          <div className="flex items-baseline justify-between px-4 pb-3">
            <h2 className="text-lg">Resultados</h2>
            {!cargando && <span className="text-sm text-gris" aria-live="polite">{cerca.length} {cerca.length === 1 ? "evento" : "eventos"}</span>}
          </div>
          {cargando ? skFilas : cerca.length ? filas(cerca) : (
            <div className="px-4 py-8 text-center">
              <p className="font-semibold">No encontramos eventos</p>
              <p className="text-sm text-gris">Prueba con otra búsqueda o categoría.</p>
              <button onClick={() => { setQ(""); setFiltro("todo"); }} className="mt-2 min-h-[44px] px-4 font-semibold text-marca">Limpiar filtros</button>
            </div>
          )}
        </section>
      );
    }
    return (
      <>
        <Seccion titulo="Esta semana" onVer={() => setVista("semana")}>
          {cargando ? <div className="flex gap-3 overflow-hidden px-4"><SkeletonTarjeta /><SkeletonTarjeta /></div>
            : semana.length ? <div className="scroll-hide flex snap-x gap-3 overflow-x-auto px-4 pb-1">{semana.map((e) => <TarjetaEvento key={e.id} e={e} />)}</div>
            : vacio("No hay eventos esta semana.")}
        </Seccion>
        <Seccion titulo="Gratis este finde" onVer={() => setVista("gratis")}>
          {cargando ? <div className="space-y-4 px-4"><SkeletonFila /></div> : gratis.length ? filas(gratis) : vacio("No hay planes gratis este finde.")}
        </Seccion>
        <Seccion titulo="Cerca de ti" onVer={() => setVista("cerca")}>
          {cargando ? skFilas : filas(cerca.slice(0, 4))}
        </Seccion>
      </>
    );
  }

  return (
    <div className="pb-6">
      <div className="sticky top-0 z-10 border-b border-linea bg-white px-4 pb-3 pt-4">
        <div className="relative flex items-center justify-between pb-3">
          <p className="text-2xl font-semibold tracking-tight">Rumbo<span className="text-marca">.</span></p>
          <button onClick={() => setMenuZona(!menuZona)} aria-expanded={menuZona} aria-haspopup="listbox"
            className="flex min-h-[44px] items-center gap-1.5 rounded-lg border border-linea px-3 text-sm font-medium">
            <IconPin width={16} height={16} className="text-marca" />{zona}<IconChevron width={16} height={16} className="text-gris" />
          </button>
          {menuZona && (
            <ul role="listbox" aria-label="Zona" className="absolute right-0 top-[52px] z-20 w-52 overflow-hidden rounded-xl border border-linea bg-white py-1">
              {ZONAS.map((z) => (
                <li key={z.nombre} role="option" aria-selected={z.nombre === zona}>
                  <button onClick={() => { setZona(z.nombre); setMenuZona(false); }}
                    className={`flex min-h-[44px] w-full items-center px-4 text-left text-sm ${z.nombre === zona ? "font-semibold text-marca" : ""}`}>{z.nombre}</button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <label className="relative block">
          <span className="sr-only">Buscar eventos</span>
          <IconBuscar className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gris" width={20} height={20} />
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Busca eventos, lugares o zonas"
            className="min-h-[44px] w-full rounded-xl border border-linea bg-fondo pl-10 pr-3 text-base placeholder:text-gris focus:bg-white" />
        </label>
      </div>

      <div className="scroll-hide flex gap-1 overflow-x-auto px-2 pt-2" role="group" aria-label="Categorías">
        {FILTROS.map((f) => {
          const Icon = ICONOS[f.id];
          const on = filtro === f.id;
          return (
            <button key={f.id} onClick={() => { setFiltro(f.id); setVista(null); }} aria-pressed={on}
              className={`flex min-h-[64px] w-[72px] shrink-0 flex-col items-center justify-center gap-1 border-b-2 text-xs font-medium ${on ? "border-marca text-marca" : "border-transparent text-gris"}`}>
              <Icon width={24} height={24} />{f.label}
            </button>
          );
        })}
      </div>
      <div className="border-b border-linea" />

      {contenido()}
    </div>
  );
}
