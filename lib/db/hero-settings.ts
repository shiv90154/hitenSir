import { prisma } from "@/lib/db/client";

export interface HeroSettings {
  eyebrow: string;
  title: string;
  subtitle: string;
  imageId: string | null;
}

export const DEFAULT_HERO_SETTINGS: HeroSettings = {
  eyebrow: "Himachal Pradesh, India",
  title: "Plan your next mountain escape",
  subtitle:
    "Destinations, curated packages, and local know-how — everything you need to plan a trip to the Himalayas.",
  imageId: null,
};

export async function getHeroSettings(): Promise<HeroSettings & { imageUrl: string | null }> {
  const row = await prisma.websiteSetting.findUnique({ where: { key: "hero" } });
  const settings = { ...DEFAULT_HERO_SETTINGS, ...(row?.value as Partial<HeroSettings> | undefined) };

  if (!settings.imageId) return { ...settings, imageUrl: null };

  const image = await prisma.media.findUnique({ where: { id: settings.imageId } });
  return { ...settings, imageUrl: image?.url ?? null };
}
