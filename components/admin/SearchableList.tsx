"use client";

import { useMemo, useState } from "react";

export function SearchableList<T>({
  items,
  getSearchText,
  placeholder = "Search…",
  children,
}: {
  items: T[];
  getSearchText: (item: T) => string;
  placeholder?: string;
  children: (filtered: T[]) => React.ReactNode;
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => getSearchText(item).toLowerCase().includes(q));
  }, [items, query, getSearchText]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full max-w-xs rounded-full border border-border bg-white px-4 py-2 text-sm outline-none focus:border-navy"
        />
        {query && (
          <p className="shrink-0 text-xs text-ink-soft">
            {filtered.length} of {items.length}
          </p>
        )}
      </div>
      {children(filtered)}
    </div>
  );
}
