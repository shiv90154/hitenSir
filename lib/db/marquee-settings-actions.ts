"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/client";
import { getCurrentAdmin } from "@/lib/auth/session";

export interface MarqueeSettingsFormState {
  success?: boolean;
  error?: string;
}

export async function updateMarqueeSettingsAction(
  _prevState: MarqueeSettingsFormState,
  formData: FormData
): Promise<MarqueeSettingsFormState> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const enabled = formData.get("enabled") === "on";
  const itemsRaw = formData.get("items");
  const speed = formData.get("speed");

  const items =
    typeof itemsRaw === "string"
      ? itemsRaw
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean)
      : [];

  if (enabled && items.length === 0) {
    return { error: "Add at least one line of text before enabling the marquee" };
  }

  const value = {
    enabled,
    items,
    speed: speed === "slow" || speed === "fast" ? speed : "normal",
  };

  await prisma.websiteSetting.upsert({
    where: { key: "marquee" },
    update: { value },
    create: { key: "marquee", value },
  });

  revalidatePath("/admin/homepage");
  revalidatePath("/");
  return { success: true };
}
