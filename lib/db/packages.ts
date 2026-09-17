import { prisma } from "@/lib/db/client";

export function listPublished() {
  return prisma.package.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { name: "asc" },
    include: { destination: true },
  });
}

export function listAll() {
  return prisma.package.findMany({
    orderBy: { updatedAt: "desc" },
    include: { destination: true },
  });
}

export function getBySlug(slug: string) {
  return prisma.package.findUnique({
    where: { slug },
    include: {
      destination: true,
      itineraries: { orderBy: { dayNumber: "asc" } },
      categories: { include: { category: true } },
    },
  });
}

export function getById(id: string) {
  return prisma.package.findUnique({
    where: { id },
    include: {
      itineraries: { orderBy: { dayNumber: "asc" } },
      categories: true,
    },
  });
}

export function remove(id: string) {
  return prisma.package.delete({ where: { id } });
}
