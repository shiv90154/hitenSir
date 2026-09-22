"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/client";
import { getCurrentAdmin } from "@/lib/auth/session";
import type { WhyUsStat } from "@/lib/db/why-us";

export interface WhyUsFormState {
  success?: boolean;
  error?: string;
}

export async function updateWhyUsAction(
  _prevState: WhyUsFormState,
  formData: FormData
): Promise<WhyUsFormState> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const eyebrow = (formData.get("eyebrow") as string) || "";
  const heading = (formData.get("heading") as string) || "";
  const description = (formData.get("description") as string) || "";
  const imageId1 = (formData.get("imageId1") as string) || null;
  const imageId2 = (formData.get("imageId2") as string) || null;
  const buttonLabel = (formData.get("buttonLabel") as string) || "";
  const buttonHref = (formData.get("buttonHref") as string) || "";

  const icons = formData.getAll("statIcon") as string[];
  const values = formData.getAll("statValue") as string[];
  const labels = formData.getAll("statLabel") as string[];

  const stats: WhyUsStat[] = values
    .map((value, i) => ({
      icon: (icons[i] ?? "").trim(),
      value: value.trim(),
      label: (labels[i] ?? "").trim(),
    }))
    .filter((stat) => stat.value || stat.label);

  const value = {
    eyebrow,
    heading,
    description,
    imageId1,
    imageId2,
    stats: stats as unknown as Prisma.InputJsonValue,
    buttonLabel,
    buttonHref,
  };

  await prisma.websiteSetting.upsert({
    where: { key: "whyUs" },
    update: { value },
    create: { key: "whyUs", value },
  });

  revalidatePath("/admin/homepage");
  revalidatePath("/");
  return { success: true };
}
