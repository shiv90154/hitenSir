"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/client";
import { getCurrentAdmin } from "@/lib/auth/session";
import { DEFAULT_HOMEPAGE_SECTIONS, type HomepageSections } from "@/lib/db/homepage-settings";

export interface HomepageSettingsFormState {
  success?: boolean;
}

export async function updateHomepageSectionsAction(
  _prevState: HomepageSettingsFormState,
  formData: FormData
): Promise<HomepageSettingsFormState> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const keys = Object.keys(DEFAULT_HOMEPAGE_SECTIONS) as (keyof HomepageSections)[];
  const value: Record<string, boolean> = {};
  for (const key of keys) {
    value[key] = formData.get(key) === "on";
  }

  await prisma.websiteSetting.upsert({
    where: { key: "homepage" },
    update: { value },
    create: { key: "homepage", value },
  });

  revalidatePath("/admin/homepage");
  revalidatePath("/");
  return { success: true };
}
