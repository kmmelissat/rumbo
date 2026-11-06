"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { QRCodeSVG } from "qrcode.react";
import { useStore } from "@/lib/store";
import { formatFecha } from "@/lib/data";
import { Foto } from "@/components/Foto";
import { LinkPrimario, SECUNDARIO } from "@/components/Botones";
import { ChipCategoria, Nota } from "@/components/Marca";
import { Logo } from "@/src/components/Logo";
import { COLOR_CAT } from "@/lib/data";
import { haptico } from "@/lib/haptico";
import { IconBoleto, IconCalendario, IconCheck, IconCompartir } from "@/components/Icons";

const pad = (n: number) => String(n).padStart(2, "0");

/** Convierte "9:00 a. m." / "4:30 p. m." a [h, m] en 24 h. */
function parseHora(h: string): [number, number] {
  const m = h.match(/(\d{1,2}):(\d{2})\s*([ap])/i);
  if (!m) return [9, 0];
  let hh = Number(m[1]) % 12;
  if (m[3].toLowerCase() === "p") hh += 12;
  return [hh, Number(m[2])];
}


const CONFETI = ["#0FA3A3", "#FF8A6B", "#C5E063", "#0E5A8A", "#F5B82E"];

/** Confeti discreto: pocas piezas, una sola vez, sin azar en el render. */
function Confeti() {
  const reducir = useReducedMotion();
  if (reducir) return null;
  return (
    <div className="pointer-events-none absolute inset-x-0 top-6 flex justify-center" aria-hidden>
      {Array.from({ length: 22 }, (_, i) => {
        const ang = (i / 22) * Math.PI * 2;
        const r = 70 + ((i * 37) % 60);
        return (
          <motion.i key={i} className="absolute h-2 w-1.5 rounded-[2px]" style={{ background: CONFETI[i % CONFETI.length] }}
            initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
            animate={{ x: Math.cos(ang) * r, y: Math.sin(ang) * r * 0.7 + 90, opacity: 0, rotate: 200 + i * 20, scale: 0.7 }}
            transition={{ duration: 1.5 + (i % 4) * 0.12, ease: [0.2, 0.7, 0.3, 1], delay: 0.15 }} />
        );
      })}
    </div>
  );
}

/** Pase tipo wallet: se inclina con el puntero (o el giroscopio) y deja un brillo que sigue la luz. */
function Pase({ children }: { children: React.ReactNode }) {
  const reducir = useReducedMotion();
  const rx = useSpring(useMotionValue(0), { stiffness: 180, damping: 18 });
  const ry = useSpring(useMotionValue(0), { stiffness: 180, damping: 18 });
  const bx = useMotionValue(50), by = useMotionValue(20);
  const brillo = useMotionTemplate`radial-gradient(circle at ${bx}% ${by}%, rgba(255,255,255,0.28), transparent 55%)`;
  function mover(x: number, y: number) { // x,y en 0..1
    if (reducir) return;
    ry.set((x - 0.5) * 14); rx.set((0.5 - y) * 14); bx.set(x * 100); by.set(y * 100);
  }
  return (
    <div style={{ perspective: 900 }}
      onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); mover((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height); }}
      onPointerLeave={() => { rx.set(0); ry.set(0); bx.set(50); by.set(20); }}>
      <motion.article style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        className="relative overflow-hidden rounded-[32px] bg-gradient-to-b from-[#0E5A8A] to-[#0A2E4D] text-white shadow-capas">
        {children}
        <motion.div className="pointer-events-none absolute inset-0" style={{ background: brillo }} aria-hidden />
      </motion.article>
    </div>
  );
}

export default function Boleto() {
  const { id } = useParams<{ id: string }>();
  const { boletos, eventos } = useStore();
  const b = boletos.find((x) => x.id === id);
  const e = b && eventos.find((x) => x.id === b.eventoId);
  const [wallet, setWallet] = useState(false);

  if (!b || !e) {
    return (
      <div className="space-y-4 p-6 pt-16 text-center">
        <h1 className="text-xl">No encontramos este boleto</h1>
        <LinkPrimario href="/prototipo">Volver a Explorar</LinkPrimario>
      </div>
    );
  }

  const codigo = b.codigo ?? b.id;
  const reciente = Date.now() - new Date(b.comprado).getTime() < 30000;

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
    <div className="space-y-6 px-4 pb-10 pt-10">
      <header className="relative text-center">
        {reciente && <Confeti />}
        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 380, damping: 14 }}
          className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-lima text-ink shadow-suave"><IconCheck /></motion.span>
        <h1 className="text-[40px] leading-[1.02]">¡Hay plan!</h1>
        <Nota className="mt-1 block -rotate-2 text-acento">nos vemos allá</Nota>
        <p className="mt-2 text-sm text-gris">Enviamos tus entradas a {b.contacto || "tu contacto"}.</p>
      </header>

      <Pase>
        <Foto src={e.foto} sizes="430px" degradado className="h-36 w-full" />
        <div className="absolute left-4 top-4"><Logo variant="invertida" size={26} /></div>
        <div className="-mt-12 relative space-y-1 px-5 pb-5">
          <h2 className="text-[26px] leading-tight text-white">{e.titulo}</h2>
          <p className="text-sm capitalize text-white/85">{formatFecha(e.fecha, true)} · {e.hora}</p>
          <p className="text-sm text-white/85">{e.lugar}, {e.zona}</p>
        </div>
        <div className="relative flex items-center" aria-hidden>
          <span className="-ml-3 h-6 w-6 shrink-0 rounded-full bg-sup" />
          <span className="flex-1 border-t-2 border-dashed border-white/30" />
          <span className="-mr-3 h-6 w-6 shrink-0 rounded-full bg-sup" />
        </div>
        <div className="flex flex-col items-center gap-4 px-5 pb-6 pt-5">
          <div className="rounded-3xl bg-white p-3.5 shadow-suave">
            <QRCodeSVG value={`RUMBO:${codigo}:${e.id}:${b.cantidad}`} size={196} fgColor="#111827" bgColor="#FFFFFF" level="M" title={`QR del boleto ${codigo}`} />
          </div>
          <dl className="grid w-full grid-cols-2 gap-4 text-left">
            <div><dt className="text-xs uppercase tracking-wider text-white/70">Código</dt><dd className="font-mono text-base font-semibold tracking-wider">{codigo}</dd></div>
            <div><dt className="text-xs uppercase tracking-wider text-white/70">Cantidad</dt><dd className="text-base font-semibold">{b.cantidad} {b.cantidad === 1 ? "entrada" : "entradas"}</dd></div>
          </dl>
        </div>
        <motion.div initial={{ scale: 2.4, rotate: -28, opacity: 0 }} animate={{ scale: 1, rotate: -10, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.5 }} onAnimationComplete={() => haptico(12)}
          className={`absolute bottom-5 right-4 flex h-[72px] w-[72px] flex-col items-center justify-center rounded-full border-4 border-dashed bg-white/10 text-center text-[11px] font-black uppercase leading-tight tracking-wide backdrop-blur-sm ${COLOR_CAT[e.categoria].sello}`}
          aria-label={`Sello ganado: ${e.categoria}`}>
          <span>Sello</span><span>{e.categoria}</span>
        </motion.div>
      </Pase>

      <div className="space-y-3">
        <motion.button whileTap={{ scale: 0.97 }} onClick={() => { setWallet(true); haptico(14); }} disabled={wallet}
          className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-ink px-6 text-base font-bold text-white shadow-suave ring-1 ring-white/15 disabled:opacity-90">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={String(wallet)} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="inline-flex items-center gap-2">
              {wallet ? <><IconCheck width={20} height={20} className="text-lima" />Agregado a Wallet (simulado)</> : <><IconBoleto width={20} height={20} />Agregar a Wallet</>}
            </motion.span>
          </AnimatePresence>
        </motion.button>
        <button onClick={calendario} className={SECUNDARIO}><IconCalendario width={20} height={20} />Agregar al calendario</button>
        <a href={invitar} target="_blank" rel="noopener noreferrer" className={SECUNDARIO}><IconCompartir width={20} height={20} />Invitar a un amigo</a>
        <LinkPrimario href="/prototipo">Volver a Explorar</LinkPrimario>
      </div>
    </div>
  );
}
