"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/client";
import { getCurrentAdmin } from "@/lib/auth/session";
import { placeSchema } from "@/lib/validation/place";
import { fieldErrorsFrom } from "@/lib/db/form-utils";

export interface PlaceFormState {
  error?: string;
  fieldErrors?: Record<string, string>;
}

function parseForm(formData: FormData) {
  return placeSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    destinationId: formData.get("destinationId"),
    bestTimeToVisit: formData.get("bestTimeToVisit"),
    status: formData.get("status"),
  });
}

export async function createPlaceAction(
  _prevState: PlaceFormState,
  formData: FormData
): Promise<PlaceFormState> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const parsed = parseForm(formData);
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error) };

  const existing = await prisma.place.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) return { fieldErrors: { slug: "That slug is already in use" } };

  await prisma.place.create({ data: parsed.data });
  revalidatePath("/admin/places");
  revalidatePath("/places");
  redirect("/admin/places");
}

export async function updatePlaceAction(
  id: string,
  _prevState: PlaceFormState,
  formData: FormData
): Promise<PlaceFormState> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const parsed = parseForm(formData);
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error) };

  const conflict = await prisma.place.findFirst({
    where: { slug: parsed.data.slug, NOT: { id } },
  });
  if (conflict) return { fieldErrors: { slug: "That slug is already in use" } };

  await prisma.place.update({ where: { id }, data: parsed.data });
  revalidatePath("/admin/places");
  revalidatePath("/places");
  revalidatePath(`/places/${parsed.data.slug}`);
  redirect("/admin/places");
}

export async function deletePlaceAction(id: string) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  await prisma.place.delete({ where: { id } });
  revalidatePath("/admin/places");
  revalidatePath("/places");
}
