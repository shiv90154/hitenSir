"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db/client";
import { getCurrentAdmin } from "@/lib/auth/session";

const navigationItemSchema = z.object({
  label: z.string().trim().min(1, "Label is required"),
  url: z.string().trim().min(1, "URL is required"),
  parentId: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : undefined)),
  sortOrder: z.coerce.number().int().default(0),
});

export interface NavigationFormState {
  error?: string;
}

export async function createNavigationItemAction(
  _prevState: NavigationFormState,
  formData: FormData
): Promise<NavigationFormState> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const parsed = navigationItemSchema.safeParse({
    label: formData.get("label"),
    url: formData.get("url"),
    parentId: formData.get("parentId"),
    sortOrder: formData.get("sortOrder"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  await prisma.navigationItem.create({ data: parsed.data });
  revalidatePath("/admin/navigation");
  return {};
}

export async function updateNavigationItemAction(
  id: string,
  _prevState: NavigationFormState,
  formData: FormData
): Promise<NavigationFormState> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const parsed = navigationItemSchema.safeParse({
    label: formData.get("label"),
    url: formData.get("url"),
    parentId: formData.get("parentId"),
    sortOrder: formData.get("sortOrder"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  if (parsed.data.parentId === id) {
    return { error: "An item can't be its own parent." };
  }

  await prisma.navigationItem.update({ where: { id }, data: parsed.data });
  revalidatePath("/admin/navigation");
  return {};
}

export async function deleteNavigationItemAction(id: string) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  await prisma.navigationItem.delete({ where: { id } });
  revalidatePath("/admin/navigation");
}
