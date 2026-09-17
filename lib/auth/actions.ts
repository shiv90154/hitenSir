"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/client";
import { getSession } from "@/lib/auth/session";
import { loginSchema } from "@/lib/validation/auth";
import { checkRateLimit } from "@/lib/rate-limit";

export interface LoginState {
  error?: string;
}

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const rateLimit = checkRateLimit(`login:${ip}`);
  if (!rateLimit.allowed) {
    return { error: "Too many attempts. Try again in a minute." };
  }

  const { email, password } = parsed.data;
  const admin = await prisma.admin.findUnique({ where: { email } });

  if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
    return { error: "Invalid email or password" };
  }

  await prisma.admin.update({
    where: { id: admin.id },
    data: { lastLoginAt: new Date() },
  });

  const session = await getSession();
  session.adminId = admin.id;
  session.email = admin.email;
  session.name = admin.name;
  await session.save();

  redirect("/admin");
}

export async function logoutAction() {
  const session = await getSession();
  session.destroy();
  redirect("/admin/login");
}
