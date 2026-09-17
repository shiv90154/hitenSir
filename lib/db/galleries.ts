import { prisma } from "@/lib/db/client";

export function listAll() {
  return prisma.gallery.findMany({
    orderBy: { title: "asc" },
    include: { images: { include: { media: true }, orderBy: { sortOrder: "asc" }, take: 1 } },
  });
}

export function getBySlug(slug: string) {
  return prisma.gallery.findUnique({
    where: { slug },
    include: { images: { include: { media: true }, orderBy: { sortOrder: "asc" } } },
  });
}

export function getById(id: string) {
  return prisma.gallery.findUnique({
    where: { id },
    include: { images: true },
  });
}
