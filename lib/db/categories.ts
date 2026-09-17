import { prisma } from "@/lib/db/client";
import type { CategoryAppliesTo } from "@prisma/client";

export function listAll() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

export function listByAppliesTo(appliesTo: CategoryAppliesTo) {
  return prisma.category.findMany({ where: { appliesTo }, orderBy: { name: "asc" } });
}

export function getById(id: string) {
  return prisma.category.findUnique({ where: { id } });
}
