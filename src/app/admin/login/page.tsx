import type { Metadata } from "next";
import { Logo } from "@/components/Logo";
import { ActionForm } from "@/components/admin/ActionForm";
import { login } from "../actions";
import "../admin.css";

export const metadata: Metadata = { title: "Entrar al panel", robots: { index: false } };

export default function LoginPage() {
  return (
    <main className="login">
      <div className="card">
        <div className="brand"><Logo /> Panel</div>
        <div>
          <h1>Entrar al panel</h1>
          <p>Escribe la contraseña de administración.</p>
        </div>
        <ActionForm action={login} submitLabel="Entrar">
          <label className="f full">
            Contraseña
            <input type="password" name="password" id="password" autoComplete="current-password" required autoFocus />
          </label>
        </ActionForm>
      </div>
    </main>
  );
}
