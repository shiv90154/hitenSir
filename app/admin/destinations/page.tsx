import Link from "next/link";
import { listAll } from "@/lib/db/destinations";
import { DestinationsTable } from "@/components/admin/DestinationsTable";

export const dynamic = "force-dynamic";

export default async function AdminDestinationsPage() {
  const destinations = await listAll();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink">Destinations</h1>
        <Link
          href="/admin/destinations/new"
          className="rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white"
        >
          New Destination
        </Link>
      </div>

      <DestinationsTable destinations={destinations} />
    </div>
  );
}
