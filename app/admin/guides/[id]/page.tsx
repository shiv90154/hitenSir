import { notFound } from "next/navigation";
import { getById } from "@/lib/db/blogs";
import { updateBlogAction } from "@/lib/db/blogs-actions";
import { BlogForm } from "@/components/admin/BlogForm";
import { prisma } from "@/lib/db/client";

export default async function EditGuidePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [guide, media, categories, tags] = await Promise.all([
    getById(id),
    prisma.media.findMany({
      select: { id: true, url: true, altText: true, title: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.blogCategory.findMany({ select: { name: true }, orderBy: { name: "asc" } }),
    prisma.blogTag.findMany({ select: { name: true }, orderBy: { name: "asc" } }),
  ]);
  if (!guide) notFound();

  const boundAction = updateBlogAction.bind(null, id);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold text-ink">Edit {guide.title}</h1>
      <BlogForm
        action={boundAction}
        submitLabel="Save Changes"
        postType="GUIDE"
        media={media}
        cancelHref="/admin/guides"
        existingCategories={categories.map((c) => c.name)}
        existingTags={tags.map((t) => t.name)}
        defaultValues={guide}
      />
    </div>
  );
}
