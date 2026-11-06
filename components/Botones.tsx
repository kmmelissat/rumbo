import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Ondulado } from "./Marca";

const PRIMARIO = "inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-marca px-6 text-base font-bold text-white hover:bg-[#0c8e8e] disabled:cursor-not-allowed disabled:opacity-40";
export const SECUNDARIO = "inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border border-linea bg-white px-6 text-base font-semibold text-tinta hover:bg-fondo";
export function BotonPrimario(p: ButtonHTMLAttributes<HTMLButtonElement>) { return <button {...p} className={`${PRIMARIO} ${p.className ?? ""}`} />; }
export function LinkPrimario({ href, children }: { href: string; children: ReactNode }) { return <Link href={href} className={PRIMARIO}>{children}</Link>; }

export function Encabezado({ titulo, sub, color = "text-marca" }: { titulo: string; sub?: string; color?: string }) {
  return (
    <header className="px-4 pb-4 pt-6">
      <h1 className="relative inline-block text-3xl leading-tight">{titulo}<Ondulado color={color} /></h1>
      {sub && <p className="mt-3 text-sm text-gris">{sub}</p>}
    </header>
  );
}

export function Vacio({ icono, titulo, texto, children }: { icono: ReactNode; titulo: string; texto: string; children?: ReactNode }) {
  return (
    <div className="mx-4 mt-6 flex flex-col items-center gap-2 rounded-[20px] border-2 border-dashed border-marca/50 bg-arena p-8 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-marca">{icono}</span>
      <h2 className="text-lg">{titulo}</h2>
      <p className="text-sm text-gris">{texto}</p>
      {children && <div className="mt-3 w-full">{children}</div>}
    </div>
  );
}

export function Switch({ on, onChange, label, detalle }: { on: boolean; onChange: (v: boolean) => void; label: string; detalle?: string }) {
  return (
    <button type="button" role="switch" aria-checked={on} onClick={() => onChange(!on)} className="flex min-h-[52px] w-full items-center justify-between gap-3 text-left">
      <span><span className="block font-medium">{label}</span>{detalle && <span className="block text-xs text-gris">{detalle}</span>}</span>
      <span className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${on ? "bg-marca" : "bg-[#D1D5DB]"}`}>
        <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white transition-all ${on ? "left-[22px]" : "left-0.5"}`} />
      </span>
    </button>
  );
}
