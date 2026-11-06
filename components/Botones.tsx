import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

const PRIMARIO = "inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-oceano px-6 font-bold text-white shadow-[0_8px_18px_-8px_rgba(14,90,138,.8)] hover:bg-oceano/90 disabled:opacity-40";
export function BotonPrimario(p: ButtonHTMLAttributes<HTMLButtonElement>) { return <button {...p} className={`${PRIMARIO} ${p.className ?? ""}`} />; }
export function LinkPrimario({ href, children }: { href: string; children: ReactNode }) { return <Link href={href} className={PRIMARIO}>{children}</Link>; }

export function Encabezado({ titulo, sub }: { titulo: string; sub?: string }) {
  return (
    <header className="px-5 pb-3 pt-8">
      <h1 className="text-3xl leading-tight">{titulo}</h1>
      {sub && <p className="mt-1 text-tinta/70">{sub}</p>}
    </header>
  );
}

export function Vacio({ arte, titulo, texto, children }: { arte: ReactNode; titulo: string; texto: string; children?: ReactNode }) {
  return (
    <div className="mx-5 mt-4 space-y-3 rounded-card bg-white p-6 text-center">
      <div className="mx-auto h-28 w-44 overflow-hidden rounded-2xl">{arte}</div>
      <h2 className="text-xl">{titulo}</h2>
      <p className="text-tinta/70">{texto}</p>
      {children}
    </div>
  );
}
