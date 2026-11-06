"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { IconExplorar, IconCorazon, IconBoleto, IconPerfil, IconPlanes } from "./Icons";

const TABS = [
  { href: "/prototipo", label: "Explorar", Icon: IconExplorar },
  { href: "/prototipo/planes", label: "Planes", Icon: IconPlanes },
  { href: "/prototipo/guardados", label: "Guardados", Icon: IconCorazon },
  { href: "/prototipo/boletos", label: "Boletos", Icon: IconBoleto },
  { href: "/prototipo/perfil", label: "Perfil", Icon: IconPerfil, IconPlanes },
];

export function TabBar() {
  const path = usePathname();
  return (
    <nav aria-label="Principal" className="absolute inset-x-0 bottom-0 z-20 cristal border-t border-linea/60 pb-[env(safe-area-inset-bottom)]">
      <ul className="grid grid-cols-5">
        {TABS.map(({ href, label, Icon }) => {
          const activo = href === "/prototipo" ? path === "/prototipo" : path.startsWith(href);
          return (
            <li key={href}>
              <Link href={href} aria-current={activo ? "page" : undefined}
                className={`relative flex min-h-[56px] flex-col items-center justify-center gap-0.5 text-xs font-bold ${activo ? "text-acento" : "text-gris"}`}>
                {activo && <motion.span layoutId="tab-activa" transition={{ type: "spring", stiffness: 500, damping: 36 }} className="absolute top-0 h-1 w-8 rounded-b-full bg-marca" />}
                <Icon width={24} height={24} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
