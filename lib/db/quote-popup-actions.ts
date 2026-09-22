"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/client";
import { getCurrentAdmin } from "@/lib/auth/session";
import { DEFAULT_QUOTE_POPUP_SETTINGS } from "@/lib/db/quote-popup";

export interface QuotePopupFormState {
  success?: boolean;
  error?: string;
}

export async function updateQuotePopupAction(
  _prevState: QuotePopupFormState,
  formData: FormData
): Promise<QuotePopupFormState> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const heading = (formData.get("heading") as string) || DEFAULT_QUOTE_POPUP_SETTINGS.heading;
  const subheading = (formData.get("subheading") as string) ?? "";
  const imageIds = formData.getAll("imageIds") as string[];
  const delaySecondsRaw = Number(formData.get("delaySeconds"));
  const delaySeconds = Number.isFinite(delaySecondsRaw) && delaySecondsRaw >= 0 ? delaySecondsRaw : 3;

  const value = {
    enabled: formData.get("enabled") === "on",
    heading,
    subheading,
    imageIds,
    delaySeconds,
  };

  await prisma.websiteSetting.upsert({
    where: { key: "quotePopup" },
    update: { value },
    create: { key: "quotePopup", value },
  });

  revalidatePath("/admin/popups");
  revalidatePath("/", "layout");
  return { success: true };
}
