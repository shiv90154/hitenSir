"use client";

import Link from "next/link";
import { deleteActivityAction } from "@/lib/db/activities-actions";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { SearchableList } from "@/components/admin/SearchableList";

interface ActivityRow {
  id: string;
  name: string;
  slug: string;
  status: string;
  destination: { name: string };
}

export function ActivitiesTable({ activities }: { activities: ActivityRow[] }) {
  return (
    <SearchableList
      items={activities}
      getSearchText={(a) => `${a.name} ${a.destination.name}`}
      placeholder="Search by name or destination…"
    >
      {(filtered) => (
        <div className="overflow-hidden rounded-lg border border-border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-admin-surface text-xs uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Destination</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-ink-soft">
                    {activities.length === 0 ? "No activities yet." : "No results match your search."}
                  </td>
                </tr>
              )}
              {filtered.map((activity) => (
                <tr key={activity.id} className="hover:bg-admin-surface">
                  <td className="px-4 py-3 font-medium text-ink">{activity.name}</td>
                  <td className="px-4 py-3 text-ink-soft">{activity.destination.name}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={activity.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-3">
                      <Link
                        href={`/things-to-do/${activity.slug}`}
                        target="_blank"
                        className="text-xs font-medium text-ink-soft hover:text-navy"
                      >
                        Preview
                      </Link>
                      <Link
                        href={`/admin/activities/${activity.id}`}
                        className="text-xs font-medium text-navy hover:underline"
                      >
                        Edit
                      </Link>
                      <form action={deleteActivityAction.bind(null, activity.id)}>
                        <ConfirmSubmitButton
                          confirmMessage={`Delete "${activity.name}"? This can't be undone.`}
                          className="text-xs font-medium text-orange hover:underline"
                        >
                          Delete
                        </ConfirmSubmitButton>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </SearchableList>
  );
}
