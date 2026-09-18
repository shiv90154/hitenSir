import type { Metadata } from "next";
import { listPublished } from "@/lib/db/packages";
import { PackageCard } from "@/components/public/PackageCard";
import { resolveCoverImageUrls } from "@/lib/db/resolve-media";

export const metadata: Metadata = {
  title: "Packages",
  description: "Curated travel packages across Himachal Pradesh.",
};

export const revalidate = 3600;

export default async function PackagesPage() {
  const packages = await listPublished();
  const coverImages = await resolveCoverImageUrls(packages);

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-16">
      <h1 className="font-display text-4xl font-semibold text-ink">Travel Packages</h1>
      <p className="mt-2 text-sm text-ink-soft">{packages.length} packages</p>

      {packages.length === 0 ? (
        <p className="mt-10 rounded-xl border border-dashed border-border p-10 text-center text-sm text-ink-soft">
          No packages published yet.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <PackageCard
              key={pkg.id}
              slug={pkg.slug}
              name={pkg.name}
              duration={pkg.duration}
              destinationName={pkg.destination?.name}
              priceFrom={pkg.priceFrom?.toString()}
              coverImageUrl={coverImages.get(pkg.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
