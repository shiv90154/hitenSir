"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/client";
import { getCurrentAdmin } from "@/lib/auth/session";
import { packageSchema } from "@/lib/validation/package";
import { fieldErrorsFrom } from "@/lib/db/form-utils";

export interface PackageFormState {
  error?: string;
  fieldErrors?: Record<string, string>;
}

function parseForm(formData: FormData) {
  let itineraries: unknown = [];
  const raw = formData.get("itinerariesJson");
  if (typeof raw === "string" && raw.trim()) {
    try {
      itineraries = JSON.parse(raw);
    } catch {
      itineraries = [];
    }
  }

  return packageSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    shortDescription: formData.get("shortDescription"),
    description: formData.get("description"),
    duration: formData.get("duration"),
    priceFrom: formData.get("priceFrom"),
    destinationId: formData.get("destinationId"),
    included: formData.get("included"),
    excluded: formData.get("excluded"),
    highlights: formData.get("highlights"),
    status: formData.get("status"),
    categoryIds: formData.getAll("categoryIds"),
    itineraries,
  });
}

export async function createPackageAction(
  _prevState: PackageFormState,
  formData: FormData
): Promise<PackageFormState> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const parsed = parseForm(formData);
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error) };

  const existing = await prisma.package.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) return { fieldErrors: { slug: "That slug is already in use" } };

  const { categoryIds, itineraries, ...data } = parsed.data;

  await prisma.package.create({
    data: {
      ...data,
      itineraries: { create: itineraries },
      categories: { create: categoryIds.map((categoryId) => ({ categoryId })) },
    },
  });

  revalidatePath("/admin/packages");
  revalidatePath("/packages");
  redirect("/admin/packages");
}

export async function updatePackageAction(
  id: string,
  _prevState: PackageFormState,
  formData: FormData
): Promise<PackageFormState> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const parsed = parseForm(formData);
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error) };

  const conflict = await prisma.package.findFirst({
    where: { slug: parsed.data.slug, NOT: { id } },
  });
  if (conflict) return { fieldErrors: { slug: "That slug is already in use" } };

  const { categoryIds, itineraries, ...data } = parsed.data;

  await prisma.$transaction([
    prisma.packageItinerary.deleteMany({ where: { packageId: id } }),
    prisma.packageCategoryMap.deleteMany({ where: { packageId: id } }),
    prisma.package.update({
      where: { id },
      data: {
        ...data,
        itineraries: { create: itineraries },
        categories: { create: categoryIds.map((categoryId) => ({ categoryId })) },
      },
    }),
  ]);

  revalidatePath("/admin/packages");
  revalidatePath("/packages");
  revalidatePath(`/packages/${parsed.data.slug}`);
  redirect("/admin/packages");
}

export async function deletePackageAction(id: string) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  await prisma.package.delete({ where: { id } });
  revalidatePath("/admin/packages");
  revalidatePath("/packages");
}
