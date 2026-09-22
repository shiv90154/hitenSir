"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/client";
import { getCurrentAdmin } from "@/lib/auth/session";
import { DEFAULT_HERO_SETTINGS } from "@/lib/db/hero-settings";

export interface HeroSettingsFormState {
  success?: boolean;
  error?: string;
}

export async function updateHeroSettingsAction(
  _prevState: HeroSettingsFormState,
  formData: FormData
): Promise<HeroSettingsFormState> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const eyebrow = formData.get("eyebrow");
  const title = formData.get("title");
  const subtitle = formData.get("subtitle");
  const imageIds = formData.getAll("imageIds") as string[];

  if (typeof title !== "string" || !title.trim()) {
    return { error: "Headline is required" };
  }

  const value: Record<string, string | string[]> = {
    eyebrow: typeof eyebrow === "string" && eyebrow.trim() ? eyebrow.trim() : DEFAULT_HERO_SETTINGS.eyebrow,
    title: title.trim(),
    subtitle: typeof subtitle === "string" ? subtitle.trim() : "",
    imageIds,
  };

  await prisma.websiteSetting.upsert({
    where: { key: "hero" },
    update: { value },
    create: { key: "hero", value },
  });

  revalidatePath("/admin/homepage");
  revalidatePath("/");
  return { success: true };
}
