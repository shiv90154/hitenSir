import { notFound } from "next/navigation";
import Link from "next/link";
import { getBySlug } from "@/lib/db/galleries";
import { GalleryGrid } from "@/components/public/GalleryGrid";

export const revalidate = 3600;

export default async function GalleryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const gallery = await getBySlug(slug);
  if (!gallery) notFound();

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-16">
      <nav aria-label="Breadcrumb" className="text-xs text-ink-soft">
        <Link href="/gallery" className="hover:underline">
          Gallery
        </Link>{" "}
        / <span aria-current="page">{gallery.title}</span>
      </nav>
      <h1 className="mt-3 font-display text-4xl font-semibold text-ink">{gallery.title}</h1>
      {gallery.description && <p className="mt-2 text-sm text-ink-soft">{gallery.description}</p>}

      {gallery.images.length === 0 ? (
        <p className="mt-10 text-sm text-ink-soft">No images in this album yet.</p>
      ) : (
        <GalleryGrid
          title={gallery.title}
          images={gallery.images.map(({ id, media }) => ({
            id,
            url: media.url,
            alt: media.altText ?? gallery.title,
          }))}
        />
      )}
    </div>
  );
}
