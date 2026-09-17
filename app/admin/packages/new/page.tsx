import { PackageForm } from "@/components/admin/PackageForm";
import { createPackageAction } from "@/lib/db/packages-actions";
import { prisma } from "@/lib/db/client";

export default async function NewPackagePage() {
  const [destinations, categories] = await Promise.all([
    prisma.destination.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.category.findMany({
      where: { appliesTo: "PACKAGE" },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold text-ink">New Package</h1>
      <PackageForm
        action={createPackageAction}
        submitLabel="Create Package"
        destinations={destinations}
        categories={categories}
      />
    </div>
  );
}
