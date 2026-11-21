import { db } from "@/lib/db";
import { ExperienceForm } from "@/components/admin/ExperienceForm";
import { deleteExperience, moveExperience } from "../../actions";

export default async function ExperiencePage() {
  const items = await db.experience.findMany({ orderBy: { order: "asc" } });
  return (
    <>
      <div className="pagehead"><div><h1>Trayectoria</h1><p>Experiencia laboral y formación, en el orden en que aparecen en el sitio.</p></div></div>
      <div className="panel">
        {items.map((e, i) => (
          <div className="xp-item" key={e.id}>
            <div className="xp-tools">
              <span className="grow">{e.title}</span>
              <div className="order">
                <form action={moveExperience}><input type="hidden" name="id" value={e.id} /><input type="hidden" name="dir" value="up" /><button type="submit" disabled={i === 0} aria-label={`Subir ${e.title}`}>↑</button></form>
                <form action={moveExperience}><input type="hidden" name="id" value={e.id} /><input type="hidden" name="dir" value="down" /><button type="submit" disabled={i === items.length - 1} aria-label={`Bajar ${e.title}`}>↓</button></form>
              </div>
              <details className="danger-zone" style={{ position: "relative" }}>
                <summary>Eliminar</summary>
                <form action={deleteExperience}><input type="hidden" name="id" value={e.id} /><button type="submit" className="btn danger sm">Confirmar</button></form>
              </details>
            </div>
            <ExperienceForm item={e} />
          </div>
        ))}
        {items.length === 0 && <p style={{ color: "var(--muted)" }}>Aún no hay entradas.</p>}
      </div>
      <div className="panel">
        <h2>Agregar entrada</h2>
        <ExperienceForm />
      </div>
    </>
  );
}
