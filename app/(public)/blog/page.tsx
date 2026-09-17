import type { Metadata } from "next";
import { listPublished } from "@/lib/db/blogs";
import { BlogCard } from "@/components/public/BlogCard";

export const metadata: Metadata = {
  title: "Blog",
  description: "Stories, tips, and updates from Himachal Pradesh.",
};

export const revalidate = 3600;

export default async function BlogListingPage() {
  const posts = await listPublished("ARTICLE");

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-16">
      <h1 className="font-display text-4xl font-semibold text-ink">Blog</h1>
      <p className="mt-2 text-sm text-ink-soft">{posts.length} articles</p>

      {posts.length === 0 ? (
        <p className="mt-10 rounded-xl border border-dashed border-border p-10 text-center text-sm text-ink-soft">
          No articles published yet.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard
              key={post.id}
              slug={post.slug}
              title={post.title}
              excerpt={post.excerpt}
              readingTime={post.readingTime}
              basePath="/blog"
              imageUrl={post.featuredImage?.url}
            />
          ))}
        </div>
      )}
    </div>
  );
}
