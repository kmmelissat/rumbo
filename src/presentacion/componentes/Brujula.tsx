"use client";
import { motion } from "motion/react";

/** Brújula: al activarse gira varias vueltas y se detiene apuntando a `grados` (90 = al este). */
export function Brujula({ size = 280, activa, grados = 90 }: { size?: number; activa: boolean; grados?: number }) {
  const marcas = Array.from({ length: 36 }, (_, i) => i * 10);
  return (
    <div style={{ width: size, height: size }} className="relative drop-shadow-[0_10px_18px_rgba(14,90,138,0.25)]" aria-hidden>
      <svg viewBox="0 0 200 200" className="absolute inset-0">
        <circle cx="100" cy="100" r="97" fill="#fff" stroke="#0E5A8A" strokeWidth="6" />
        <circle cx="100" cy="100" r="82" fill="#FFF4DF" stroke="#0FA3A3" strokeWidth="2.5" strokeDasharray="2 6" strokeLinecap="round" />
        {marcas.map((a) => (
          <line key={a} x1="100" y1="10" x2="100" y2={a % 90 === 0 ? 24 : 17} stroke="#0E5A8A" strokeWidth={a % 90 === 0 ? 3 : 1.5} strokeLinecap="round" transform={`rotate(${a} 100 100)`} />
        ))}
        {[["N", 100, 44], ["E", 160, 108], ["S", 100, 176], ["O", 40, 108]].map(([t, x, y]) => (
          <text key={t as string} x={x as number} y={y as number} textAnchor="middle" fontFamily="var(--font-fraunces)" fontWeight="700" fontSize="18" fill="#0E5A8A">{t}</text>
        ))}
      </svg>
      <motion.svg viewBox="0 0 200 200" className="absolute inset-0" initial={false}
        animate={activa ? { rotate: [0, 400, 70, 100, grados] } : { rotate: 0 }}
        transition={activa ? { duration: 2.8, times: [0, 0.55, 0.75, 0.9, 1], ease: "easeInOut", delay: 0.6 } : { duration: 0.3 }}>
        <polygon points="100,28 114,100 86,100" fill="#FF8A6B" />
        <polygon points="100,172 114,100 86,100" fill="#0E5A8A" />
        <circle cx="100" cy="100" r="9" fill="#C5E063" stroke="#fff" strokeWidth="3" />
      </motion.svg>
    </div>
  );
}
