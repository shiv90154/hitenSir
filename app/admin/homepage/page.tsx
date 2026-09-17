import { getHomepageSections } from "@/lib/db/homepage-settings";
import { getHeroSettings } from "@/lib/db/hero-settings";
import { getMarqueeSettings } from "@/lib/db/marquee-settings";
import { prisma } from "@/lib/db/client";
import { HomepageSectionsForm } from "@/components/admin/HomepageSectionsForm";
import { HeroSettingsForm } from "@/components/admin/HeroSettingsForm";
import { MarqueeSettingsForm } from "@/components/admin/MarqueeSettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminHomepagePage() {
  const [sections, hero, marquee, media] = await Promise.all([
    getHomepageSections(),
    getHeroSettings(),
    getMarqueeSettings(),
    prisma.media.findMany({
      select: { id: true, url: true, altText: true, title: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Homepage</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Control the hero banner, the scrolling announcement strip, and which sections appear below.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-soft">Hero Banner</h2>
        <HeroSettingsForm hero={hero} media={media} />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-soft">
          Scrolling Marquee
        </h2>
        <MarqueeSettingsForm marquee={marquee} />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-soft">
          Sections
        </h2>
        <p className="text-xs text-ink-soft">
          Turn sections on or off. Sections with no published content still hide themselves automatically.
        </p>
        <HomepageSectionsForm sections={sections} />
      </section>
    </div>
  );
}
