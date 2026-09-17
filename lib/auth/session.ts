import "server-only";
import { cookies } from "next/headers";
import { getIronSession, type IronSession } from "iron-session";

export interface AdminSessionData {
  adminId?: string;
  email?: string;
  name?: string;
}

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret || sessionSecret.length < 32) {
  throw new Error(
    "SESSION_SECRET env var must be set to a random string of at least 32 characters."
  );
}

export const sessionOptions = {
  password: sessionSecret,
  cookieName: "bharattrip_admin_session",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
  },
};

export async function getSession(): Promise<IronSession<AdminSessionData>> {
  const cookieStore = await cookies();
  return getIronSession<AdminSessionData>(cookieStore, sessionOptions);
}

export async function getCurrentAdmin() {
  const session = await getSession();
  if (!session.adminId) return null;
  return { id: session.adminId, email: session.email, name: session.name };
}
