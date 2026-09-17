"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/client";
import { getCurrentAdmin } from "@/lib/auth/session";
import { categorySchema } from "@/lib/validation/category";
import { fieldErrorsFrom } from "@/lib/db/form-utils";

export interface CategoryFormState {
  error?: string;
  fieldErrors?: Record<string, string>;
}

function parseForm(formData: FormData) {
  return categorySchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    appliesTo: formData.get("appliesTo"),
  });
}

export async function createCategoryAction(
  _prevState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const parsed = parseForm(formData);
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error) };

  const existing = await prisma.category.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) return { fieldErrors: { slug: "That slug is already in use" } };

  await prisma.category.create({ data: parsed.data });
  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function updateCategoryAction(
  id: string,
  _prevState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const parsed = parseForm(formData);
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error) };

  const conflict = await prisma.category.findFirst({ where: { slug: parsed.data.slug, NOT: { id } } });
  if (conflict) return { fieldErrors: { slug: "That slug is already in use" } };

  await prisma.category.update({ where: { id }, data: parsed.data });
  revalidatePath("/admin/categories");
  return {};
}

export async function deleteCategoryAction(id: string) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
}
