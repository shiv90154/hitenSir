import Link from "next/link";
import { listAll } from "@/lib/db/packages";
import { PackagesTable } from "@/components/admin/PackagesTable";

export const dynamic = "force-dynamic";

export default async function AdminPackagesPage() {
  const packages = await listAll();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink">Packages</h1>
        <Link
          href="/admin/packages/new"
          className="rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white"
        >
          New Package
        </Link>
      </div>

      <PackagesTable packages={packages.map((p) => ({ ...p, priceFrom: p.priceFrom?.toString() ?? null }))} />
    </div>
  );
}
