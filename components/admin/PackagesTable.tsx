"use client";

import Link from "next/link";
import { deletePackageAction } from "@/lib/db/packages-actions";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { SearchableList } from "@/components/admin/SearchableList";

interface PackageRow {
  id: string;
  name: string;
  slug: string;
  status: string;
  priceFrom: string | number | null;
  destination: { name: string } | null;
}

export function PackagesTable({ packages }: { packages: PackageRow[] }) {
  return (
    <SearchableList
      items={packages}
      getSearchText={(p) => `${p.name} ${p.destination?.name ?? ""}`}
      placeholder="Search by name or destination…"
    >
      {(filtered) => (
        <div className="overflow-hidden rounded-lg border border-border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-admin-surface text-xs uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Destination</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-ink-soft">
                    {packages.length === 0 ? "No packages yet." : "No results match your search."}
                  </td>
                </tr>
              )}
              {filtered.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-admin-surface">
                  <td className="px-4 py-3 font-medium text-ink">{pkg.name}</td>
                  <td className="px-4 py-3 text-ink-soft">{pkg.destination?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-ink-soft">
                    {pkg.priceFrom ? `₹${pkg.priceFrom.toString()}` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={pkg.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-3">
                      <Link
                        href={`/packages/${pkg.slug}`}
                        target="_blank"
                        className="text-xs font-medium text-ink-soft hover:text-navy"
                      >
                        Preview
                      </Link>
                      <Link
                        href={`/admin/packages/${pkg.id}`}
                        className="text-xs font-medium text-navy hover:underline"
                      >
                        Edit
                      </Link>
                      <form action={deletePackageAction.bind(null, pkg.id)}>
                        <ConfirmSubmitButton
                          confirmMessage={`Delete "${pkg.name}"? This can't be undone.`}
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
