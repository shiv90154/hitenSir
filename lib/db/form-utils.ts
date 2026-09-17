import type { ZodError } from "zod";

export function fieldErrorsFrom(error: ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    fieldErrors[issue.path[0] as string] = issue.message;
  }
  return fieldErrors;
}
