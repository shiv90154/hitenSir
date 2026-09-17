import { BlogForm } from "@/components/admin/BlogForm";
import { createBlogAction } from "@/lib/db/blogs-actions";
import { prisma } from "@/lib/db/client";

export default async function NewBlogPostPage() {
  const media = await prisma.media.findMany({
    select: { id: true, url: true, altText: true, title: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold text-ink">New Blog Post</h1>
      <BlogForm
        action={createBlogAction}
        submitLabel="Create Post"
        postType="ARTICLE"
        media={media}
        cancelHref="/admin/blog"
      />
    </div>
  );
}
