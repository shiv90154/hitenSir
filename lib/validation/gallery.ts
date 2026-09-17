import { z } from "zod";
import { slugPattern } from "@/lib/validation/slug";

export const gallerySchema = z.object({
  title: z.string().trim().min(2, "Title is required"),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(slugPattern, "Slug must be lowercase, hyphen-separated"),
  description: z.string().trim().optional().or(z.literal("")),
  mediaIds: z.array(z.string().uuid()).default([]),
});

export type GalleryInput = z.infer<typeof gallerySchema>;
