"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/client";
import { getCurrentAdmin } from "@/lib/auth/session";
import { activitySchema } from "@/lib/validation/activity";
import { fieldErrorsFrom } from "@/lib/db/form-utils";

export interface ActivityFormState {
  error?: string;
  fieldErrors?: Record<string, string>;
}

function parseForm(formData: FormData) {
  return activitySchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    destinationId: formData.get("destinationId"),
    duration: formData.get("duration"),
    priceFrom: formData.get("priceFrom"),
    difficulty: formData.get("difficulty"),
    bestSeason: formData.get("bestSeason"),
    safetyInfo: formData.get("safetyInfo"),
    status: formData.get("status"),
  });
}

function toPrismaData(data: ReturnType<typeof activitySchema.parse>) {
  return {
    ...data,
    difficulty: data.difficulty ? data.difficulty : undefined,
  };
}

export async function createActivityAction(
  _prevState: ActivityFormState,
  formData: FormData
): Promise<ActivityFormState> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const parsed = parseForm(formData);
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error) };

  const existing = await prisma.activity.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) return { fieldErrors: { slug: "That slug is already in use" } };

  await prisma.activity.create({ data: toPrismaData(parsed.data) });
  revalidatePath("/admin/activities");
  revalidatePath("/things-to-do");
  redirect("/admin/activities");
}

export async function updateActivityAction(
  id: string,
  _prevState: ActivityFormState,
  formData: FormData
): Promise<ActivityFormState> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const parsed = parseForm(formData);
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error) };

  const conflict = await prisma.activity.findFirst({
    where: { slug: parsed.data.slug, NOT: { id } },
  });
  if (conflict) return { fieldErrors: { slug: "That slug is already in use" } };

  await prisma.activity.update({ where: { id }, data: toPrismaData(parsed.data) });
  revalidatePath("/admin/activities");
  revalidatePath("/things-to-do");
  revalidatePath(`/things-to-do/${parsed.data.slug}`);
  redirect("/admin/activities");
}

export async function deleteActivityAction(id: string) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  await prisma.activity.delete({ where: { id } });
  revalidatePath("/admin/activities");
  revalidatePath("/things-to-do");
}
