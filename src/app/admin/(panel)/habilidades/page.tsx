import { db } from "@/lib/db";
import { ActionForm } from "@/components/admin/ActionForm";
import { saveSkills } from "../../actions";

export default async function SkillsPage() {
  const groups = await db.skillGroup.findMany({ orderBy: { order: "asc" } });
  const text = groups.map((g) => `${g.label}: ${g.items.join(", ")}`).join("\n");
  return (
    <>
      <div className="pagehead"><div><h1>Habilidades</h1><p>Aparecen en la sección Perfil del sitio.</p></div></div>
      <div className="panel">
        <ActionForm action={saveSkills}>
          <label className="f full">
            Grupos
            <textarea name="skills" id="skills" defaultValue={text} style={{ minHeight: 200, fontFamily: "var(--f-mono)", fontSize: 13 }} />
            <small>Un grupo por línea, con el formato: Nombre del grupo: elemento, elemento, elemento</small>
          </label>
        </ActionForm>
      </div>
    </>
  );
}
