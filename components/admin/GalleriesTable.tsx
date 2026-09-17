"use client";

import Link from "next/link";
import { deleteGalleryAction } from "@/lib/db/galleries-actions";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { SearchableList } from "@/components/admin/SearchableList";

interface GalleryRow {
  id: string;
  title: string;
  slug: string;
  images: unknown[];
}

export function GalleriesTable({ galleries }: { galleries: GalleryRow[] }) {
  return (
    <SearchableList items={galleries} getSearchText={(g) => g.title} placeholder="Search by title…">
      {(filtered) => (
        <div className="overflow-hidden rounded-lg border border-border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-admin-surface text-xs uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Images</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-ink-soft">
                    {galleries.length === 0 ? "No galleries yet." : "No results match your search."}
                  </td>
                </tr>
              )}
              {filtered.map((gallery) => (
                <tr key={gallery.id} className="hover:bg-admin-surface">
                  <td className="px-4 py-3 font-medium text-ink">{gallery.title}</td>
                  <td className="px-4 py-3 text-ink-soft">{gallery.images.length ? "1+" : "0"}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-3">
                      <Link
                        href={`/gallery/${gallery.slug}`}
                        target="_blank"
                        className="text-xs font-medium text-ink-soft hover:text-navy"
                      >
                        Preview
                      </Link>
                      <Link
                        href={`/admin/galleries/${gallery.id}`}
                        className="text-xs font-medium text-navy hover:underline"
                      >
                        Edit
                      </Link>
                      <form action={deleteGalleryAction.bind(null, gallery.id)}>
                        <ConfirmSubmitButton
                          confirmMessage={`Delete "${gallery.title}"?`}
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
