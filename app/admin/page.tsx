import Link from "next/link";
import { prisma } from "@/lib/db/client";
import { StatTile } from "@/components/admin/StatTile";
import { StatusBadge } from "@/components/shared/StatusBadge";

export const dynamic = "force-dynamic";

interface RecentContentItem {
  id: string;
  name: string;
  status: string;
  updatedAt: Date;
  type: string;
  href: string;
}

async function getDashboardData() {
  const [
    destinationCount,
    packageCount,
    blogCount,
    publishedCounts,
    draftCounts,
    recentByType,
    recentEnquiries,
  ] = await Promise.all([
    prisma.destination.count(),
    prisma.package.count(),
    prisma.blog.count(),
    Promise.all([
      prisma.destination.count({ where: { status: "PUBLISHED" } }),
      prisma.place.count({ where: { status: "PUBLISHED" } }),
      prisma.activity.count({ where: { status: "PUBLISHED" } }),
      prisma.package.count({ where: { status: "PUBLISHED" } }),
      prisma.blog.count({ where: { status: "PUBLISHED" } }),
    ]),
    Promise.all([
      prisma.destination.count({ where: { status: "DRAFT" } }),
      prisma.place.count({ where: { status: "DRAFT" } }),
      prisma.activity.count({ where: { status: "DRAFT" } }),
      prisma.package.count({ where: { status: "DRAFT" } }),
      prisma.blog.count({ where: { status: "DRAFT" } }),
    ]),
    Promise.all([
      prisma.destination.findMany({
        orderBy: { updatedAt: "desc" },
        take: 5,
        select: { id: true, name: true, status: true, updatedAt: true },
      }),
      prisma.place.findMany({
        orderBy: { updatedAt: "desc" },
        take: 5,
        select: { id: true, name: true, status: true, updatedAt: true },
      }),
      prisma.activity.findMany({
        orderBy: { updatedAt: "desc" },
        take: 5,
        select: { id: true, name: true, status: true, updatedAt: true },
      }),
      prisma.package.findMany({
        orderBy: { updatedAt: "desc" },
        take: 5,
        select: { id: true, name: true, status: true, updatedAt: true },
      }),
      prisma.blog.findMany({
        orderBy: { updatedAt: "desc" },
        take: 5,
        select: { id: true, title: true, status: true, updatedAt: true, postType: true },
      }),
    ]),
    prisma.enquiry.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  const typeConfig = [
    { type: "Destination", editBase: "/admin/destinations" },
    { type: "Place", editBase: "/admin/places" },
    { type: "Activity", editBase: "/admin/activities" },
    { type: "Package", editBase: "/admin/packages" },
    { type: "Blog", editBase: "/admin/blog" },
  ] as const;

  const recentContent: RecentContentItem[] = recentByType
    .flatMap((items, index) => {
      const { type, editBase } = typeConfig[index];
      return items.map((item) => {
        const name = "name" in item ? item.name : item.title;
        const base =
          type === "Blog" && "postType" in item && item.postType === "GUIDE"
            ? "/admin/guides"
            : editBase;
        const label = type === "Blog" && "postType" in item && item.postType === "GUIDE" ? "Guide" : type;
        return {
          id: item.id,
          name,
          status: item.status,
          updatedAt: item.updatedAt,
          type: label,
          href: `${base}/${item.id}`,
        };
      });
    })
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 5);

  return {
    destinationCount,
    packageCount,
    blogCount,
    publishedCount: publishedCounts.reduce((sum, count) => sum + count, 0),
    draftCount: draftCounts.reduce((sum, count) => sum + count, 0),
    recentContent,
    recentEnquiries,
  };
}

export default async function AdminDashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="space-y-8">
      <h1 className="font-display text-2xl font-semibold text-ink">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatTile label="Destinations" value={data.destinationCount} href="/admin/destinations" />
        <StatTile label="Packages" value={data.packageCount} href="/admin/packages" />
        <StatTile label="Blog Posts" value={data.blogCount} href="/admin/blog" />
        <StatTile label="Published (all content)" value={data.publishedCount} />
        <StatTile label="Drafts (all content)" value={data.draftCount} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-white p-5">
          <h2 className="text-sm font-semibold text-ink">Recent Content</h2>
          <p className="mt-0.5 text-xs text-ink-soft">
            Most recently edited across Destinations, Places, Things To Do, Packages, Blog & Guides.
          </p>
          <ul className="mt-4 divide-y divide-border">
            {data.recentContent.length === 0 && (
              <li className="py-3 text-sm text-ink-soft">Nothing yet.</li>
            )}
            {data.recentContent.map((item) => (
              <li key={`${item.type}-${item.id}`}>
                <Link
                  href={item.href}
                  className="-mx-2 flex items-center justify-between gap-3 rounded-md px-2 py-3 transition-colors hover:bg-admin-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-ink">{item.name}</span>
                    <span className="text-xs text-ink-soft">{item.type}</span>
                  </span>
                  <StatusBadge status={item.status} />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-border bg-white p-5">
          <h2 className="text-sm font-semibold text-ink">Recent Enquiries</h2>
          <ul className="mt-4 divide-y divide-border">
            {data.recentEnquiries.length === 0 && (
              <li className="py-3 text-sm text-ink-soft">No enquiries yet.</li>
            )}
            {data.recentEnquiries.map((e) => (
              <li key={e.id}>
                <Link
                  href="/admin/enquiries"
                  className="-mx-2 flex items-center justify-between gap-3 rounded-md px-2 py-3 transition-colors hover:bg-admin-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-ink">{e.name}</span>
                    <span className="block truncate text-xs text-ink-soft">{e.email}</span>
                  </span>
                  <StatusBadge status={e.status} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
