import { prisma } from "@/lib/db/client";
import type { Prisma } from "@prisma/client";

export function listPublished(search?: string) {
  const query = search?.trim();
  return prisma.destination.findMany({
    where: {
      status: "PUBLISHED",
      ...(query
        ? {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { state: { contains: query, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { name: "asc" },
    include: { coverImage: true },
  });
}

export function listAll() {
  return prisma.destination.findMany({
    orderBy: { updatedAt: "desc" },
  });
}

export function getBySlug(slug: string) {
  return prisma.destination.findUnique({
    where: { slug },
    include: {
      coverImage: true,
      places: { where: { status: "PUBLISHED" } },
      activities: { where: { status: "PUBLISHED" } },
      packages: { where: { status: "PUBLISHED" } },
    },
  });
}

export function getById(id: string) {
  return prisma.destination.findUnique({ where: { id } });
}

export function create(data: Prisma.DestinationCreateInput) {
  return prisma.destination.create({ data });
}

export function update(id: string, data: Prisma.DestinationUpdateInput) {
  return prisma.destination.update({ where: { id }, data });
}

export function remove(id: string) {
  return prisma.destination.delete({ where: { id } });
}

export function counts() {
  return prisma.destination.groupBy({
    by: ["status"],
    _count: true,
  });
}
