"use client";

import { useEffect, useState } from "react";

// Accepts the whole action-state object (not just its `.success` boolean) so
// a fresh submit is detected every time — including two successful saves in
// a row, where `.success` would stay `true` and never "change".
export function SavedNotice({ state }: { state: { success?: boolean } }) {
  const [lastState, setLastState] = useState(state);
  const [visible, setVisible] = useState(false);

  // Adjusted during render (React's pattern for reacting to a prop change)
  // rather than in an effect, since this needs to run before paint.
  if (state !== lastState) {
    setLastState(state);
    if (state.success) setVisible(true);
  }

  // The timer itself is a legitimate effect — it's a subscription to an
  // external clock, not a derived value copied from a prop.
  useEffect(() => {
    if (!visible) return;
    const timeout = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(timeout);
  }, [visible]);

  if (!visible) return null;

  return (
    <p
      role="status"
      className="flex items-center gap-1.5 rounded-lg bg-status-published-bg px-3 py-2 text-sm font-medium text-status-published-text"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-4 w-4" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      Saved
    </p>
  );
}
