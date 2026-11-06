"use client";
import { useParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { useStore } from "@/lib/store";
import { formatFecha } from "@/lib/data";
import { Art } from "@/components/Art";
import { LinkPrimario } from "@/components/Botones";
import { IconCalendario, IconCheck, IconCompartir } from "@/components/Icons";

const pad = (n: number) => String(n).padStart(2, "0");

/** Convierte "9:00 a. m." / "4:30 p. m." a [h, m] en 24 h. */
function parseHora(h: string): [number, number] {
  const m = h.match(/(\d{1,2}):(\d{2})\s*([ap])/i);
  if (!m) return [9, 0];
  let hh = Number(m[1]) % 12;
  if (m[3].toLowerCase() === "p") hh += 12;
  return [hh, Number(m[2])];
}

export default function Boleto() {
  const { id } = useParams<{ id: string }>();
  const { boletos, eventos } = useStore();
  const b = boletos.find((x) => x.id === id);
  const e = b && eventos.find((x) => x.id === b.eventoId);

  if (!b || !e) {
    return (
      <div className="space-y-4 p-6 pt-16 text-center">
        <h1 className="text-2xl">No encontramos este boleto</h1>
        <LinkPrimario href="/">Volver a Explorar</LinkPrimario>
      </div>
    );
  }

  const codigo = b.codigo ?? b.id;

  function calendario() {
    if (!e || !b) return;
    const [hh, mm] = parseHora(e.hora);
    const [y, mo, d] = e.fecha.split("-");
    const ini = `${y}${mo}${d}T${pad(hh)}${pad(mm)}00`;
    const fin = `${y}${mo}${d}T${pad((hh + 3) % 24)}${pad(mm)}00`;
    const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Rumbo//ES", "BEGIN:VEVENT", `UID:${codigo}@rumbo`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").slice(0, 15)}Z`, `DTSTART:${ini}`, `DTEND:${fin}`,
      `SUMMARY:${e.titulo}`, `LOCATION:${e.lugar}, ${e.zona}`, `DESCRIPTION:Boleto ${codigo} (${b.cantidad})`, "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url; a.download = "rumbo-evento.ics"; a.click();
    URL.revokeObjectURL(url);
  }

  const invitar = `https://wa.me/?text=${encodeURIComponent(`¡Hay plan! Voy a ${e.titulo} el ${formatFecha(e.fecha, true)} en ${e.lugar}, ${e.zona}. ¿Te animas?`)}`;
  const sec = "inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full border-2 border-oceano px-6 font-bold text-oceano";

  return (
    <div className="space-y-5 px-5 pb-8 pt-10">
      <header className="text-center">
        <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-lima"><IconCheck /></span>
        <h1 className="text-4xl">¡Hay plan!</h1>
        <p className="mt-1 text-tinta/70">Enviamos tus entradas a {b.contacto || "tu contacto"}.</p>
      </header>

      <article className="relative overflow-hidden rounded-card bg-white shadow-[0_10px_30px_-14px_rgba(15,42,58,.5)]">
        <div className="h-28"><Art kind={e.arte} className="h-full w-full" /></div>
        <div className="space-y-1 p-5">
          <h2 className="text-xl leading-tight">{e.titulo}</h2>
          <p className="text-sm text-tinta/70">{formatFecha(e.fecha, true)} · {e.hora}</p>
          <p className="text-sm text-tinta/70">{e.lugar}, {e.zona}</p>
        </div>
        <div className="relative mx-4 border-t-2 border-dashed border-tinta/20" />
        <div className="flex items-center gap-4 p-5">
          <div className="rounded-2xl border border-tinta/10 bg-white p-2">
            <QRCodeSVG value={`RUMBO:${codigo}:${e.id}:${b.cantidad}`} size={120} fgColor="#0F2A3A" bgColor="#FFFFFF" level="M" title={`QR del boleto ${codigo}`} />
          </div>
          <dl className="space-y-2 text-sm">
            <div><dt className="text-xs text-tinta/60">Código</dt><dd className="font-mono text-base font-bold tracking-wider">{codigo}</dd></div>
            <div><dt className="text-xs text-tinta/60">Cantidad</dt><dd className="font-bold">{b.cantidad} {b.cantidad === 1 ? "entrada" : "entradas"}</dd></div>
          </dl>
        </div>
        <div aria-label={`Sello: ${e.categoria}, ${formatFecha(e.fecha)}`} className="absolute right-3 top-20 flex h-20 w-20 rotate-12 flex-col items-center justify-center rounded-full border-4 border-dashed border-coral bg-arena/90 text-center text-coral">
          <span className="font-display text-sm leading-none">{e.categoria}</span>
          <span className="mt-1 text-[11px] font-bold uppercase leading-none text-tinta">{formatFecha(e.fecha)}</span>
        </div>
      </article>

      <div className="space-y-3">
        <button onClick={calendario} className={sec}><IconCalendario />Agregar al calendario</button>
        <a href={invitar} target="_blank" rel="noopener noreferrer" className={sec}><IconCompartir />Invitar a un amigo</a>
        <LinkPrimario href="/">Volver a Explorar</LinkPrimario>
      </div>
    </div>
  );
}
