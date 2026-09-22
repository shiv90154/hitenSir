import { prisma } from "@/lib/db/client";

export interface SiteSettings {
  siteName: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string;
  contactPhone2: string;
  address: string;
  socialFacebook: string;
  socialInstagram: string;
  socialTwitter: string;
  socialYoutube: string;
  tawkEnabled: boolean;
  tawkWidgetUrl: string;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteName: "BharatTrip",
  tagline: "Discover Himachal Pradesh",
  contactEmail: "",
  contactPhone: "",
  contactPhone2: "",
  address: "",
  socialFacebook: "",
  socialInstagram: "",
  socialTwitter: "",
  socialYoutube: "",
  tawkEnabled: true,
  tawkWidgetUrl: "https://embed.tawk.to/699f0d06b59a521c38a1e9f1/default",
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const row = await prisma.websiteSetting.findUnique({ where: { key: "site" } });
  if (!row) return DEFAULT_SITE_SETTINGS;
  return { ...DEFAULT_SITE_SETTINGS, ...(row.value as Partial<SiteSettings>) };
}
