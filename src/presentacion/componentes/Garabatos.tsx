import type { SVGProps } from "react";
type P = SVGProps<SVGSVGElement>;
const base = { fill: "none", stroke: "currentColor", strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true } as const;

export const Sol = (p: P) => (
  <svg viewBox="0 0 100 100" {...base} {...p}>
    <circle cx="50" cy="50" r="16" />
    {Array.from({ length: 10 }, (_, i) => <line key={i} x1="50" y1="14" x2="50" y2="24" transform={`rotate(${i * 36} 50 50)`} />)}
  </svg>
);
export const Ola = (p: P) => (
  <svg viewBox="0 0 160 50" {...base} {...p}>
    <path d="M4 14 Q24 -2 44 14 T84 14 T124 14 T156 14" /><path d="M4 34 Q24 18 44 34 T84 34 T124 34 T156 34" />
  </svg>
);
export const Cruz = (p: P) => (
  <svg viewBox="0 0 60 60" {...base} strokeWidth={6} {...p}><path d="M12 12 L48 48 M48 12 L12 48" /></svg>
);
export const Espiral = (p: P) => (
  <svg viewBox="0 0 100 100" {...base} {...p}><path d="M50 50 m0 -4 a4 4 0 1 1 -4 4 a10 10 0 1 1 10 10 a18 18 0 1 1 -18 -18 a28 28 0 1 1 28 28" /></svg>
);
export const Flecha = (p: P) => (
  <svg viewBox="0 0 200 80" {...base} {...p}><path d="M6 60 C 60 0, 120 10, 188 40" /><path d="M164 22 L190 41 L160 54" /></svg>
);
/** Silueta de volcán. */
export const Volcan = (p: P) => (
  <svg viewBox="0 0 400 200" {...p} aria-hidden><path d="M0 200 L130 50 L160 62 L200 40 L240 62 L270 50 L400 200 Z" fill="currentColor" /></svg>
);
