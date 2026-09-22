import { prisma } from "@/lib/db/client";

export type CtaButtonType = "call" | "whatsapp" | "quote" | "link";

export interface CtaButton {
  label: string;
  type: CtaButtonType;
  // Only used when type is "link" — "call" and "whatsapp" always resolve to
  // the site-wide contact phone from Settings, so the number lives in one
  // place instead of being retyped per button.
  value: string;
}

export interface CtaPopupSettings {
  enabled: boolean;
  heading: string;
  message: string;
  delaySeconds: number;
  buttons: CtaButton[];
}

export const DEFAULT_CTA_POPUP_SETTINGS: CtaPopupSettings = {
  enabled: false,
  heading: "Planning a trip?",
  message: "Talk to our travel experts right now.",
  delaySeconds: 2,
  buttons: [
    { label: "Call Now", type: "call", value: "" },
    { label: "WhatsApp Us", type: "whatsapp", value: "" },
  ],
};

export async function getCtaPopupSettings(): Promise<CtaPopupSettings> {
  const row = await prisma.websiteSetting.findUnique({ where: { key: "ctaPopup" } });
  const stored = row?.value as Partial<CtaPopupSettings> | undefined;
  return {
    ...DEFAULT_CTA_POPUP_SETTINGS,
    ...stored,
    buttons: stored?.buttons?.length ? stored.buttons : DEFAULT_CTA_POPUP_SETTINGS.buttons,
  };
}
