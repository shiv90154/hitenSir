import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { listPublished } from "@/lib/db/places";

export const metadata: Metadata = {
  title: "Places",
  description: "Browse every place we cover across Himachal Pradesh.",
};

export const revalidate = 3600;

export default async function PlacesPage() {
  const places = await listPublished();

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-16">
      <h1 className="font-display text-4xl font-semibold text-ink">Places</h1>
      <p className="mt-2 text-sm text-ink-soft">{places.length} places</p>

      {places.length === 0 ? (
        <p className="mt-10 rounded-xl border border-dashed border-border p-10 text-center text-sm text-ink-soft">
          No places published yet.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {places.map((place) => (
            <Link
              key={place.id}
              href={`/places/${place.slug}`}
              className="group overflow-hidden rounded-xl border border-border bg-surface transition-shadow hover:shadow-lg"
            >
              <div className="relative h-[200px] w-full overflow-hidden bg-placeholder">
                {place.destination.coverImage ? (
                  <Image
                    src={place.destination.coverImage.url}
                    alt={place.destination.coverImage.altText ?? place.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center border border-placeholder-border text-xs font-medium uppercase tracking-wide text-placeholder-label">
                    Photo
                  </div>
                )}
              </div>
              <div className="space-y-1 p-4">
                <p className="font-display text-lg font-semibold text-ink">{place.name}</p>
                <p className="text-xs uppercase tracking-wide text-ink-soft">
                  {place.destination.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
