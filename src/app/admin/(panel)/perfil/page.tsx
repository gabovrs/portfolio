import { db } from "@/lib/db";
import { ProfileForm } from "@/components/admin/ProfileForm";

export default async function ProfilePage() {
  const [profile, stats] = await Promise.all([
    db.profile.findUnique({ where: { id: 1 } }),
    db.stat.findMany({ orderBy: { order: "asc" } }),
  ]);
  return (
    <>
      <div className="pagehead"><div><h1>Perfil y textos</h1><p>Todo lo que aparece en la portada, el perfil y el contacto.</p></div></div>
      <div className="panel"><ProfileForm profile={profile} stats={stats} /></div>
    </>
  );
}
