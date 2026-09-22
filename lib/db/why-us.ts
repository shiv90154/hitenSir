import { prisma } from "@/lib/db/client";

export interface WhyUsStat {
  icon: string;
  value: string;
  label: string;
}

export interface WhyUsSettings {
  eyebrow: string;
  heading: string;
  description: string;
  imageId1: string | null;
  imageId2: string | null;
  stats: WhyUsStat[];
  buttonLabel: string;
  buttonHref: string;
}

export const DEFAULT_WHY_US_SETTINGS: WhyUsSettings = {
  eyebrow: "About Us",
  heading: "Why Us?",
  description:
    "We prioritize ease of use, security, and reliability in all our services. Our user-friendly solutions are designed to be intuitive, ensuring a seamless experience. We safeguard your data with robust security measures, providing peace of mind. Trust us for dependable and efficient service every time.",
  imageId1: null,
  imageId2: null,
  stats: [
    { icon: "🛡️", value: "100%", label: "Money Safe" },
    { icon: "📅", value: "17+ Years", label: "Travel Experience" },
    { icon: "🙂", value: "8,50,203+", label: "Happy Customers" },
    { icon: "🚩", value: "200+ Team", label: "and Ground Experts" },
    { icon: "🕐", value: "24/7", label: "Support" },
    { icon: "🎁", value: "Family", label: "Discounts" },
  ],
  buttonLabel: "More About",
  buttonHref: "/contact",
};

export async function getWhyUsSettings(): Promise<
  WhyUsSettings & { imageUrl1: string | null; imageUrl2: string | null }
> {
  const row = await prisma.websiteSetting.findUnique({ where: { key: "whyUs" } });
  const stored = row?.value as Partial<WhyUsSettings> | undefined;
  const settings = {
    ...DEFAULT_WHY_US_SETTINGS,
    ...stored,
    stats: stored?.stats?.length ? stored.stats : DEFAULT_WHY_US_SETTINGS.stats,
  };

  const ids = [settings.imageId1, settings.imageId2].filter((id): id is string => Boolean(id));
  const images = ids.length ? await prisma.media.findMany({ where: { id: { in: ids } } }) : [];
  const byId = new Map(images.map((m) => [m.id, m.url]));

  return {
    ...settings,
    imageUrl1: settings.imageId1 ? (byId.get(settings.imageId1) ?? null) : null,
    imageUrl2: settings.imageId2 ? (byId.get(settings.imageId2) ?? null) : null,
  };
}
