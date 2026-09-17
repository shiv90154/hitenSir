import Link from "next/link";
import { prisma } from "@/lib/db/client";
import { BlogList } from "@/components/admin/BlogList";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const posts = await prisma.blog.findMany({
    where: { postType: "ARTICLE" },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink">Blog</h1>
        <Link
          href="/admin/blog/new"
          className="rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white"
        >
          New Post
        </Link>
      </div>
      <BlogList
        items={posts}
        adminBasePath="/admin/blog"
        publicBasePath="/blog"
        emptyLabel="No blog posts yet."
      />
    </div>
  );
}
