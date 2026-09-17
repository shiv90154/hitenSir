import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getBySlug, listPublished } from "@/lib/db/destinations";
import { StructuredData } from "@/components/shared/StructuredData";
import { breadcrumbList, touristDestination } from "@/lib/seo/schema";
import { getRelatedIds } from "@/lib/db/content-relations";
import { prisma } from "@/lib/db/client";
import { SaveButton } from "@/components/public/SaveButton";

export const revalidate = 3600;

export async function generateStaticParams() {
  const destinations = await listPublished();
  return destinations.map((destination) => ({ slug: destination.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const destination = await getBySlug(slug);
  if (!destination) return {};

  const seo = (destination.seo as Record<string, string> | null) ?? {};
  return {
    title: seo.title ?? destination.name,
    description: seo.description ?? destination.shortDescription ?? undefined,
  };
}

export default async function DestinationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const destination = await getBySlug(slug);

  if (!destination || destination.status !== "PUBLISHED") {
    notFound();
  }

  const nearbyIds = await getRelatedIds("DESTINATION", destination.id, "DESTINATION", "NEARBY");
  const nearbyDestinations = nearbyIds.length
    ? await prisma.destination.findMany({
        where: { id: { in: nearbyIds }, status: "PUBLISHED" },
        select: { name: true, slug: true },
      })
    : [];

  return (
    <div>
      <StructuredData
        data={touristDestination({
          name: destination.name,
          description: destination.description,
          slug: destination.slug,
          coverImageUrl: destination.coverImage?.url,
        })}
      />
      <StructuredData
        data={breadcrumbList([
          { name: "Destinations", path: "/destinations" },
          { name: destination.name, path: `/destinations/${destination.slug}` },
        ])}
      />

      <div className="relative h-[420px] w-full border-b border-placeholder-border bg-placeholder">
        {destination.coverImage ? (
          <Image
            src={destination.coverImage.url}
            alt={destination.coverImage.altText ?? destination.name}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm font-medium uppercase tracking-wide text-placeholder-label">
            Cover Photo
          </div>
        )}
      </div>

      <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl px-6 py-4 text-xs text-ink-soft lg:px-16">
        <Link href="/destinations" className="hover:underline">
          Destinations
        </Link>{" "}
        / <span aria-current="page">{destination.name}</span>
      </nav>

      <div className="mx-auto grid max-w-7xl gap-10 px-6 pb-20 lg:grid-cols-[2fr_1fr] lg:px-16">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-4xl font-semibold text-ink">
                {destination.name}
              </h1>
              {destination.state && (
                <p className="mt-1 text-sm text-ink-soft">{destination.state}, India</p>
              )}
            </div>
            <div className="flex gap-3">
              <SaveButton id={destination.id} name={destination.name} />
              <Link
                href={`/contact?destinationId=${destination.id}&destinationName=${encodeURIComponent(destination.name)}`}
                className="rounded-full bg-orange px-5 py-2.5 text-sm font-semibold text-white"
              >
                Enquire
              </Link>
            </div>
          </div>

          {destination.description && (
            <section className="mt-10">
              <h2 className="font-display text-2xl font-semibold text-ink">About</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink-soft">
                {destination.description}
              </p>
            </section>
          )}

          {destination.places.length > 0 && (
            <section className="mt-10">
              <h2 className="font-display text-2xl font-semibold text-ink">
                Places to Visit
              </h2>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {destination.places.map((place) => (
                  <div
                    key={place.id}
                    className="rounded-lg border border-border bg-surface p-3 text-sm font-medium text-ink"
                  >
                    {place.name}
                  </div>
                ))}
              </div>
            </section>
          )}

          {destination.packages.length > 0 && (
            <section className="mt-10">
              <h2 className="font-display text-2xl font-semibold text-ink">
                Packages for {destination.name}
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {destination.packages.map((pkg) => (
                  <Link
                    key={pkg.id}
                    href={`/packages/${pkg.slug}`}
                    className="rounded-lg border border-border bg-surface p-4 hover:shadow-md"
                  >
                    <p className="font-display text-lg font-semibold text-ink">{pkg.name}</p>
                    {pkg.duration && (
                      <p className="mt-1 text-xs text-ink-soft">{pkg.duration}</p>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="sticky top-24 h-fit max-h-[calc(100vh-7rem)] space-y-6 overflow-y-auto rounded-xl border border-border bg-surface p-6">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
              Quick Facts
            </h3>
            <dl className="mt-3 space-y-2 text-sm">
              {destination.bestTimeToVisit && (
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-soft">Best time</dt>
                  <dd className="text-right text-ink">{destination.bestTimeToVisit}</dd>
                </div>
              )}
              {destination.state && (
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-soft">State</dt>
                  <dd className="text-ink">{destination.state}</dd>
                </div>
              )}
            </dl>
          </div>

          {destination.howToReach && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
                How to Reach
              </h3>
              <p className="mt-2 text-sm text-ink-soft">{destination.howToReach}</p>
            </div>
          )}

          <Link
            href={`/contact?destinationId=${destination.id}&destinationName=${encodeURIComponent(destination.name)}`}
            className="block rounded-lg bg-navy px-4 py-3 text-center text-sm font-semibold text-white"
          >
            Enquire about {destination.name}
          </Link>

          {nearbyDestinations.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
                Nearby Destinations
              </h3>
              <ul className="mt-3 space-y-2">
                {nearbyDestinations.map((d) => (
                  <li key={d.slug}>
                    <Link
                      href={`/destinations/${d.slug}`}
                      className="text-sm text-navy hover:underline"
                    >
                      {d.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
