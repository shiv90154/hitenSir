import { z } from "zod";

export const testimonialSchema = z.object({
  authorName: z.string().trim().min(2, "Name is required"),
  authorLocation: z.string().trim().optional().or(z.literal("")),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  quote: z.string().trim().min(2, "Quote is required"),
  sortOrder: z.coerce.number().int().default(0),
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;
