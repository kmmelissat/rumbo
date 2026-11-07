"use client";
import { Caveat } from "next/font/google";
import { motion, useReducedMotion } from "motion/react";
import { Brujula } from "../componentes/Brujula";

const caveat = Caveat({ subsets: ["latin"], weight: "600" });

const C = { crema: "#FAF6EF", noche: "#12303A", turquesa: "#0A7C7C", mostaza: "#F5B82E", terracota: "#C8553D" };

interface Perfil {
  rol: string;
  nombre: string;
  edad: string;
  frase: string;
  piel: string;
  pelo: string;
  filas: { etiqueta: string; texto: string }[];
}

const ASISTENTE: Perfil = {
  rol: "Quien descubre",
  nombre: "Andrea",
  edad: "26 años aprox.",
  frase: "Quiero un plan distinto este fin de semana, sin pasarme horas buscando.",
  piel: "#E9B98F",
  pelo: "#2B1D16",
  filas: [
    { etiqueta: "Quién es", texto: "Joven adulto salvadoreño que busca planes distintos los fines de semana." },
    { etiqueta: "Qué busca", texto: "Aventura, conexión y bienestar sin tener que investigar durante horas." },
    { etiqueta: "Qué le duele", texto: "Eventos regados, enterarse tarde, no saber si vale la pena." },
    { etiqueta: "Qué gana con Rumbo", texto: "Todo en un lugar, boleto en el celular, planes según sus pilares." },
  ],
};

// Pendiente: el texto del organizador llegó cortado en "Qué le duele"; "Qué gana" está inferido del flujo de la app.
const ORGANIZADOR: Perfil = {
  rol: "Quien organiza",
  nombre: "Mario",
  edad: "34 años aprox.",
  frase: "Mi evento es bueno; lo que me falta es que llegue a más gente y cobrar sin enredos.",
  piel: "#C98F65",
  pelo: "#1E1B18",
  filas: [
    { etiqueta: "Quién es", texto: "Emprendedor o creador local: mercaditos, experiencias, talleres, música." },
    { etiqueta: "Qué busca", texto: "Llenar su evento y cobrar sin complicaciones." },
    { etiqueta: "Qué le duele", texto: "Depender solo de redes, cobrar por transferencia o efectivo sin control y no saber quién viene." },
    { etiqueta: "Qué gana con Rumbo", texto: "Publica en minutos, vende boletos con QR y sabe quién viene." },
  ],
};

function Avatar({ piel, pelo, fondo }: { piel: string; pelo: string; fondo: string }) {
  return (
    <svg aria-hidden viewBox="0 0 100 100" className="h-[120px] w-[120px] shrink-0 rounded-full" style={{ background: fondo }}>
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
  return (
    <motion.div aria-hidden={!visible} initial={false}
      animate={visible ? { opacity: 1, y: 0, rotate: 0 } : { opacity: 0, y: 60, rotate: desde }}
      transition={rm ? { duration: 0.2 } : visible ? { type: "spring", stiffness: 90, damping: 15, delay: 0.15 } : { duration: 0.25 }}
      className="absolute left-[80px] top-[170px] w-[640px] rounded-[28px] p-8 shadow-2xl shadow-black/25"
      style={{ background: C.crema, color: C.noche }}>
      <div className="flex items-center gap-5">
        <Avatar piel={p.piel} pelo={p.pelo} fondo={acento + "55"} />
        <div>
          <p className="text-[18px] font-bold uppercase tracking-[0.16em]" style={{ color: acento === C.mostaza ? C.terracota : C.turquesa }}>{p.rol}</p>
          <p className="font-display text-[48px] font-bold leading-none">{p.nombre}</p>
          <p className="mt-1 text-[20px] opacity-70">{p.edad}</p>
        </div>
      </div>
      <p className={`${caveat.className} mt-5 border-l-4 pl-4 text-[30px] leading-[1.1]`} style={{ borderColor: acento }}>
        “{p.frase}”
      </p>
      <dl className="mt-5 space-y-3">
        {p.filas.map((f, i) => (
          <motion.div key={f.etiqueta} initial={false} animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : 20 }}
            transition={{ duration: 0.4, delay: visible ? 0.5 + i * 0.15 : 0 }}>
            <dt className="text-[16px] font-bold uppercase tracking-[0.14em]" style={{ color: i === 3 ? C.turquesa : C.noche + "99" }}>{f.etiqueta}</dt>
            <dd className={`text-[21px] leading-snug ${i === 3 ? "font-bold" : ""}`}>{f.texto}</dd>
          </motion.div>
        ))}
      </dl>
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
      </motion.div>

      {/* Mitad derecha: organizador */}
      <motion.div initial={false} animate={{ x: p >= 0 ? 0 : 800 }} transition={resorte}
        className="absolute left-[800px] top-0 h-full w-[800px]" style={{ background: C.mostaza, color: C.noche }}>
        <motion.p initial={false} animate={{ opacity: p === 0 ? 1 : 0 }} transition={{ duration: 0.4, delay: p === 0 ? 0.9 : 0 }}
          className="absolute inset-x-0 bottom-[130px] text-center font-display text-[64px] font-bold">Organizador</motion.p>
        <Tarjeta p={ORGANIZADOR} acento={C.turquesa} visible={p >= 2} desde={4} />
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
        className="absolute left-[740px] top-[780px]" style={{ zIndex: 12 }}>
        <Brujula size={120} activa={p >= 0} grados={90} />
      </motion.div>
    </div>
  );
}
