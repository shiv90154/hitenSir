// One-time script to create the first admin account.
// Usage: npm run seed:admin -- --email you@example.com --password "change-me" --name "Admin"
// Disable or remove this script once the first account exists (Phase 9 checklist).
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
      "Usage: npm run seed:admin -- --email you@example.com --password \"change-me\" [--name \"Admin\"]"
    );
    process.exit(1);
  }

  if (password.length < 8) {
    console.error("Password must be at least 8 characters.");
    process.exit(1);
  }

  const existing = await prisma.admin.findUnique({ where: { email } });
  if (existing) {
    console.error(`An admin with email ${email} already exists.`);
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);
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
