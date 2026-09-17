"use client";

import { useState } from "react";
import Image from "next/image";

export interface MediaOption {
  id: string;
  url: string;
  altText: string | null;
  title: string | null;
}

export function MediaPicker({
  name,
  media,
  defaultValue,
}: {
  name: string;
  media: MediaOption[];
  defaultValue?: string | null;
}) {
  const [selected, setSelected] = useState(defaultValue ?? "");

  if (media.length === 0) {
    return (
      <p className="mt-1 text-sm text-ink-soft">
        No media uploaded yet — add some in the Media Library first.
      </p>
    );
  }

  return (
    <div className="mt-1">
      <input type="hidden" name={name} value={selected} />
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
        <button
          type="button"
          onClick={() => setSelected("")}
          aria-pressed={selected === ""}
          className={`flex h-20 w-full items-center justify-center rounded-md border text-xs font-medium text-ink-soft ${
            selected === "" ? "border-navy ring-2 ring-navy" : "border-border hover:border-navy"
          }`}
        >
          No image
        </button>
        {media.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSelected(item.id)}
            aria-pressed={selected === item.id}
            aria-label={item.title || item.altText || "Untitled image"}
            className={`relative h-20 w-full overflow-hidden rounded-md border bg-placeholder ${
              selected === item.id ? "border-navy ring-2 ring-navy" : "border-border hover:border-navy"
            }`}
          >
            <Image src={item.url} alt={item.altText ?? ""} fill className="object-cover" />
          </button>
        ))}
      </div>
      {selected && (
        <p className="mt-2 truncate text-xs text-ink-soft">
          Selected:{" "}
          {media.find((m) => m.id === selected)?.title ||
            media.find((m) => m.id === selected)?.altText ||
            selected}
        </p>
      )}
    </div>
  );
}
