import { z } from "zod";

export const enquirySchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  phone: z.string().trim().optional().or(z.literal("")),
  destinationId: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : undefined)),
  packageId: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : undefined)),
  travelDate: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? new Date(v) : undefined)),
  peopleCount: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? Number(v) : undefined)),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  // Honeypot field — real users never fill this in; bots that fill every
  // field will trip it. Silently accepted and dropped in the action.
  company: z.string().trim().optional().or(z.literal("")),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;
