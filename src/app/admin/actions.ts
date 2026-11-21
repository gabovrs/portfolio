"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { createSessionToken, sessionCookieOptions, SESSION_COOKIE } from "@/lib/session";
import { fileFrom, removeFile, uploadFile } from "@/lib/storage";

export type FormState = { ok: boolean; message: string } | null;

const ok = (message: string): FormState => ({ ok: true, message });
const fail = (message: string): FormState => ({ ok: false, message });

function refresh() {
  revalidatePath("/");
  revalidatePath("/admin", "layout");
}

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const lines = (v: string) => v.split("\n").map((s) => s.trim()).filter(Boolean);
const csv = (v: string) => v.split(/[,\n]/).map((s) => s.trim()).filter(Boolean);
const bool = (fd: FormData, k: string) => fd.get(k) === "on";
const optionalUrl = z.union([z.literal(""), z.string().url("Revisa que el enlace empiece con https://")]);

function firstIssue(e: z.ZodError) {
  return e.issues[0]?.message ?? "Revisa los datos del formulario.";
}

/* ---------- Sesión ---------- */

export async function login(_: FormState, fd: FormData): Promise<FormState> {
  const expected = process.env.ADMIN_PASSWORD ?? "";
  const given = str(fd, "password");
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  // Pausa breve para encarecer los intentos por fuerza bruta.
  await new Promise((r) => setTimeout(r, 400));
  if (!expected || a.length !== b.length || !timingSafeEqual(a, b)) {
    return fail("Contraseña incorrecta.");
  }
  const store = await cookies();
  store.set(SESSION_COOKIE, await createSessionToken(), sessionCookieOptions);
  redirect("/admin");
}

export async function logout() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect("/admin/login");
}

/* ---------- Proyectos ---------- */

const projectSchema = z.object({
  title: z.string().min(1, "El proyecto necesita un nombre."),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "El identificador solo puede tener minúsculas, números y guiones."),
  role: z.string().min(1, "Indica tu rol en el proyecto."),
  period: z.string(),
  status: z.enum(["IN_PROGRESS", "LIVE", "ARCHIVED"]),
  statusLabel: z.string(),
  summary: z.string().min(1, "Agrega una descripción corta."),
  url: optionalUrl,
  linkLabel: z.string(),
  imageAlt: z.string(),
});

function slugify(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseMetrics(v: string) {
  return lines(v).map((l) => {
    const [value, ...rest] = l.split("|");
    return { value: value.trim(), label: rest.join("|").trim() };
  });
}

export async function saveProject(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = str(fd, "id");
  const parsed = projectSchema.safeParse({
    title: str(fd, "title"),
    slug: str(fd, "slug") || slugify(str(fd, "title")),
    role: str(fd, "role"),
    period: str(fd, "period"),
    status: str(fd, "status") || "LIVE",
    statusLabel: str(fd, "statusLabel"),
    summary: str(fd, "summary"),
    url: str(fd, "url"),
    linkLabel: str(fd, "linkLabel"),
    imageAlt: str(fd, "imageAlt"),
  });
  if (!parsed.success) return fail(firstIssue(parsed.error));
  const v = parsed.data;

  const clash = await db.project.findFirst({ where: { slug: v.slug, NOT: id ? { id } : undefined } });
  if (clash) return fail(`Ya existe otro proyecto con el identificador "${v.slug}".`);

  const existing = id ? await db.project.findUnique({ where: { id } }) : null;
  if (id && !existing) return fail("Ese proyecto ya no existe.");

  let imageUrl = existing?.imageUrl ?? null;
  const image = fileFrom(fd, "image");
  try {
    if (image) {
      imageUrl = await uploadFile(image, "projects");
      await removeFile(existing?.imageUrl);
    } else if (bool(fd, "removeImage")) {
      await removeFile(existing?.imageUrl);
      imageUrl = null;
    }
  } catch (e) {
    return fail(e instanceof Error ? e.message : "No se pudo subir la imagen.");
  }

  const data = {
    ...v,
    url: v.url || null,
    linkLabel: v.linkLabel || null,
    highlights: lines(str(fd, "highlights")),
    tech: csv(str(fd, "tech")),
    metrics: parseMetrics(str(fd, "metrics")),
    featured: bool(fd, "featured"),
    visible: bool(fd, "visible"),
    imageUrl,
  };

  if (existing) {
    await db.project.update({ where: { id: existing.id }, data });
    refresh();
    return ok("Cambios guardados y publicados.");
  }
  const last = await db.project.aggregate({ _max: { order: true } });
  const created = await db.project.create({ data: { ...data, order: (last._max.order ?? -1) + 1 } });
  refresh();
  redirect(`/admin/proyectos/${created.id}?creado=1`);
}

export async function toggleProject(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id");
  const field = str(fd, "field");
  if (field !== "featured" && field !== "visible") return;
  const p = await db.project.findUnique({ where: { id } });
  if (!p) return;
  await db.project.update({ where: { id }, data: { [field]: !p[field] } });
  refresh();
}

async function move<T extends { id: string; order: number }>(
  items: T[],
  id: string,
  dir: string,
  update: (id: string, order: number) => Promise<unknown>,
) {
  const i = items.findIndex((x) => x.id === id);
  const j = dir === "up" ? i - 1 : i + 1;
  if (i < 0 || j < 0 || j >= items.length) return;
  const reordered = [...items];
  [reordered[i], reordered[j]] = [reordered[j], reordered[i]];
  await Promise.all(reordered.map((x, idx) => (x.order === idx ? null : update(x.id, idx))));
}

export async function moveProject(fd: FormData) {
  await requireAdmin();
  const items = await db.project.findMany({ orderBy: { order: "asc" } });
  await move(items, str(fd, "id"), str(fd, "dir"), (id, order) => db.project.update({ where: { id }, data: { order } }));
  refresh();
}

export async function deleteProject(fd: FormData) {
  await requireAdmin();
  const p = await db.project.findUnique({ where: { id: str(fd, "id") } });
  if (p) {
    await removeFile(p.imageUrl);
    await db.project.delete({ where: { id: p.id } });
  }
  refresh();
  redirect("/admin");
}

/* ---------- Perfil ---------- */

const profileSchema = z.object({
  firstName: z.string().min(1, "Falta tu nombre."),
  lastName: z.string().min(1, "Falta tu apellido."),
  accentName: z.string(),
  headline: z.string().min(1, "Falta el titular."),
  intro: z.string().min(1, "Falta la presentación."),
  availability: z.string().min(1, "Indica tu disponibilidad."),
  photoCaption: z.string(),
  aboutQuote: z.string(),
  aboutText: z.string(),
  contactTitle: z.string().min(1, "Falta el título de contacto."),
  email: z.string().email("Revisa el correo."),
  linkedinUrl: optionalUrl,
  githubUrl: optionalUrl,
});

export async function saveProfile(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = profileSchema.safeParse(
    Object.fromEntries(Object.keys(profileSchema.shape).map((k) => [k, str(fd, k)])),
  );
  if (!parsed.success) return fail(firstIssue(parsed.error));
  const v = parsed.data;
  const current = await db.profile.findUnique({ where: { id: 1 } });

  let photoUrl = current?.photoUrl ?? null;
  let cvUrl = current?.cvUrl ?? null;
  try {
    const photo = fileFrom(fd, "photo");
    if (photo) {
      photoUrl = await uploadFile(photo, "profile");
      await removeFile(current?.photoUrl);
    }
    const cv = fileFrom(fd, "cv");
    if (cv) {
      cvUrl = await uploadFile(cv, "cv", "pdf");
      await removeFile(current?.cvUrl);
    } else if (bool(fd, "removeCv")) {
      await removeFile(current?.cvUrl);
      cvUrl = null;
    }
  } catch (e) {
    return fail(e instanceof Error ? e.message : "No se pudo subir el archivo.");
  }

  const data = {
    ...v,
    linkedinUrl: v.linkedinUrl || null,
    githubUrl: v.githubUrl || null,
    available: bool(fd, "available"),
    techStrip: csv(str(fd, "techStrip")),
    photoUrl,
    cvUrl,
  };
  await db.profile.upsert({ where: { id: 1 }, update: data, create: { id: 1, ...data } });

  const stats = lines(str(fd, "stats")).map((l, order) => {
    const [value, ...rest] = l.split("|");
    return { value: value.trim(), label: rest.join("|").trim(), order };
  });
  await db.$transaction([db.stat.deleteMany(), db.stat.createMany({ data: stats })]);

  refresh();
  return ok("Perfil guardado y publicado.");
}

/* ---------- Experiencia ---------- */

const experienceSchema = z.object({
  period: z.string().min(1, "Indica el periodo."),
  title: z.string().min(1, "Indica el cargo o título."),
  org: z.string().min(1, "Indica la organización."),
  description: z.string(),
});

export async function saveExperience(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = experienceSchema.safeParse({
    period: str(fd, "period"),
    title: str(fd, "title"),
    org: str(fd, "org"),
    description: str(fd, "description"),
  });
  if (!parsed.success) return fail(firstIssue(parsed.error));
  const id = str(fd, "id");
  const data = { ...parsed.data, current: bool(fd, "current") };
  if (id) {
    await db.experience.update({ where: { id }, data });
  } else {
    const last = await db.experience.aggregate({ _max: { order: true } });
    await db.experience.create({ data: { ...data, order: (last._max.order ?? -1) + 1 } });
  }
  refresh();
  return ok(id ? "Guardado." : "Agregado a tu trayectoria.");
}

export async function moveExperience(fd: FormData) {
  await requireAdmin();
  const items = await db.experience.findMany({ orderBy: { order: "asc" } });
  await move(items, str(fd, "id"), str(fd, "dir"), (id, order) => db.experience.update({ where: { id }, data: { order } }));
  refresh();
}

export async function deleteExperience(fd: FormData) {
  await requireAdmin();
  await db.experience.deleteMany({ where: { id: str(fd, "id") } });
  refresh();
}

/* ---------- Habilidades ---------- */

export async function saveSkills(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const groups = lines(str(fd, "skills"))
    .map((l, order) => {
      const [label, ...rest] = l.split(":");
      return { label: label.trim(), items: csv(rest.join(":")), order };
    })
    .filter((g) => g.label && g.items.length);
  await db.$transaction([db.skillGroup.deleteMany(), db.skillGroup.createMany({ data: groups })]);
  refresh();
  return ok("Habilidades guardadas.");
}
