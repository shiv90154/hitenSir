import Link from "next/link";
import { listAll } from "@/lib/db/galleries";
import { GalleriesTable } from "@/components/admin/GalleriesTable";

export const dynamic = "force-dynamic";

export default async function AdminGalleriesPage() {
  const galleries = await listAll();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink">Galleries</h1>
        <Link
          href="/admin/galleries/new"
          className="rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white"
        >
          New Gallery
        </Link>
      </div>

      <GalleriesTable galleries={galleries} />
    </div>
  );
}
