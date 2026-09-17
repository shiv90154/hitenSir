"use client";

import Link from "next/link";
import { deleteBlogAction } from "@/lib/db/blogs-actions";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { SearchableList } from "@/components/admin/SearchableList";

interface BlogListItem {
  id: string;
  title: string;
  slug: string;
  status: string;
}

export function BlogList({
  items,
  adminBasePath,
  publicBasePath,
  emptyLabel,
}: {
  items: BlogListItem[];
  adminBasePath: string;
  publicBasePath: string;
  emptyLabel: string;
}) {
  return (
    <SearchableList items={items} getSearchText={(item) => item.title} placeholder="Search by title…">
      {(filtered) => (
        <div className="overflow-hidden rounded-lg border border-border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-admin-surface text-xs uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-ink-soft">
                    {items.length === 0 ? emptyLabel : "No results match your search."}
                  </td>
                </tr>
              )}
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-admin-surface">
                  <td className="px-4 py-3 font-medium text-ink">{item.title}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-3">
                      <Link
                        href={`${publicBasePath}/${item.slug}`}
                        target="_blank"
                        className="text-xs font-medium text-ink-soft hover:text-navy"
                      >
                        Preview
                      </Link>
                      <Link
                        href={`${adminBasePath}/${item.id}`}
                        className="text-xs font-medium text-navy hover:underline"
                      >
                        Edit
                      </Link>
                      <form action={deleteBlogAction.bind(null, item.id)}>
                        <ConfirmSubmitButton
                          confirmMessage={`Delete "${item.title}"? This can't be undone.`}
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
