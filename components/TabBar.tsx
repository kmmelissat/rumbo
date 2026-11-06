"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconExplorar, IconCorazon, IconBoleto, IconPerfil } from "./Icons";

const TABS = [
  { href: "/prototipo", label: "Explorar", Icon: IconExplorar },
  { href: "/prototipo/guardados", label: "Guardados", Icon: IconCorazon },
  { href: "/prototipo/boletos", label: "Boletos", Icon: IconBoleto },
  { href: "/prototipo/perfil", label: "Perfil", Icon: IconPerfil },
];

export function TabBar() {
  const path = usePathname();
  return (
    <nav aria-label="Principal" className="absolute inset-x-0 bottom-0 z-20 border-t border-linea bg-white pb-[env(safe-area-inset-bottom)]">
      <ul className="grid grid-cols-4">
        {TABS.map(({ href, label, Icon }) => {
          const activo = href === "/prototipo" ? path === "/prototipo" : path.startsWith(href);
          return (
            <li key={href}>
              <Link href={href} aria-current={activo ? "page" : undefined}
                className={`relative flex min-h-[56px] flex-col items-center justify-center gap-0.5 text-[11px] font-bold ${activo ? "text-oceano" : "text-gris"}`}>
                {activo && <span className="absolute top-0 h-1 w-8 rounded-b-full bg-marca" />}
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
