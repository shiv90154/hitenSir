"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/client";
import { getCurrentAdmin } from "@/lib/auth/session";

export interface CulturalBannerFormState {
  success?: boolean;
  error?: string;
}

export async function updateCulturalBannerAction(
  _prevState: CulturalBannerFormState,
  formData: FormData
): Promise<CulturalBannerFormState> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const heading = (formData.get("heading") as string) || "";
  const subheading = (formData.get("subheading") as string) || "";
  const ctaLabel = (formData.get("ctaLabel") as string) || "";
  const ctaHref = (formData.get("ctaHref") as string) || "";
  const imageIds = formData.getAll("imageIds") as string[];

  const value = {
    enabled: formData.get("enabled") === "on",
    heading,
    subheading,
    ctaLabel,
    ctaHref,
    imageIds,
  };

  await prisma.websiteSetting.upsert({
    where: { key: "culturalBanner" },
    update: { value },
    create: { key: "culturalBanner", value },
  });

  revalidatePath("/admin/homepage");
  revalidatePath("/");
  return { success: true };
}
