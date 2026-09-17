"use client";

import { useState, useTransition } from "react";
import { updateMediaAltTextAction } from "@/lib/db/media-actions";

export function MediaAltTextEditor({ id, altText }: { id: string; altText: string | null }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(altText ?? "");
  const [isPending, startTransition] = useTransition();

  function save() {
    if (!value.trim()) return;
    startTransition(async () => {
      await updateMediaAltTextAction(id, value.trim());
      setEditing(false);
    });
  }

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="block w-full truncate text-left text-xs text-ink-soft hover:text-navy hover:underline"
        title="Click to edit alt text"
      >
        {altText || "(no alt text)"}
      </button>
    );
  }

  return (
    <div className="space-y-1">
      <input
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") save();
          if (e.key === "Escape") setEditing(false);
        }}
        className="w-full rounded border border-border px-1.5 py-1 text-xs outline-none focus:border-navy"
      />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={save}
          disabled={isPending}
          className="text-xs font-medium text-navy hover:underline disabled:opacity-60"
        >
          {isPending ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          onClick={() => {
            setValue(altText ?? "");
            setEditing(false);
          }}
          className="text-xs font-medium text-ink-soft hover:text-navy"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
