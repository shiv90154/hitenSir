"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/client";
import { getCurrentAdmin } from "@/lib/auth/session";
import type { CtaButton, CtaButtonType } from "@/lib/db/cta-popup";

export interface CtaPopupFormState {
  success?: boolean;
  error?: string;
}

const VALID_TYPES: CtaButtonType[] = ["call", "whatsapp", "quote", "link"];

export async function updateCtaPopupAction(
  _prevState: CtaPopupFormState,
  formData: FormData
): Promise<CtaPopupFormState> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const heading = (formData.get("heading") as string) || "";
  const message = (formData.get("message") as string) || "";
  const delaySecondsRaw = Number(formData.get("delaySeconds"));
  const delaySeconds = Number.isFinite(delaySecondsRaw) && delaySecondsRaw >= 0 ? delaySecondsRaw : 2;

  const labels = formData.getAll("buttonLabel") as string[];
  const types = formData.getAll("buttonType") as string[];
  const values = formData.getAll("buttonValue") as string[];

  const buttons: CtaButton[] = labels
    .map((label, i) => ({
      label: label.trim(),
      type: (VALID_TYPES.includes(types[i] as CtaButtonType) ? types[i] : "link") as CtaButtonType,
      value: (values[i] ?? "").trim(),
    }))
    .filter((btn) => btn.label);

  const value = {
    enabled: formData.get("enabled") === "on",
    heading,
    message,
    delaySeconds,
    buttons: buttons as unknown as Prisma.InputJsonValue,
  };

  await prisma.websiteSetting.upsert({
    where: { key: "ctaPopup" },
    update: { value },
    create: { key: "ctaPopup", value },
  });

  revalidatePath("/admin/popups");
  revalidatePath("/", "layout");
  return { success: true };
}
