"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/client";
import { getCurrentAdmin } from "@/lib/auth/session";
import { enquirySchema } from "@/lib/validation/enquiry";
import { fieldErrorsFrom } from "@/lib/db/form-utils";
import { checkRateLimit } from "@/lib/rate-limit";
import { notifyNewEnquiry } from "@/lib/email/notify-enquiry";

export interface EnquiryFormState {
  error?: string;
  fieldErrors?: Record<string, string>;
  success?: boolean;
}

export async function createEnquiryAction(
  _prevState: EnquiryFormState,
  formData: FormData
): Promise<EnquiryFormState> {
  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const rateLimit = checkRateLimit(`enquiry:${ip}`, { windowMs: 60_000, max: 5 });
  if (!rateLimit.allowed) {
    return { error: "Too many requests. Please try again in a minute." };
  }

  const parsed = enquirySchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    destinationId: formData.get("destinationId"),
    packageId: formData.get("packageId"),
    travelDate: formData.get("travelDate"),
    peopleCount: formData.get("peopleCount"),
    message: formData.get("message"),
    company: formData.get("company"),
  });
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error) };

  // Honeypot tripped — pretend success so the bot moves on, but drop it.
  if (parsed.data.company) {
    return { success: true };
  }

  const enquiry = await prisma.enquiry.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      destinationId: parsed.data.destinationId,
      packageId: parsed.data.packageId,
      travelDate: parsed.data.travelDate,
      peopleCount: parsed.data.peopleCount,
      message: parsed.data.message,
    },
  });
  await notifyNewEnquiry(enquiry);

  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");
  return { success: true };
}

export interface UpdateEnquiryStatusState {
  error?: string;
}

export async function updateEnquiryStatusAction(
  id: string,
  status: "NEW" | "CONTACTED" | "IN_PROGRESS" | "CONVERTED" | "CLOSED"
) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  await prisma.enquiry.update({ where: { id }, data: { status } });
  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");
}

export async function updateEnquiryNotesAction(id: string, adminNotes: string) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  await prisma.enquiry.update({ where: { id }, data: { adminNotes } });
  revalidatePath("/admin/enquiries");
}

export async function deleteEnquiryAction(id: string) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  await prisma.enquiry.delete({ where: { id } });
  revalidatePath("/admin/enquiries");
}
