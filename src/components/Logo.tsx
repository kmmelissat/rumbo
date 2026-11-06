export type VarianteLogo = "principal" | "invertida" | "mono" | "icono";

const PALETA = {
  principal: { bg: "#0A7C7C", fg: "#FFFFFF", accent: "#F5B82E", texto: "#12303A" },
  invertida: { bg: "#FAF6EF", fg: "#0A7C7C", accent: "#F5B82E", texto: "#FAF6EF" },
} as const;

function colores(variant: VarianteLogo, color: string) {
  if (variant === "mono") return { bg: color, fg: "#FFFFFF", accent: "#FFFFFF", texto: color, hueco: true };
  const p = PALETA[variant === "icono" ? "principal" : variant];
  return { ...p, hueco: false };
}

/** Cuadro redondeado con la R geométrica y la chispa de brújula. viewBox 0 0 100 100. */
function Marca({ bg, fg, accent }: { bg: string; fg: string; accent: string }) {
  return (
    <>
      <rect width="100" height="100" rx="27" fill={bg} />
      <g fill="none" stroke={fg} strokeWidth="13" strokeLinecap="round" strokeLinejoin="round">
        <path d="M33 76 V26 H50 A15 15 0 0 1 50 56 H33" />
        <path d="M52 57 L68 77" />
      </g>
      <path d="M74 16 L76.8 23.2 L84 26 L76.8 28.8 L74 36 L71.2 28.8 L64 26 L71.2 23.2 Z" fill={accent} />
    </>
  );
}

/**
 * Solo el ícono. En la variante mono todo va en un solo color: el cuadro lleva
 * el color y la R y la chispa se "recortan" en blanco (la chispa igual que la R).
 */
export function LogoIcon({ variant = "principal", size = 40, color = "#12303A", className, title = "Rumbo" }: {
  variant?: VarianteLogo; size?: number; color?: string; className?: string; title?: string;
}) {
  const c = colores(variant, color);
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} role="img" aria-label={title}>
      <Marca bg={c.bg} fg={c.fg} accent={c.accent} />
    </svg>
  );
}

/** Ícono + wordmark "Rumbo" (Fraunces 700) en horizontal. */
export function Logo({ variant = "principal", size = 40, className, color = "#12303A" }: {
  variant?: VarianteLogo; size?: number; className?: string; color?: string;
}) {
  if (variant === "icono") return <LogoIcon variant="icono" size={size} className={className} />;
  const c = colores(variant, color);
  const ancho = 440; // ícono 100 + separación 30 + wordmark (~0.9 del alto del ícono)
  return (
    <svg viewBox={`0 0 ${ancho} 100`} height={size} width={(size * ancho) / 100} className={className} role="img" aria-label="Rumbo" style={{ overflow: "visible" }}>
      <Marca bg={c.bg} fg={c.fg} accent={c.accent} />
      <text x="130" y="79" fontSize="90" fontWeight="700" fill={c.texto}
        style={{ fontFamily: "var(--font-fraunces), Fraunces, Georgia, serif", letterSpacing: "-0.01em" }}>Rumbo</text>
    </svg>
  );
}
