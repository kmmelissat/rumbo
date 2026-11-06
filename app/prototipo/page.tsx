"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { COLOR_FILTRO, FILTROS, ZONAS, distancia, hoyISO, rangoFinde, type Evento, type FiltroCategoria } from "@/lib/data";
import { FilaEvento, SkeletonDestacada, SkeletonFila, SkeletonTarjeta, TarjetaDestacada, TarjetaEvento } from "@/components/EventCard";
import { Sheet } from "@/components/Sheet";
import { haptico } from "@/lib/haptico";
import { Logo } from "@/src/components/Logo";
import { Nota, Ruta, TituloSeccion } from "@/components/Marca";
import { IconAtras, IconBuscar, IconFiltro, IconChevron, IconComida, IconGratis, IconMercado, IconMusica, IconPin, IconTaller, IconTodo } from "@/components/Icons";

const ICONOS: Record<FiltroCategoria, typeof IconTodo> = { todo: IconTodo, mercado: IconMercado, musica: IconMusica, comida: IconComida, taller: IconTaller, gratis: IconGratis };
const CAT_DE: Record<string, FiltroCategoria> = { Mercado: "mercado", Música: "musica", Comida: "comida", Taller: "taller" };
type Vista = "semana" | "gratis" | "cerca" | null;
const TITULOS = { semana: "Lo que se mueve este finde", gratis: "Gratis, que no falte plan", cerca: "Cerca de ti" };

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

function Seccion({ titulo, color, nota, sub, onVer, children }: { titulo: string; color: string; nota?: string; sub?: string; onVer: () => void; children: React.ReactNode }) {
  return (
    <section className="pt-2">
      <div className="flex items-center justify-between gap-2 px-4 pb-4">
        <div className="flex min-w-0 flex-wrap items-baseline gap-x-3">
          <TituloSeccion color={color}>{titulo}</TituloSeccion>
          {nota && <Nota className="-rotate-3 text-acento">{nota}</Nota>}
          {sub && <p className="mt-2 w-full text-sm text-gris">{sub}</p>}
        </div>
        <button onClick={onVer} className="min-h-[44px] shrink-0 px-1 text-sm font-bold text-acento">Ver todo</button>
      </div>
      {children}
    </section>
  );
}

export default function Explorar() {
  const { eventos, zona, setZona, intereses } = useStore();
  const [q, setQ] = useState("");
  const [qDeb, setQDeb] = useState("");
  const [filtro, setFiltro] = useState<FiltroCategoria>("todo");
  const [vista, setVista] = useState<Vista>(null);
  const [menuZona, setMenuZona] = useState(false);
  const [hoja, setHoja] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cargando, setCargando] = useState(true);
  const primera = useRef(true);

  useEffect(() => { const t = setTimeout(() => setQDeb(q), 250); return () => clearTimeout(t); }, [q]);
  // El header se vuelve cristal cuando la página ya se desplazó.
  useEffect(() => {
    const main = document.querySelector("main");
    if (!main) return;
    const alScroll = () => setScrolled(main.scrollTop > 130);
    main.addEventListener("scroll", alScroll, { passive: true });
    return () => main.removeEventListener("scroll", alScroll);
  }, []);
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

  // Destacados (grande, arriba) y "Para tu rumbo" (ordenado por los pilares elegidos).
  const peso = (e: Evento) => (e.pocas ? 0 : e.nuevo ? 1 : 2);
  const destacados = [...base].sort((a, b) => peso(a) - peso(b) || porFecha(a, b)).slice(0, 4);
  const paraTi = intereses.length ? [...base].filter((e) => intereses.includes(e.pilar)).sort(porFecha).slice(0, 6) : [];

  const filas = (lista: Evento[]) => <div className="space-y-5 px-4">{lista.map((e, i) => <FilaEvento key={e.id} e={e} i={i} />)}</div>;
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
            <div className="mx-4 rounded-3xl border-2 border-dashed border-marca/50 bg-arena px-4 py-8 text-center">
              <p className="font-display text-lg font-bold">Ni un mercadito por aquí</p>
              <p className="text-sm text-gris">Prueba otra palabra o suelta un filtro: el rumbo siempre aparece.</p>
              <button onClick={() => { setQ(""); setFiltro("todo"); }} className="mt-2 min-h-[44px] px-4 font-bold text-acento">Limpiar filtros</button>
            </div>
          )}
        </section>
      );
    }
    return (
      <>
        {(cargando || destacados.length > 0) && (
          <div className="scroll-hide flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-4 pt-1" aria-label="Destacados">
            {cargando ? <><SkeletonDestacada /><SkeletonDestacada /></> : destacados.map((e, i) => <TarjetaDestacada key={e.id} e={e} i={i} />)}
          </div>
        )}
        {!cargando && paraTi.length > 0 && (
          <>
            <Seccion titulo="Para tu rumbo" color="text-lima" nota={undefined} onVer={() => setVista("semana")} sub={`Por tus pilares: ${intereses.join(", ")}`}>
              <div className="scroll-hide flex snap-x scroll-px-4 gap-4 overflow-x-auto px-4 pb-2">{paraTi.map((e, i) => <TarjetaEvento key={e.id} e={e} i={i} />)}</div>
            </Seccion>
            <Ruta />
          </>
        )}
        <Seccion titulo={TITULOS.semana} color="text-marca" onVer={() => setVista("semana")}>
          {cargando ? <div className="flex gap-3 overflow-hidden px-4"><SkeletonTarjeta /><SkeletonTarjeta /></div>
            : semana.length ? <div className="scroll-hide flex snap-x scroll-px-4 gap-4 overflow-x-auto px-4 pb-2">{semana.map((e, i) => <TarjetaEvento key={e.id} e={e} i={i} />)}</div>
            : vacio("Finde tranquilo: aquí no hay planes todavía.")}
        </Seccion>
        <Ruta />
        <Seccion titulo={TITULOS.gratis} color="text-coral" nota="¡a costo cero!" onVer={() => setVista("gratis")}>
          {cargando ? <div className="space-y-5 px-4"><SkeletonFila /></div> : gratis.length ? filas(gratis) : vacio("Hoy no hay planes gratis, pero mañana puede cambiar.")}
        </Seccion>
        <Ruta invertir />
        <Seccion titulo={TITULOS.cerca} color="text-acento" onVer={() => setVista("cerca")}>
          {cargando ? skFilas : cerca.length ? filas(cerca.slice(0, 4)) : vacio("Nada cerca por ahora.")}
        </Seccion>
      </>
    );
  }

  return (
    <div className="pb-8">
      <div className="sticky -top-[140px] z-10">
        <div className={`rounded-b-[32px] px-4 pb-4 pt-[max(env(safe-area-inset-top),16px)] text-white shadow-capas transition-colors duration-300 ${scrolled ? "bg-oceano/80 backdrop-blur-xl backdrop-saturate-150" : "bg-oceano"}`}>
          <div className="relative flex h-11 items-center justify-between">
            <Logo variant="invertida" size={32} />
            <button onClick={() => setMenuZona(!menuZona)} aria-expanded={menuZona} aria-haspopup="listbox"
              className="flex min-h-[44px] items-center gap-1.5 rounded-xl border border-white/30 bg-sup/15 px-3 text-sm font-medium">
              <IconPin width={16} height={16} className="text-lima" />{zona}<IconChevron width={16} height={16} className="text-white/80" />
            </button>
            {menuZona && (
              <ul role="listbox" aria-label="Zona" className="absolute right-0 top-[52px] z-20 w-52 overflow-hidden rounded-2xl border border-linea bg-sup py-1 text-tinta">
                {ZONAS.map((z) => (
                  <li key={z.nombre} role="option" aria-selected={z.nombre === zona}>
                    <button onClick={() => { setZona(z.nombre); setMenuZona(false); }}
                      className={`flex min-h-[44px] w-full items-center px-4 text-left text-sm ${z.nombre === zona ? "font-bold text-acento" : ""}`}>{z.nombre}</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="relative mt-2 h-[72px]">
            <h1 className="font-display text-[34px] leading-[1.05] text-white">¿Qué rumbo hoy?</h1>
            <Nota className="absolute right-1 top-0 -rotate-6 text-2xl text-lima">hay plan</Nota>
            <p className="mt-1 text-sm text-white/90">Eventos, mercaditos y experiencias cerca de ti.</p>
          </div>
          <label className="relative mt-3 block">
            <span className="sr-only">Buscar eventos</span>
            <IconBuscar className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gris" width={20} height={20} />
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Busca eventos, lugares o zonas"
              className="min-h-[44px] w-full rounded-2xl border-0 bg-sup pl-10 pr-3 text-base text-tinta placeholder:text-gris" />
          </label>
        </div>
      </div>

      <div className="scroll-hide flex gap-2 overflow-x-auto px-4 py-4" role="group" aria-label="Categorías">
        <button onClick={() => { setHoja(true); haptico(6); }} aria-label="Abrir filtros"
          className="flex min-h-[44px] shrink-0 items-center gap-2 rounded-2xl bg-sup px-3.5 text-sm font-bold text-tinta shadow-suave ring-1 ring-linea"><IconFiltro width={20} height={20} />Filtros</button>
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

      <Sheet abierto={hoja} onCerrar={() => setHoja(false)} titulo="Filtra tu rumbo">
        <div>
          <p className="pb-2 text-sm font-bold text-gris">Qué buscas</p>
          <div className="flex flex-wrap gap-2">
            {FILTROS.map((f) => {
              const Icon = ICONOS[f.id];
              const on = filtro === f.id;
              return (
                <button key={f.id} onClick={() => { setFiltro(f.id); setVista(null); haptico(6); }} aria-pressed={on}
                  className={`flex min-h-[44px] items-center gap-2 rounded-2xl border-2 px-3.5 text-sm font-bold ${on ? COLOR_FILTRO[f.id].on : COLOR_FILTRO[f.id].off}`}><Icon width={20} height={20} />{f.label}</button>
              );
            })}
          </div>
        </div>
        <div>
          <p className="pb-2 text-sm font-bold text-gris">Dónde</p>
          <div className="flex flex-wrap gap-2">
            {ZONAS.map((z) => (
              <button key={z.nombre} onClick={() => { setZona(z.nombre); haptico(6); }} aria-pressed={z.nombre === zona}
                className={`min-h-[44px] rounded-2xl px-3.5 text-sm font-bold ${z.nombre === zona ? "bg-oceano text-white" : "bg-fondo text-tinta"}`}>{z.nombre}</button>
            ))}
          </div>
        </div>
        <button onClick={() => setHoja(false)} className="inline-flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-marca px-6 text-base font-bold text-white shadow-suave">Ver planes</button>
      </Sheet>
    </div>
  );
}
