import { z } from "zod";
import { slugPattern } from "@/lib/validation/slug";

function linesToArray(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export const packageSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(slugPattern, "Slug must be lowercase, hyphen-separated"),
  shortDescription: z.string().trim().max(280).optional().or(z.literal("")),
  description: z.string().trim().optional().or(z.literal("")),
  duration: z.string().trim().optional().or(z.literal("")),
  priceFrom: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : undefined))
    .refine((v) => v === undefined || !Number.isNaN(Number(v)), "Must be a number"),
  destinationId: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : undefined)),
  included: z.string().optional().default("").transform(linesToArray),
  excluded: z.string().optional().default("").transform(linesToArray),
  highlights: z.string().optional().default("").transform(linesToArray),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  categoryIds: z.array(z.string().uuid()).default([]),
  itineraries: z
    .array(
      z.object({
        dayNumber: z.number().int().min(1),
        title: z.string().trim().min(1),
        description: z.string().trim().optional().default(""),
      })
    )
    .default([]),
});

export type PackageInput = z.infer<typeof packageSchema>;
