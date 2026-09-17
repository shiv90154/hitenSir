import { z } from "zod";

export const faqSchema = z.object({
  question: z.string().trim().min(2, "Question is required"),
  answer: z.string().trim().min(2, "Answer is required"),
  context: z.enum(["GLOBAL", "PACKAGE", "DESTINATION", "GUIDE"]),
  contextId: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : undefined)),
  sortOrder: z.coerce.number().int().default(0),
});

export type FaqInput = z.infer<typeof faqSchema>;
