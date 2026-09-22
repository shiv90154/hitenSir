"use client";

import { useEffect, useState } from "react";
import type { CtaButton } from "@/lib/db/cta-popup";
import { OPEN_QUOTE_POPUP_EVENT, QUOTE_POPUP_CLOSED_EVENT } from "@/components/public/QuotePopupModal";

const SESSION_KEY = "bt-cta-popup-shown";

// "call" and "whatsapp" always resolve to the site-wide contact phone from
// Settings — never a per-button value — so the number is managed in one
// place across the whole site.
function hrefFor(button: CtaButton, phone: string): string | null {
  if (button.type === "call") return phone ? `tel:${phone}` : null;
  if (button.type === "whatsapp") return phone ? `https://wa.me/${phone.replace(/\D/g, "")}` : null;
  if (button.type === "link") return button.value || null;
  return null;
}

export function CtaPopupWidget({
  enabled,
  quotePopupEnabled,
  heading,
  message,
  delaySeconds,
  buttons,
  phone,
}: {
  enabled: boolean;
  quotePopupEnabled: boolean;
  heading: string;
  message: string;
  delaySeconds: number;
  buttons: CtaButton[];
  phone: string;
}) {
  const [open, setOpen] = useState(false);

  function show() {
    let alreadyShown = false;
    try {
      alreadyShown = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      // Ignore — private mode etc.
    }
    if (alreadyShown) return;

    setOpen(true);
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // Ignore.
    }
  }

  // When the quote popup is on, wait for it to close (whatever the reason)
  // and then show this one after the configured delay, so the two never
  // overlap. When the quote popup is off, fall back to its own timer.
  useEffect(() => {
    if (!enabled) return;

    if (quotePopupEnabled) {
      function handleClosed() {
        const timer = setTimeout(show, Math.max(0, delaySeconds) * 1000);
        return timer;
      }
      let timer: ReturnType<typeof setTimeout> | undefined;
      const listener = () => {
        timer = handleClosed();
      };
      window.addEventListener(QUOTE_POPUP_CLOSED_EVENT, listener);
      return () => {
        window.removeEventListener(QUOTE_POPUP_CLOSED_EVENT, listener);
        if (timer) clearTimeout(timer);
      };
    }

    const timer = setTimeout(show, Math.max(0, delaySeconds) * 1000);
    return () => clearTimeout(timer);
  }, [enabled, quotePopupEnabled, delaySeconds]);

  if (!open) return null;

  return (
    <div className="fixed bottom-4 right-4 z-90 w-[calc(100%-2rem)] max-w-xs animate-[fade-in-up_0.3s_ease-out] rounded-2xl border border-border bg-surface p-5 shadow-2xl sm:bottom-6 sm:right-6">
      <button
        type="button"
        onClick={() => setOpen(false)}
        aria-label="Close"
        className="absolute right-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-full text-ink-soft hover:bg-admin-surface hover:text-ink"
      >
        ✕
      </button>
      <p className="pr-6 font-display text-base font-semibold text-ink">{heading}</p>
      {message && <p className="mt-1.5 text-sm text-ink-soft">{message}</p>}
      <div className="mt-4 flex flex-wrap gap-2">
        {buttons.map((btn, i) => {
          if (btn.type === "quote") {
            return (
              <button
                key={i}
                type="button"
                onClick={() => {
                  window.dispatchEvent(new Event(OPEN_QUOTE_POPUP_EVENT));
                  setOpen(false);
                }}
                className="rounded-full bg-orange px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
              >
                {btn.label}
              </button>
            );
          }
          const href = hrefFor(btn, phone);
          if (!href) return null;
          return (
            <a
              key={i}
              href={href}
              target={btn.type === "link" ? "_blank" : undefined}
              rel={btn.type === "link" ? "noreferrer" : undefined}
              className="rounded-full bg-navy px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
            >
              {btn.label}
            </a>
          );
        })}
      </div>
    </div>
  );
}
