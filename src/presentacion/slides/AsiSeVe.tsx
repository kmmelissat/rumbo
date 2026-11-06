"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Nota, Ondulado } from "@/components/Marca";
import { Entra } from "../componentes/Entra";
import { Flecha } from "../componentes/Garabatos";

type Pantalla = "explorar" | "ficha" | "checkout" | "boleto" | "guardados" | "boletos" | "perfil" | "bienvenida";

const NOTAS: Record<Pantalla, { etiqueta: string; puntos: string[]; accion: string }> = {
  bienvenida: {
    etiqueta: "Primer uso",
    puntos: ["Al abrir la app por primera vez, eliges lo que te mueve entre cuatro pilares: Aventura, Conexión, Emprendedurismo y Bienestar.", "Con eso armamos las recomendaciones, sin crear cuenta."],
    accion: "Elige un interés y toca Empezar a explorar.",
  },
  explorar: {
    etiqueta: "Explorar",
    puntos: ["Busca por nombre, lugar o zona y filtra por categoría: cada una tiene su color.", "Tres caminos para descubrir: lo que se mueve este finde, lo gratis y lo que está cerca de ti.", "Cada tarjeta trae fecha, un sticker de contexto y el precio, sin sorpresas."],
    accion: "Toca cualquier evento para ver su ficha.",
  },
  ficha: {
    etiqueta: "Ficha del evento",
    puntos: ["Organizador verificado, parqueo y mascotas a la vista.", "Cómo llegar con Waze o Google Maps, a un toque.", "La información está confirmada por el organizador y muestra cuándo se actualizó."],
    accion: "Toca Comprar entradas o Guardar mi lugar.",
  },
  checkout: {
    etiqueta: "Pago",
    puntos: ["El 3.8% de procesamiento va en su propia línea, y no cobramos fee de servicio.", "La política de reembolso se ve antes de pagar.", "Las entradas se apartan por 10 minutos con cuenta regresiva. No hace falta crear cuenta."],
    accion: "Escribe un correo y paga: es una simulación.",
  },
  boleto: {
    etiqueta: "Boleto",
    puntos: ["Código QR real y código del boleto.", "Se agrega al calendario o se comparte con un amigo por WhatsApp.", "Cada compra suma un sello al pasaporte."],
    accion: "Revisa tu pasaporte en la pestaña Perfil.",
  },
  guardados: {
    etiqueta: "Guardados",
    puntos: ["Los eventos con corazón se juntan aquí, listos para decidir después."],
    accion: "Guarda algo desde Explorar y míralo aparecer.",
  },
  boletos: {
    etiqueta: "Rumbo al plan",
    puntos: ["Todos tus boletos en un solo lugar, cada uno con su QR."],
    accion: "Toca un boleto para abrirlo.",
  },
  perfil: {
    etiqueta: "Perfil",
    puntos: ["El pasaporte junta un sello por cada evento al que vas, con recompensa cada cinco.", "Ajustes básicos: zona, recordatorios e intereses."],
    accion: "Compra un boleto y mira cómo se estampa el sello.",
  },
};

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

/** Marco de teléfono en CSS (390 x 844 de pantalla). */
function Telefono({ cargar }: { cargar: boolean }) {
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
            <div className="min-h-0 flex-1">
              {cargar && (
                <iframe id="rumbo-iframe" title="App de Rumbo" src="/prototipo?embed=1" className="block h-full w-full border-0" />
              )}
            </div>

            {/* Indicador de inicio */}
            <div className="relative flex h-[22px] shrink-0 items-center justify-center bg-white">
              <span className="h-[5px] w-[134px] rounded-full bg-black" aria-hidden />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AsiSeVe({ activa }: { activa: boolean }) {
  const [cargar, setCargar] = useState(false);
  const [pantalla, setPantalla] = useState<Pantalla>("explorar");
  const cajaRef = useRef<HTMLDivElement>(null);

  // El iframe se monta la primera vez que la parada se activa y se queda cargado.
  useEffect(() => { if (activa) setCargar(true); }, [activa]);

  useEffect(() => {
    const alMensaje = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      const marco = cajaRef.current?.querySelector("iframe");
      if (!marco || e.source !== marco.contentWindow) return;
      const d = e.data as { tipo?: string; ruta?: string } | null;
      if (d?.tipo === "rumbo:ruta" && typeof d.ruta === "string") setPantalla(pantallaDe(d.ruta));
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

  return (
    <div className="relative h-full w-full">
      <Entra activa={activa} desde="escala" rot={-2} className="absolute left-[150px] top-[100px]">
        <div ref={cajaRef} data-nodrag style={{ width: 420 * 0.86, height: 874 * 0.86 }}>
          <div style={{ transform: "scale(0.86)", transformOrigin: "top left", width: 420, height: 874 }}>
            <Telefono cargar={cargar} />
          </div>
        </div>
      </Entra>

      <div className="absolute left-[620px] top-[130px] w-[820px]">
        <Entra activa={activa} retraso={0.3} desde="izq">
          <h2 className="relative inline-block font-display text-[84px] font-bold leading-tight text-oceano">Así se ve Rumbo<Ondulado color="text-coral" /></h2>
        </Entra>

        <Entra activa={activa} retraso={0.5} className="mt-12">
          <div className="min-h-[430px] rounded-[28px] border-2 border-marca/40 bg-white/80 p-9">
            <AnimatePresence mode="wait">
              <motion.div key={pantalla} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.25 }}>
                <span className="inline-block rounded-lg border-[6px] border-white bg-lima px-3 text-[22px] font-bold leading-9 text-tinta shadow-md shadow-black/20 -rotate-2">{nota.etiqueta}</span>
                <ul className="mt-6 space-y-4">
                  {nota.puntos.map((p) => (
                    <li key={p} className="flex gap-4 text-[30px] leading-snug text-tinta/90">
                      <span className="mt-[14px] h-3 w-3 shrink-0 rounded-full bg-marca" aria-hidden />{p}
                    </li>
                  ))}
                </ul>
                <p className="mt-7 font-display text-[28px] font-bold text-oceano">{nota.accion}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </Entra>

        <Entra activa={activa} retraso={0.9} rot={-3} className="mt-8 flex items-center gap-4">
          <Nota className="text-[38px] text-marca">es la app de verdad, tócala</Nota>
          <Flecha className="h-[50px] w-[120px] -scale-x-100 text-coral" />
        </Entra>
        <Entra activa={activa} retraso={1} className="mt-3">
          <p className="text-[22px] text-gris">Con el celular activo, la flecha → te devuelve aquí; otra vez, avanza.</p>
        </Entra>
      </div>
    </div>
  );
}
