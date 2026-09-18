import { notFound } from "next/navigation";
import { getById } from "@/lib/db/packages";
import { updatePackageAction } from "@/lib/db/packages-actions";
import { PackageForm } from "@/components/admin/PackageForm";
import { prisma } from "@/lib/db/client";

export default async function EditPackagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [pkg, destinations, categories, media] = await Promise.all([
    getById(id),
    prisma.destination.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.category.findMany({
      where: { appliesTo: "PACKAGE" },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.media.findMany({
      select: { id: true, url: true, altText: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  if (!pkg) notFound();

  const boundAction = updatePackageAction.bind(null, id);
  const imageIds = Array.isArray(pkg.images) ? (pkg.images as string[]) : [];

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold text-ink">Edit {pkg.name}</h1>
      <PackageForm
        action={boundAction}
        submitLabel="Save Changes"
        destinations={destinations}
        categories={categories}
        media={media}
        defaultValues={{
          ...pkg,
          priceFrom: pkg.priceFrom?.toString() ?? null,
          categoryIds: pkg.categories.map((c) => c.categoryId),
          imageIds,
        }}
      />
    </div>
  );
}
