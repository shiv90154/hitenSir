import Link from "next/link";
import Image from "next/image";
import { listPublished as listDestinations } from "@/lib/db/destinations";
import { listPublished as listPackages } from "@/lib/db/packages";
import { listPublished as listActivities } from "@/lib/db/activities";
import { listPublished as listPlaces } from "@/lib/db/places";
import { prisma } from "@/lib/db/client";
import { DestinationCard } from "@/components/public/DestinationCard";
import { PackageCard } from "@/components/public/PackageCard";
import { BlogCard } from "@/components/public/BlogCard";
import { Marquee } from "@/components/public/Marquee";
import { getHomepageSections } from "@/lib/db/homepage-settings";
import { getHeroSettings } from "@/lib/db/hero-settings";
import { getMarqueeSettings } from "@/lib/db/marquee-settings";
import { getCulturalBannerSettings } from "@/lib/db/cultural-banner";
import { resolveCoverImageUrls } from "@/lib/db/resolve-media";
import { CulturalBanner } from "@/components/public/CulturalBanner";

const whyChooseUs = [
  { title: "Local Expertise", body: "Every itinerary is built by people who actually know Himachal." },
  { title: "Curated Stays", body: "Hand-picked hotels and homestays, not random listings." },
  { title: "Flexible Planning", body: "Customize any package to fit your dates and budget." },
  { title: "Always Reachable", body: "Real support before, during, and after your trip." },
];

export default async function HomePage() {
  const [sections, hero, marquee, culturalBanner] = await Promise.all([
    getHomepageSections(),
    getHeroSettings(),
    getMarqueeSettings(),
    getCulturalBannerSettings(),
  ]);

  const [destinations, packages, activities, places, blogPosts, galleries, testimonials, faqs] =
    await Promise.all([
      sections.showFeaturedDestinations ? listDestinations() : Promise.resolve([]),
      sections.showPackages ? listPackages() : Promise.resolve([]),
      sections.showThingsToDo ? listActivities() : Promise.resolve([]),
      sections.showPopularPlaces ? listPlaces() : Promise.resolve([]),
      sections.showBlog
        ? prisma.blog.findMany({
            where: { status: "PUBLISHED" },
            orderBy: { publishedAt: "desc" },
            take: 3,
            include: { featuredImage: true },
          })
        : Promise.resolve([]),
      sections.showGallery
        ? prisma.gallery.findMany({
            take: 4,
            include: {
              images: { include: { media: true }, orderBy: { sortOrder: "asc" }, take: 1 },
            },
          })
        : Promise.resolve([]),
      sections.showTestimonials
        ? prisma.testimonial.findMany({ orderBy: { sortOrder: "asc" }, take: 3 })
        : Promise.resolve([]),
      sections.showFaqs
        ? prisma.faq.findMany({ where: { context: "GLOBAL" }, orderBy: { sortOrder: "asc" }, take: 6 })
        : Promise.resolve([]),
    ]);

  const packageCoverImages = await resolveCoverImageUrls(packages);

  return (
    <>
      <section className="relative flex min-h-128 flex-col justify-center overflow-hidden bg-navy-dark px-6 py-24 text-white sm:min-h-152 sm:py-28 lg:px-16">
        {hero.imageUrl && (
          <>
            <Image
              src={hero.imageUrl}
              alt=""
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-navy-dark/70" aria-hidden="true" />
          </>
        )}
        <div className="relative mx-auto max-w-3xl text-center">
          {hero.eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-widest text-white/60">{hero.eyebrow}</p>
          )}
          <h1 className="mt-3 font-display text-4xl font-semibold leading-tight sm:text-5xl">
            {hero.title}
          </h1>
          {hero.subtitle && <p className="mt-4 text-base text-white/70">{hero.subtitle}</p>}
        </div>
        <form
          action="/destinations"
          className="relative mx-auto mt-8 flex max-w-2xl flex-wrap items-center justify-center gap-3 rounded-full bg-white/10 p-2 backdrop-blur"
        >
          <label htmlFor="hero-search" className="sr-only">
            Search a destination
          </label>
          <input
            id="hero-search"
            type="search"
            name="q"
            placeholder="Search a destination…"
            className="min-w-0 flex-1 rounded-full bg-white px-5 py-3 text-sm text-ink outline-none placeholder:text-ink-soft"
          />
          <button
            type="submit"
            className="rounded-full bg-orange px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Search
          </button>
        </form>
      </section>

      {marquee.enabled && <Marquee items={marquee.items} speed={marquee.speed} />}

      {sections.showFeaturedDestinations && (
        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-16">
          <SectionHeader title="Featured Destinations" href="/destinations" />
          {destinations.length === 0 ? (
            <EmptyState label="destinations" />
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {destinations.slice(0, 4).map((destination) => (
                <DestinationCard
                  key={destination.id}
                  slug={destination.slug}
                  name={destination.name}
                  state={destination.state}
                  shortDescription={destination.shortDescription}
                  coverImageUrl={destination.coverImage?.url}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {sections.showPackages && (
        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-16">
          <SectionHeader title="Popular Travel Packages" href="/packages" />
          {packages.length === 0 ? (
            <EmptyState label="packages" />
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {packages.slice(0, 3).map((pkg) => (
                <PackageCard
                  key={pkg.id}
                  slug={pkg.slug}
                  name={pkg.name}
                  duration={pkg.duration}
                  destinationName={pkg.destination?.name}
                  priceFrom={pkg.priceFrom?.toString()}
                  coverImageUrl={packageCoverImages.get(pkg.id)}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {sections.showThingsToDo && (
        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-16">
          <SectionHeader title="Things To Do" href="/things-to-do" />
          {activities.length === 0 ? (
            <EmptyState label="activities" />
          ) : (
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {activities.slice(0, 6).map((activity) => (
                <Link
                  key={activity.id}
                  href={`/things-to-do/${activity.slug}`}
                  className="flex flex-col items-center gap-2 rounded-xl border border-border bg-surface p-4 text-center hover:shadow-md"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-status-published-bg text-navy">
                    ●
                  </span>
                  <p className="text-sm font-medium text-ink">{activity.name}</p>
                </Link>
              ))}
            </div>
          )}
        </section>
      )}

      {sections.showPopularPlaces && (
        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-16">
          <SectionHeader title="Popular Places" href="/places" />
          {places.length === 0 ? (
            <EmptyState label="places" />
          ) : (
            <div className="mt-8 flex flex-wrap gap-3">
              {places.slice(0, 10).map((place) => (
                <Link
                  key={place.id}
                  href={`/places/${place.slug}`}
                  className="rounded-full border border-border bg-surface px-4 py-2 text-sm text-ink hover:border-navy hover:text-navy"
                >
                  {place.name}
                </Link>
              ))}
            </div>
          )}
        </section>
      )}

      {blogPosts.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-16">
          <SectionHeader title="Latest Blog & Travel Guides" href="/blog" />
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <BlogCard
                key={post.id}
                slug={post.slug}
                title={post.title}
                excerpt={post.excerpt}
                readingTime={post.readingTime}
                basePath={post.postType === "GUIDE" ? "/guides" : "/blog"}
                imageUrl={post.featuredImage?.url}
              />
            ))}
          </div>
        </section>
      )}

      {galleries.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-16">
          <SectionHeader title="Photo Gallery" href="/gallery" />
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {galleries.map((gallery) => (
              <Link
                key={gallery.id}
                href={`/gallery/${gallery.slug}`}
                className="flex h-32 items-center justify-center overflow-hidden rounded-lg border border-placeholder-border bg-placeholder text-xs font-medium uppercase tracking-wide text-placeholder-label"
              >
                {gallery.title}
              </Link>
            ))}
          </div>
        </section>
      )}

      {sections.showWhyChooseUs && (
        <section className="bg-navy-dark px-6 py-20 text-white lg:px-16">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 lg:grid-cols-4">
            {whyChooseUs.map((item) => (
              <div key={item.title}>
                <p className="font-display text-lg font-semibold">{item.title}</p>
                <p className="mt-2 text-sm text-white/70">{item.body}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {testimonials.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-16">
          <h2 className="text-center font-display text-3xl font-semibold text-ink">
            What Travellers Say
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.id} className="rounded-xl border border-border bg-surface p-6">
                <p className="text-sm text-ink-soft">&ldquo;{t.quote}&rdquo;</p>
                <p className="mt-4 text-sm font-semibold text-ink">{t.authorName}</p>
                {t.authorLocation && <p className="text-xs text-ink-soft">{t.authorLocation}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {faqs.length > 0 && (
        <section className="mx-auto max-w-3xl px-6 py-20 lg:px-16">
          <h2 className="text-center font-display text-3xl font-semibold text-ink">FAQs</h2>
          <div className="mt-8 space-y-3">
            {faqs.map((faq) => (
              <details key={faq.id} className="rounded-lg border border-border bg-surface p-4">
                <summary className="cursor-pointer text-sm font-medium text-ink">
                  {faq.question}
                </summary>
                <p className="mt-2 text-sm text-ink-soft">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {culturalBanner.enabled && culturalBanner.imageUrls.length > 0 && (
        <div className="pb-20">
          <CulturalBanner
            heading={culturalBanner.heading}
            subheading={culturalBanner.subheading}
            ctaLabel={culturalBanner.ctaLabel}
            ctaHref={culturalBanner.ctaHref}
            imageUrls={culturalBanner.imageUrls}
          />
        </div>
      )}

      <section className="mx-auto max-w-4xl px-6 pb-20 lg:px-16">
        <div className="rounded-2xl bg-cta-bg px-8 py-10 text-center">
          <h2 className="font-display text-2xl font-semibold text-ink">
            Ready to plan your trip?
          </h2>
          <p className="mt-2 text-sm text-ink-soft">
            Tell us what you have in mind and we&apos;ll take it from there.
          </p>
          <Link
            href="/contact"
            className="mt-5 inline-block rounded-full bg-orange px-6 py-3 text-sm font-semibold text-white"
          >
            Get in touch
          </Link>
        </div>
      </section>
    </>
  );
}

function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <div className="flex items-end justify-between">
      <h2 className="font-display text-3xl font-semibold text-ink">{title}</h2>
      <Link href={href} className="text-sm font-medium text-navy hover:underline">
        View all
      </Link>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <p className="mt-8 rounded-xl border border-dashed border-border p-10 text-center text-sm text-ink-soft">
      No {label} published yet — add some from the{" "}
      <Link href="/admin" className="text-navy underline">
        admin panel
      </Link>
      .
    </p>
  );
}
