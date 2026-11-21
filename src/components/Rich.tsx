import { Fragment } from "react";

/**
 * Formato mínimo para textos editables desde el panel:
 * **texto** = destacado, *texto* = acento en serif cursiva.
 */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith("**") && p.endsWith("**")) return <strong key={i}>{p.slice(2, -2)}</strong>;
        if (p.startsWith("*") && p.endsWith("*")) return <span key={i} className="serif">{p.slice(1, -1)}</span>;
        return <Fragment key={i}>{p}</Fragment>;
      })}
    </>
  );
}
