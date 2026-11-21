import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, verifySessionToken } from "./session";

/** Corta cualquier acción del panel si no hay sesión válida. */
export async function requireAdmin() {
  const store = await cookies();
  const ok = await verifySessionToken(store.get(SESSION_COOKIE)?.value);
  if (!ok) redirect("/admin/login");
}
