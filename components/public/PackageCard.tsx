import Link from "next/link";
import Image from "next/image";

export interface PackageCardProps {
  slug: string;
  name: string;
  duration?: string | null;
  destinationName?: string | null;
  priceFrom?: string | number | null;
  coverImageUrl?: string | null;
}

export function PackageCard({
  slug,
  name,
  duration,
  destinationName,
  priceFrom,
  coverImageUrl,
}: PackageCardProps) {
  return (
    <Link
      href={`/packages/${slug}`}
      className="group overflow-hidden rounded-xl border border-border bg-surface transition-shadow hover:shadow-lg"
    >
      <div className="relative h-[220px] w-full overflow-hidden bg-placeholder">
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
      <div className="space-y-1.5 p-4">
        <p className="font-display text-lg font-semibold text-ink">{name}</p>
        <p className="text-xs uppercase tracking-wide text-ink-soft">
          {duration}
          {destinationName ? ` · ${destinationName}` : ""}
        </p>
        {priceFrom && <p className="pt-1 text-sm font-semibold text-orange">From ₹{priceFrom.toString()}</p>}
      </div>
    </Link>
  );
}
