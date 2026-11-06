"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { TabBar } from "./TabBar";

export function Shell({ children }: { children: React.ReactNode }) {
  const { listo, bienvenidaVista } = useStore();
  const path = usePathname();
  const router = useRouter();
  const enBienvenida = path === "/bienvenida";
  const sinTabs = enBienvenida || path.startsWith("/evento/") || path.startsWith("/checkout/") || path.startsWith("/boleto/");

  useEffect(() => {
    if (!listo) return;
    if (!bienvenidaVista && !enBienvenida) router.replace("/bienvenida");
    if (bienvenidaVista && enBienvenida) router.replace("/");
  }, [listo, bienvenidaVista, enBienvenida, router]);

  const mostrar = listo && (bienvenidaVista || enBienvenida);

  return (
    <div className="mx-auto h-dvh w-full max-w-[430px] md:border-x md:border-linea">
      <div className="relative h-full overflow-hidden bg-white">
        <main key={path} className={`scroll-hide entrar h-full overflow-y-auto ${sinTabs ? "" : "pb-[72px]"}`}>
          {mostrar ? children : null}
        </main>
        {mostrar && !sinTabs && <TabBar />}
      </div>
    </div>
  );
}
