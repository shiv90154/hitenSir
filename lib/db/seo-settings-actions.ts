"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/client";
import { getCurrentAdmin } from "@/lib/auth/session";

export interface SeoSettingsFormState {
  success?: boolean;
}

export async function updateSeoDefaultsAction(
  _prevState: SeoSettingsFormState,
  formData: FormData
): Promise<SeoSettingsFormState> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const value = {
    defaultTitleSuffix: String(formData.get("defaultTitleSuffix") ?? "").trim(),
    defaultDescription: String(formData.get("defaultDescription") ?? "").trim(),
  };

  await prisma.websiteSetting.upsert({
    where: { key: "seo" },
    update: { value },
    create: { key: "seo", value },
  });

  revalidatePath("/admin/seo");
  revalidatePath("/", "layout");
  return { success: true };
}
