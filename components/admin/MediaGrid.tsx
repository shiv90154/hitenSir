"use client";

import Image from "next/image";
import { deleteMediaAction } from "@/lib/db/media-actions";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { SearchableList } from "@/components/admin/SearchableList";
import { MediaAltTextEditor } from "@/components/admin/MediaAltTextEditor";

interface MediaItem {
  id: string;
  url: string;
  altText: string | null;
  title: string | null;
}

export function MediaGrid({ media }: { media: MediaItem[] }) {
  return (
    <SearchableList
      items={media}
      getSearchText={(item) => `${item.altText ?? ""} ${item.title ?? ""}`}
      placeholder="Search by alt text or title…"
    >
      {(filtered) => (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {filtered.length === 0 && (
            <p className="col-span-full rounded-xl border border-dashed border-border p-10 text-center text-sm text-ink-soft">
              {media.length === 0 ? "No media uploaded yet." : "No results match your search."}
            </p>
          )}
          {filtered.map((item) => (
            <div key={item.id} className="overflow-hidden rounded-lg border border-border bg-white">
              <div className="relative h-32 w-full bg-placeholder">
                <Image src={item.url} alt={item.altText ?? ""} fill className="object-cover" />
              </div>
              <div className="space-y-1.5 p-2">
                <MediaAltTextEditor id={item.id} altText={item.altText} />
                <form action={deleteMediaAction.bind(null, item.id)}>
                  <ConfirmSubmitButton
                    confirmMessage="Delete this image? Pages using it will lose the reference."
                    className="text-xs font-medium text-orange hover:underline"
                  >
                    Delete
                  </ConfirmSubmitButton>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </SearchableList>
  );
}
