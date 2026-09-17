import Link from "next/link";
import Image from "next/image";

export interface DestinationCardProps {
  slug: string;
  name: string;
  state?: string | null;
  shortDescription?: string | null;
  coverImageUrl?: string | null;
}

export function DestinationCard({
  slug,
  name,
  state,
  shortDescription,
  coverImageUrl,
}: DestinationCardProps) {
  return (
    <Link
      href={`/destinations/${slug}`}
      className="group overflow-hidden rounded-xl border border-border bg-surface transition-shadow hover:shadow-lg"
    >
      <div className="relative h-[200px] w-full overflow-hidden bg-placeholder">
        {coverImageUrl ? (
          <Image
            src={coverImageUrl}
            alt={name}
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
        <h3 className="font-display text-lg font-semibold text-ink">{name}</h3>
        {state && <p className="text-xs uppercase tracking-wide text-ink-soft">{state}</p>}
        {shortDescription && (
          <p className="line-clamp-2 text-sm text-ink-soft">{shortDescription}</p>
        )}
      </div>
    </Link>
  );
}
