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
  const guides = await listPublished("GUIDE");
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getBySlug(slug);
  if (!guide) return {};

  const seo = (guide.seo as Record<string, string> | null) ?? {};
  return {
    title: seo.title ?? guide.title,
    description: seo.description ?? guide.excerpt ?? undefined,
  };
}

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = await getBySlug(slug);

  if (!guide || guide.status !== "PUBLISHED" || guide.postType !== "GUIDE") {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl px-6 py-16 lg:px-16">
      <StructuredData
        data={article({
          title: guide.title,
          excerpt: guide.excerpt,
          slug: guide.slug,
          postType: guide.postType,
          publishedAt: guide.publishedAt,
          authorName: guide.author?.name,
        })}
      />
      <StructuredData
        data={breadcrumbList([
          { name: "Guides", path: "/guides" },
          { name: guide.title, path: `/guides/${guide.slug}` },
        ])}
      />
      <nav aria-label="Breadcrumb" className="text-xs text-ink-soft">
        <Link href="/guides" className="hover:underline">
          Guides
        </Link>{" "}
        / <span aria-current="page">{guide.title}</span>
      </nav>

      {guide.featuredImage && (
        <div className="relative mt-4 h-64 w-full overflow-hidden rounded-xl border border-border bg-placeholder sm:h-80">
          <Image
            src={guide.featuredImage.url}
            alt={guide.featuredImage.altText ?? guide.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <h1 className="mt-3 font-display text-4xl font-semibold text-ink">{guide.title}</h1>
      <div className="mt-2 flex flex-wrap gap-3 text-xs text-ink-soft">
        {guide.author && <span>By {guide.author.name}</span>}
        {guide.readingTime && <span>{guide.readingTime} min read</span>}
      </div>

      {guide.body && (
        <div
          className="prose-content mt-8 text-sm leading-relaxed text-ink-soft"
          dangerouslySetInnerHTML={{ __html: renderMarkdownLite(guide.body) }}
        />
      )}
    </article>
  );
}
