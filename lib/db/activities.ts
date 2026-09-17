import { prisma } from "@/lib/db/client";
import type { Prisma } from "@prisma/client";

export function listPublished() {
  return prisma.activity.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { name: "asc" },
    include: { destination: true },
  });
}

export function listAll() {
  return prisma.activity.findMany({
    orderBy: { updatedAt: "desc" },
    include: { destination: true },
  });
}

export function getBySlug(slug: string) {
  return prisma.activity.findUnique({
    where: { slug },
    include: { destination: true },
  });
}

export function getById(id: string) {
  return prisma.activity.findUnique({ where: { id } });
}

export function create(data: Prisma.ActivityCreateInput) {
  return prisma.activity.create({ data });
}

export function update(id: string, data: Prisma.ActivityUpdateInput) {
  return prisma.activity.update({ where: { id }, data });
}

export function remove(id: string) {
  return prisma.activity.delete({ where: { id } });
}
