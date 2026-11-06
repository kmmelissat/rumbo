"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { PILARES, type Pilar } from "@/lib/data";
import { Foto } from "@/components/Foto";
import { BotonPrimario } from "@/components/Botones";
import { IconCheck } from "@/components/Icons";

export default function Bienvenida() {
  const { terminarBienvenida } = useStore();
  const router = useRouter();
  const [sel, setSel] = useState<Pilar[]>([]);
  const alternar = (p: Pilar) => setSel((s) => (s.includes(p) ? s.filter((x) => x !== p) : [...s, p]));

  return (
    <div className="flex min-h-full flex-col px-4 pb-6 pt-8">
      <p className="text-2xl font-semibold tracking-tight">Rumbo<span className="text-marca">.</span></p>
      <h1 className="mt-6 text-3xl leading-tight">Encuentra tu rumbo</h1>
      <p className="mt-2 text-gris">Elige lo que te mueve y te mostraremos planes para ti. Puedes escoger varios.</p>

      <ul className="mt-6 grid grid-cols-2 gap-3">
        {PILARES.map((p) => {
          const on = sel.includes(p.id);
          return (
            <li key={p.id}>
              <button onClick={() => alternar(p.id)} aria-pressed={on} className={`relative block w-full overflow-hidden rounded-xl border-2 text-left ${on ? "border-marca" : "border-transparent"}`}>
                <Foto src={p.foto} sizes="200px" className="aspect-[4/5] w-full" />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-10 text-white">
                  <span className="block font-semibold leading-tight">{p.id}</span>
                  <span className="block text-xs text-white/85">{p.texto}</span>
                </span>
                {on && <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-marca text-white"><IconCheck width={16} height={16} /></span>}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto space-y-2 pt-6">
        <BotonPrimario disabled={sel.length === 0} onClick={() => { terminarBienvenida(sel); router.replace("/"); }}>Empezar a explorar</BotonPrimario>
        <p className="text-center text-xs text-gris">{sel.length === 0 ? "Elige al menos un interés para continuar." : `${sel.length} ${sel.length === 1 ? "elegido" : "elegidos"}`}</p>
      </div>
    </div>
  );
}
