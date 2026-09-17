import Link from "next/link";
import { prisma } from "@/lib/db/client";
import { BlogList } from "@/components/admin/BlogList";

export const dynamic = "force-dynamic";

export default async function AdminGuidesPage() {
  const guides = await prisma.blog.findMany({
    where: { postType: "GUIDE" },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink">Travel Guides</h1>
        <Link
          href="/admin/guides/new"
          className="rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white"
        >
          New Guide
        </Link>
      </div>
      <BlogList
        items={guides}
        adminBasePath="/admin/guides"
        publicBasePath="/guides"
        emptyLabel="No guides yet."
      />
    </div>
  );
}
