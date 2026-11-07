"use client";
import { Caveat } from "next/font/google";
import { motion, useReducedMotion } from "motion/react";
import { Brujula } from "../componentes/Brujula";

const caveat = Caveat({ subsets: ["latin"], weight: "600" });

const C = { crema: "#FAF6EF", noche: "#12303A", turquesa: "#0A7C7C", mostaza: "#F5B82E", terracota: "#C8553D" };

/**
 * Datos de los perfiles. Son perfiles construidos para esta propuesta, no personas entrevistadas.
 * `frase` es opcional: si está vacía no se muestra.
 */
interface Perfil {
  rol: string;
  nombre: string;
  edad: number;
  frase?: string;
  piel: string;
  pelo: string;
  /** Datos duros que se muestran como etiquetas. */
  datos: string[];
  filas: { etiqueta: string; textos: string[] }[];
}

const CLIENTES_DATOS: {
  asistente: Perfil;
  organizador: Perfil;
  otros: { asistentes: string; eventos: string; organizadores: string };
  nota: string;
} = {
  asistente: {
    rol: "Quien descubre",
    nombre: "Andrea Salazar",
    edad: 25,
    piel: "#E9B98F",
    pelo: "#2B1D16",
    datos: ["Gasta $15–$40 por salida", "Instagram · TikTok · WhatsApp"],
    filas: [
      { etiqueta: "Quién es", textos: ["Joven profesional de marketing, tecnología o finanzas en el área metropolitana de San Salvador."] },
      { etiqueta: "Qué busca", textos: ["Planes diferentes sin fricción logística."] },
      { etiqueta: "Qué le duele", textos: ["Información vieja.", "Fees sorpresa."] },
      { etiqueta: "Qué gana con Rumbo", textos: ["Ficha con dónde, a qué hora y parqueo.", "Compra con un solo QR."] },
    ],
  },
  organizador: {
    rol: "Quien organiza",
    nombre: "Camila Rivas",
    edad: 29,
    piel: "#C98F65",
    pelo: "#1E1B18",
    datos: ["Cobra $25–$50 por stand", "Todo desde el celular", "Invertiría $20–$50 por evento en promoción"],
    filas: [
      { etiqueta: "Quién es", textos: ["Productora independiente de ferias y mercaditos mensuales con 20 a 35 marcas."] },
      { etiqueta: "Qué busca", textos: ["Entre 400 y 1,500 visitantes por fin de semana."] },
      { etiqueta: "Qué le duele", textos: ["Registrar el evento es largo.", "El alcance orgánico de Instagram baja y la pauta es cara.", "Cada expositor pregunta lo mismo por DM."] },
      { etiqueta: "Qué gana con Rumbo", textos: ["Carga el evento en menos de 3 minutos.", "Evento destacado.", "Check-in por QR: asistencia real contra entradas vendidas.", "Métricas de clics, guardados y asistencia.", "Pago tras el evento."] },
    ],
  },
  otros: {
    asistentes: "Turistas, parejas, familias y grupos.",
    eventos: "Conciertos, talleres y tours.",
    organizadores: "Expositores, cafeterías, restaurantes y patrocinadores.",
  },
  nota: "Andrea y Camila son perfiles construidos para esta propuesta, no personas entrevistadas.",
};

const { asistente: ASISTENTE, organizador: ORGANIZADOR } = CLIENTES_DATOS;

function Avatar({ piel, pelo, fondo }: { piel: string; pelo: string; fondo: string }) {
  return (
    <svg aria-hidden viewBox="0 0 100 100" className="h-[96px] w-[96px] shrink-0 rounded-full" style={{ background: fondo }}>
      <path d="M14 100c2-26 18-36 36-36s34 10 36 36z" fill={C.noche} />
      <rect x="43" y="52" width="14" height="14" rx="5" fill={piel} />
      <path d="M28 44c-2-22 12-30 24-30s26 8 22 30c-2 4-4 4-6 0-6-6-22-6-34-2-4 4-6 4-6 2z" fill={pelo} />
      <ellipse cx="50" cy="44" rx="17" ry="19" fill={piel} />
      <path d="M31 40c2-14 14-20 26-18 8 2 12 8 12 18-8-8-24-10-38 0z" fill={pelo} />
      <circle cx="43" cy="46" r="2" fill={C.noche} />
      <circle cx="57" cy="46" r="2" fill={C.noche} />
      <path d="M43 55q7 6 14 0" fill="none" stroke={C.noche} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function Tarjeta({ p, acento, visible, desde }: { p: Perfil; acento: string; visible: boolean; desde: number }) {
  const rm = useReducedMotion();
  const ultima = p.filas.length - 1;
  return (
    <motion.div aria-hidden={!visible} initial={false}
      animate={visible ? { opacity: 1, y: 0, rotate: 0 } : { opacity: 0, y: 60, rotate: desde }}
      transition={rm ? { duration: 0.2 } : visible ? { type: "spring", stiffness: 90, damping: 15, delay: 0.15 } : { duration: 0.25 }}
      className="absolute left-[60px] top-[150px] w-[680px] rounded-[26px] px-7 py-6 shadow-2xl shadow-black/25"
      style={{ background: C.crema, color: C.noche }}>
      <div className="flex items-center gap-5">
        <Avatar piel={p.piel} pelo={p.pelo} fondo={acento + "55"} />
        <div>
          <p className="text-[16px] font-bold uppercase tracking-[0.16em]" style={{ color: acento === C.mostaza ? C.terracota : C.turquesa }}>{p.rol}</p>
          <p className="font-display text-[40px] font-bold leading-none">{p.nombre}</p>
          <p className="mt-1 text-[19px] opacity-70">{p.edad} años</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {p.datos.map((d) => <span key={d} className="rounded-full px-3 py-1 text-[16px] font-semibold" style={{ background: acento + "40" }}>{d}</span>)}
      </div>
      {p.frase && <p className={`${caveat.className} mt-3 border-l-4 pl-4 text-[28px] leading-[1.1]`} style={{ borderColor: acento }}>“{p.frase}”</p>}
      <dl className="mt-3 space-y-2">
        {p.filas.map((f, i) => (
          <motion.div key={f.etiqueta} initial={false} animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : 20 }}
            transition={{ duration: 0.4, delay: visible ? 0.5 + i * 0.15 : 0 }}>
            <dt className="text-[13px] font-bold uppercase tracking-[0.14em]" style={{ color: i === ultima ? C.turquesa : C.noche + "99" }}>{f.etiqueta}</dt>
            <dd className={`text-[18px] leading-[1.3] ${i === ultima ? "font-bold" : ""}`}>
              {f.textos.map((t) => <span key={t} className="block">{f.textos.length > 1 ? `· ${t}` : t}</span>)}
            </dd>
          </motion.div>
        ))}
      </dl>
    </motion.div>
  );
}

/** Pie pequeño de cada mitad: otros segmentos y, opcionalmente, la nota de alcance. */
function Pie({ visible, lineas, nota }: { visible: boolean; lineas: [string, string][]; nota?: string }) {
  return (
    <motion.div aria-hidden={!visible} initial={false} animate={{ opacity: visible ? 1 : 0 }} transition={{ duration: 0.5, delay: visible ? 1.2 : 0 }}
      className="absolute left-[60px] top-[816px] w-[640px] text-[16px] leading-snug">
      {lineas.map(([e, t]) => <p key={e}><strong>{e}:</strong> {t}</p>)}
      {nota && <p className="mt-1 italic opacity-85">{nota}</p>}
    </motion.div>
  );
}

export function Clientes({ activa, paso }: { activa: boolean; paso: number }) {
  const rm = useReducedMotion();
  const p = activa ? paso : -1;
  const resorte = rm ? { duration: 0.2 } : { type: "spring" as const, stiffness: 70, damping: 14 };
  const titulo = p === 0 ? { y: 300, scale: 1 } : { y: 24, scale: 0.5 };

  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: C.crema }}>
      {/* Mitad izquierda: asistente */}
      <motion.div initial={false} animate={{ x: p >= 0 ? 0 : -800 }} transition={resorte}
        className="absolute left-0 top-0 h-full w-[800px]" style={{ background: C.turquesa, color: C.crema }}>
        <motion.p initial={false} animate={{ opacity: p === 0 ? 1 : 0 }} transition={{ duration: 0.4, delay: p === 0 ? 0.9 : 0 }}
          className="absolute inset-x-0 bottom-[130px] text-center font-display text-[64px] font-bold">Asistente</motion.p>
        <Tarjeta p={ASISTENTE} acento={C.mostaza} visible={p >= 1} desde={-4} />
        <Pie visible={p >= 1} lineas={[["También asisten", CLIENTES_DATOS.otros.asistentes]]} nota={CLIENTES_DATOS.nota} />
      </motion.div>

      {/* Mitad derecha: organizador */}
      <motion.div initial={false} animate={{ x: p >= 0 ? 0 : 800 }} transition={resorte}
        className="absolute left-[800px] top-0 h-full w-[800px]" style={{ background: C.mostaza, color: C.noche }}>
        <motion.p initial={false} animate={{ opacity: p === 0 ? 1 : 0 }} transition={{ duration: 0.4, delay: p === 0 ? 0.9 : 0 }}
          className="absolute inset-x-0 bottom-[130px] text-center font-display text-[64px] font-bold">Organizador</motion.p>
        <Tarjeta p={ORGANIZADOR} acento={C.turquesa} visible={p >= 2} desde={4} />
        <Pie visible={p >= 2} lineas={[["También organizan", CLIENTES_DATOS.otros.eventos], ["Y se suman", CLIENTES_DATOS.otros.organizadores]]} />
      </motion.div>

      {/* Título */}
      <motion.div initial={false} animate={p >= 0 ? { opacity: 1, ...titulo } : { opacity: 0, y: -80, scale: 0.5 }}
        transition={rm ? { duration: 0.2 } : { type: "spring", stiffness: 70, damping: 16, delay: p === 0 ? 0.5 : 0 }}
        className="absolute left-[250px] top-0 w-[1100px] origin-top rounded-[36px] px-10 py-8 text-center shadow-2xl shadow-black/20"
        style={{ zIndex: 10, background: C.crema, color: C.noche }}>
        <h1 className="font-display text-[76px] font-bold leading-[1.02]">Dos lados, un mismo rumbo</h1>
        <p className={`${caveat.className} mt-4 text-[44px]`} style={{ color: C.terracota }}>(quien descubre y quien organiza)</p>
      </motion.div>

      {/* Brújula en la unión */}
      <motion.div initial={false} animate={{ opacity: p >= 0 ? 1 : 0, scale: p >= 0 ? 1 : 0.4 }}
        transition={{ type: "spring", stiffness: 120, damping: 14, delay: p >= 0 ? 0.7 : 0 }}
        className="absolute left-[750px] top-[790px]" style={{ zIndex: 12 }}>
        <Brujula size={100} activa={p >= 0} grados={90} />
      </motion.div>
    </div>
  );
}
