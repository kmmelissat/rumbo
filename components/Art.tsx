import type { ArteKind } from "@/lib/data";

const FONDOS: Record<ArteKind, string> = {
  volcan: "#12B5B0", sol: "#FF8A6B", ola: "#0E5A8A", palmera: "#C5E063", brujula: "#FFF4DF",
};

export function Art({ kind, className = "" }: { kind: ArteKind; className?: string }) {
  return (
    <svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" className={className} role="img" aria-label={`Ilustración de ${kind}`}>
      <rect width="400" height="240" fill={FONDOS[kind]} />
      {kind === "volcan" && (<>
        <circle cx="300" cy="62" r="26" fill="#FFF4DF" />
        <path d="M0 240V170l70-40 50 30 70-90 60 40 50-30 100 90v70z" fill="#0E5A8A" opacity=".5" />
        <path d="M110 240l70-150h40l70 150z" fill="#0F2A3A" />
        <path d="M168 112l12-22h40l12 22-24 14-16-10z" fill="#FFF4DF" />
        <path d="M0 240v-30c60-20 120 10 200 0s140-20 200 0v30z" fill="#C5E063" />
      </>)}
      {kind === "sol" && (<>
        <circle cx="200" cy="150" r="64" fill="#FFF4DF" />
        {Array.from({ length: 9 }).map((_, i) => {
          const a = Math.PI + (i * Math.PI) / 8;
          return <line key={i} x1={200 + Math.cos(a) * 80} y1={150 + Math.sin(a) * 80} x2={200 + Math.cos(a) * 108} y2={150 + Math.sin(a) * 108} stroke="#FFF4DF" strokeWidth="8" strokeLinecap="round" />;
        })}
        <rect y="150" width="400" height="90" fill="#0E5A8A" />
        <path d="M0 175q25-12 50 0t50 0 50 0 50 0 50 0 50 0 50 0 50 0" fill="none" stroke="#12B5B0" strokeWidth="6" />
        <path d="M0 205q25-12 50 0t50 0 50 0 50 0 50 0 50 0 50 0 50 0" fill="none" stroke="#12B5B0" strokeWidth="6" opacity=".6" />
      </>)}
      {kind === "ola" && (<>
        <circle cx="90" cy="60" r="24" fill="#C5E063" />
        <path d="M0 150q50-50 100-10t100-10 100 10 100-10v120H0z" fill="#12B5B0" />
        <path d="M0 185q50-40 100-5t100-10 100 10 100-10v70H0z" fill="#FF8A6B" opacity=".9" />
        <path d="M0 215q50-30 100-5t100-5 100 5 100-5v35H0z" fill="#FFF4DF" />
      </>)}
      {kind === "palmera" && (<>
        <circle cx="320" cy="60" r="28" fill="#FFF4DF" />
        <path d="M0 240v-40q100-30 200-5t200-5v50z" fill="#12B5B0" />
        <path d="M196 200c4-40 2-80-10-120h14c10 40 12 80 8 120z" fill="#0F2A3A" />
        <g fill="#0E5A8A">
          <path d="M193 82c-40-30-80-20-100 0 40-12 70-4 100 0z" />
          <path d="M193 82c40-30 80-20 100 0-40-12-70-4-100 0z" />
          <path d="M193 82c-20-40-60-50-90-40 40 4 66 20 90 40z" />
          <path d="M193 82c20-40 60-50 90-40-40 4-66 20-90 40z" />
          <path d="M193 82c-6-30 0-50 0-60 8 20 8 40 0 60z" />
        </g>
      </>)}
      {kind === "brujula" && (<>
        <circle cx="200" cy="120" r="84" fill="#0E5A8A" />
        <circle cx="200" cy="120" r="68" fill="#FFF4DF" />
        <circle cx="200" cy="120" r="68" fill="none" stroke="#12B5B0" strokeWidth="4" strokeDasharray="2 14" strokeLinecap="round" />
        <path d="M200 66l16 54h-32z" fill="#FF8A6B" />
        <path d="M200 174l-16-54h32z" fill="#0F2A3A" />
        <circle cx="200" cy="120" r="7" fill="#C5E063" stroke="#0F2A3A" strokeWidth="3" />
        <circle cx="60" cy="50" r="10" fill="#C5E063" /><circle cx="345" cy="195" r="14" fill="#FF8A6B" />
      </>)}
    </svg>
  );
}
