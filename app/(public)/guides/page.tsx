import type { Metadata } from "next";
import { listPublished } from "@/lib/db/blogs";
import { BlogCard } from "@/components/public/BlogCard";

export const metadata: Metadata = {
  title: "Travel Guides",
  description: "In-depth travel guides for planning your trip to Himachal Pradesh.",
};

export const revalidate = 3600;

export default async function GuidesListingPage() {
  const guides = await listPublished("GUIDE");

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-16">
      <h1 className="font-display text-4xl font-semibold text-ink">Travel Guides</h1>
      <p className="mt-2 text-sm text-ink-soft">{guides.length} guides</p>

      {guides.length === 0 ? (
        <p className="mt-10 rounded-xl border border-dashed border-border p-10 text-center text-sm text-ink-soft">
          No guides published yet.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide) => (
            <BlogCard
              key={guide.id}
              slug={guide.slug}
              title={guide.title}
              excerpt={guide.excerpt}
              readingTime={guide.readingTime}
              basePath="/guides"
              imageUrl={guide.featuredImage?.url}
            />
          ))}
        </div>
      )}
    </div>
  );
}
