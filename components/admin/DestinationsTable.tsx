"use client";

import Link from "next/link";
import { deleteDestinationAction } from "@/lib/db/destinations-actions";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { SearchableList } from "@/components/admin/SearchableList";

interface DestinationRow {
  id: string;
  name: string;
  slug: string;
  state: string | null;
  status: string;
}

export function DestinationsTable({ destinations }: { destinations: DestinationRow[] }) {
  return (
    <SearchableList
      items={destinations}
      getSearchText={(d) => `${d.name} ${d.state ?? ""}`}
      placeholder="Search by name or state…"
    >
      {(filtered) => (
        <div className="overflow-hidden rounded-lg border border-border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-admin-surface text-xs uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">State</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-ink-soft">
                    {destinations.length === 0 ? "No destinations yet." : "No results match your search."}
                  </td>
                </tr>
              )}
              {filtered.map((destination) => (
                <tr key={destination.id} className="hover:bg-admin-surface">
                  <td className="px-4 py-3 font-medium text-ink">{destination.name}</td>
                  <td className="px-4 py-3 text-ink-soft">{destination.state ?? "—"}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={destination.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-3">
                      <Link
                        href={`/destinations/${destination.slug}`}
                        target="_blank"
                        className="text-xs font-medium text-ink-soft hover:text-navy"
                      >
                        Preview
                      </Link>
                      <Link
                        href={`/admin/destinations/${destination.id}`}
                        className="text-xs font-medium text-navy hover:underline"
                      >
                        Edit
                      </Link>
                      <form action={deleteDestinationAction.bind(null, destination.id)}>
                        <ConfirmSubmitButton
                          confirmMessage={`Delete "${destination.name}"? This can't be undone.`}
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
