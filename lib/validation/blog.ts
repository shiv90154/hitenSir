import { z } from "zod";
import { slugPattern } from "@/lib/validation/slug";

function tokenize(value: string): string[] {
  return Array.from(
    new Set(
      value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean)
    )
  );
}

export const blogSchema = z.object({
  title: z.string().trim().min(2, "Title is required"),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(slugPattern, "Slug must be lowercase, hyphen-separated"),
  postType: z.enum(["ARTICLE", "GUIDE"]),
  excerpt: z.string().trim().max(300).optional().or(z.literal("")),
  body: z.string().trim().optional().or(z.literal("")),
  featuredImageId: z.string().uuid().optional().or(z.literal("")),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  categories: z.string().optional().default("").transform(tokenize),
  tags: z.string().optional().default("").transform(tokenize),
});

export type BlogInput = z.infer<typeof blogSchema>;

export function estimateReadingTime(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
