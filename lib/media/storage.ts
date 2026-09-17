import "server-only";
import { randomBytes } from "node:crypto";
import { writeFile } from "node:fs/promises";
import path from "node:path";

export interface UploadResult {
  url: string;
  key: string;
}

function randomKey(extension: string): string {
  return `${randomBytes(16).toString("hex")}${extension}`;
}

/**
 * S3-compatible (Cloudflare R2 / AWS S3) upload, used whenever storage
 * credentials are configured. See REQUIREMENTS.md Phase 8/9.
 */
async function uploadToS3(buffer: Buffer, extension: string, contentType: string): Promise<UploadResult> {
  const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");

  const client = new S3Client({
    region: process.env.STORAGE_REGION || "auto",
    endpoint: process.env.STORAGE_ENDPOINT,
    credentials: {
      accessKeyId: process.env.STORAGE_ACCESS_KEY_ID!,
      secretAccessKey: process.env.STORAGE_SECRET_ACCESS_KEY!,
    },
  });

  const key = `media/${randomKey(extension)}`;

  await client.send(
    new PutObjectCommand({
      Bucket: process.env.STORAGE_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );

  const publicBase = process.env.STORAGE_PUBLIC_URL?.replace(/\/$/, "");
  return { url: `${publicBase}/${key}`, key };
}

/**
 * Local-disk fallback for development when no object storage is
 * configured — never used in production (Phase 8 requires object storage).
 */
async function uploadToLocalDisk(buffer: Buffer, extension: string): Promise<UploadResult> {
  const key = randomKey(extension);
  const filePath = path.join(process.cwd(), "public", "uploads", key);
  await writeFile(filePath, buffer);
  return { url: `/uploads/${key}`, key };
}

export function isObjectStorageConfigured(): boolean {
  return Boolean(
    process.env.STORAGE_BUCKET &&
      process.env.STORAGE_ACCESS_KEY_ID &&
      process.env.STORAGE_SECRET_ACCESS_KEY &&
      process.env.STORAGE_PUBLIC_URL
  );
}

export async function uploadImage(
  buffer: Buffer,
  extension: string,
  contentType: string
): Promise<UploadResult> {
  if (isObjectStorageConfigured()) {
    return uploadToS3(buffer, extension, contentType);
  }
  return uploadToLocalDisk(buffer, extension);
}
