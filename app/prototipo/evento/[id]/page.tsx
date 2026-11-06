"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { formatFecha, formatPrecio, stickerDe } from "@/lib/data";
import { Foto } from "@/components/Foto";
import { Corazon } from "@/components/EventCard";
import { Sheet } from "@/components/Sheet";
import { haptico } from "@/lib/haptico";
import { ChipCategoria, Nota, PestanaFecha, Sticker } from "@/components/Marca";
import { BotonPrimario, LinkPrimario, SECUNDARIO } from "@/components/Botones";
import { IconAtras, IconCalendario, IconMas, IconMenos, IconCoche, IconChevron, IconCompartir, IconNavegar, IconPata, IconPin, IconPlanes, IconReloj, IconVerificado } from "@/components/Icons";

export default function Detalle() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { eventos, planes, crearPlan, toggleEnPlan } = useStore();
  const e = eventos.find((x) => x.id === id);
  const [compra, setCompra] = useState(false);
  const [cant, setCant] = useState(1);
  const [plan, setPlan] = useState(false);
  const [mas, setMas] = useState(false);

  if (!e) {
    return (
      <div className="space-y-4 p-6 pt-16 text-center">
        <h1 className="text-xl">No encontramos este evento</h1>
        <LinkPrimario href="/prototipo">Volver a explorar</LinkPrimario>
      </div>
    );
  }

  const gratis = e.precio === 0;
  const sticker = stickerDe(e);
  const direccion = encodeURIComponent(`${e.lugar}, ${e.zona}, El Salvador`);
  const url = typeof window !== "undefined" ? window.location.href : "";
  const wa = `https://wa.me/?text=${encodeURIComponent(`${e.titulo} · ${formatFecha(e.fecha)} · ${e.lugar}, ${e.zona}\n${url}`)}`;
  const ymd = e.fecha.replaceAll("-", "");
  const sig = new Date(e.fecha + "T12:00:00"); sig.setDate(sig.getDate() + 1);
  const ymdSig = `${sig.getFullYear()}${String(sig.getMonth() + 1).padStart(2, "0")}${String(sig.getDate()).padStart(2, "0")}`;
  const cal = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(e.titulo)}&dates=${ymd}/${ymdSig}&location=${direccion}&details=${encodeURIComponent(`Hora: ${e.hora}`)}`;
  const larga = e.descripcion.length > 180;
  const circ = "flex h-11 w-11 items-center justify-center rounded-full bg-sup/95 text-tinta";
  const fila = (Icon: typeof IconPin, titulo: string, sub?: string) => (
    <li className="flex items-start gap-3">
      <Icon width={22} height={22} className="mt-0.5 shrink-0 text-gris" />
      <span><span className="block font-medium first-letter:uppercase">{titulo}</span>{sub && <span className="block text-sm text-gris">{sub}</span>}</span>
    </li>
  );

  return (
    <div className="flex min-h-full flex-col">
      <div className="relative" data-foto style={{ viewTransitionName: `foto-${e.id}` }}>
        <Foto src={e.foto} priority degradado sizes="430px" className="h-[340px] w-full rounded-b-[32px]" />
        <span className="absolute bottom-4 right-4"><PestanaFecha e={e} /></span>
        {sticker && <span className="absolute -bottom-3 left-4"><Sticker tipo={sticker} id={e.id} /></span>}
        <button onClick={() => (window.history.length > 1 ? router.back() : router.push("/prototipo"))} aria-label="Volver" className={`absolute left-4 top-4 ${circ}`}><IconAtras /></button>
        <div className="absolute right-4 top-4 flex gap-2">
          <a href={wa} target="_blank" rel="noopener noreferrer" aria-label="Compartir por WhatsApp" className={circ}><IconCompartir width={20} height={20} /></a>
          <div className="relative h-11 w-11"><Corazon id={e.id} className="inset-0" /></div>
        </div>
      </div>

      <div className="flex-1 space-y-6 px-4 pb-6 pt-7">
        <div className="space-y-2">
          <ChipCategoria categoria={e.categoria} />
          <h1 className="text-[34px] leading-[1.08]">{e.titulo}</h1>
          <p className="flex flex-wrap items-center gap-1.5 text-sm text-gris">
            Organiza <span className="font-medium text-tinta">{e.organizador}</span>
            {e.verificado && <span className="inline-flex items-center gap-1 text-marca"><IconVerificado width={16} height={16} />Verificado</span>}
          </p>
        </div>

        {e.pocas && <p className="rounded-2xl bg-coral/15 px-4 py-3 text-sm font-medium text-tinta">Quedan pocos lugares. Asegura el tuyo antes de que se agoten.</p>}

        <ul className="space-y-4">
          {fila(IconCalendario, formatFecha(e.fecha, true))}
          {fila(IconReloj, e.hora)}
          <li className="-mt-1 flex flex-wrap gap-x-5 pl-[34px]"><button onClick={() => setPlan(true)} className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-medium text-acento"><IconPlanes width={16} height={16} />{planes.some((p) => p.eventos.includes(e.id)) ? "En tu plan de finde" : "Agregar a un plan"}</button><a href={cal} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center text-sm font-medium text-acento underline-offset-4 hover:underline">Agregar al calendario</a></li>
          {fila(IconPin, e.lugar, e.zona)}
          {fila(IconCoche, e.parqueo ? "Parqueo disponible" : "Sin parqueo")}
          {fila(IconPata, e.mascotas ? "Se aceptan mascotas" : "No se aceptan mascotas")}
        </ul>

        <div className="border-t border-linea pt-5">
          <h2 className="pb-2 text-lg">Acerca del evento</h2>
          <p className={`leading-relaxed text-tinta/90 ${larga && !mas ? "line-clamp-4" : ""}`}>{e.descripcion}</p>
          {larga && <button onClick={() => setMas(!mas)} aria-expanded={mas} className="mt-1 inline-flex min-h-[44px] items-center gap-1 text-sm font-medium text-acento">{mas ? "Ver menos" : "Leer más"}<IconChevron width={16} height={16} className={mas ? "rotate-180" : ""} /></button>}
        </div>

        <section aria-labelledby="info-util" className="border-t border-linea pt-5">
          <h2 id="info-util" className="pb-3 text-lg">Información útil</h2>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            {[
              ["Entrada", gratis ? "Gratis, con registro" : `Desde ${formatPrecio(e.precio)} por persona`],
              ["Edades", "Todo público"],
              ["Puertas", `Abren 30 min antes (${e.hora})`],
              ["Boleto", "QR en tu teléfono, sin imprimir"],
              ["Cambios", "Escríbele al organizador"],
              ["Qué llevar", "Tu boleto y un documento"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-2xl bg-fondo p-3"><dt className="text-xs text-gris">{k}</dt><dd className="pt-0.5 font-medium">{v}</dd></div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="como-llegar" className="border-t border-linea pt-5">
          <h2 id="como-llegar" className="text-lg">Cómo llegar <Nota className="ml-1 inline-block -rotate-3 text-acento">¡te esperamos!</Nota></h2>
          <p className="pb-3 text-sm text-gris">{e.lugar}, {e.zona}</p>
          <a href={`https://www.google.com/maps/search/?api=1&query=${direccion}`} target="_blank" rel="noopener noreferrer" aria-label={`Ver ${e.lugar} en el mapa`} className="relative mb-3 block h-40 overflow-hidden rounded-2xl border border-linea bg-fondo">
            <svg viewBox="0 0 400 160" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden="true">
              <rect width="400" height="160" fill="currentColor" className="text-lima/20" />
              <path d="M0 120 Q120 90 220 130 T400 100 V160 H0Z" fill="currentColor" className="text-oceano/20" />
              <g stroke="currentColor" className="text-linea" strokeWidth="14" fill="none" strokeLinecap="round"><path d="M-10 50 H410" /><path d="M90 -10 V170" /><path d="M280 -10 L240 170" /></g>
              <g stroke="currentColor" className="text-sup" strokeWidth="9" fill="none" strokeLinecap="round"><path d="M-10 50 H410" /><path d="M90 -10 V170" /><path d="M280 -10 L240 170" /></g>
            </svg>
            <span className="absolute left-[62%] top-[34%] -translate-x-1/2 -translate-y-1/2 text-marca"><IconPin width={40} height={40} className="drop-shadow" /></span>
            <span className="absolute bottom-2 left-2 rounded-full bg-sup/95 px-3 py-1 text-xs font-medium text-tinta">{e.zona}</span>
          </a>
          <div className="flex gap-2">
            <a className={SECUNDARIO} target="_blank" rel="noopener noreferrer" href={`https://waze.com/ul?q=${direccion}&navigate=yes`}><IconNavegar width={18} height={18} />Waze</a>
            <a className={SECUNDARIO} target="_blank" rel="noopener noreferrer" href={`https://www.google.com/maps/search/?api=1&query=${direccion}`}><IconPin width={18} height={18} />Google Maps</a>
          </div>
        </section>

        <p className="text-xs text-gris">Información confirmada por el organizador · actualizada el {formatFecha(e.actualizado)}</p>
      </div>

      <div className="sticky bottom-0 z-10 flex items-center gap-4 cristal border-t border-linea/60 px-4 pb-[max(env(safe-area-inset-bottom),12px)] pt-3">
        <div className="shrink-0">
          <p className="text-xs text-gris">{gratis ? "Entrada" : "Desde"}</p>
          <p className="text-xl font-semibold leading-none">{formatPrecio(e.precio)}</p>
        </div>
        <button onClick={() => { setCompra(true); haptico(8); }} className="inline-flex min-h-[52px] flex-1 items-center justify-center rounded-2xl bg-marca px-6 font-bold text-white shadow-suave hover:brightness-95">
          {gratis ? "Guardar mi lugar" : "Comprar entradas"}
        </button>
      </div>

      <Sheet abierto={plan} onCerrar={() => setPlan(false)} titulo="Agregar a un plan">
        <ul className="-mt-2 space-y-2">
          {planes.map((p) => {
            const esta = p.eventos.includes(e.id);
            return (
              <li key={p.id}><button onClick={() => { toggleEnPlan(p.id, e.id); haptico(5); }} aria-pressed={esta} className={`flex min-h-[52px] w-full items-center justify-between rounded-2xl px-4 text-left ring-1 ${esta ? "bg-marca/10 ring-marca" : "ring-linea"}`}>
                <span className="font-medium">{p.nombre}</span><span className="text-sm text-gris">{esta ? "Quitar" : `${p.eventos.length} eventos`}</span>
              </button></li>
            );
          })}
        </ul>
        <button onClick={() => { crearPlan(e.id); haptico(8); }} className={SECUNDARIO}><IconMas width={18} height={18} />Nuevo plan con este evento</button>
        <LinkPrimario href="/prototipo/planes">Ver mis planes</LinkPrimario>
      </Sheet>

      <Sheet abierto={compra} onCerrar={() => setCompra(false)} titulo={gratis ? "Guarda tu lugar" : "Tus entradas"}>
        <p className="-mt-3 text-sm text-gris">{e.titulo} · <span className="capitalize">{formatFecha(e.fecha)}</span></p>
        <div className="flex items-center justify-between">
          <span className="font-medium">{gratis ? "Lugares" : "Entradas"}</span>
          <div className="flex items-center gap-1">
            <button aria-label="Menos" disabled={cant <= 1} onClick={() => { setCant(cant - 1); haptico(5); }} className="flex h-11 w-11 items-center justify-center rounded-xl bg-fondo disabled:opacity-40"><IconMenos width={18} height={18} /></button>
            <span className="w-10 text-center text-xl font-bold tabular-nums" aria-live="polite">{cant}</span>
            <button aria-label="Más" disabled={cant >= 6} onClick={() => { setCant(cant + 1); haptico(5); }} className="flex h-11 w-11 items-center justify-center rounded-xl bg-fondo disabled:opacity-40"><IconMas width={18} height={18} /></button>
          </div>
        </div>
        <div className="flex items-baseline justify-between border-t border-linea pt-4">
          <span className="text-gris">Subtotal</span>
          <span className="font-display text-[28px] font-bold tabular-nums">{formatPrecio(e.precio * cant)}</span>
        </div>
        <BotonPrimario onClick={() => router.push(`/prototipo/checkout/${e.id}?cant=${cant}`)}>Continuar al pago</BotonPrimario>
      </Sheet>
    </div>
  );
}
