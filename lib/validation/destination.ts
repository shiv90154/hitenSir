import { z } from "zod";
import { slugPattern } from "@/lib/validation/slug";

export const destinationSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(slugPattern, "Slug must be lowercase, hyphen-separated"),
  shortDescription: z.string().trim().max(280).optional().or(z.literal("")),
  description: z.string().trim().optional().or(z.literal("")),
  coverImageId: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : undefined)),
  state: z.string().trim().optional().or(z.literal("")),
  bestTimeToVisit: z.string().trim().optional().or(z.literal("")),
  howToReach: z.string().trim().optional().or(z.literal("")),
  travelTips: z.string().trim().optional().or(z.literal("")),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});

export type DestinationInput = z.infer<typeof destinationSchema>;
