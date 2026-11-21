"use client";

import type { Experience } from "@prisma/client";
import { ActionForm } from "./ActionForm";
import { saveExperience } from "@/app/admin/actions";

export function ExperienceForm({ item }: { item?: Experience }) {
  const k = item?.id ?? "new";
  return (
    <ActionForm action={saveExperience} submitLabel={item ? "Guardar" : "Agregar"} resetOnSuccess={!item}>
      {item && <input type="hidden" name="id" value={item.id} />}
      <label className="f">Cargo o título<input type="text" name="title" id={`title-${k}`} defaultValue={item?.title} required /></label>
      <label className="f">Organización<input type="text" name="org" id={`org-${k}`} defaultValue={item?.org} required /></label>
      <label className="f">Periodo<input type="text" name="period" id={`period-${k}`} defaultValue={item?.period} placeholder="Ene 2023 – hoy" required /></label>
      <div className="f" style={{ alignContent: "end" }}>
        <label className="check"><input type="checkbox" name="current" id={`current-${k}`} defaultChecked={item?.current} /> Marcar como actual</label>
      </div>
      <label className="f full">Descripción<textarea name="description" id={`description-${k}`} defaultValue={item?.description} style={{ minHeight: 72 }} /></label>
    </ActionForm>
  );
}
