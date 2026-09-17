import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/client";
import { listByCategorySlug } from "@/lib/db/blogs";
import { BlogCard } from "@/components/public/BlogCard";

export const revalidate = 3600;

export default async function BlogCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await prisma.blogCategory.findUnique({ where: { slug } });
  if (!category) notFound();

  const posts = await listByCategorySlug("ARTICLE", slug);

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-16">
      <p className="text-xs uppercase tracking-wide text-ink-soft">Category</p>
      <h1 className="font-display text-4xl font-semibold text-ink">{category.name}</h1>

      {posts.length === 0 ? (
        <p className="mt-10 rounded-xl border border-dashed border-border p-10 text-center text-sm text-ink-soft">
          No articles in this category yet.
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
