import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { deleteProject } from "../../../actions";

export default async function EditProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ creado?: string }>;
}) {
  const { id } = await params;
  const { creado } = await searchParams;
  const project = await db.project.findUnique({ where: { id } });
  if (!project) notFound();
  return (
    <>
      <div className="pagehead">
        <div><Link href="/admin" style={{ fontSize: 13, color: "var(--muted)" }}>← Proyectos</Link><h1>{project.title}</h1></div>
        <span className={project.visible ? "st" : "st hidden"}><i />{project.visible ? "Publicado" : "Oculto"}</span>
      </div>
      <div className="panel"><ProjectForm project={project} created={creado === "1"} /></div>
      <details className="panel danger-zone">
        <summary>Eliminar este proyecto</summary>
        <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 12 }}>Se borra del sitio junto con su captura. No se puede deshacer.</p>
        <form action={deleteProject}>
          <input type="hidden" name="id" value={project.id} />
          <button type="submit" className="btn danger sm">Sí, eliminar {project.title}</button>
        </form>
      </details>
    </>
  );
}
