import "server-only";
import { randomBytes } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

export interface UploadResult {
  url: string;
  key: string;
}

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

function randomKey(extension: string): string {
  return `${randomBytes(16).toString("hex")}${extension}`;
}

/**
 * All uploaded media is stored directly on this server's own disk, under
 * public/uploads — no external object storage (S3/R2/Cloudinary) involved.
 * Files are served straight from Next.js's static /public handling.
 */
export async function uploadImage(buffer: Buffer, extension: string): Promise<UploadResult> {
  const key = randomKey(extension);
  await mkdir(UPLOADS_DIR, { recursive: true });
  await writeFile(path.join(UPLOADS_DIR, key), buffer);
  return { url: `/uploads/${key}`, key };
}

/**
 * Removes a previously-uploaded file from disk given its public URL
 * (e.g. "/uploads/ab12...jpg"). Called when a media record is deleted, so
 * files don't pile up on disk indefinitely. Safe to call on a URL that
 * doesn't point at a local upload (e.g. leftover data from before this
 * storage mode) — it's just a no-op in that case.
 */
export async function deleteImageByUrl(url: string): Promise<void> {
  if (!url.startsWith("/uploads/")) return;

  const key = url.slice("/uploads/".length);
  // Guard against path traversal — a key should never contain a path separator.
  if (!key || key.includes("/") || key.includes("\\") || key.includes("..")) return;

  try {
    await unlink(path.join(UPLOADS_DIR, key));
  } catch (error) {
    // Already gone, or a permissions issue — deleting the DB record should
    // still proceed either way, so this is intentionally swallowed.
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      console.error(`Failed to delete uploaded file for ${url}:`, error);
    }
  }
}
