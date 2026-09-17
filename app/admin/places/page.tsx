import Link from "next/link";
import { listAll } from "@/lib/db/places";
import { PlacesTable } from "@/components/admin/PlacesTable";

export const dynamic = "force-dynamic";

export default async function AdminPlacesPage() {
  const places = await listAll();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink">Places</h1>
        <Link
          href="/admin/places/new"
          className="rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white"
        >
          New Place
        </Link>
      </div>

      <PlacesTable places={places} />
    </div>
  );
}
