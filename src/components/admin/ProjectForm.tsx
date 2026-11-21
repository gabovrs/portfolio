"use client";

import type { Project } from "@prisma/client";
import { ActionForm } from "./ActionForm";
import { ImageField } from "./ImageField";
import { saveProject } from "@/app/admin/actions";

type Metric = { value: string; label: string };

export function ProjectForm({ project, created }: { project?: Project; created?: boolean }) {
  const metrics = (Array.isArray(project?.metrics) ? (project!.metrics as Metric[]) : [])
    .map((m) => `${m.value} | ${m.label}`)
    .join("\n");
  return (
    <ActionForm action={saveProject} submitLabel={project ? "Guardar y publicar" : "Crear proyecto"} initialMessage={created ? "Proyecto creado y publicado." : undefined}>
      {project && <input type="hidden" name="id" value={project.id} />}
      <label className="f">Nombre<input type="text" name="title" id="title" defaultValue={project?.title} required /></label>
      <label className="f">Identificador<input type="text" name="slug" id="slug" defaultValue={project?.slug} placeholder="se genera desde el nombre" /></label>
      <label className="f">Tu rol<input type="text" name="role" id="role" defaultValue={project?.role} required /></label>
      <label className="f">Periodo<input type="text" name="period" id="period" defaultValue={project?.period} placeholder="2026 · Proyecto personal" /></label>
      <label className="f">Estado
        <select name="status" id="status" defaultValue={project?.status ?? "LIVE"}>
          <option value="IN_PROGRESS">En curso</option>
          <option value="LIVE">En producción</option>
          <option value="ARCHIVED">Finalizado</option>
        </select>
      </label>
      <label className="f">Texto del estado<input type="text" name="statusLabel" id="statusLabel" defaultValue={project?.statusLabel} placeholder="En curso · beta abierta" /></label>
      <label className="f full">Descripción corta<textarea name="summary" id="summary" defaultValue={project?.summary} required /></label>
      <label className="f full">Logros destacados<textarea name="highlights" id="highlights" defaultValue={project?.highlights.join("\n")} style={{ minHeight: 130 }} /><small>Uno por línea.</small></label>
      <label className="f full">Cifras<textarea name="metrics" id="metrics" defaultValue={metrics} style={{ minHeight: 72 }} /><small>Una por línea, con el formato: valor | descripción. Ejemplo: ~10k | visitas mensuales</small></label>
      <label className="f full">Tecnologías<input type="text" name="tech" id="tech" defaultValue={project?.tech.join(", ")} /><small>Separadas por comas.</small></label>
      <label className="f">Enlace<input type="url" name="url" id="url" defaultValue={project?.url ?? ""} placeholder="https://" /></label>
      <label className="f">Texto del enlace<input type="text" name="linkLabel" id="linkLabel" defaultValue={project?.linkLabel ?? ""} placeholder="quedo.cl" /></label>
      <ImageField name="image" label="Captura del proyecto" current={project?.imageUrl} removeName="removeImage" hint="Formato 16:10 recomendado (por ejemplo 1440 × 900) · máx. 6 MB" />
      <label className="f full">Texto alternativo de la imagen<input type="text" name="imageAlt" id="imageAlt" defaultValue={project?.imageAlt} placeholder="Describe la captura para lectores de pantalla" /></label>
      <div className="full checks">
        <label className="check"><input type="checkbox" name="featured" id="featured" defaultChecked={project?.featured ?? false} /> Destacado</label>
        <label className="check"><input type="checkbox" name="visible" id="visible" defaultChecked={project?.visible ?? true} /> Visible en el sitio</label>
      </div>
    </ActionForm>
  );
}
