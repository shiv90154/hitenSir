"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/client";
import { getCurrentAdmin } from "@/lib/auth/session";
import { gallerySchema } from "@/lib/validation/gallery";
import { fieldErrorsFrom } from "@/lib/db/form-utils";

export interface GalleryFormState {
  error?: string;
  fieldErrors?: Record<string, string>;
}

function parseForm(formData: FormData) {
  return gallerySchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    mediaIds: formData.getAll("mediaIds"),
  });
}

export async function createGalleryAction(
  _prevState: GalleryFormState,
  formData: FormData
): Promise<GalleryFormState> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const parsed = parseForm(formData);
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error) };

  const existing = await prisma.gallery.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) return { fieldErrors: { slug: "That slug is already in use" } };

  const { mediaIds, ...data } = parsed.data;

  await prisma.gallery.create({
    data: {
      ...data,
      images: {
        create: mediaIds.map((mediaId, index) => ({ mediaId, sortOrder: index })),
      },
    },
  });

  revalidatePath("/admin/galleries");
  revalidatePath("/gallery");
  redirect("/admin/galleries");
}

export async function updateGalleryAction(
  id: string,
  _prevState: GalleryFormState,
  formData: FormData
): Promise<GalleryFormState> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const parsed = parseForm(formData);
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error) };

  const conflict = await prisma.gallery.findFirst({
    where: { slug: parsed.data.slug, NOT: { id } },
  });
  if (conflict) return { fieldErrors: { slug: "That slug is already in use" } };

  const { mediaIds, ...data } = parsed.data;

  await prisma.$transaction([
    prisma.galleryImage.deleteMany({ where: { galleryId: id } }),
    prisma.gallery.update({
      where: { id },
      data: {
        ...data,
        images: {
          create: mediaIds.map((mediaId, index) => ({ mediaId, sortOrder: index })),
        },
      },
    }),
  ]);

  revalidatePath("/admin/galleries");
  revalidatePath("/gallery");
  revalidatePath(`/gallery/${parsed.data.slug}`);
  redirect("/admin/galleries");
}

export async function deleteGalleryAction(id: string) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  await prisma.gallery.delete({ where: { id } });
  revalidatePath("/admin/galleries");
  revalidatePath("/gallery");
}
