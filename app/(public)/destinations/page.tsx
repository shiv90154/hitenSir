import type { Metadata } from "next";
import Link from "next/link";
import { listPublished } from "@/lib/db/destinations";
import { DestinationCard } from "@/components/public/DestinationCard";

export const metadata: Metadata = {
  title: "Destinations",
  description: "Browse every destination we cover across Himachal Pradesh.",
};

export const revalidate = 3600;

export default async function DestinationsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const destinations = await listPublished(q);

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-16">
      <h1 className="font-display text-4xl font-semibold text-ink">Destinations</h1>
      <form action="/destinations" className="mt-6 flex max-w-md gap-2">
        <input
          type="search"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search by destination or state…"
          className="w-full rounded-full border border-border bg-white px-4 py-2.5 text-sm outline-none focus:border-navy"
        />
        <button
          type="submit"
          className="shrink-0 rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white"
        >
          Search
        </button>
      </form>
      <p className="mt-4 text-sm text-ink-soft">
        {q ? (
          <>
            {destinations.length} result{destinations.length === 1 ? "" : "s"} for &ldquo;{q}&rdquo;
            {" · "}
            <Link href="/destinations" className="text-navy hover:underline">
              Clear search
            </Link>
          </>
        ) : (
          `${destinations.length} destinations`
        )}
      </p>

      {destinations.length === 0 ? (
        <p className="mt-10 rounded-xl border border-dashed border-border p-10 text-center text-sm text-ink-soft">
          {q ? `No destinations match "${q}".` : "No destinations published yet."}
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((destination) => (
            <DestinationCard
              key={destination.id}
              slug={destination.slug}
              name={destination.name}
              state={destination.state}
              shortDescription={destination.shortDescription}
              coverImageUrl={destination.coverImage?.url}
            />
          ))}
        </div>
      )}
    </div>
  );
}
