import { prisma } from "@/lib/db/client";

export interface SeoDefaults {
  defaultTitleSuffix: string;
  defaultDescription: string;
}

export const DEFAULT_SEO_DEFAULTS: SeoDefaults = {
  defaultTitleSuffix: "BharatTrip",
  defaultDescription: "Plan your trip to Himachal Pradesh with BharatTrip.",
};

export async function getSeoDefaults(): Promise<SeoDefaults> {
  const row = await prisma.websiteSetting.findUnique({ where: { key: "seo" } });
  if (!row) return DEFAULT_SEO_DEFAULTS;
  return { ...DEFAULT_SEO_DEFAULTS, ...(row.value as Partial<SeoDefaults>) };
}
