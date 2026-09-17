"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "bharattrip:saved-destinations";
const CHANGE_EVENT = "bharattrip:saved-destinations-change";

function readSaved(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function writeSaved(ids: string[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // localStorage unavailable (private browsing, storage blocked) — fail silently,
    // the button still works for the current page view, it just won't persist.
  }
  // 'storage' events only fire in OTHER tabs, not this one — dispatch our own
  // so useSyncExternalStore re-reads immediately after a local toggle.
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

function getServerSnapshot() {
  return false;
}

export function SaveButton({ id, name }: { id: string; name: string }) {
  // useSyncExternalStore reads localStorage only after hydration on the
  // client (getServerSnapshot always returns false), so the server-rendered
  // and first-hydrated output match — no effect needed, no mismatch.
  const saved = useSyncExternalStore(subscribe, () => readSaved().includes(id), getServerSnapshot);

  function toggle() {
    const current = readSaved();
    const isSaved = current.includes(id);
    const next = isSaved ? current.filter((savedId) => savedId !== id) : [...current, id];
    writeSaved(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={saved}
      className={`flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors ${
        saved
          ? "border-orange bg-orange/10 text-orange"
          : "border-border text-ink hover:border-navy hover:text-navy"
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        fill={saved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={1.75}
        className="h-4 w-4"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 21s-7.5-4.6-10-9.1C.5 8.2 2.4 4.5 6 4.5c2 0 3.5 1 6 3.5 2.5-2.5 4-3.5 6-3.5 3.6 0 5.5 3.7 4 7.4-2.5 4.5-10 9.1-10 9.1Z"
        />
      </svg>
      {saved ? "Saved" : "Save"}
      <span className="sr-only"> {name}</span>
    </button>
  );
}
