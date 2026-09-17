"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/client";
import { getCurrentAdmin } from "@/lib/auth/session";
import { faqSchema } from "@/lib/validation/faq";
import { fieldErrorsFrom } from "@/lib/db/form-utils";

export interface FaqFormState {
  error?: string;
  fieldErrors?: Record<string, string>;
}

export async function createFaqAction(
  _prevState: FaqFormState,
  formData: FormData
): Promise<FaqFormState> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const parsed = faqSchema.safeParse({
    question: formData.get("question"),
    answer: formData.get("answer"),
    context: formData.get("context"),
    contextId: formData.get("contextId"),
    sortOrder: formData.get("sortOrder"),
  });
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error) };

  await prisma.faq.create({ data: parsed.data });
  revalidatePath("/admin/faqs");
  revalidatePath("/");
  redirect("/admin/faqs");
}

export async function updateFaqAction(
  id: string,
  _prevState: FaqFormState,
  formData: FormData
): Promise<FaqFormState> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const parsed = faqSchema.safeParse({
    question: formData.get("question"),
    answer: formData.get("answer"),
    context: formData.get("context"),
    contextId: formData.get("contextId"),
    sortOrder: formData.get("sortOrder"),
  });
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error) };

  await prisma.faq.update({ where: { id }, data: parsed.data });
  revalidatePath("/admin/faqs");
  revalidatePath("/");
  return {};
}

export async function deleteFaqAction(id: string) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  await prisma.faq.delete({ where: { id } });
  revalidatePath("/admin/faqs");
  revalidatePath("/");
}
