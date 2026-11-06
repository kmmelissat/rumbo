"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { COLOR_FILTRO, FILTROS, ZONAS, distancia, hoyISO, rangoFinde, type Evento, type FiltroCategoria } from "@/lib/data";
import { FilaEvento, SkeletonFila, SkeletonTarjeta, TarjetaEvento } from "@/components/EventCard";
import { Nota, Ruta, TituloSeccion } from "@/components/Marca";
import { IconAtras, IconBuscar, IconChevron, IconComida, IconGratis, IconMercado, IconMusica, IconPin, IconTaller, IconTodo } from "@/components/Icons";

const ICONOS: Record<FiltroCategoria, typeof IconTodo> = { todo: IconTodo, mercado: IconMercado, musica: IconMusica, comida: IconComida, taller: IconTaller, gratis: IconGratis };
const CAT_DE: Record<string, FiltroCategoria> = { Mercado: "mercado", Música: "musica", Comida: "comida", Taller: "taller" };
type Vista = "semana" | "gratis" | "cerca" | null;
const TITULOS = { semana: "Lo que se mueve este finde", gratis: "Gratis, que no falte plan", cerca: "Cerca de ti" };

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

function Seccion({ titulo, color, nota, onVer, children }: { titulo: string; color: string; nota?: string; onVer: () => void; children: React.ReactNode }) {
  return (
    <section className="pt-2">
      <div className="flex items-center justify-between gap-2 px-4 pb-4">
        <div className="flex min-w-0 flex-wrap items-baseline gap-x-3">
          <TituloSeccion color={color}>{titulo}</TituloSeccion>
          {nota && <Nota className="-rotate-3 text-oceano">{nota}</Nota>}
        </div>
        <button onClick={onVer} className="min-h-[44px] shrink-0 px-1 text-sm font-bold text-oceano">Ver todo</button>
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
  const semana = base.filter((e) => e.fecha <= fHasta).sort(porFecha);
  const gratis = base.filter((e) => e.precio === 0 && e.fecha >= fDesde && e.fecha <= fHasta).sort(porFecha);
  const cerca = [...base].sort((a, b) => distancia(zona, a.zona) - distancia(zona, b.zona) || porFecha(a, b));

  const filas = (lista: Evento[]) => <div className="space-y-5 px-4">{lista.map((e) => <FilaEvento key={e.id} e={e} />)}</div>;
  const vacio = (txt: string) => <p className="px-4 pb-2 text-sm text-gris">{txt}</p>;
  const skFilas = (
    <div className="space-y-5 px-4">
      <p className="text-sm text-gris" role="status">Buscando planes con buena vibra…</p>
      <SkeletonFila /><SkeletonFila /><SkeletonFila />
    </div>
  );

  function contenido() {
    if (vista) {
      const lista = vista === "semana" ? semana : vista === "gratis" ? gratis : cerca;
      return (
        <section className="pt-3">
          <div className="flex items-center gap-1 px-2 pb-4">
            <button onClick={() => setVista(null)} aria-label="Volver" className="flex h-11 w-11 items-center justify-center"><IconAtras /></button>
            <TituloSeccion color="text-coral">{TITULOS[vista]}</TituloSeccion>
          </div>
          {cargando ? skFilas : lista.length ? filas(lista) : vacio("Por ahora nada por aquí. Vuelve pronto, siempre aparece algo.")}
        </section>
      );
    }
    if (buscando) {
      return (
        <section className="pt-3">
          <div className="flex items-baseline justify-between px-4 pb-4">
            <TituloSeccion color="text-coral">Esto encontramos</TituloSeccion>
            {!cargando && <span className="text-sm text-gris" aria-live="polite">{cerca.length} {cerca.length === 1 ? "plan" : "planes"}</span>}
          </div>
          {cargando ? skFilas : cerca.length ? filas(cerca) : (
            <div className="mx-4 rounded-[20px] border-2 border-dashed border-marca/50 bg-arena px-4 py-8 text-center">
              <p className="font-display text-lg font-bold">Ni un mercadito por aquí</p>
              <p className="text-sm text-gris">Prueba otra palabra o suelta un filtro: el rumbo siempre aparece.</p>
              <button onClick={() => { setQ(""); setFiltro("todo"); }} className="mt-2 min-h-[44px] px-4 font-bold text-oceano">Limpiar filtros</button>
            </div>
          )}
        </section>
      );
    }
    return (
      <>
        <Seccion titulo={TITULOS.semana} color="text-marca" onVer={() => setVista("semana")}>
          {cargando ? <div className="flex gap-3 overflow-hidden px-4"><SkeletonTarjeta /><SkeletonTarjeta /></div>
            : semana.length ? <div className="scroll-hide flex snap-x gap-4 overflow-x-auto px-4 pb-2">{semana.map((e) => <TarjetaEvento key={e.id} e={e} />)}</div>
            : vacio("Finde tranquilo: aquí no hay planes todavía.")}
        </Seccion>
        <Ruta />
        <Seccion titulo={TITULOS.gratis} color="text-coral" nota="¡a costo cero!" onVer={() => setVista("gratis")}>
          {cargando ? <div className="space-y-5 px-4"><SkeletonFila /></div> : gratis.length ? filas(gratis) : vacio("Hoy no hay planes gratis, pero mañana puede cambiar.")}
        </Seccion>
        <Ruta invertir />
        <Seccion titulo={TITULOS.cerca} color="text-oceano" onVer={() => setVista("cerca")}>
          {cargando ? skFilas : cerca.length ? filas(cerca.slice(0, 4)) : vacio("Nada cerca por ahora.")}
        </Seccion>
      </>
    );
  }

  return (
    <div className="pb-8">
      <div className="sticky -top-[128px] z-10">
        <div className="rounded-b-[28px] bg-oceano px-4 pb-4 pt-4 text-white">
          <div className="relative flex h-11 items-center justify-between">
            <p className="font-display text-2xl font-bold">Rumbo<span className="text-lima">.</span></p>
            <button onClick={() => setMenuZona(!menuZona)} aria-expanded={menuZona} aria-haspopup="listbox"
              className="flex min-h-[44px] items-center gap-1.5 rounded-xl border border-white/30 bg-white/15 px-3 text-sm font-medium">
              <IconPin width={16} height={16} className="text-lima" />{zona}<IconChevron width={16} height={16} className="text-white/80" />
            </button>
            {menuZona && (
              <ul role="listbox" aria-label="Zona" className="absolute right-0 top-[52px] z-20 w-52 overflow-hidden rounded-2xl border border-linea bg-white py-1 text-tinta">
                {ZONAS.map((z) => (
                  <li key={z.nombre} role="option" aria-selected={z.nombre === zona}>
                    <button onClick={() => { setZona(z.nombre); setMenuZona(false); }}
                      className={`flex min-h-[44px] w-full items-center px-4 text-left text-sm ${z.nombre === zona ? "font-bold text-oceano" : ""}`}>{z.nombre}</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="relative mt-1 h-16">
            <h1 className="font-display text-[30px] leading-9">¿Qué rumbo hoy?</h1>
            <Nota className="absolute right-1 top-0 -rotate-6 text-2xl text-lima">hay plan</Nota>
            <p className="text-sm text-white/85">Eventos, mercaditos y experiencias cerca de ti.</p>
          </div>
          <label className="relative mt-3 block">
            <span className="sr-only">Buscar eventos</span>
            <IconBuscar className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gris" width={20} height={20} />
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Busca eventos, lugares o zonas"
              className="min-h-[44px] w-full rounded-2xl border-0 bg-white pl-10 pr-3 text-base text-tinta placeholder:text-gris" />
          </label>
        </div>
      </div>

      <div className="scroll-hide flex gap-2 overflow-x-auto px-4 py-4" role="group" aria-label="Categorías">
        {FILTROS.map((f) => {
          const Icon = ICONOS[f.id];
          const on = filtro === f.id;
          return (
            <button key={f.id} onClick={() => { setFiltro(f.id); setVista(null); }} aria-pressed={on}
              className={`flex min-h-[44px] shrink-0 items-center gap-2 rounded-2xl border-2 px-3.5 text-sm font-bold ${on ? COLOR_FILTRO[f.id].on : COLOR_FILTRO[f.id].off}`}>
              <Icon width={20} height={20} />{f.label}
            </button>
          );
        })}
      </div>

      {contenido()}
    </div>
  );
}
