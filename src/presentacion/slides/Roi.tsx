"use client";
import { useEffect, useState, type ReactNode } from "react";
import { Caveat } from "next/font/google";
import { animate, motion, useReducedMotion } from "motion/react";
import { Entra } from "../componentes/Entra";

/**
 * Datos editables (mes 1 a mes 6). Los totales, el ROAS y el ROI se calculan abajo:
 * cambia un arreglo y todo se recalcula. Es una proyección conservadora, no resultados.
 */
export const PROYECCION_DATOS = {
  titulo: "Qué devuelve",
  subtitulo: "(proyección conservadora a 6 meses, no resultados)",
  gastoMkt: [100, 130, 185, 240, 295, 350],
  usuariosActivos: [600, 950, 1450, 2250, 3500, 5500],
  organizadores: [8, 14, 22, 32, 45, 60],
  entradas: [15, 24, 44, 68, 123, 193],
  destacados: [1, 1, 2, 4, 5, 7],
  /** 8% + $0.30 sobre una entrada promedio de $12 (COMISION_NETA_ENTRADA). */
  comisionNetaEntrada: 1.26,
  precioDestacado: 30,
  costosFijosMes: 25,
  /** Líneas de ingreso del modelo de negocio: cuántas contamos aquí y cuántas hay. */
  lineasContadas: 2,
  lineasTotales: 7,
};

const D = PROYECCION_DATOS;
const caveat = Caveat({ subsets: ["latin"], weight: "600" });
const C = { crema: "#FAF6EF", noche: "#12303A", turquesa: "#0A7C7C", mostaza: "#F5B82E" };

/* Cálculos: nada se escribe a mano. Los usuarios y organizadores NO se suman (son cifras de cada mes). */
const MESES = D.gastoMkt.length;
const ULT = MESES - 1;
const suma = (a: number[]) => a.reduce((x, y) => x + y, 0);
const ingresoMes = D.entradas.map((e, i) => e * D.comisionNetaEntrada + D.destacados[i] * D.precioDestacado);
const gastoTotal = suma(D.gastoMkt);
const ingresoTotal = suma(ingresoMes);
const roasMes = ingresoMes.map((v, i) => v / D.gastoMkt[i]);
const roas = ingresoTotal / gastoTotal;
/** Primer mes en que el ingreso alcanza al gasto (-1 si nunca). */
const MES_EQUILIBRIO = ingresoMes.findIndex((v, i) => v >= D.gastoMkt[i]);
const margenMes6ConFijos = ingresoMes[ULT] - D.gastoMkt[ULT] - D.costosFijosMes;
const compranPor100 = D.entradas.map((e, i) => ((e / D.usuariosActivos[i]) * 100).toFixed(1));
const unoDeCada = Math.round(D.organizadores[ULT] / D.destacados[ULT]);
const fmt = (n: number) => Math.round(n).toLocaleString("en-US");
const usd = (n: number) => `$${fmt(n)}`;

const FUNNEL = [
  { etiqueta: "Usuarios activos", valores: D.usuariosActivos },
  { etiqueta: "Organizadores", valores: D.organizadores },
  { etiqueta: "Entradas vendidas", valores: D.entradas },
  { etiqueta: "Eventos destacados", valores: D.destacados },
];

/** Progreso 0..5 que recorre del mes 1 al mes 6 cuando el paso está activo. */
function useRecorrido(activo: boolean) {
  const rm = useReducedMotion();
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!activo) { setT(0); return; }
    if (rm) { setT(ULT); return; }
    const c = animate(0, ULT, { duration: 3.4, delay: 0.9, ease: "easeInOut", onUpdate: setT });
    return () => c.stop();
  }, [activo, rm]);
  return t;
}
const interpola = (v: number[], t: number) => {
  const i = Math.min(Math.floor(t), v.length - 1);
  return v[i] + (v[Math.min(i + 1, v.length - 1)] - v[i]) * (t - i);
};

/* Paso 1 */
function PasoFunnel({ activo }: { activo: boolean }) {
  const t = useRecorrido(activo);
  const mes = Math.min(MESES, Math.floor(t + 0.001) + 1);
  return (
    <div className="flex h-full flex-col justify-center gap-6">
      <Entra activa={activo}>
        <p className="text-[22px] font-bold uppercase tracking-[0.14em]" style={{ color: C.turquesa }}>
          Mes {mes} de {MESES}
        </p>
      </Entra>
      <div className="grid grid-cols-4 gap-6">
        {FUNNEL.map((f, i) => {
          const max = Math.max(...f.valores);
          return (
            <Entra key={f.etiqueta} activa={activo} retraso={0.1 + i * 0.12}>
              <div className="rounded-[24px] border-2 bg-white px-6 py-6" style={{ borderColor: C.noche + "14" }}>
                <p className="text-[20px] font-bold uppercase tracking-[0.1em] opacity-70">{f.etiqueta}</p>
                <p className="mt-2 font-display text-[72px] font-bold leading-none tabular-nums">{fmt(interpola(f.valores, t))}</p>
                <div className="mt-5 flex h-[110px] items-end gap-2" aria-hidden>
                  {f.valores.map((v, j) => (
                    <div key={j} className="flex-1 rounded-t-md transition-colors duration-300"
                      style={{ height: `${Math.max(8, (v / max) * 100)}%`, background: j <= Math.round(t) ? C.turquesa : C.noche + "1f" }} />
                  ))}
                </div>
                <p className="mt-3 flex justify-between text-[18px] font-semibold opacity-70">
                  <span>mes 1 · {fmt(f.valores[0])}</span><span>mes {MESES} · {fmt(f.valores[ULT])}</span>
                </p>
              </div>
            </Entra>
          );
        })}
      </div>
      <Entra activa={activo} retraso={0.7} className="flex flex-col gap-2">
        <p className="text-[22px] leading-snug">
          De <b className="font-display text-[26px]" style={{ color: C.turquesa }}>{compranPor100[0]}</b> a <b className="font-display text-[26px]" style={{ color: C.turquesa }}>{compranPor100[ULT]}</b> de cada 100 usuarios compran una entrada pagada; los demás ven planes gratis o guardan eventos.
        </p>
        <p className="text-[22px] leading-snug">
          1 de cada {unoDeCada} organizadores paga por destacar.
        </p>
      </Entra>
    </div>
  );
}

/* Paso 2 */
function Chispa() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" width={20} height={20}>
      <path d="M12 1 L14.600 9.400 L23 12 L14.600 14.600 L12 23 L9.400 14.600 L1 12 L9.400 9.400 Z" fill={C.mostaza} />
    </svg>
  );
}

function PasoBarras({ activo }: { activo: boolean }) {
  const rm = useReducedMotion();
  const max = Math.max(...D.gastoMkt, ...ingresoMes);
  const ALTO = 320;
  const barra = (valor: number, color: string, retraso: number) => (
    <div className="flex flex-col items-center justify-end gap-1">
      <Entra activa={activo} retraso={retraso + 0.6} desde="abajo" className="text-[19px] font-bold tabular-nums">{usd(valor)}</Entra>
      <motion.div initial={false} className="w-[54px] origin-bottom rounded-t-lg" style={{ height: (valor / max) * ALTO, background: color }}
        animate={{ scaleY: activo ? 1 : 0 }}
        transition={rm ? { duration: 0.2 } : { duration: 0.8, ease: "easeOut", delay: activo ? 0.3 + retraso : 0 }} />
    </div>
  );
  return (
    <div className="flex h-full flex-col justify-center gap-5">
      <Entra activa={activo} className="flex flex-wrap gap-8 text-[24px] font-semibold">
        <span className="flex items-center gap-3"><i className="h-5 w-5 rounded-md" style={{ background: C.noche }} />Gasto en marketing</span>
        <span className="flex items-center gap-3"><i className="h-5 w-5 rounded-md" style={{ background: C.turquesa }} />Ingreso</span>
        {MES_EQUILIBRIO >= 0 && (
          <span className="flex items-center gap-3"><Chispa />Mes {MES_EQUILIBRIO + 1}: el ingreso alcanza al gasto</span>
        )}
      </Entra>
      <div className="grid grid-cols-6 gap-3 rounded-[28px] border-2 bg-white px-6 pb-5 pt-5" style={{ borderColor: C.noche + "14" }}>
        {D.gastoMkt.map((g, i) => {
          const marca = i === MES_EQUILIBRIO;
          return (
            <div key={i} className="flex flex-col items-center gap-2 rounded-2xl px-2 pb-3 pt-2" style={{ background: marca ? C.turquesa + "14" : undefined }}>
              <div className="flex h-[30px] items-center gap-2 text-[17px] font-bold" style={{ visibility: marca ? "visible" : "hidden" }}>
                <Chispa />ingreso ≥ gasto
              </div>
              <div className="flex items-end gap-3" style={{ minHeight: ALTO + 44 }}>
                {barra(g, C.noche, i * 0.12)}
                {barra(ingresoMes[i], C.turquesa, i * 0.12 + 0.06)}
              </div>
              <p className="text-[22px] font-bold uppercase tracking-[0.1em] opacity-70">Mes {i + 1}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* Pasos 3 y 4 */
function PasoRetorno({ activo, supuestos }: { activo: boolean; supuestos: boolean }) {
  const cifras = [
    { etiqueta: "Gasto", valor: usd(gastoTotal) },
    { etiqueta: "Ingresos", valor: usd(ingresoTotal) },
    { etiqueta: "ROAS", valor: `${roas.toFixed(1)}x` },
  ];
  return (
    <div className="flex h-full flex-col justify-center gap-8">
      <div className="grid grid-cols-3 gap-6">
        {cifras.map((c, i) => (
          <Entra key={c.etiqueta} activa={activo} retraso={i * 0.12}>
            <div className="rounded-[24px] border-2 bg-white px-8 py-6" style={{ borderColor: C.noche + "14" }}>
              <p className="text-[22px] font-bold uppercase tracking-[0.12em] opacity-70">{c.etiqueta} · 6 meses</p>
              <p className="mt-1 font-display text-[96px] font-bold leading-none tabular-nums">{c.valor}</p>
            </div>
          </Entra>
        ))}
      </div>
      <Entra activa={activo} retraso={0.6}>
        <p className="max-w-[1300px] font-display text-[54px] font-bold leading-[1.12]">
          El semestre es inversión de validación: en el mes {MESES}, cada dólar devuelve{" "}
          <span style={{ color: C.turquesa }}>${roasMes[ULT].toFixed(2)}</span>
        </p>
      </Entra>
      <Entra activa={supuestos}>
        <p className="text-[19px] leading-snug opacity-80">
          Comisión neta de ${D.comisionNetaEntrada.toFixed(2)} por entrada y evento destacado de ${D.precioDestacado}. Solo contamos {D.lineasContadas} de las {D.lineasTotales} líneas de ingreso.
          {margenMes6ConFijos > 0 && ` Con costos fijos incluidos, el mes ${MESES} ya deja margen positivo.`}
        </p>
      </Entra>
    </div>
  );
}

/** Las capas comparten celda: la inactiva se desvanece por completo y no recibe clics. */
function Capa({ on, children }: { on: boolean; children: ReactNode }) {
  const rm = useReducedMotion();
  return (
    <motion.div aria-hidden={!on} initial={false} animate={{ opacity: on ? 1 : 0 }}
      transition={{ duration: rm ? 0.15 : 0.3, delay: on ? 0.15 : 0 }}
      style={{ gridArea: "1 / 1", pointerEvents: "none" }} className="min-h-0">
      {children}
    </motion.div>
  );
}

export function Roi({ activa, paso }: { activa: boolean; paso: number }) {
  const p = activa ? paso : -1;
  return (
    <div className="flex h-full w-full flex-col px-[80px] pb-[48px] pt-[64px]" style={{ background: C.crema, color: C.noche }}>
      <div className="shrink-0">
        <Entra activa={p >= 0} desde="arriba">
          <h1 className="font-display text-[60px] font-bold leading-[1.05]">{D.titulo}</h1>
        </Entra>
        <Entra activa={p >= 0} retraso={0.15} desde="arriba">
          <p className={`${caveat.className} mt-1 text-[40px] leading-none`} style={{ color: C.turquesa }}>{D.subtitulo}</p>
        </Entra>
      </div>
      <div className="mt-4 grid min-h-0 flex-1">
        <Capa on={p === 0}><PasoFunnel activo={p === 0} /></Capa>
        <Capa on={p === 1}><PasoBarras activo={p === 1} /></Capa>
        <Capa on={p >= 2}><PasoRetorno activo={p >= 2} supuestos={p >= 3} /></Capa>
      </div>
    </div>
  );
}
