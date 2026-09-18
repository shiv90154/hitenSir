import { prisma } from "@/lib/db/client";

/**
 * Package.images (and similar Json id-array fields) store an ordered list
 * of Media ids rather than a real relation — findMany({ id: { in } }) does
 * NOT preserve that order, so this re-sorts the result to match.
 */
export async function resolveMediaByIds(ids: unknown) {
  const idList = Array.isArray(ids) ? (ids as string[]) : [];
  if (idList.length === 0) return [];

  const media = await prisma.media.findMany({ where: { id: { in: idList } } });
  const byId = new Map(media.map((m) => [m.id, m]));
  return idList.map((id) => byId.get(id)).filter((m): m is NonNullable<typeof m> => Boolean(m));
}

/**
 * Batch-resolves just the first image of each item's `images` id-array
 * (e.g. package cover photos on a listing page) in a single query, keyed
 * by the item's own id.
 */
export async function resolveCoverImageUrls(
  items: { id: string; images: unknown }[]
): Promise<Map<string, string>> {
  const firstIdByItem = new Map<string, string>();
  for (const item of items) {
    const ids = Array.isArray(item.images) ? (item.images as string[]) : [];
    if (ids[0]) firstIdByItem.set(item.id, ids[0]);
  }
  if (firstIdByItem.size === 0) return new Map();

  const media = await prisma.media.findMany({
    where: { id: { in: [...firstIdByItem.values()] } },
    select: { id: true, url: true },
  });
  const urlByMediaId = new Map(media.map((m) => [m.id, m.url]));

  const result = new Map<string, string>();
  for (const [itemId, mediaId] of firstIdByItem) {
    const url = urlByMediaId.get(mediaId);
    if (url) result.set(itemId, url);
  }
  return result;
}
