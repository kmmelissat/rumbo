"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { formatFecha, formatPrecio } from "@/lib/data";
import { Foto } from "@/components/Foto";
import { BotonPrimario, LinkPrimario } from "@/components/Botones";
import { IconAtras, IconCandado, IconMas, IconMenos, IconPin, IconReloj } from "@/components/Icons";

const APARTADO_MS = 10 * 60 * 1000;
const FEE = 0.038;
const redondear = (n: number) => Math.round(n * 100) / 100;

function contactoValido(v: string) {
  const t = v.trim();
  if (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(t)) return true;
  return t.replace(/\D/g, "").length >= 8 && /^[+\d\s()-]+$/.test(t);
}

export default function Checkout() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { eventos, comprar } = useStore();
  const [cant, setCant] = useState(1);
  const [contacto, setContacto] = useState("");
  const [tocado, setTocado] = useState(false);
  const [pagando, setPagando] = useState(false);
  const [limite, setLimite] = useState(() => Date.now() + APARTADO_MS);
  const [restante, setRestante] = useState(APARTADO_MS);

  useEffect(() => {
    const tick = () => setRestante(Math.max(0, limite - Date.now()));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [limite]);

  const e = eventos.find((x) => x.id === id);
  if (!e) {
    return (
      <div className="space-y-4 p-6 pt-16 text-center">
        <h1 className="text-xl">No encontramos este evento</h1>
        <LinkPrimario href="/">Volver a explorar</LinkPrimario>
      </div>
    );
  }

  const subtotal = redondear(e.precio * cant);
  const proc = redondear(subtotal * FEE);
  const total = redondear(subtotal + proc);
  const expirado = restante === 0;
  const mm = String(Math.floor(restante / 60000)).padStart(2, "0");
  const ss = String(Math.floor((restante % 60000) / 1000)).padStart(2, "0");
  const valido = contactoValido(contacto);
  const gratis = e.precio === 0;

  function pagar() {
    setTocado(true);
    if (!valido || expirado || pagando || !e) return;
    setPagando(true);
    setTimeout(() => {
      const b = comprar(e, cant, contacto.trim());
      router.push(`/boleto/${b.id}`);
    }, 1200);
  }

  const fila = "flex items-center justify-between";
  const paso = "flex h-11 w-11 items-center justify-center rounded-lg border border-linea disabled:opacity-40";

  return (
    <div className="pb-8">
      <div className="flex items-center gap-1 border-b border-linea px-2 py-2">
        <button onClick={() => router.back()} aria-label="Volver" className="flex h-11 w-11 items-center justify-center"><IconAtras /></button>
        <h1 className="text-lg">{gratis ? "Guardar mi lugar" : "Pago"}</h1>
      </div>

      <div className="space-y-5 px-4 pt-4">
        <div role="timer" className={`flex items-center gap-3 rounded-xl border p-3 text-sm ${expirado ? "border-coral bg-coral/10" : "border-marca/40 bg-arena"}`}>
          <IconReloj width={20} height={20} className="shrink-0 text-gris" />
          {expirado ? (
            <div className="flex-1">
              <p className="font-semibold">Se acabó el tiempo de apartado</p>
              <button onClick={() => setLimite(Date.now() + APARTADO_MS)} className="min-h-[44px] font-semibold text-marca">Apartar de nuevo</button>
            </div>
          ) : (
            <p className="flex-1">Tus entradas quedan apartadas por 10 minutos. <strong className="tabular-nums">{mm}:{ss}</strong></p>
          )}
        </div>

        <section className="flex gap-3" aria-label="Resumen del evento">
          <Foto src={e.foto} sizes="88px" className="h-[88px] w-[88px] shrink-0 rounded-[20px]" />
          <div className="min-w-0 space-y-0.5">
            <h2 className="line-clamp-2 text-base leading-snug">{e.titulo}</h2>
            <p className="text-sm capitalize text-gris">{formatFecha(e.fecha, true)} · {e.hora}</p>
            <p className="flex items-center gap-1 text-sm text-gris"><IconPin width={14} height={14} />{e.lugar}</p>
          </div>
        </section>

        <section className={`${fila} border-t border-linea pt-4`} aria-label="Cantidad">
          <span className="font-medium">{gratis ? "Lugares" : "Entradas"}</span>
          <div className="flex items-center gap-1">
            <button aria-label="Menos" disabled={cant <= 1} onClick={() => setCant(cant - 1)} className={paso}><IconMenos width={18} height={18} /></button>
            <span className="w-8 text-center text-lg font-semibold" aria-live="polite">{cant}</span>
            <button aria-label="Más" disabled={cant >= 6} onClick={() => setCant(cant + 1)} className={paso}><IconMas width={18} height={18} /></button>
          </div>
        </section>

        <section className="space-y-2 border-t border-linea pt-4" aria-label="Desglose">
          <div className={fila}><span>Subtotal ({cant} × {formatPrecio(e.precio)})</span><span>{formatPrecio(subtotal)}</span></div>
          <div className={`${fila} text-sm text-gris`}><span>Costo de procesamiento del pago</span><span>{formatPrecio(proc)}</span></div>
          <div className={`${fila} border-t border-linea pt-2 text-lg font-semibold`}><span>Total</span><span>{formatPrecio(total)}</span></div>
          <p className="text-xs text-gris">Sin fee de servicio. El procesamiento es el 3.8% del subtotal.</p>
        </section>

        <section className="space-y-2 border-t border-linea pt-4">
          <label htmlFor="contacto" className="block font-medium">Correo o WhatsApp</label>
          <input id="contacto" value={contacto} onChange={(ev) => setContacto(ev.target.value)} onBlur={() => setTocado(true)}
            inputMode="email" autoComplete="email" placeholder="tu@correo.com o +503 7000 0000"
            aria-invalid={tocado && !valido} aria-describedby="contacto-ayuda"
            className={`min-h-[48px] w-full rounded-xl border px-4 text-base ${tocado && !valido ? "border-coral" : "border-linea"}`} />
          <p id="contacto-ayuda" className={`text-xs ${tocado && !valido ? "font-semibold text-tinta" : "text-gris"}`}>
            {tocado && !valido ? "Escribe un correo o un número de WhatsApp válido." : "Aquí te enviamos tus entradas. No necesitas crear cuenta."}
          </p>
        </section>

        <div className="space-y-2 rounded-[20px] bg-arena p-3 text-xs leading-relaxed text-gris">
          <p className="flex items-center gap-2 text-sm font-semibold text-tinta"><IconCandado width={16} height={16} className="text-marca" />Pago seguro. Tu plan está en buenas manos.</p>
          <p><strong className="text-tinta">Política de reembolso:</strong> puedes pedir reembolso del subtotal hasta 48 horas antes del evento. Si el organizador cancela, te devolvemos todo.</p>
        </div>

        <BotonPrimario onClick={pagar} disabled={expirado || pagando}>
          {pagando ? "Procesando…" : gratis ? "Confirmar mi lugar" : `Pagar ${formatPrecio(total)}`}
        </BotonPrimario>
      </div>
    </div>
  );
}
