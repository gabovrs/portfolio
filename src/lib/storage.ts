import "server-only";
import { put, del } from "@vercel/blob";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_IMAGE = 6 * 1024 * 1024;
const MAX_PDF = 8 * 1024 * 1024;

// Vercel conecta el store con BLOB_STORE_ID (+ token OIDC del despliegue) o con BLOB_READ_WRITE_TOKEN.
const hasBlob = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);

export type UploadKind = "image" | "pdf";

/**
 * Sube un archivo a Vercel Blob. Sin credenciales de Blob (desarrollo local)
 * lo guarda en public/uploads.
 */
export async function uploadFile(file: File, folder: string, kind: UploadKind = "image") {
  if (kind === "image" && !IMAGE_TYPES.includes(file.type)) {
    throw new Error("Formato no soportado. Usa JPG, PNG, WEBP o AVIF.");
  }
  if (kind === "pdf" && file.type !== "application/pdf") {
    throw new Error("El CV debe ser un PDF.");
  }
  const limit = kind === "image" ? MAX_IMAGE : MAX_PDF;
  if (file.size > limit) throw new Error(`El archivo supera ${Math.round(limit / 1024 / 1024)} MB.`);

  const ext = (file.name.split(".").pop() || (kind === "pdf" ? "pdf" : "jpg")).toLowerCase().replace(/[^a-z0-9]/g, "");
  const name = `${folder}/${randomUUID()}.${ext}`;

  if (hasBlob()) {
    const blob = await put(name, file, { access: "public", contentType: file.type });
    return blob.url;
  }

  if (process.env.VERCEL) {
    throw new Error("Falta conectar un Blob store en Vercel (Storage → Blob) para subir archivos.");
  }

  const dir = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(process.cwd(), "public", "uploads", name), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${name}`;
}

/** Borra un archivo anterior si estaba en Vercel Blob. Los archivos locales y de /seed se dejan. */
export async function removeFile(url: string | null | undefined) {
  if (!url || !hasBlob()) return;
  if (!url.includes(".blob.vercel-storage.com")) return;
  try {
    await del(url);
  } catch {
    // No bloquea el guardado si el archivo ya no existe.
  }
}

export function fileFrom(formData: FormData, key: string) {
  const f = formData.get(key);
  return f instanceof File && f.size > 0 ? f : null;
}
