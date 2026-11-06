"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/** Foto con blur-up: skeleton con brillo mientras carga, luego se enfoca. `degradado` oscurece el borde inferior para leer texto encima. */
export function Foto({ src, alt = "", className = "", priority = false, sizes = "430px", degradado = false }: {
  src: string; alt?: string; className?: string; priority?: boolean; sizes?: string; degradado?: boolean;
}) {
  const [lista, setLista] = useState(false);
  const ref = useRef<HTMLImageElement>(null);
  useEffect(() => { if (ref.current?.complete) setLista(true); }, []);
  return (
    <div className={`relative overflow-hidden bg-linea ${className}`}>
      {!lista && <div className="skeleton absolute inset-0" aria-hidden />}
      <Image ref={ref} src={src} alt={alt} fill sizes={sizes} priority={priority} onLoad={() => setLista(true)}
        className={`object-cover transition-[filter,transform,opacity] duration-700 ease-out ${lista ? "scale-100 opacity-100 blur-0" : "scale-110 opacity-0 blur-xl"}`} />
      {degradado && <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/60 via-black/15 to-transparent" aria-hidden />}
    </div>
  );
}
