import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getBySlug, listPublished } from "@/lib/db/packages";
import { prisma } from "@/lib/db/client";
import { StructuredData } from "@/components/shared/StructuredData";
import { breadcrumbList, touristTrip, faqPage } from "@/lib/seo/schema";
import { getSiteSettings } from "@/lib/db/settings";
import { resolveMediaByIds } from "@/lib/db/resolve-media";
import { PackagePhotoGallery } from "@/components/public/PackagePhotoGallery";

export const revalidate = 3600;

export async function generateStaticParams() {
  const packages = await listPublished();
  return packages.map((pkg) => ({ slug: pkg.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await getBySlug(slug);
  if (!pkg) return {};

  const seo = (pkg.seo as Record<string, string> | null) ?? {};
  return {
    title: seo.title ?? pkg.name,
    description: seo.description ?? pkg.shortDescription ?? undefined,
  };
}

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pkg = await getBySlug(slug);

  if (!pkg || pkg.status !== "PUBLISHED") {
    notFound();
  }

  const [faqs, settings, photos] = await Promise.all([
    prisma.faq.findMany({
      where: { context: "PACKAGE", contextId: pkg.id },
      orderBy: { sortOrder: "asc" },
    }),
    getSiteSettings(),
    resolveMediaByIds(pkg.images),
  ]);

  const whatsappNumber = settings.contactPhone?.replace(/[^\d]/g, "");
  const whatsappHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hi, I'm interested in the "${pkg.name}" package.`)}`
    : null;

  const included = Array.isArray(pkg.included) ? (pkg.included as string[]) : [];
  const excluded = Array.isArray(pkg.excluded) ? (pkg.excluded as string[]) : [];
  const highlights = Array.isArray(pkg.highlights) ? (pkg.highlights as string[]) : [];

  const faqSchema = faqPage(faqs);

  return (
    <div>
      <StructuredData
        data={touristTrip({
          name: pkg.name,
          shortDescription: pkg.shortDescription,
          slug: pkg.slug,
          priceFrom: pkg.priceFrom?.toString(),
        })}
      />
      <StructuredData
        data={breadcrumbList([
          { name: "Packages", path: "/packages" },
          { name: pkg.name, path: `/packages/${pkg.slug}` },
        ])}
      />
      {faqSchema && <StructuredData data={faqSchema} />}

      <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl px-6 pt-6 text-xs text-ink-soft lg:px-16">
        <Link href="/packages" className="hover:underline">
          Packages
        </Link>{" "}
        / <span aria-current="page">{pkg.name}</span>
      </nav>

      <PackagePhotoGallery
        title={pkg.name}
        photos={photos.map((m) => ({ id: m.id, url: m.url, alt: m.altText ?? pkg.name }))}
      />

      <div className="mx-auto mt-6 max-w-7xl px-6 lg:px-16">
        <h1 className="font-display text-4xl font-semibold text-ink">{pkg.name}</h1>
        <div className="mt-2 flex flex-wrap gap-4 text-sm text-ink-soft">
          {pkg.duration && <span>{pkg.duration}</span>}
          {pkg.priceFrom && (
            <span className="font-semibold text-orange">From ₹{pkg.priceFrom.toString()}</span>
          )}
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-6 pb-20 pt-8 lg:grid-cols-[2fr_1fr] lg:px-16">
        <div className="space-y-10">
          {pkg.description && (
            <section>
              <h2 className="font-display text-2xl font-semibold text-ink">Overview</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink-soft">
                {pkg.description}
              </p>
              {highlights.length > 0 && (
                <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-ink">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-navy" />
                      {h}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {pkg.itineraries.length > 0 && (
            <section>
              <h2 className="font-display text-2xl font-semibold text-ink">Itinerary</h2>
              <ol className="mt-4 space-y-4">
                {pkg.itineraries.map((day) => (
                  <li key={day.id} className="rounded-lg border border-border bg-surface p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-navy">
                      Day {day.dayNumber}
                    </p>
                    <p className="mt-1 font-display text-lg font-semibold text-ink">
                      {day.title}
                    </p>
                    {day.description && (
                      <p className="mt-2 text-sm text-ink-soft">{day.description}</p>
                    )}
                  </li>
                ))}
              </ol>
            </section>
          )}

          {(included.length > 0 || excluded.length > 0) && (
            <section className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {included.length > 0 && (
                <div>
                  <h3 className="font-display text-lg font-semibold text-ink">Included</h3>
                  <ul className="mt-3 space-y-2">
                    {included.map((item, i) => (
                      <li key={i} className="text-sm text-ink-soft">
                        + {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {excluded.length > 0 && (
                <div>
                  <h3 className="font-display text-lg font-semibold text-ink">Excluded</h3>
                  <ul className="mt-3 space-y-2">
                    {excluded.map((item, i) => (
                      <li key={i} className="text-sm text-ink-soft">
                        − {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}

          {faqs.length > 0 && (
            <section>
              <h2 className="font-display text-2xl font-semibold text-ink">FAQs</h2>
              <div className="mt-4 space-y-3">
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
        </div>

        <aside className="sticky top-24 h-fit max-h-[calc(100vh-7rem)] space-y-4 overflow-y-auto rounded-xl border border-border bg-surface p-6">
          {pkg.priceFrom && (
            <div>
              <p className="text-xs uppercase tracking-wide text-ink-soft">Starting from</p>
              <p className="font-display text-3xl font-semibold text-ink">
                ₹{pkg.priceFrom.toString()}
              </p>
              <p className="text-xs text-ink-soft">per person</p>
            </div>
          )}
          <form action="/contact" className="space-y-3">
            <input type="hidden" name="packageId" value={pkg.id} />
            <input type="hidden" name="packageName" value={pkg.name} />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="travelDate" className="block text-xs font-medium text-ink-soft">
                  Travel date
                </label>
                <input
                  id="travelDate"
                  type="date"
                  name="travelDate"
                  min={new Date().toISOString().split("T")[0]}
                  className="mt-1 w-full rounded-lg border border-border px-2 py-2 text-xs outline-none focus:border-navy"
                />
              </div>
              <div>
                <label htmlFor="peopleCount" className="block text-xs font-medium text-ink-soft">
                  Travellers
                </label>
                <input
                  id="peopleCount"
                  type="number"
                  name="peopleCount"
                  min={1}
                  placeholder="2"
                  className="mt-1 w-full rounded-lg border border-border px-2 py-2 text-xs outline-none focus:border-navy"
                />
              </div>
            </div>
            <button
              type="submit"
              className="block w-full rounded-full bg-orange px-4 py-3 text-center text-sm font-semibold text-white"
            >
              Enquire Now
            </button>
          </form>
          {whatsappHref && (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="block rounded-full border border-border px-4 py-3 text-center text-sm font-semibold text-ink hover:border-navy"
            >
              WhatsApp Us
            </a>
          )}
          {settings.contactPhone && (
            <a
              href={`tel:${settings.contactPhone}`}
              className="block rounded-full border border-border px-4 py-3 text-center text-sm font-semibold text-ink hover:border-navy"
            >
              Call Us
            </a>
          )}
        </aside>
      </div>
    </div>
  );
}
