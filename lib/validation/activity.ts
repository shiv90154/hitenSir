import { z } from "zod";
import { slugPattern } from "@/lib/validation/slug";

export const activitySchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(slugPattern, "Slug must be lowercase, hyphen-separated"),
  description: z.string().trim().optional().or(z.literal("")),
  destinationId: z.string().uuid("Choose a destination"),
  duration: z.string().trim().optional().or(z.literal("")),
  priceFrom: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : undefined))
    .refine((v) => v === undefined || !Number.isNaN(Number(v)), "Must be a number"),
  difficulty: z.enum(["EASY", "MODERATE", "DIFFICULT", ""]).optional(),
  bestSeason: z.string().trim().optional().or(z.literal("")),
  safetyInfo: z.string().trim().optional().or(z.literal("")),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});

export type ActivityInput = z.infer<typeof activitySchema>;
