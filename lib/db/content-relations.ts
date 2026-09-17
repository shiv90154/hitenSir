import { prisma } from "@/lib/db/client";
import type { ContentType, RelationType } from "@prisma/client";

export async function getRelatedIds(
  fromType: ContentType,
  fromId: string,
  toType: ContentType,
  relationType: RelationType
): Promise<string[]> {
  const rows = await prisma.contentRelation.findMany({
    where: { fromType, fromId, toType, relationType },
    orderBy: { sortOrder: "asc" },
  });
  return rows.map((r) => r.toId);
}

export async function setRelations(
  fromType: ContentType,
  fromId: string,
  toType: ContentType,
  relationType: RelationType,
  toIds: string[]
) {
  await prisma.$transaction([
    prisma.contentRelation.deleteMany({ where: { fromType, fromId, toType, relationType } }),
    prisma.contentRelation.createMany({
      data: toIds.map((toId, index) => ({
        fromType,
        fromId,
        toType,
        relationType,
        toId,
        sortOrder: index,
      })),
    }),
  ]);
}
