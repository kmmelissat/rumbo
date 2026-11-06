import type { MouseEvent } from "react";

// Transición compartida: la foto de la tarjeta se expande a la ficha usando View Transitions.
// Si el navegador no las soporta (o hay prefers-reduced-motion), se navega normal.
let terminar: (() => void) | null = null;

/** Lo llama el Shell cuando la nueva ruta ya se pintó: cierra la transición. */
export function transicionLista() {
  const f = terminar;
  if (!f) return;
  terminar = null;
  requestAnimationFrame(() => requestAnimationFrame(f));
}

export function navegarConFoto(e: MouseEvent<HTMLAnchorElement>, push: (href: string) => void, href: string, id: string) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const doc = document as Document & { startViewTransition?: (cb: () => Promise<void>) => unknown };
  if (!doc.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const foto = e.currentTarget.querySelector<HTMLElement>("[data-foto]");
  if (!foto) return;
  e.preventDefault();
  foto.style.setProperty("view-transition-name", `foto-${id}`);
  doc.startViewTransition(() => new Promise<void>((res) => {
    terminar = res;
    push(href);
    setTimeout(() => { terminar = null; res(); }, 1500); // red de seguridad
  }));
}
