import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { listAll } from "@/lib/db/galleries";

export const metadata: Metadata = {
  title: "Photo Gallery",
  description: "Photos from across Himachal Pradesh.",
};

export const revalidate = 3600;

export default async function GalleryListingPage() {
  const galleries = await listAll();

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-16">
      <h1 className="font-display text-4xl font-semibold text-ink">Photo Gallery</h1>

      {galleries.length === 0 ? (
        <p className="mt-10 rounded-xl border border-dashed border-border p-10 text-center text-sm text-ink-soft">
          No albums yet.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {galleries.map((gallery) => {
            const cover = gallery.images[0]?.media;
            return (
              <Link
                key={gallery.id}
                href={`/gallery/${gallery.slug}`}
                className="group overflow-hidden rounded-xl border border-border bg-surface"
              >
                <div className="relative h-40 w-full bg-placeholder">
                  {cover ? (
                    <Image
                      src={cover.url}
                      alt={cover.altText ?? gallery.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs font-medium uppercase tracking-wide text-placeholder-label">
                      Photo
                    </div>
                  )}
                </div>
                <p className="p-3 text-sm font-medium text-ink">{gallery.title}</p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
