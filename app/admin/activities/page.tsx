import Link from "next/link";
import { listAll } from "@/lib/db/activities";
import { ActivitiesTable } from "@/components/admin/ActivitiesTable";

export const dynamic = "force-dynamic";

export default async function AdminActivitiesPage() {
  const activities = await listAll();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink">Things To Do</h1>
        <Link
          href="/admin/activities/new"
          className="rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white"
        >
          New Activity
        </Link>
      </div>

      <ActivitiesTable activities={activities} />
    </div>
  );
}
