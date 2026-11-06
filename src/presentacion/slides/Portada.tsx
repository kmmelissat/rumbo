"use client";
import { Foto } from "@/components/Foto";
import { Logo } from "@/src/components/Logo";
import { Nota, Ondulado } from "@/components/Marca";
import { Brujula } from "../componentes/Brujula";
import { Entra } from "../componentes/Entra";
import { Flecha } from "../componentes/Garabatos";

const INTEGRANTES = [
  { nombre: "Karla Melissa Torres", estilo: "bg-lima text-tinta", rot: -4 },
  { nombre: "Lucía Turcios", estilo: "bg-coral text-tinta", rot: 3 },
  { nombre: "Masciel Fuentes", estilo: "bg-oceano text-white", rot: -2 },
];

function Polaroid({ src, alt, w, h, rot, activa, retraso, className }: { src: string; alt: string; w: number; h: number; rot: number; activa: boolean; retraso: number; className: string }) {
  return (
    <Entra activa={activa} retraso={retraso} desde="giro" rot={rot} className={`absolute ${className}`}>
      <div className="rounded-sm border-[14px] border-white bg-white shadow-xl shadow-black/25" style={{ width: w, height: h }}>
        <Foto src={src} alt={alt} sizes="520px" className="h-full w-full" />
      </div>
    </Entra>
  );
}

export function Portada({ activa }: { activa: boolean }) {
  return (
    <div className="relative h-full w-full">
      {/* Columna izquierda */}
      <div className="absolute left-[110px] top-[100px] w-[760px]">
        <Entra activa={activa} retraso={0.1} desde="giro" rot={-2} className="origin-left">
          <Logo variant="principal" size={150} />
        </Entra>

        <Entra activa={activa} retraso={0.5} desde="izq" className="mt-10">
          <h1 className="relative inline-block font-display text-[84px] font-bold leading-[1.05] text-tinta">
            Encuentra tu rumbo<Ondulado color="text-coral" />
          </h1>
        </Entra>

        <Entra activa={activa} retraso={0.7} className="mt-10">
          <p className="max-w-[640px] text-[34px] leading-snug text-tinta/85">Todo lo que pasa en El Salvador, en un solo lugar</p>
        </Entra>

        <Entra activa={activa} retraso={0.9} rot={-3} className="mt-5 inline-block">
          <Nota className="text-[44px] text-marca">una ruta, muchos planes</Nota>
        </Entra>

        <div className="mt-9 flex flex-wrap gap-4">
          {INTEGRANTES.map((m, i) => (
            <Entra key={m.nombre} activa={activa} retraso={1.1 + i * 0.12} desde="giro" rot={m.rot}>
              <span className={`inline-block rounded-xl border-[6px] border-white px-4 py-1.5 text-[26px] font-bold shadow-lg shadow-black/20 ${m.estilo}`}>{m.nombre}</span>
            </Entra>
          ))}
        </div>

        <Entra activa={activa} retraso={1.5} desde="izq" className="mt-9">
          <span className="inline-block rounded-full border-2 border-dashed border-marca bg-arena px-6 py-2 text-[26px] font-bold tracking-wide text-oceano">Plan de negocio · ESEN</span>
        </Entra>
      </div>

      {/* Columna derecha: fotos reales y brújula */}
      <Polaroid src="/images/caminata.jpg" alt="Caminata al amanecer en un cerro salvadoreño" w={500} h={360} rot={5} activa={activa} retraso={0.3} className="right-[120px] top-[90px]" />
      <Polaroid src="/images/mercado.jpg" alt="Mercadito local con puestos de artesanías" w={400} h={300} rot={-7} activa={activa} retraso={0.5} className="right-[470px] top-[330px]" />
      <Polaroid src="/images/concierto.jpg" alt="Concierto al atardecer frente al mar" w={380} h={280} rot={3} activa={activa} retraso={0.7} className="right-[90px] top-[400px]" />

      <Entra activa={activa} retraso={0.9} desde="escala" className="absolute right-[330px] top-[560px]">
        <Brujula size={250} activa={activa} grados={90} />
      </Entra>

      <Entra activa={activa} retraso={2.6} desde="izq" className="absolute right-[40px] top-[790px] flex items-center gap-3 text-coral">
        <Nota className="rotate-[-4deg] text-[36px] text-oceano">siguiente parada</Nota>
        <Flecha className="h-[60px] w-[150px]" />
      </Entra>
    </div>
  );
}
