import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getBySlug, listPublished } from "@/lib/db/blogs";
import { StructuredData } from "@/components/shared/StructuredData";
import { breadcrumbList, article } from "@/lib/seo/schema";
import { renderMarkdownLite } from "@/lib/markdown";

export const revalidate = 3600;

export async function generateStaticParams() {
  const posts = await listPublished("ARTICLE");
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBySlug(slug);
  if (!post) return {};

  const seo = (post.seo as Record<string, string> | null) ?? {};
  return {
    title: seo.title ?? post.title,
    description: seo.description ?? post.excerpt ?? undefined,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBySlug(slug);

  if (!post || post.status !== "PUBLISHED" || post.postType !== "ARTICLE") {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl px-6 py-16 lg:px-16">
      <StructuredData
        data={article({
          title: post.title,
          excerpt: post.excerpt,
          slug: post.slug,
          postType: post.postType,
          publishedAt: post.publishedAt,
          authorName: post.author?.name,
        })}
      />
      <StructuredData
        data={breadcrumbList([
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ])}
      />
      <nav aria-label="Breadcrumb" className="text-xs text-ink-soft">
        <Link href="/blog" className="hover:underline">
          Blog
        </Link>{" "}
        / <span aria-current="page">{post.title}</span>
      </nav>

      {post.featuredImage && (
        <div className="relative mt-4 h-64 w-full overflow-hidden rounded-xl border border-border bg-placeholder sm:h-80">
          <Image
            src={post.featuredImage.url}
            alt={post.featuredImage.altText ?? post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <h1 className="mt-3 font-display text-4xl font-semibold text-ink">{post.title}</h1>
      <div className="mt-2 flex flex-wrap gap-3 text-xs text-ink-soft">
        {post.author && <span>By {post.author.name}</span>}
        {post.readingTime && <span>{post.readingTime} min read</span>}
        {post.publishedAt && (
          <span>{new Date(post.publishedAt).toLocaleDateString("en-IN", { dateStyle: "long" })}</span>
        )}
      </div>

      {post.categories.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {post.categories.map(({ category }) => (
            <Link
              key={category.id}
              href={`/blog/category/${category.slug}`}
              className="rounded-full bg-tag-bg px-3 py-1 text-xs font-medium text-tag-text"
            >
              {category.name}
            </Link>
          ))}
        </div>
      )}

      {post.body && (
        <div
          className="prose-content mt-8 text-sm leading-relaxed text-ink-soft"
          dangerouslySetInnerHTML={{ __html: renderMarkdownLite(post.body) }}
        />
      )}

      <div className="mt-8 flex items-center gap-3 border-t border-border pt-6 text-xs text-ink-soft">
        <span className="font-medium uppercase tracking-wide">Share:</span>
        <a
          href={`https://wa.me/?text=${encodeURIComponent(`${post.title} — /blog/${post.slug}`)}`}
          target="_blank"
          rel="noreferrer"
          className="hover:text-navy hover:underline"
        >
          WhatsApp
        </a>
        <a
          href={`https://x.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`/blog/${post.slug}`)}`}
          target="_blank"
          rel="noreferrer"
          className="hover:text-navy hover:underline"
        >
          X
        </a>
        <a
          href={`mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(`/blog/${post.slug}`)}`}
          className="hover:text-navy hover:underline"
        >
          Email
        </a>
      </div>

      {post.tags.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2 border-t border-border pt-6">
          {post.tags.map(({ tag }) => (
            <Link
              key={tag.id}
              href={`/blog/tag/${tag.slug}`}
              className="rounded-full border border-border px-3 py-1 text-xs text-ink-soft hover:border-navy hover:text-navy"
            >
              #{tag.name}
            </Link>
          ))}
        </div>
      )}
    </article>
  );
}
