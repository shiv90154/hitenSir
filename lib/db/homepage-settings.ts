import { prisma } from "@/lib/db/client";

export interface HomepageSections {
  showFeaturedDestinations: boolean;
  showPackages: boolean;
  showThingsToDo: boolean;
  showPopularPlaces: boolean;
  showBlog: boolean;
  showGallery: boolean;
  showWhyChooseUs: boolean;
  showTestimonials: boolean;
  showFaqs: boolean;
}

export const DEFAULT_HOMEPAGE_SECTIONS: HomepageSections = {
  showFeaturedDestinations: true,
  showPackages: true,
  showThingsToDo: true,
  showPopularPlaces: true,
  showBlog: true,
  showGallery: true,
  showWhyChooseUs: true,
  showTestimonials: true,
  showFaqs: true,
};

export async function getHomepageSections(): Promise<HomepageSections> {
  const row = await prisma.websiteSetting.findUnique({ where: { key: "homepage" } });
  if (!row) return DEFAULT_HOMEPAGE_SECTIONS;
  return { ...DEFAULT_HOMEPAGE_SECTIONS, ...(row.value as Partial<HomepageSections>) };
}
