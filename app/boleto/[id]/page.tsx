"use client";
import { useParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { useStore } from "@/lib/store";
import { formatFecha } from "@/lib/data";
import { Foto } from "@/components/Foto";
import { LinkPrimario, SECUNDARIO } from "@/components/Botones";
import { ChipCategoria, Nota } from "@/components/Marca";
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
        <h1 className="text-xl">No encontramos este boleto</h1>
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

  return (
    <div className="space-y-5 px-4 pb-8 pt-10">
      <header className="text-center">
        <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-lima text-tinta"><IconCheck /></span>
        <h1 className="text-[34px] leading-tight">¡Hay plan!</h1>
        <Nota className="mt-1 block -rotate-2 text-oceano">nos vemos allá</Nota>
        <p className="mt-1 text-sm text-gris">Enviamos tus entradas a {b.contacto || "tu contacto"}.</p>
      </header>

      <article className="overflow-hidden rounded-[20px] border-2 border-marca">
        <Foto src={e.foto} sizes="430px" className="h-32 w-full" />
        <div className="space-y-0.5 p-4">
          <h2 className="text-lg leading-snug">{e.titulo}</h2>
          <p className="text-sm capitalize text-gris">{formatFecha(e.fecha, true)} · {e.hora}</p>
          <p className="text-sm text-gris">{e.lugar}, {e.zona}</p>
        </div>
        <div className="mx-4 border-t border-dashed border-linea" />
        <div className="flex items-center gap-4 p-4">
          <div className="rounded-lg border border-linea bg-white p-2">
            <QRCodeSVG value={`RUMBO:${codigo}:${e.id}:${b.cantidad}`} size={120} fgColor="#111827" bgColor="#FFFFFF" level="M" title={`QR del boleto ${codigo}`} />
          </div>
          <dl className="space-y-2 text-sm">
            <div><dt className="text-xs text-gris">Código</dt><dd className="font-mono text-base font-semibold tracking-wider">{codigo}</dd></div>
            <div><dt className="text-xs text-gris">Cantidad</dt><dd className="font-semibold">{b.cantidad} {b.cantidad === 1 ? "entrada" : "entradas"}</dd></div>
          </dl>
        </div>
        <p className="flex items-center gap-2 border-t border-marca/40 bg-arena px-4 py-3 text-sm text-gris">
          Sello ganado: <ChipCategoria categoria={e.categoria} /> · <span className="capitalize">{formatFecha(e.fecha)}</span>
        </p>
      </article>

      <div className="space-y-3">
        <button onClick={calendario} className={SECUNDARIO}><IconCalendario width={20} height={20} />Agregar al calendario</button>
        <a href={invitar} target="_blank" rel="noopener noreferrer" className={SECUNDARIO}><IconCompartir width={20} height={20} />Invitar a un amigo</a>
        <LinkPrimario href="/">Volver a Explorar</LinkPrimario>
      </div>
    </div>
  );
}
