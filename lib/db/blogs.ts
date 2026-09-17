import { prisma } from "@/lib/db/client";
import type { BlogPostType } from "@prisma/client";

export function listPublished(postType: BlogPostType) {
  return prisma.blog.findMany({
    where: { status: "PUBLISHED", postType },
    orderBy: { publishedAt: "desc" },
    include: {
      author: true,
      featuredImage: true,
      categories: { include: { category: true } },
      tags: { include: { tag: true } },
    },
  });
}

export function listByCategorySlug(postType: BlogPostType, categorySlug: string) {
  return prisma.blog.findMany({
    where: {
      status: "PUBLISHED",
      postType,
      categories: { some: { category: { slug: categorySlug } } },
    },
    orderBy: { publishedAt: "desc" },
    include: { featuredImage: true },
  });
}

export function listByTagSlug(postType: BlogPostType, tagSlug: string) {
  return prisma.blog.findMany({
    where: {
      status: "PUBLISHED",
      postType,
      tags: { some: { tag: { slug: tagSlug } } },
    },
    orderBy: { publishedAt: "desc" },
    include: { featuredImage: true },
  });
}

export function listAll() {
  return prisma.blog.findMany({
    orderBy: { updatedAt: "desc" },
  });
}

export function getBySlug(slug: string) {
  return prisma.blog.findUnique({
    where: { slug },
    include: {
      author: true,
      featuredImage: true,
      categories: { include: { category: true } },
      tags: { include: { tag: true } },
    },
  });
}

export function getById(id: string) {
  return prisma.blog.findUnique({
    where: { id },
    include: { categories: { include: { category: true } }, tags: { include: { tag: true } } },
  });
}

export function remove(id: string) {
  return prisma.blog.delete({ where: { id } });
}
