"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/admin", label: "Proyectos", match: (p: string) => p === "/admin" || p.startsWith("/admin/proyectos") },
  { href: "/admin/perfil", label: "Perfil y textos" },
  { href: "/admin/experiencia", label: "Trayectoria" },
  { href: "/admin/habilidades", label: "Habilidades" },
];

export function AdminNav() {
  const path = usePathname();
  return (
    <>
      {items.map((i) => {
        const active = i.match ? i.match(path) : path.startsWith(i.href);
        return (
          <Link key={i.href} href={i.href} className="nav-i" aria-current={active ? "page" : undefined}>
            {i.label}
          </Link>
        );
      })}
    </>
  );
}
