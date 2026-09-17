"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/client";
import { getCurrentAdmin } from "@/lib/auth/session";
import { destinationSchema } from "@/lib/validation/destination";
import { fieldErrorsFrom } from "@/lib/db/form-utils";
import { setRelations } from "@/lib/db/content-relations";

export interface DestinationFormState {
  error?: string;
  fieldErrors?: Record<string, string>;
}

function parseForm(formData: FormData) {
  return destinationSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    shortDescription: formData.get("shortDescription"),
    description: formData.get("description"),
    coverImageId: formData.get("coverImageId"),
    state: formData.get("state"),
    bestTimeToVisit: formData.get("bestTimeToVisit"),
    howToReach: formData.get("howToReach"),
    travelTips: formData.get("travelTips"),
    status: formData.get("status"),
  });
}

export async function createDestinationAction(
  _prevState: DestinationFormState,
  formData: FormData
): Promise<DestinationFormState> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const parsed = parseForm(formData);
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error) };

  const existing = await prisma.destination.findUnique({
    where: { slug: parsed.data.slug },
  });
  if (existing) {
    return { fieldErrors: { slug: "That slug is already in use" } };
  }

  await prisma.destination.create({ data: parsed.data });
  revalidatePath("/admin/destinations");
  revalidatePath("/destinations");
  redirect("/admin/destinations");
}

export async function updateDestinationAction(
  id: string,
  _prevState: DestinationFormState,
  formData: FormData
): Promise<DestinationFormState> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const parsed = parseForm(formData);
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error) };

  const conflict = await prisma.destination.findFirst({
    where: { slug: parsed.data.slug, NOT: { id } },
  });
  if (conflict) {
    return { fieldErrors: { slug: "That slug is already in use" } };
  }

  await prisma.destination.update({ where: { id }, data: parsed.data });

  const nearbyIds = formData.getAll("nearbyDestinationIds").map(String).filter(Boolean);
  await setRelations("DESTINATION", id, "DESTINATION", "NEARBY", nearbyIds);

  revalidatePath("/admin/destinations");
  revalidatePath("/destinations");
  revalidatePath(`/destinations/${parsed.data.slug}`);
  redirect("/admin/destinations");
}

export async function deleteDestinationAction(id: string) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  await prisma.destination.delete({ where: { id } });
  revalidatePath("/admin/destinations");
  revalidatePath("/destinations");
}
