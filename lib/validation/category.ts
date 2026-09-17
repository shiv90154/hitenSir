import { z } from "zod";
import { slugPattern } from "@/lib/validation/slug";

export const categorySchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(slugPattern, "Slug must be lowercase, hyphen-separated"),
  appliesTo: z.enum(["PACKAGE", "BLOG", "ACTIVITY"]),
});

export type CategoryInput = z.infer<typeof categorySchema>;
