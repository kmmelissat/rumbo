"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { MotionConfig } from "motion/react";
import { TabBar } from "./TabBar";
import { transicionLista } from "@/lib/transicion";

export function Shell({ children }: { children: React.ReactNode }) {
  const { listo, bienvenidaVista, tema } = useStore();
  const path = usePathname();
  const router = useRouter();
  // Modo embed (?embed=1): la app corre dentro de un iframe, a todo el ancho y sin marco de escritorio.
  // Se detecta una vez; el Shell persiste entre navegaciones internas, así que no se pierde.
  const [embed, setEmbed] = useState(false);
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("embed") === "1") {
      setEmbed(true);
      document.documentElement.dataset.embed = "1";
    }
  }, []);
  const rel = path.replace(/^\/prototipo/, "") || "/";
  const enBienvenida = rel === "/bienvenida";
  const sinTabs = enBienvenida || rel.startsWith("/evento/") || rel.startsWith("/checkout/") || rel.startsWith("/boleto/");

  useEffect(() => {
    if (!listo) return;
    if (!bienvenidaVista && !enBienvenida) router.replace("/prototipo/bienvenida");
    if (bienvenidaVista && enBienvenida) router.replace("/prototipo");
  }, [listo, bienvenidaVista, enBienvenida, router]);

  // En embed, avisa a la página padre qué pantalla se está viendo y cuándo se pulsa una flecha.
  useEffect(() => {
    if (!embed || window.parent === window) return;
    window.parent.postMessage({ tipo: "rumbo:ruta", ruta: rel }, window.location.origin);
  }, [embed, rel]);
  useEffect(() => {
    if (!embed || window.parent === window) return;
    const tecla = (e: KeyboardEvent) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      e.preventDefault();
      window.parent.postMessage({ tipo: "rumbo:salir", tecla: e.key }, window.location.origin);
    };
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  }, [embed]);

  // Tema: "auto" sigue al sistema (en embed siempre claro, para que la demo sea predecible).
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const aplicar = () => {
      const oscuro = tema === "oscuro" || (tema === "auto" && mq.matches && !embed);
      if (oscuro) document.documentElement.dataset.tema = "oscuro"; else delete document.documentElement.dataset.tema;
    };
    aplicar();
    mq.addEventListener("change", aplicar);
    return () => { mq.removeEventListener("change", aplicar); delete document.documentElement.dataset.tema; };
  }, [tema, embed]);

  // Cierra la transición compartida cuando la nueva ruta ya se pintó.
  useEffect(() => { transicionLista(); }, [path]);

  const mostrar = listo && (bienvenidaVista || enBienvenida);

  return (
    <div className={embed ? "h-dvh w-full" : "mx-auto h-dvh w-full max-w-[430px] md:border-x md:border-linea"}>
      <MotionConfig reducedMotion="user">
      <div className="relative h-full overflow-hidden bg-sup">
        <main key={path} className={`scroll-hide scroll-suave h-full overflow-y-auto ${rel.startsWith("/evento/") ? "" : "entrar"} ${sinTabs ? "" : "pb-[88px]"}`}>
          {mostrar ? children : null}
        </main>
        {mostrar && !sinTabs && <TabBar />}
      </div>
      </MotionConfig>
    </div>
  );
}
