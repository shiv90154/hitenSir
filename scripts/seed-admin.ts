// Creates the admin account from ADMIN_EMAIL/ADMIN_PASSWORD/ADMIN_NAME in
// .env, or updates that admin's password/name if the account already
// exists — so .env stays the single source of truth for admin login and
// this script is always safe to re-run after changing it.
// Usage: npm run seed:admin
//   (or override just this once: npm run seed:admin -- --email you@example.com --password "change-me" --name "Admin")
import bcrypt from "bcryptjs";
import { prisma } from "../lib/db/client";

function getArg(flag: string): string | undefined {
  const index = process.argv.indexOf(flag);
  return index !== -1 ? process.argv[index + 1] : undefined;
}

async function main() {
  const email = getArg("--email") ?? process.env.ADMIN_EMAIL;
  const password = getArg("--password") ?? process.env.ADMIN_PASSWORD;
  const name = getArg("--name") ?? process.env.ADMIN_NAME ?? "Admin";

  if (!email || !password) {
    console.error(
      "Set ADMIN_EMAIL and ADMIN_PASSWORD in .env, or pass --email/--password directly."
    );
    process.exit(1);
  }

  if (password.length < 8) {
    console.error("Password must be at least 8 characters.");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const existing = await prisma.admin.findUnique({ where: { email } });
  if (existing) {
    const admin = await prisma.admin.update({
      where: { email },
      data: { passwordHash, name },
    });
    console.log(`Updated admin ${admin.email} (${admin.id}) — password set to the value in .env.`);
    return;
  }

  const admin = await prisma.admin.create({
    data: { email, passwordHash, name },
  });
  console.log(`Created admin ${admin.email} (${admin.id}).`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
