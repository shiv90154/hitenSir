"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/client";
import { getCurrentAdmin } from "@/lib/auth/session";
import { blogSchema, estimateReadingTime } from "@/lib/validation/blog";
import { fieldErrorsFrom } from "@/lib/db/form-utils";
import { slugify } from "@/lib/validation/slug";

export interface BlogFormState {
  error?: string;
  fieldErrors?: Record<string, string>;
}

function parseForm(formData: FormData) {
  return blogSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    postType: formData.get("postType"),
    excerpt: formData.get("excerpt"),
    body: formData.get("body"),
    featuredImageId: formData.get("featuredImageId"),
    status: formData.get("status"),
    categories: formData.get("categories"),
    tags: formData.get("tags"),
  });
}

async function upsertCategoryIds(names: string[]) {
  const ids: string[] = [];
  for (const name of names) {
    const slug = slugify(name);
    const category = await prisma.blogCategory.upsert({
      where: { slug },
      update: {},
      create: { name, slug },
    });
    ids.push(category.id);
  }
  return ids;
}

async function upsertTagIds(names: string[]) {
  const ids: string[] = [];
  for (const name of names) {
    const slug = slugify(name);
    const tag = await prisma.blogTag.upsert({
      where: { slug },
      update: {},
      create: { name, slug },
    });
    ids.push(tag.id);
  }
  return ids;
}

export async function createBlogAction(
  _prevState: BlogFormState,
  formData: FormData
): Promise<BlogFormState> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const parsed = parseForm(formData);
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error) };

  const existing = await prisma.blog.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) return { fieldErrors: { slug: "That slug is already in use" } };

  const { categories, tags, body, status, featuredImageId, ...data } = parsed.data;
  const [categoryIds, tagIds] = await Promise.all([
    upsertCategoryIds(categories),
    upsertTagIds(tags),
  ]);

  await prisma.blog.create({
    data: {
      ...data,
      body,
      status,
      featuredImageId: featuredImageId || null,
      authorId: admin.id,
      readingTime: body ? estimateReadingTime(body) : null,
      publishedAt: status === "PUBLISHED" ? new Date() : null,
      categories: { create: categoryIds.map((categoryId) => ({ categoryId })) },
      tags: { create: tagIds.map((tagId) => ({ tagId })) },
    },
  });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath("/guides");
  redirect(parsed.data.postType === "GUIDE" ? "/admin/guides" : "/admin/blog");
}

export async function updateBlogAction(
  id: string,
  _prevState: BlogFormState,
  formData: FormData
): Promise<BlogFormState> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const parsed = parseForm(formData);
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error) };

  const conflict = await prisma.blog.findFirst({ where: { slug: parsed.data.slug, NOT: { id } } });
  if (conflict) return { fieldErrors: { slug: "That slug is already in use" } };

  const existing = await prisma.blog.findUnique({ where: { id } });
  const { categories, tags, body, status, featuredImageId, ...data } = parsed.data;
  const [categoryIds, tagIds] = await Promise.all([
    upsertCategoryIds(categories),
    upsertTagIds(tags),
  ]);

  await prisma.$transaction([
    prisma.blogCategoryMap.deleteMany({ where: { blogId: id } }),
    prisma.blogTagMap.deleteMany({ where: { blogId: id } }),
    prisma.blog.update({
      where: { id },
      data: {
        ...data,
        body,
        status,
        featuredImageId: featuredImageId || null,
        readingTime: body ? estimateReadingTime(body) : null,
        publishedAt:
          status === "PUBLISHED" ? (existing?.publishedAt ?? new Date()) : existing?.publishedAt,
        categories: { create: categoryIds.map((categoryId) => ({ categoryId })) },
        tags: { create: tagIds.map((tagId) => ({ tagId })) },
      },
    }),
  ]);

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath("/guides");
  revalidatePath(`/blog/${parsed.data.slug}`);
  revalidatePath(`/guides/${parsed.data.slug}`);
  redirect(parsed.data.postType === "GUIDE" ? "/admin/guides" : "/admin/blog");
}

export async function deleteBlogAction(id: string) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  await prisma.blog.delete({ where: { id } });
  revalidatePath("/admin/blog");
  revalidatePath("/admin/guides");
  revalidatePath("/blog");
  revalidatePath("/guides");
}
