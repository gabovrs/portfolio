import Link from "next/link";
import { ProjectForm } from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <>
      <div className="pagehead"><div><Link href="/admin" style={{ fontSize: 13, color: "var(--muted)" }}>← Proyectos</Link><h1>Nuevo proyecto</h1></div></div>
      <div className="panel"><ProjectForm /></div>
    </>
  );
}
