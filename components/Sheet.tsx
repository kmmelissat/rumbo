"use client";
import { useEffect } from "react";
import { AnimatePresence, motion, type PanInfo } from "motion/react";

/** Bottom sheet con spring y gesto de arrastre para cerrar. Se ancla al contenedor de la app. */
export function Sheet({ abierto, onCerrar, titulo, children }: { abierto: boolean; onCerrar: () => void; titulo: string; children: React.ReactNode }) {
  useEffect(() => {
    if (!abierto) return;
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") onCerrar(); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [abierto, onCerrar]);

  return (
    <AnimatePresence>
      {abierto && (
        <div className="absolute inset-0 z-40 flex items-end" role="dialog" aria-modal="true" aria-label={titulo}>
          <motion.div className="absolute inset-0 bg-black/45 backdrop-blur-[3px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onCerrar} />
          <motion.div
            className="relative w-full rounded-t-[32px] bg-sup pb-[max(env(safe-area-inset-bottom),16px)] shadow-capas"
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 34, stiffness: 380 }}
            drag="y" dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0.05, bottom: 0.7 }}
            onDragEnd={(_, i: PanInfo) => { if (i.offset.y > 90 || i.velocity.y > 500) onCerrar(); }}
          >
            <div className="mx-auto mt-3 h-1.5 w-10 rounded-full bg-linea" aria-hidden />
            <div className="space-y-5 px-4 pb-2 pt-4">
              <h2 className="text-[22px]">{titulo}</h2>
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
