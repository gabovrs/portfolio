"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import type { FormState } from "@/app/admin/actions";

type Props = {
  action: (state: FormState, fd: FormData) => Promise<FormState>;
  children: React.ReactNode;
  submitLabel?: string;
  className?: string;
  resetOnSuccess?: boolean;
  initialMessage?: string;
};

export function SubmitButton({ label, pendingLabel = "Guardando…", className = "btn primary sm" }: { label: string; pendingLabel?: string; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button className={className} type="submit" disabled={pending} aria-busy={pending}>
      {pending ? pendingLabel : label}
    </button>
  );
}

export function ActionForm({ action, children, submitLabel = "Guardar y publicar", className = "form", resetOnSuccess, initialMessage }: Props) {
  const [state, formAction] = useActionState(action, initialMessage ? { ok: true, message: initialMessage } : null);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.ok && resetOnSuccess) ref.current?.reset();
  }, [state, resetOnSuccess]);
  return (
    <form ref={ref} action={formAction} className={className}>
      {children}
      <div className="full actions">
        <SubmitButton label={submitLabel} />
        {state && (
          <span className={state.ok ? "msg ok" : "msg err"} role="status">
            {state.message}
          </span>
        )}
      </div>
    </form>
  );
}
