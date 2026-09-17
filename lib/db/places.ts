import { prisma } from "@/lib/db/client";
import type { Prisma } from "@prisma/client";

export function listPublished() {
  return prisma.place.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { name: "asc" },
    include: { destination: { include: { coverImage: true } } },
  });
}

export function listAll() {
  return prisma.place.findMany({
    orderBy: { updatedAt: "desc" },
    include: { destination: true },
  });
}

export function getBySlug(slug: string) {
  return prisma.place.findUnique({
    where: { slug },
    include: { destination: true },
  });
}

export function getById(id: string) {
  return prisma.place.findUnique({ where: { id } });
}

export function create(data: Prisma.PlaceCreateInput) {
  return prisma.place.create({ data });
}

export function update(id: string, data: Prisma.PlaceUpdateInput) {
  return prisma.place.update({ where: { id }, data });
}

export function remove(id: string) {
  return prisma.place.delete({ where: { id } });
}
