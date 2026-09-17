import { prisma } from "@/lib/db/client";

export interface MarqueeSettings {
  enabled: boolean;
  items: string[];
  speed: "slow" | "normal" | "fast";
}

export const DEFAULT_MARQUEE_SETTINGS: MarqueeSettings = {
  enabled: false,
  items: [],
  speed: "normal",
};

export async function getMarqueeSettings(): Promise<MarqueeSettings> {
  const row = await prisma.websiteSetting.findUnique({ where: { key: "marquee" } });
  return { ...DEFAULT_MARQUEE_SETTINGS, ...(row?.value as Partial<MarqueeSettings> | undefined) };
}
