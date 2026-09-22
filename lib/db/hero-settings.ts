import { prisma } from "@/lib/db/client";

export interface HeroSettings {
  eyebrow: string;
  title: string;
  subtitle: string;
  imageIds: string[];
}

export const DEFAULT_HERO_SETTINGS: HeroSettings = {
  eyebrow: "Himachal Pradesh, India",
  title: "Plan your next mountain escape",
  subtitle:
    "Destinations, curated packages, and local know-how — everything you need to plan a trip to the Himalayas.",
  imageIds: [],
};

export async function getHeroSettings(): Promise<HeroSettings & { imageUrls: string[] }> {
  const row = await prisma.websiteSetting.findUnique({ where: { key: "hero" } });
  // Older rows stored a single `imageId` before the hero became a slider —
  // fall back to that as a one-item list so existing hero photos survive.
  const stored = row?.value as (Partial<HeroSettings> & { imageId?: string | null }) | undefined;
  const legacyImageIds = stored?.imageId ? [stored.imageId] : DEFAULT_HERO_SETTINGS.imageIds;
  const settings = {
    ...DEFAULT_HERO_SETTINGS,
    ...stored,
    imageIds: stored?.imageIds ?? legacyImageIds,
  };

  if (settings.imageIds.length === 0) return { ...settings, imageUrls: [] };

  const images = await prisma.media.findMany({ where: { id: { in: settings.imageIds } } });
  const byId = new Map(images.map((img) => [img.id, img.url]));
  const imageUrls = settings.imageIds.map((id) => byId.get(id)).filter((url): url is string => Boolean(url));

  return { ...settings, imageUrls };
}
