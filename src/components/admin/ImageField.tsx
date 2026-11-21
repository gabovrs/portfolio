"use client";

import { useState } from "react";

export function ImageField({
  name,
  label,
  current,
  accept = "image/jpeg,image/png,image/webp,image/avif",
  ratio = "16 / 10",
  hint,
  removeName,
}: {
  name: string;
  label: string;
  current?: string | null;
  accept?: string;
  ratio?: string;
  hint?: string;
  removeName?: string;
}) {
  const [preview, setPreview] = useState<string | null>(current ?? null);
  const [removed, setRemoved] = useState(false);
  return (
    <div className="full imgfield">
      <span className="flabel">{label}</span>
      <div className="imgrow">
        <div className="imgprev" style={{ aspectRatio: ratio }}>
          {preview && !removed ? <img src={preview} alt="" /> : <span>Sin imagen</span>}
        </div>
        <div className="imgctl">
          <label className="drop">
            <input
              type="file"
              name={name}
              accept={accept}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) {
                  setPreview(URL.createObjectURL(f));
                  setRemoved(false);
                }
              }}
            />
            <b>Elegir imagen</b>
            <span>{hint ?? "JPG, PNG o WEBP · máx. 6 MB"}</span>
          </label>
          {removeName && current && (
            <label className="check">
              <input type="checkbox" name={removeName} onChange={(e) => setRemoved(e.target.checked)} /> Quitar imagen actual
            </label>
          )}
        </div>
      </div>
    </div>
  );
}
