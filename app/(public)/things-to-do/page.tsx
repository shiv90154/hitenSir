import type { Metadata } from "next";
import Link from "next/link";
import { listPublished } from "@/lib/db/activities";

export const metadata: Metadata = {
  title: "Things To Do",
  description: "Adventure sports, experiences, and activities across Himachal Pradesh.",
};

export const revalidate = 3600;

export default async function ThingsToDoPage() {
  const activities = await listPublished();

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-16">
      <h1 className="font-display text-4xl font-semibold text-ink">Things To Do</h1>
      <p className="mt-2 text-sm text-ink-soft">{activities.length} experiences</p>

      {activities.length === 0 ? (
        <p className="mt-10 rounded-xl border border-dashed border-border p-10 text-center text-sm text-ink-soft">
          Nothing published yet.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {activities.map((activity) => (
            <Link
              key={activity.id}
              href={`/things-to-do/${activity.slug}`}
              className="rounded-xl border border-border bg-surface p-5 hover:shadow-md"
            >
              <p className="font-display text-lg font-semibold text-ink">{activity.name}</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-ink-soft">
                {activity.destination.name}
                {activity.duration ? ` · ${activity.duration}` : ""}
              </p>
              {activity.priceFrom && (
                <p className="mt-2 text-sm font-medium text-orange">
                  From ₹{activity.priceFrom.toString()}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
