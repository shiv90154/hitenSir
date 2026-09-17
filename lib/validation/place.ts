import { z } from "zod";
import { slugPattern } from "@/lib/validation/slug";

export const placeSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(slugPattern, "Slug must be lowercase, hyphen-separated"),
  description: z.string().trim().optional().or(z.literal("")),
  destinationId: z.string().uuid("Choose a destination"),
  bestTimeToVisit: z.string().trim().optional().or(z.literal("")),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});

export type PlaceInput = z.infer<typeof placeSchema>;
