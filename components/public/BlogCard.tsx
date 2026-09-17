import Link from "next/link";
import Image from "next/image";

export function BlogCard({
  slug,
  title,
  excerpt,
  readingTime,
  basePath,
  imageUrl,
}: {
  slug: string;
  title: string;
  excerpt?: string | null;
  readingTime?: number | null;
  basePath: string;
  imageUrl?: string | null;
}) {
  return (
    <Link
      href={`${basePath}/${slug}`}
      className="group overflow-hidden rounded-xl border border-border bg-surface hover:shadow-lg"
    >
      <div className="relative h-[180px] w-full overflow-hidden bg-placeholder">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center border-b border-placeholder-border text-xs font-medium uppercase tracking-wide text-placeholder-label">
            Photo
          </div>
        )}
      </div>
      <div className="space-y-1.5 p-4">
        <p className="font-display text-lg font-semibold text-ink">{title}</p>
        {excerpt && <p className="line-clamp-2 text-sm text-ink-soft">{excerpt}</p>}
        {readingTime && <p className="text-xs text-ink-soft">{readingTime} min read</p>}
      </div>
    </Link>
  );
}
