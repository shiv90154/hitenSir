"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/client";
import { getCurrentAdmin } from "@/lib/auth/session";
import { testimonialSchema } from "@/lib/validation/testimonial";
import { fieldErrorsFrom } from "@/lib/db/form-utils";

export interface TestimonialFormState {
  error?: string;
  fieldErrors?: Record<string, string>;
}

export async function createTestimonialAction(
  _prevState: TestimonialFormState,
  formData: FormData
): Promise<TestimonialFormState> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const parsed = testimonialSchema.safeParse({
    authorName: formData.get("authorName"),
    authorLocation: formData.get("authorLocation"),
    rating: formData.get("rating"),
    quote: formData.get("quote"),
    sortOrder: formData.get("sortOrder"),
    avatarMediaId: formData.get("avatarMediaId"),
  });
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error) };

  await prisma.testimonial.create({ data: parsed.data });
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  redirect("/admin/testimonials");
}

export async function updateTestimonialAction(
  id: string,
  _prevState: TestimonialFormState,
  formData: FormData
): Promise<TestimonialFormState> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const parsed = testimonialSchema.safeParse({
    authorName: formData.get("authorName"),
    authorLocation: formData.get("authorLocation"),
    rating: formData.get("rating"),
    quote: formData.get("quote"),
    sortOrder: formData.get("sortOrder"),
    avatarMediaId: formData.get("avatarMediaId"),
  });
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error) };

  await prisma.testimonial.update({ where: { id }, data: parsed.data });
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  return {};
}

export async function deleteTestimonialAction(id: string) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  await prisma.testimonial.delete({ where: { id } });
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}
