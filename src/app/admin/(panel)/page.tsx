import Link from "next/link";
import { db } from "@/lib/db";
import { moveProject, toggleProject } from "../actions";

export default async function ProjectsPage() {
  const projects = await db.project.findMany({ orderBy: { order: "asc" } });
  return (
    <>
      <div className="pagehead">
        <div>
          <h1>Proyectos</h1>
          <p>El destacado aparece primero. Usa las flechas para ordenar el resto.</p>
        </div>
        <Link className="btn primary sm" href="/admin/proyectos/nuevo">Nuevo proyecto</Link>
      </div>
      <div className="tbl">
        <table>
          <thead>
            <tr><th>Orden</th><th>Imagen</th><th>Proyecto</th><th>Estado</th><th>Destacado</th><th>Visible</th></tr>
          </thead>
          <tbody>
            {projects.length === 0 && (
              <tr><td colSpan={6} style={{ color: "var(--muted)" }}>Aún no hay proyectos. Crea el primero con “Nuevo proyecto”.</td></tr>
            )}
            {projects.map((p, i) => (
              <tr key={p.id}>
                <td>
                  <div className="order">
                    <form action={moveProject}><input type="hidden" name="id" value={p.id} /><input type="hidden" name="dir" value="up" /><button type="submit" disabled={i === 0} aria-label={`Subir ${p.title}`}>↑</button></form>
                    <form action={moveProject}><input type="hidden" name="id" value={p.id} /><input type="hidden" name="dir" value="down" /><button type="submit" disabled={i === projects.length - 1} aria-label={`Bajar ${p.title}`}>↓</button></form>
                  </div>
                </td>
                <td><div className="thumb">{p.imageUrl && <img src={p.imageUrl} alt="" />}</div></td>
                <td>
                  <Link className="title" href={`/admin/proyectos/${p.id}`}>{p.title}</Link>
                  <div style={{ color: "var(--muted)", fontSize: 13 }}>{p.linkLabel || p.slug}</div>
                </td>
                <td><span className={p.visible ? "st" : "st hidden"}><i />{p.visible ? "Publicado" : "Oculto"}</span></td>
                {(["featured", "visible"] as const).map((field) => (
                  <td key={field}>
                    <form action={toggleProject}>
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="field" value={field} />
                      <button type="submit" className="toggle" aria-pressed={p[field]} aria-label={`${field === "featured" ? "Destacado" : "Visible"}: ${p.title}`} />
                    </form>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
