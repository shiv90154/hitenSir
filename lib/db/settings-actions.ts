"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/client";
import { getCurrentAdmin } from "@/lib/auth/session";
import { DEFAULT_SITE_SETTINGS, type SiteSettings } from "@/lib/db/settings";

export interface SettingsFormState {
  error?: string;
  success?: boolean;
}

export async function updateSiteSettingsAction(
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const value: SiteSettings = {
    siteName: String(formData.get("siteName") ?? DEFAULT_SITE_SETTINGS.siteName).trim(),
    tagline: String(formData.get("tagline") ?? "").trim(),
    contactEmail: String(formData.get("contactEmail") ?? "").trim(),
    contactPhone: String(formData.get("contactPhone") ?? "").trim(),
    contactPhone2: String(formData.get("contactPhone2") ?? "").trim(),
    address: String(formData.get("address") ?? "").trim(),
    socialFacebook: String(formData.get("socialFacebook") ?? "").trim(),
    socialInstagram: String(formData.get("socialInstagram") ?? "").trim(),
    socialTwitter: String(formData.get("socialTwitter") ?? "").trim(),
    socialYoutube: String(formData.get("socialYoutube") ?? "").trim(),
    tawkEnabled: formData.get("tawkEnabled") === "on",
    tawkWidgetUrl: String(formData.get("tawkWidgetUrl") ?? "").trim(),
  };

  const jsonValue: Record<string, string | boolean> = { ...value };

  await prisma.websiteSetting.upsert({
    where: { key: "site" },
    update: { value: jsonValue },
    create: { key: "site", value: jsonValue },
  });

  revalidatePath("/admin/settings");
  revalidatePath("/");
  return { success: true };
}
