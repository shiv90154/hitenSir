"use client";

import Link from "next/link";
import { deletePlaceAction } from "@/lib/db/places-actions";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { SearchableList } from "@/components/admin/SearchableList";

interface PlaceRow {
  id: string;
  name: string;
  slug: string;
  status: string;
  destination: { name: string };
}

export function PlacesTable({ places }: { places: PlaceRow[] }) {
  return (
    <SearchableList
      items={places}
      getSearchText={(p) => `${p.name} ${p.destination.name}`}
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
                    {places.length === 0 ? "No places yet." : "No results match your search."}
                  </td>
                </tr>
              )}
              {filtered.map((place) => (
                <tr key={place.id} className="hover:bg-admin-surface">
                  <td className="px-4 py-3 font-medium text-ink">{place.name}</td>
                  <td className="px-4 py-3 text-ink-soft">{place.destination.name}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={place.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-3">
                      <Link
                        href={`/places/${place.slug}`}
                        target="_blank"
                        className="text-xs font-medium text-ink-soft hover:text-navy"
                      >
                        Preview
                      </Link>
                      <Link
                        href={`/admin/places/${place.id}`}
                        className="text-xs font-medium text-navy hover:underline"
                      >
                        Edit
                      </Link>
                      <form action={deletePlaceAction.bind(null, place.id)}>
                        <ConfirmSubmitButton
                          confirmMessage={`Delete "${place.name}"? This can't be undone.`}
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
