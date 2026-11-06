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
  const sinTabs = enBienvenida || path.startsWith("/evento/") || path.startsWith("/checkout/") || path.startsWith("/boleto/") || path === "/organizador/nuevo";

  useEffect(() => {
    if (!listo) return;
    if (!bienvenidaVista && !enBienvenida) router.replace("/bienvenida");
    if (bienvenidaVista && enBienvenida) router.replace("/");
  }, [listo, bienvenidaVista, enBienvenida, router]);

  const mostrar = listo && (bienvenidaVista || enBienvenida);

  return (
    <div className="flex h-dvh items-center justify-center md:p-6">
      <div className="relative h-full w-full max-w-[430px] overflow-hidden bg-arena md:h-[860px] md:max-h-full md:rounded-[44px] md:border-[10px] md:border-tinta md:shadow-[0_30px_80px_-20px_rgba(15,42,58,.45)]">
        <main key={path} className={`scroll-hide entrar h-full overflow-y-auto ${sinTabs ? "" : "pb-24"}`}>
          {mostrar ? children : null}
        </main>
        {mostrar && !sinTabs && <TabBar />}
      </div>
    </div>
  );
}
