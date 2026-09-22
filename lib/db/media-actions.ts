"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import sharp from "sharp";
import { prisma } from "@/lib/db/client";
import { getCurrentAdmin } from "@/lib/auth/session";
import { uploadImage, deleteImageByUrl } from "@/lib/media/storage";
import { ALLOWED_MIME_TYPES, MAX_UPLOAD_BYTES } from "@/lib/validation/media";

export interface MediaFormState {
  error?: string;
}

export async function uploadMediaAction(
  _prevState: MediaFormState,
  formData: FormData
): Promise<MediaFormState> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const file = formData.get("file");
  const altText = formData.get("altText");
  const title = formData.get("title");

  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose an image file" };
  }
  if (typeof altText !== "string" || !altText.trim()) {
    return { error: "Alt text is required for accessibility and SEO" };
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return { error: "File is too large (max 8MB)" };
  }
  const extension = ALLOWED_MIME_TYPES[file.type];
  if (!extension) {
    return { error: "Only JPEG, PNG, WebP, AVIF, GIF, BMP, or TIFF images are allowed" };
  }

  const inputBuffer = Buffer.from(await file.arrayBuffer());

  // Re-encode through sharp: normalizes the format, auto-rotates from EXIF
  // orientation, then strips all remaining metadata (Phase 8).
  const image = sharp(inputBuffer).rotate();
  const { width, height } = await image.metadata();
  const outputBuffer = await image.toBuffer();

  const { url } = await uploadImage(outputBuffer, extension);

  await prisma.media.create({
    data: {
      url,
      altText,
      title: typeof title === "string" && title.trim() ? title.trim() : null,
      width: width ?? null,
      height: height ?? null,
      sizeBytes: outputBuffer.byteLength,
      mimeType: file.type,
    },
  });

  revalidatePath("/admin/media");
  return {};
}

export async function deleteMediaAction(id: string) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const media = await prisma.media.delete({ where: { id } });
  await deleteImageByUrl(media.url);
  revalidatePath("/admin/media");
}

export async function updateMediaAltTextAction(id: string, altText: string) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  if (!altText.trim()) return;
  await prisma.media.update({ where: { id }, data: { altText } });
  revalidatePath("/admin/media");
}
