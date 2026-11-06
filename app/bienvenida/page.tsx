"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { PILARES, type Pilar } from "@/lib/data";
import { Art } from "@/components/Art";
import { BotonPrimario } from "@/components/Botones";
import { IconCheck } from "@/components/Icons";

export default function Bienvenida() {
  const { terminarBienvenida } = useStore();
  const router = useRouter();
  const [sel, setSel] = useState<Pilar[]>([]);
  const alternar = (p: Pilar) => setSel((s) => (s.includes(p) ? s.filter((x) => x !== p) : [...s, p]));

  return (
    <div className="flex min-h-full flex-col">
      <div className="h-52 w-full"><Art kind="sol" className="h-full w-full" /></div>
      <div className="-mt-6 flex flex-1 flex-col rounded-t-[28px] bg-arena px-5 pt-7">
        <h1 className="text-4xl leading-tight">Encuentra tu rumbo</h1>
        <p className="mt-2 text-tinta/75">Elige lo que te mueve y te mostraremos eventos hechos para ti. Puedes escoger varios.</p>

        <ul className="mt-5 grid grid-cols-2 gap-3">
          {PILARES.map((p) => {
            const on = sel.includes(p.id);
            return (
              <li key={p.id}>
                <button onClick={() => alternar(p.id)} aria-pressed={on}
                  className={`relative w-full overflow-hidden rounded-card border-2 text-left ${on ? "border-oceano bg-white" : "border-transparent bg-white"}`}>
                  <div className="h-20"><Art kind={p.arte} className="h-full w-full" /></div>
                  <div className="p-3">
                    <p className="font-display text-base leading-tight">{p.id}</p>
                    <p className="mt-0.5 text-xs text-tinta/70">{p.texto}</p>
                  </div>
                  {on && <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-oceano text-white"><IconCheck width={16} height={16} /></span>}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mt-auto space-y-2 py-6">
          <BotonPrimario disabled={sel.length === 0} onClick={() => { terminarBienvenida(sel); router.replace("/"); }}>
            Empezar a explorar
          </BotonPrimario>
          <p className="text-center text-xs text-tinta/60">{sel.length === 0 ? "Elige al menos un interés para continuar." : `${sel.length} ${sel.length === 1 ? "elegido" : "elegidos"}`}</p>
        </div>
      </div>
    </div>
  );
}
