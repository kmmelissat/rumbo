"use client";
import { useEffect, useRef, useState, type ComponentType, type SVGProps } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Caveat } from "next/font/google";
import { Nota, Ondulado } from "@/components/Marca";
import { LogoIcon } from "@/src/components/Logo";
import { Entra } from "../componentes/Entra";
import { Cruz, Espiral, Flecha, Ola, Sol, Volcan } from "../componentes/Garabatos";

const caveat = Caveat({ subsets: ["latin"], weight: "600" });

type Pantalla = "explorar" | "ficha" | "checkout" | "boleto" | "guardados" | "boletos" | "perfil" | "bienvenida";
type Garabato = ComponentType<SVGProps<SVGSVGElement>>;
type StickerDef = { Icono: Garabato; fondo: string; trazo: string; left: number; top: number; rot: number };

const OSC = "#12303A";

const NOTAS: Record<Pantalla, {
  etiqueta: string; puntos: string[]; accion: string;
  color: string; texto: string; rot: number; stickers: StickerDef[];
}> = {
  bienvenida: {
    etiqueta: "Primer uso",
    puntos: ["Eliges lo que te mueve, sin crear cuenta.", "Con eso armamos tus recomendaciones."],
    accion: "Toca Empezar a explorar",
    color: "#2F6B3F", texto: "#FFFFFF", rot: -1.5,
    stickers: [
      { Icono: Sol, fondo: "#F5B82E", trazo: OSC, left: 1478, top: 250, rot: 8 },
      { Icono: Volcan, fondo: "#C5E063", trazo: OSC, left: 1470, top: 540, rot: -9 },
    ],
  },
  explorar: {
    etiqueta: "Explorar",
    puntos: ["Busca por nombre, lugar o zona.", "Cada tarjeta trae fecha, precio y contexto."],
    accion: "Toca un evento para ver su ficha",
    color: "#0FA3A3", texto: "#FFFFFF", rot: 1.5,
    stickers: [
      { Icono: Ola, fondo: "#FAF6EF", trazo: "#0A7C7C", left: 1478, top: 260, rot: -8 },
      { Icono: Sol, fondo: "#F5B82E", trazo: OSC, left: 1472, top: 540, rot: 10 },
    ],
  },
  ficha: {
    etiqueta: "Ficha del evento",
    puntos: ["Organizador verificado, parqueo, mascotas.", "Cómo llegar con Waze o Google Maps."],
    accion: "Toca Comprar entradas",
    color: "#F28F6B", texto: OSC, rot: -2,
    stickers: [
      { Icono: Cruz, fondo: "#FAF6EF", trazo: "#F28F6B", left: 1476, top: 270, rot: 9 },
    ],
  },
  checkout: {
    etiqueta: "Pago",
    puntos: ["3.8% de procesamiento, sin fee de servicio.", "Entradas apartadas por 10 minutos."],
    accion: "Escribe un correo y paga: pago de demostración",
    color: "#F5B82E", texto: OSC, rot: 1,
    stickers: [
      { Icono: Espiral, fondo: "#0A7C7C", trazo: "#FAF6EF", left: 1476, top: 255, rot: -10 },
      { Icono: Cruz, fondo: "#C5E063", trazo: OSC, left: 1480, top: 545, rot: 7 },
    ],
  },
  boleto: {
    etiqueta: "Boleto",
    puntos: ["Código QR real, calendario y WhatsApp.", "Cada compra suma un sello al pasaporte."],
    accion: "Revisa tu pasaporte en Perfil",
    color: "#C5E063", texto: OSC, rot: -1,
    stickers: [
      { Icono: Sol, fondo: "#F28F6B", trazo: OSC, left: 1476, top: 265, rot: 8 },
      { Icono: Ola, fondo: "#FAF6EF", trazo: "#0A7C7C", left: 1472, top: 545, rot: -7 },
    ],
  },
  guardados: {
    etiqueta: "Guardados",
    puntos: ["Tus eventos con corazón, juntos aquí."],
    accion: "Guarda uno desde Explorar",
    color: "#0E5A8A", texto: "#FFFFFF", rot: 2,
    stickers: [
      { Icono: Espiral, fondo: "#F5B82E", trazo: OSC, left: 1478, top: 280, rot: -9 },
    ],
  },
  boletos: {
    etiqueta: "Rumbo al plan",
    puntos: ["Todos tus boletos, cada uno con su QR."],
    accion: "Toca un boleto para abrirlo",
    color: "#0E5A8A", texto: "#FFFFFF", rot: -2,
    stickers: [
      { Icono: Cruz, fondo: "#C5E063", trazo: OSC, left: 1476, top: 285, rot: 10 },
    ],
  },
  perfil: {
    etiqueta: "Perfil",
    puntos: ["Un sello por evento, premio cada cinco.", "Ajustes: zona, recordatorios e intereses."],
    accion: "Compra un boleto y mira el sello",
    color: "#8B6FD6", texto: "#FFFFFF", rot: 1.5,
    stickers: [
      { Icono: Volcan, fondo: "#F5B82E", trazo: OSC, left: 1474, top: 255, rot: -8 },
      { Icono: Sol, fondo: "#FAF6EF", trazo: "#8B6FD6", left: 1480, top: 545, rot: 9 },
    ],
  },
};

const RECORRIDO: { id: Pantalla; nombre: string }[] = [
  { id: "explorar", nombre: "Explorar" },
  { id: "ficha", nombre: "Ficha" },
  { id: "checkout", nombre: "Pago" },
  { id: "boleto", nombre: "Boleto" },
  { id: "perfil", nombre: "Perfil" },
];

function pantallaDe(ruta: string): Pantalla {
  const r = ruta.replace(/^\/prototipo/, "") || "/";
  if (r.startsWith("/evento/")) return "ficha";
  if (r.startsWith("/checkout/")) return "checkout";
  if (r.startsWith("/boleto/")) return "boleto";
  if (r.startsWith("/guardados")) return "guardados";
  if (r.startsWith("/boletos")) return "boletos";
  if (r.startsWith("/perfil")) return "perfil";
  if (r.startsWith("/bienvenida")) return "bienvenida";
  return "explorar";
}

/** Pantalla de carga dentro del celular: crema, logo y brújula girando. */
function Cargando({ gira }: { gira: boolean }) {
  return (
    <motion.div
      className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-7"
      style={{ background: "#FAF6EF" }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <LogoIcon size={96} />
      <motion.svg
        width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden
        animate={gira ? { rotate: 360 } : { rotate: 0 }}
        transition={gira ? { duration: 2.4, ease: "linear", repeat: Infinity } : { duration: 0 }}
      >
        <circle cx="28" cy="28" r="24" stroke="#0A7C7C" strokeWidth="3" />
        <path d="M28 8 L34 28 L28 48 L22 28 Z" fill="#F28F6B" />
        <path d="M28 8 L34 28 L22 28 Z" fill="#12303A" />
        <circle cx="28" cy="28" r="3" fill="#FAF6EF" />
      </motion.svg>
    </motion.div>
  );
}

/** Marco de teléfono en CSS (390 x 844 de pantalla). */
function Telefono({ cargar, listo, alCargar, gira }: { cargar: boolean; listo: boolean; alCargar: () => void; gira: boolean }) {
  return (
    <div className="relative" style={{ width: 420, height: 874 }}>
      {/* Botones laterales */}
      <span className="absolute -left-[4px] top-[130px] h-[34px] w-[5px] rounded-l-sm bg-[#9a9a9f]" aria-hidden />
      <span className="absolute -left-[4px] top-[190px] h-[62px] w-[5px] rounded-l-sm bg-[#9a9a9f]" aria-hidden />
      <span className="absolute -left-[4px] top-[264px] h-[62px] w-[5px] rounded-l-sm bg-[#9a9a9f]" aria-hidden />
      <span className="absolute -right-[4px] top-[220px] h-[96px] w-[5px] rounded-r-sm bg-[#9a9a9f]" aria-hidden />

      {/* Marco de titanio */}
      <div
        className="absolute inset-0 rounded-[68px] p-[3px] shadow-[0_40px_80px_-10px_rgba(0,0,0,0.55)]"
        style={{ background: "linear-gradient(145deg,#d9d9dd 0%,#8e8e93 25%,#c9c9ce 50%,#7b7b80 78%,#cfcfd4 100%)" }}
      >
        {/* Bisel negro */}
        <div className="h-full w-full rounded-[65px] bg-black p-[12px]">
          {/* Pantalla */}
          <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[53px] bg-white">
            {/* Barra de estado */}
            <div className="relative z-10 flex h-[50px] shrink-0 items-end justify-between bg-white px-[30px] pb-[6px]">
              <span className="text-[16px] font-semibold tracking-tight text-black">9:41</span>
              <span className="absolute left-1/2 top-[11px] h-[32px] w-[110px] -translate-x-1/2 rounded-full bg-black" aria-hidden />
              <span className="flex items-center gap-[6px]" aria-hidden>
                <svg width="19" height="12" viewBox="0 0 19 12" fill="#000"><rect x="0" y="8" width="3" height="4" rx="0.8"/><rect x="5" y="5.5" width="3" height="6.5" rx="0.8"/><rect x="10" y="3" width="3" height="9" rx="0.8"/><rect x="15" y="0" width="3" height="12" rx="0.8"/></svg>
                <svg width="17" height="12" viewBox="0 0 17 12" fill="none" stroke="#000" strokeWidth="1.8" strokeLinecap="round"><path d="M1.5 4.3a10 10 0 0 1 14 0"/><path d="M4 7a6.4 6.4 0 0 1 9 0"/><circle cx="8.5" cy="10" r="1.1" fill="#000" stroke="none"/></svg>
                <svg width="27" height="13" viewBox="0 0 27 13" fill="none"><rect x="0.5" y="0.5" width="23" height="12" rx="3.6" stroke="#000" opacity="0.4"/><rect x="2" y="2" width="20" height="9" rx="2.4" fill="#000"/><path d="M25 4.5v4c.8-.3 1.5-1.1 1.5-2s-.7-1.7-1.5-2z" fill="#000" opacity="0.45"/></svg>
              </span>
            </div>

            {/* La app real */}
            <div className="relative min-h-0 flex-1">
              {cargar && (
                <iframe id="rumbo-iframe" title="App de Rumbo" src="/prototipo?embed=1" onLoad={alCargar} className="block h-full w-full border-0" />
              )}
              <AnimatePresence>{!listo && <Cargando key="cargando" gira={gira} />}</AnimatePresence>
            </div>

            {/* Indicador de inicio */}
            <div className="relative flex h-[22px] shrink-0 items-center justify-center bg-white">
              <span className="h-[5px] w-[134px] rounded-full bg-black" aria-hidden />
            </div>

            {/* Reflejo diagonal: no captura clics */}
            <div
              className="pointer-events-none absolute inset-0 z-20"
              style={{ background: "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.10) 42%, rgba(255,255,255,0.03) 52%, transparent 62%)" }}
              aria-hidden
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Check({ rm }: { rm: boolean }) {
  return (
    <motion.svg
      width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden
      initial={rm ? { opacity: 0 } : { opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={rm ? { duration: 0.2 } : { type: "spring", stiffness: 420, damping: 14 }}
    >
      <circle cx="9" cy="9" r="9" fill="#0A7C7C" />
      <path d="M5 9.3 L8 12.2 L13 6.2" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </motion.svg>
  );
}

export function AsiSeVe({ activa }: { activa: boolean }) {
  const rm = !!useReducedMotion();
  const [cargar, setCargar] = useState(false);
  const [listo, setListo] = useState(false);
  const [pantalla, setPantalla] = useState<Pantalla>("explorar");
  const [vistas, setVistas] = useState<Pantalla[]>([]);
  const cajaRef = useRef<HTMLDivElement>(null);

  // El iframe se monta la primera vez que la parada se activa y se queda cargado.
  useEffect(() => { if (activa) setCargar(true); }, [activa]);

  useEffect(() => {
    const alMensaje = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      const marco = cajaRef.current?.querySelector("iframe");
      if (!marco || e.source !== marco.contentWindow) return;
      const d = e.data as { tipo?: string; ruta?: string } | null;
      if (d?.tipo === "rumbo:ruta" && typeof d.ruta === "string") {
        // Solo el celular marca pantallas como vistas.
        const p = pantallaDe(d.ruta);
        setPantalla(p);
        setVistas((v) => (v.includes(p) ? v : [...v, p]));
      }
      else if (d?.tipo === "rumbo:salir") {
        // Primera flecha dentro del celular: devuelve el foco a la presentación.
        marco.blur();
        window.focus();
      }
    };
    window.addEventListener("message", alMensaje);
    return () => window.removeEventListener("message", alMensaje);
  }, []);

  const nota = NOTAS[pantalla];
  const animar = activa && !rm;
  const completo = RECORRIDO.every((p) => vistas.includes(p.id));

  return (
    <div className="relative h-full w-full">
      <Entra activa={activa} desde="escala" rot={-2} className="absolute left-[150px] top-[100px]">
        <div ref={cajaRef} data-nodrag className="relative" style={{ width: 420 * 0.86, height: 874 * 0.86 }}>
          {/* Sombra elíptica en el piso */}
          <motion.div
            className="pointer-events-none absolute -bottom-[26px] left-[10%] right-[10%] h-[34px] rounded-[50%]"
            style={{ background: "radial-gradient(ellipse at center, rgba(18,48,58,0.38) 0%, rgba(18,48,58,0) 70%)" }}
            animate={animar ? { scaleX: [1, 1.06, 1], opacity: [0.7, 1, 0.7] } : { scaleX: 1, opacity: 0.85 }}
            transition={animar ? { duration: 5, ease: "easeInOut", repeat: Infinity } : { duration: 0.3 }}
            aria-hidden
          />
          <div style={{ transform: "scale(0.86)", transformOrigin: "top left", width: 420, height: 874 }}>
            {/* Inclinación 3D que se asienta */}
            <motion.div
              style={{ transformPerspective: 1400, transformOrigin: "50% 100%" }}
              initial={false}
              animate={activa || rm ? { rotateX: 0, rotateY: 0 } : { rotateX: rm ? 0 : 14, rotateY: rm ? 0 : -12 }}
              transition={activa ? { type: "spring", stiffness: 60, damping: 14, delay: 0.4 } : { duration: 0.25 }}
            >
              <Telefono cargar={cargar} listo={listo} alCargar={() => setListo(true)} gira={animar} />
            </motion.div>
          </div>
        </div>
      </Entra>

      <div className="absolute left-[620px] top-[130px] w-[820px]">
        <Entra activa={activa} retraso={0.3} desde="izq">
          <h2 className="relative inline-block font-display text-[84px] font-bold leading-tight text-oceano">Así se ve Rumbo<Ondulado color="text-coral" /></h2>
        </Entra>

        {/* Recorrido guiado: solo informa */}
        <Entra activa={activa} retraso={0.4} className="relative mt-5">
          <ol className="flex items-center gap-3" aria-label="Recorrido por la app">
            {RECORRIDO.map((p) => {
              const actual = p.id === pantalla;
              const visto = vistas.includes(p.id);
              const c = NOTAS[p.id];
              return (
                <li
                  key={p.id}
                  aria-current={actual ? "step" : undefined}
                  className="flex h-[44px] items-center gap-2 rounded-full border-2 px-4 text-[20px] font-bold"
                  style={{
                    borderColor: actual ? c.color : visto ? "#0A7C7C66" : "#12303A26",
                    background: actual ? c.color : "#FFFFFFB3",
                    color: actual ? c.texto : visto ? OSC : "#12303A99",
                    transition: "background-color .25s, border-color .25s, color .25s",
                  }}
                >
                  {p.nombre}
                  {visto && (!actual || completo) && <Check rm={rm} />}
                </li>
              );
            })}
          </ol>
          <AnimatePresence>
            {completo && (
              <motion.div
                key="completo"
                className="pointer-events-none absolute left-1 top-full mt-3 flex items-center gap-3"
                initial={rm ? { opacity: 0 } : { opacity: 0, scale: 0.6, rotate: -8 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0 }}
                transition={rm ? { duration: 0.25 } : { type: "spring", stiffness: 260, damping: 13 }}
              >
                <svg width="40" height="40" viewBox="0 0 64 64" fill="none" aria-hidden>
                  <circle cx="32" cy="32" r="29" stroke="#F28F6B" strokeWidth="3" strokeDasharray="3 4" />
                  <path d="M32 15 L36 32 L32 49 L28 32 Z" fill="#F28F6B" />
                  <circle cx="32" cy="32" r="3" fill="#FAF6EF" />
                </svg>
                <span className={`${caveat.className} text-[30px] leading-none text-coral`}>recorrido completo</span>
              </motion.div>
            )}
          </AnimatePresence>
        </Entra>

        {/* Nota adhesiva con vida */}
        <Entra activa={activa} retraso={0.5} className="mt-[84px]">
          <motion.div
            animate={animar ? { y: [0, -3, 0, 3, 0], rotate: [0, 1, 0, -1, 0] } : { y: 0, rotate: 0 }}
            transition={animar ? { duration: 9, ease: "easeInOut", repeat: Infinity } : { duration: 0.3 }}
          >
            <div className="min-h-[300px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={pantalla}
                  className="rounded-[26px] border-[4px] bg-[#FFFDF6] p-8 shadow-[0_18px_30px_-12px_rgba(18,48,58,0.35)]"
                  style={{ borderColor: nota.color }}
                  initial={rm ? { opacity: 0 } : { opacity: 0, y: 50, rotate: nota.rot + 4, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, rotate: rm ? 0 : nota.rot, scale: 1 }}
                  exit={rm ? { opacity: 0 } : { opacity: 0, y: -30, rotate: nota.rot - 4, scale: 0.94 }}
                  transition={rm ? { duration: 0.2 } : { type: "spring", stiffness: 220, damping: 16, exit: { duration: 0.2 } } as object}
                >
                  <span
                    className="inline-block -rotate-2 rounded-lg border-[6px] border-white px-3 text-[22px] font-bold leading-9 shadow-md shadow-black/20"
                    style={{ background: nota.color, color: nota.texto }}
                  >{nota.etiqueta}</span>
                  <ul className="mt-5 space-y-3">
                    {nota.puntos.map((p) => (
                      <li key={p} className="flex gap-4 text-[28px] leading-snug text-tinta/90">
                        <span className="mt-[14px] h-3 w-3 shrink-0 rounded-full" style={{ background: nota.color }} aria-hidden />{p}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex items-center gap-3">
                    <motion.span
                      className="inline-flex"
                      animate={animar ? { x: [0, -10, 0] } : { x: 0 }}
                      transition={animar ? { duration: 1.4, ease: "easeInOut", repeat: Infinity } : { duration: 0.2 }}
                    >
                      <Flecha className="h-[44px] w-[100px] -scale-x-100" style={{ color: nota.color }} />
                    </motion.span>
                    <span
                      className="rounded-full px-5 py-2 font-display text-[26px] font-bold leading-tight shadow-md shadow-black/15"
                      style={{ background: nota.color, color: nota.texto }}
                    >{nota.accion}</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </Entra>

        <Entra activa={activa} retraso={0.9} className="mt-5">
          <p className="text-[20px] text-gris">Toca la app. La flecha → vuelve aquí.</p>
        </Entra>
        <Entra activa={activa} retraso={1} rot={-3} className="mt-5 flex items-center gap-3">
          <Flecha className="h-[40px] w-[90px] -scale-x-100 text-marca" />
          <Nota className="text-[34px] text-marca">es la app de verdad, tócala</Nota>
        </Entra>
      </div>

      {/* Stickers fuera del celular y del texto */}
      <AnimatePresence>
        {activa && nota.stickers.slice(0, 2).map((s, i) => (
          <motion.div
            key={`${pantalla}-${i}`}
            className="pointer-events-none absolute flex h-[80px] w-[80px] items-center justify-center rounded-full border-[6px] border-white shadow-lg shadow-black/25"
            style={{ left: i === 0 ? 1470 : 524, top: i === 0 ? 330 : 600, background: s.fondo, color: s.trazo }}
            initial={rm ? { opacity: 0 } : { opacity: 0, scale: 0, rotate: s.rot - 25 }}
            animate={{ opacity: 1, scale: 1, rotate: rm ? 0 : s.rot }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            transition={rm ? { duration: 0.2 } : { type: "spring", stiffness: 320, damping: 11, delay: 0.25 + i * 0.1 }}
            aria-hidden
          >
            <s.Icono className="h-[44px] w-[44px]" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
