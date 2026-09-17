import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getBySlug, listPublished } from "@/lib/db/places";
import { StructuredData } from "@/components/shared/StructuredData";
import { breadcrumbList, touristAttraction } from "@/lib/seo/schema";

export const revalidate = 3600;

export async function generateStaticParams() {
  const places = await listPublished();
  return places.map((place) => ({ slug: place.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const place = await getBySlug(slug);
  if (!place) return {};

  const seo = (place.seo as Record<string, string> | null) ?? {};
  return {
    title: seo.title ?? place.name,
    description: seo.description ?? place.description ?? undefined,
  };
}

export default async function PlaceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const place = await getBySlug(slug);

  if (!place || place.status !== "PUBLISHED") {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-16 lg:px-16">
      <StructuredData
        data={touristAttraction({
          name: place.name,
          description: place.description,
          slug: place.slug,
        })}
      />
      <StructuredData
        data={breadcrumbList([
          { name: "Places", path: "/places" },
          { name: place.name, path: `/places/${place.slug}` },
        ])}
      />
      <div className="text-xs text-ink-soft">
        <Link href="/places" className="hover:underline">
          Places
        </Link>{" "}
        / {place.name}
      </div>

      <h1 className="mt-3 font-display text-4xl font-semibold text-ink">{place.name}</h1>
      <Link
        href={`/destinations/${place.destination.slug}`}
        className="mt-1 inline-block text-sm text-navy hover:underline"
      >
        {place.destination.name}
      </Link>

      {place.description && (
        <p className="mt-6 whitespace-pre-line text-sm leading-relaxed text-ink-soft">
          {place.description}
        </p>
      )}

      {place.bestTimeToVisit && (
        <div className="mt-8 rounded-lg border border-border bg-surface p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
            Best time to visit
          </p>
          <p className="mt-1 text-sm text-ink">{place.bestTimeToVisit}</p>
        </div>
      )}
    </div>
  );
}
