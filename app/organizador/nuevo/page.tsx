"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { CATEGORIAS, ZONAS, formatFecha, hoyISO, type ArteKind, type Categoria, type Pilar } from "@/lib/data";
import type { Evento } from "@/lib/data";
import { BotonPrimario } from "@/components/Botones";
import { IconAtras, IconCheck } from "@/components/Icons";

const ARTE: Record<Categoria, ArteKind> = { Mercado: "volcan", Música: "sol", Comida: "palmera", Taller: "brujula" };
const PILAR: Record<Categoria, Pilar> = { Mercado: "Emprendedurismo", Música: "Conexión", Comida: "Conexión", Taller: "Bienestar" };

function hora12(v: string) {
  const [h, m] = v.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "a. m." : "p. m."}`;
}
function restarDias(f: string, n: number) {
  const d = new Date(f + "T12:00:00");
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

function Switch({ on, onChange, label, detalle }: { on: boolean; onChange: (v: boolean) => void; label: string; detalle?: string }) {
  return (
    <button type="button" role="switch" aria-checked={on} onClick={() => onChange(!on)} className="flex min-h-[52px] w-full items-center justify-between gap-3 text-left">
      <span><span className="block font-medium">{label}</span>{detalle && <span className="block text-xs text-tinta/60">{detalle}</span>}</span>
      <span className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${on ? "bg-turquesa" : "bg-tinta/20"}`}>
        <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ${on ? "left-[22px]" : "left-0.5"}`} />
      </span>
    </button>
  );
}

const campo = "min-h-[48px] w-full rounded-2xl border border-tinta/15 bg-white px-4 text-base";

export default function Nuevo() {
  const router = useRouter();
  const { publicar } = useStore();
  const [f, setF] = useState({ titulo: "", fecha: "", hora: "", lugar: "", zona: ZONAS[0], categoria: "Mercado" as Categoria, precio: "", parqueo: false, mascotas: false, destacar: false });
  const [creado, setCreado] = useState<Evento | null>(null);
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((s) => ({ ...s, [k]: v }));

  const precio = Math.max(0, Number(f.precio) || 0);
  const valido = f.titulo.trim() && f.fecha && f.hora && f.lugar.trim();
  const hoy = hoyISO();

  function enviar(ev: React.FormEvent) {
    ev.preventDefault();
    if (!valido) return;
    setCreado(publicar({
      titulo: f.titulo.trim(), categoria: f.categoria, pilar: PILAR[f.categoria], fecha: f.fecha, hora: hora12(f.hora),
      lugar: f.lugar.trim(), zona: f.zona, precio, parqueo: f.parqueo, mascotas: f.mascotas, familias: false,
      organizador: "Tu organización", destacado: f.destacar, arte: ARTE[f.categoria], descripcion: "Evento publicado en Rumbo.",
    }));
  }

  if (creado) {
    return (
      <div className="space-y-5 px-5 pb-8 pt-12">
        <header className="text-center">
          <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-lima"><IconCheck /></span>
          <h1 className="text-3xl">¡Tu evento ya está publicado!</h1>
          <p className="mt-1 text-tinta/70">{creado.titulo} ya aparece en Explorar{creado.destacado ? ", en Destacados" : ""}.</p>
        </header>
        <section className="rounded-card bg-white p-5" aria-label="Recordatorios">
          <h2 className="text-xl">Anúnciate en redes</h2>
          <p className="mb-3 text-sm text-tinta/70">Publica en tus redes estos días antes del evento:</p>
          <ul className="space-y-2">
            {[7, 3, 1].map((n) => {
              const dia = restarDias(creado.fecha, n);
              return (
                <li key={n} className="flex min-h-[44px] items-center justify-between rounded-2xl bg-arena px-4">
                  <span className="font-bold">{n} {n === 1 ? "día" : "días"} antes</span>
                  <span className="text-sm text-tinta/70">{dia < hoy ? "ya pasó" : formatFecha(dia)}</span>
                </li>
              );
            })}
          </ul>
        </section>
        <div className="space-y-3">
          <BotonPrimario onClick={() => router.push("/organizador")}>Ver mi panel</BotonPrimario>
          <Link href="/" className="flex min-h-[48px] items-center justify-center font-bold text-oceano underline">Verlo en Explorar</Link>
        </div>
      </div>
    );
  }

  const etiqueta = (t: string) => <span className="mb-1 block text-sm font-medium">{t}</span>;

  return (
    <div className="pb-8">
      <div className="flex items-center gap-2 px-4 pt-5">
        <Link href="/organizador" aria-label="Volver" className="flex h-11 w-11 items-center justify-center rounded-full bg-white"><IconAtras /></Link>
        <h1 className="text-2xl">Publicar evento</h1>
      </div>
      <form onSubmit={enviar} className="space-y-4 px-5 pt-4">
        <label className="block">{etiqueta("Nombre del evento")}<input className={campo} value={f.titulo} onChange={(e) => set("titulo", e.target.value)} placeholder="Ej. Mercadito de fin de mes" /></label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block">{etiqueta("Fecha")}<input type="date" min={hoy} className={campo} value={f.fecha} onChange={(e) => set("fecha", e.target.value)} /></label>
          <label className="block">{etiqueta("Hora")}<input type="time" className={campo} value={f.hora} onChange={(e) => set("hora", e.target.value)} /></label>
        </div>
        <label className="block">{etiqueta("Lugar")}<input className={campo} value={f.lugar} onChange={(e) => set("lugar", e.target.value)} placeholder="Nombre del sitio" /></label>
        <label className="block">{etiqueta("Zona")}<select className={campo} value={f.zona} onChange={(e) => set("zona", e.target.value)}>{ZONAS.map((z) => <option key={z}>{z}</option>)}</select></label>

        <fieldset>
          <legend className="mb-1 text-sm font-medium">Categoría</legend>
          <div className="flex flex-wrap gap-2">
            {CATEGORIAS.map((c) => (
              <button type="button" key={c} aria-pressed={f.categoria === c} onClick={() => set("categoria", c)}
                className={`min-h-[44px] rounded-full border px-4 text-sm font-medium ${f.categoria === c ? "border-oceano bg-oceano text-white" : "border-tinta/15 bg-white"}`}>{c}</button>
            ))}
          </div>
        </fieldset>

        <div>
          <label className="block">{etiqueta("Precio de entrada (USD)")}
            <input type="number" min="0" step="0.5" inputMode="decimal" placeholder="0 si es gratis" className={campo} value={f.precio} onChange={(e) => set("precio", e.target.value)} />
          </label>
          <p className="mt-2 rounded-2xl bg-turquesa/10 p-3 text-sm" role="status">
            {precio > 0 ? "Rumbo descuenta 8% + $0.30 por entrada vendida." : "Evento gratuito: sin comisión."}
          </p>
        </div>

        <div className="divide-y divide-tinta/10 rounded-card bg-white px-4">
          <Switch on={f.parqueo} onChange={(v) => set("parqueo", v)} label="Hay parqueo" />
          <Switch on={f.mascotas} onChange={(v) => set("mascotas", v)} label="Se aceptan mascotas" />
          <Switch on={f.destacar} onChange={(v) => set("destacar", v)} label="Destacar este evento · $30" detalle="Aparece en el carrusel de Destacados." />
        </div>

        <BotonPrimario type="submit" disabled={!valido}>Publicar evento</BotonPrimario>
      </form>
    </div>
  );
}
