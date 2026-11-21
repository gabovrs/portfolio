"use client";
import { useState } from "react";

export function CopyButton({ value, label = "Copiar correo" }: { value: string; label?: string }) {
  const [text, setText] = useState(label);
  return (
    <button
      type="button"
      className="copy"
      onClick={() =>
        navigator.clipboard
          .writeText(value)
          .then(() => setText("Copiado"))
          .catch(() => setText("No se pudo copiar"))
      }
    >
      {text}
    </button>
  );
}
