import { prisma } from "@/lib/db/client";

export interface QuotePopupSettings {
  enabled: boolean;
  heading: string;
  subheading: string;
  imageIds: string[];
  delaySeconds: number;
}

export const DEFAULT_QUOTE_POPUP_SETTINGS: QuotePopupSettings = {
  enabled: false,
  heading: "Discover Amazing Travel Deals",
  subheading: "Fill the form and our team will send you the best plan for your trip.",
  imageIds: [],
  delaySeconds: 3,
};

export async function getQuotePopupSettings(): Promise<QuotePopupSettings & { imageUrls: string[] }> {
  const row = await prisma.websiteSetting.findUnique({ where: { key: "quotePopup" } });
  const settings = {
    ...DEFAULT_QUOTE_POPUP_SETTINGS,
    ...(row?.value as Partial<QuotePopupSettings> | undefined),
  };

  if (settings.imageIds.length === 0) return { ...settings, imageUrls: [] };

  const images = await prisma.media.findMany({ where: { id: { in: settings.imageIds } } });
  const byId = new Map(images.map((img) => [img.id, img.url]));
  const imageUrls = settings.imageIds.map((id) => byId.get(id)).filter((url): url is string => Boolean(url));

  return { ...settings, imageUrls };
}
