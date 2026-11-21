import type { Metadata } from "next";
import { Logo } from "@/components/Logo";
import { AdminNav } from "@/components/admin/AdminNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { requireAdmin } from "@/lib/auth";
import { logout } from "../actions";
import "../admin.css";

export const metadata: Metadata = { title: "Panel", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="admin">
      <aside className="side">
        <div className="brand"><Logo /> Panel</div>
        <AdminNav />
        <div className="bottom">
          <a href="/" target="_blank" rel="noopener">Ver sitio ↗</a>
          <ThemeToggle />
          <form action={logout}><button type="submit">Cerrar sesión</button></form>
        </div>
      </aside>
      <main className="content"><div className="inner">{children}</div></main>
    </div>
  );
}
