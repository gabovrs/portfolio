import "server-only";
import { db } from "./db";

export type Metric = { value: string; label: string };

export async function getSite() {
  const [profile, stats, projects, experience, skills] = await Promise.all([
    db.profile.findUnique({ where: { id: 1 } }),
    db.stat.findMany({ orderBy: { order: "asc" } }),
    db.project.findMany({ where: { visible: true }, orderBy: [{ featured: "desc" }, { order: "asc" }] }),
    db.experience.findMany({ orderBy: { order: "asc" } }),
    db.skillGroup.findMany({ orderBy: { order: "asc" } }),
  ]);
  return { profile, stats, projects, experience, skills };
}

export function metricsOf(value: unknown): Metric[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((m): m is Metric => !!m && typeof m === "object" && "value" in m && "label" in m)
    .map((m) => ({ value: String(m.value), label: String(m.label) }));
}
