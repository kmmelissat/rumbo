"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { PILARES, type Pilar } from "@/lib/data";
import { Foto } from "@/components/Foto";
import { BotonPrimario } from "@/components/Botones";
import { Nota, Ondulado } from "@/components/Marca";
import { Logo } from "@/src/components/Logo";
import { IconCheck } from "@/components/Icons";

export default function Bienvenida() {
  const { terminarBienvenida } = useStore();
  const router = useRouter();
  const [sel, setSel] = useState<Pilar[]>([]);
  const alternar = (p: Pilar) => setSel((s) => (s.includes(p) ? s.filter((x) => x !== p) : [...s, p]));

  return (
    <div className="flex min-h-full flex-col px-4 pb-6 pt-8">
      <Logo variant="principal" size={64} />
      <div className="relative mt-6">
        <h1 className="relative inline-block text-[34px] leading-tight">Encuentra tu rumbo<Ondulado color="text-coral" /></h1>
        <Nota className="mt-3 block -rotate-2 text-oceano">elige los que quieras</Nota>
      </div>
      <p className="mt-2 text-gris">Cuéntanos qué te mueve y armamos planes a tu medida.</p>

      <ul className="mt-5 grid grid-cols-2 gap-3">
        {PILARES.map((p, i) => {
          const on = sel.includes(p.id);
          return (
            <li key={p.id}>
              <button onClick={() => alternar(p.id)} aria-pressed={on}
                className={`relative flex h-full min-h-[200px] w-full flex-col items-start rounded-[20px] border-2 p-3 text-left ${p.estilo} ${on ? "ring-4 ring-tinta/80 ring-offset-2" : ""}`}
                style={{ transform: `rotate(${i % 2 ? 1 : -1}deg)` }}>
                <Foto src={p.foto} sizes="80px" className="h-20 w-20 rounded-full border-4 border-white" />
                <span className="mt-3 block font-display text-xl font-bold leading-tight">{p.id}</span>
                <span className="mt-1 block text-sm leading-snug opacity-90">{p.texto}</span>
                {on && <span className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-tinta text-white"><IconCheck width={18} height={18} /></span>}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto space-y-2 pt-6">
        <BotonPrimario disabled={sel.length === 0} onClick={() => { terminarBienvenida(sel); router.replace("/prototipo"); }}>Empezar a explorar</BotonPrimario>
        <p className="text-center text-xs text-gris">{sel.length === 0 ? "Elige al menos uno: sin brújula no se sale." : `${sel.length} ${sel.length === 1 ? "elegido" : "elegidos"}. ¡Buen rumbo!`}</p>
      </div>
    </div>
  );
}
