import { prisma } from "@/lib/db/client";

export interface CulturalBannerSettings {
  enabled: boolean;
  heading: string;
  subheading: string;
  ctaLabel: string;
  ctaHref: string;
  imageIds: string[];
}

export const DEFAULT_CULTURAL_BANNER_SETTINGS: CulturalBannerSettings = {
  enabled: false,
  heading: "Curated Travel Experiences Across The Indian Subcontinent",
  subheading: "Explore more with us",
  ctaLabel: "Call Us",
  ctaHref: "/contact",
  imageIds: [],
};

export async function getCulturalBannerSettings(): Promise<
  CulturalBannerSettings & { imageUrls: string[] }
> {
  const row = await prisma.websiteSetting.findUnique({ where: { key: "culturalBanner" } });
  const settings = {
    ...DEFAULT_CULTURAL_BANNER_SETTINGS,
    ...(row?.value as Partial<CulturalBannerSettings> | undefined),
  };

  if (settings.imageIds.length === 0) return { ...settings, imageUrls: [] };

  const images = await prisma.media.findMany({ where: { id: { in: settings.imageIds } } });
  const byId = new Map(images.map((img) => [img.id, img.url]));
  const imageUrls = settings.imageIds.map((id) => byId.get(id)).filter((url): url is string => Boolean(url));

  return { ...settings, imageUrls };
}
