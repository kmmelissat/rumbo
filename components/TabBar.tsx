"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconExplorar, IconGuardados, IconPasaporte, IconOrganizar } from "./Icons";

const TABS = [
  { href: "/", label: "Explorar", Icon: IconExplorar },
  { href: "/guardados", label: "Guardados", Icon: IconGuardados },
  { href: "/pasaporte", label: "Pasaporte", Icon: IconPasaporte },
  { href: "/organizador", label: "Organizar", Icon: IconOrganizar },
];

export function TabBar() {
  const path = usePathname();
  return (
    <nav aria-label="Principal" className="absolute inset-x-0 bottom-0 z-20 border-t border-tinta/10 bg-arena/95 px-2 pb-[max(env(safe-area-inset-bottom),8px)] pt-2 backdrop-blur">
      <ul className="grid grid-cols-4">
        {TABS.map(({ href, label, Icon }) => {
          const activo = href === "/" ? path === "/" : path.startsWith(href);
          return (
            <li key={href}>
              <Link href={href} aria-current={activo ? "page" : undefined}
                className={`flex min-h-[48px] flex-col items-center justify-center gap-0.5 rounded-2xl text-[11px] font-medium ${activo ? "text-oceano" : "text-tinta/55"}`}>
                <span className={`flex h-7 w-12 items-center justify-center rounded-full transition-colors ${activo ? "bg-turquesa/20" : ""}`}><Icon /></span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
