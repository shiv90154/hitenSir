import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db/client";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [destinations, places, packages, activities, blogs, galleries] = await Promise.all([
    prisma.destination.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
    prisma.place.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
    prisma.package.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
    prisma.activity.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
    prisma.blog.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true, postType: true },
    }),
    prisma.gallery.findMany({ select: { slug: true } }),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/destinations",
    "/places",
    "/packages",
    "/things-to-do",
    "/blog",
    "/guides",
    "/gallery",
    "/contact",
  ].map((route) => ({ url: `${baseUrl}${route}`, lastModified: new Date() }));

  const destinationRoutes = destinations.map((d) => ({
    url: `${baseUrl}/destinations/${d.slug}`,
    lastModified: d.updatedAt,
  }));
  const placeRoutes = places.map((p) => ({
    url: `${baseUrl}/places/${p.slug}`,
    lastModified: p.updatedAt,
  }));
  const packageRoutes = packages.map((p) => ({
    url: `${baseUrl}/packages/${p.slug}`,
    lastModified: p.updatedAt,
  }));
  const activityRoutes = activities.map((a) => ({
    url: `${baseUrl}/things-to-do/${a.slug}`,
    lastModified: a.updatedAt,
  }));
  const blogRoutes = blogs.map((b) => ({
    url: `${baseUrl}/${b.postType === "GUIDE" ? "guides" : "blog"}/${b.slug}`,
    lastModified: b.updatedAt,
  }));
  const galleryRoutes = galleries.map((g) => ({
    url: `${baseUrl}/gallery/${g.slug}`,
  }));

  return [
    ...staticRoutes,
    ...destinationRoutes,
    ...placeRoutes,
    ...packageRoutes,
    ...activityRoutes,
    ...blogRoutes,
    ...galleryRoutes,
  ];
}
