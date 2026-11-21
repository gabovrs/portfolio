"use client";

import type { Profile, Stat } from "@prisma/client";
import { ActionForm } from "./ActionForm";
import { ImageField } from "./ImageField";
import { saveProfile } from "@/app/admin/actions";

export function ProfileForm({ profile, stats }: { profile: Profile | null; stats: Stat[] }) {
  const p = profile;
  return (
    <ActionForm action={saveProfile}>
      <div className="full"><h2>Portada</h2></div>
      <label className="f">Nombre<input type="text" name="firstName" id="firstName" defaultValue={p?.firstName} required /></label>
      <label className="f">Apellido<input type="text" name="lastName" id="lastName" defaultValue={p?.lastName} required /></label>
      <label className="f">Segundo apellido (va en cursiva)<input type="text" name="accentName" id="accentName" defaultValue={p?.accentName} /></label>
      <label className="f">Titular<input type="text" name="headline" id="headline" defaultValue={p?.headline} required /></label>
      <label className="f full">Presentación<textarea name="intro" id="intro" defaultValue={p?.intro} required /><small>Encierra entre **dobles asteriscos** lo que quieras resaltar.</small></label>
      <label className="f">Disponibilidad<input type="text" name="availability" id="availability" defaultValue={p?.availability} required /></label>
      <div className="f" style={{ alignContent: "end" }}>
        <label className="check"><input type="checkbox" name="available" id="available" defaultChecked={p?.available ?? true} /> Mostrar como disponible (punto verde)</label>
      </div>
      <ImageField name="photo" label="Foto de portada" current={p?.photoUrl} ratio="4 / 5" hint="Vertical 4:5 recomendado · máx. 6 MB" />
      <label className="f full">Texto bajo la foto<input type="text" name="photoCaption" id="photoCaption" defaultValue={p?.photoCaption} /></label>
      <label className="f full">Cifras de la portada
        <textarea name="stats" id="stats" defaultValue={stats.map((s) => `${s.value} | ${s.label}`).join("\n")} style={{ minHeight: 110 }} />
        <small>Una por línea, con el formato: valor | descripción. Se muestran hasta 4 por fila.</small>
      </label>
      <label className="f full">Franja de tecnologías<input type="text" name="techStrip" id="techStrip" defaultValue={p?.techStrip.join(", ")} /><small>Separadas por comas.</small></label>

      <div className="full" style={{ marginTop: 12 }}><h2>Perfil</h2></div>
      <label className="f full">Frase principal<textarea name="aboutQuote" id="aboutQuote" defaultValue={p?.aboutQuote} style={{ minHeight: 70 }} /><small>Encierra entre *asteriscos* la parte que va en cursiva azul.</small></label>
      <label className="f full">Texto<textarea name="aboutText" id="aboutText" defaultValue={p?.aboutText} /></label>

      <div className="full" style={{ marginTop: 12 }}><h2>Contacto</h2></div>
      <label className="f full">Título<input type="text" name="contactTitle" id="contactTitle" defaultValue={p?.contactTitle} required /><small>Encierra entre *asteriscos* la parte en cursiva.</small></label>
      <label className="f">Correo<input type="email" name="email" id="email" defaultValue={p?.email} required /></label>
      <label className="f">LinkedIn<input type="url" name="linkedinUrl" id="linkedinUrl" defaultValue={p?.linkedinUrl ?? ""} placeholder="https://linkedin.com/in/…" /></label>
      <label className="f">GitHub<input type="url" name="githubUrl" id="githubUrl" defaultValue={p?.githubUrl ?? ""} placeholder="https://github.com/…" /></label>
      <div className="f">
        CV en PDF
        <label className="drop" style={{ padding: 12 }}>
          <input type="file" name="cv" accept="application/pdf" />
          <b>{p?.cvUrl ? "Reemplazar CV" : "Subir CV"}</b>
          <span>{p?.cvUrl ? "Ya hay un CV publicado" : "Aparece el botón “Descargar CV” al subirlo"}</span>
        </label>
        {p?.cvUrl && <label className="check"><input type="checkbox" name="removeCv" /> Quitar CV publicado</label>}
      </div>
    </ActionForm>
  );
}
