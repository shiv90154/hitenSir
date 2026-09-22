"use client";

import { useActionState, useEffect, useState } from "react";
import Image from "next/image";
import { createEnquiryAction, type EnquiryFormState } from "@/lib/db/enquiries-actions";

const initialState: EnquiryFormState = {};

const inputClass =
  "mt-1 w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/50 focus:border-white/50";

const SESSION_KEY = "bt-quote-popup-shown";
export const OPEN_QUOTE_POPUP_EVENT = "bt:open-quote-popup";
export const QUOTE_POPUP_CLOSED_EVENT = "bt:quote-popup-closed";

function popupAction(prevState: EnquiryFormState, formData: FormData) {
  const destination = (formData.get("destination") as string | null)?.trim();
  if (destination) {
    const existing = (formData.get("message") as string | null)?.trim() ?? "";
    formData.set("message", `Destination of interest: ${destination}${existing ? `\n${existing}` : ""}`);
  }
  return createEnquiryAction(prevState, formData);
}

function ImageSlider({ imageUrls, heading }: { imageUrls: string[]; heading: string }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (imageUrls.length < 2) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % imageUrls.length), 4000);
    return () => clearInterval(timer);
  }, [imageUrls.length]);

  return (
    <div className="relative hidden min-h-64 overflow-hidden sm:block">
      {imageUrls.map((url, i) => (
        <Image
          key={url}
          src={url}
          alt=""
          fill
          priority={i === 0}
          className={`object-cover transition-opacity duration-700 ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-navy-dark/35" aria-hidden="true" />
      <p className="absolute bottom-10 left-4 right-4 font-display text-lg font-semibold text-white drop-shadow">
        {heading}
      </p>

      {imageUrls.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => setIndex((i) => (i - 1 + imageUrls.length) % imageUrls.length)}
            aria-label="Previous photo"
            className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-navy hover:bg-white"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => setIndex((i) => (i + 1) % imageUrls.length)}
            aria-label="Next photo"
            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-navy hover:bg-white"
          >
            ›
          </button>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {imageUrls.map((url, i) => (
              <button
                key={url}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Go to photo ${i + 1}`}
                className={`h-1.5 w-1.5 rounded-full ${i === index ? "bg-white" : "bg-white/40"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function QuotePopupModal({
  enabled,
  heading,
  subheading,
  imageUrls,
  delaySeconds,
}: {
  enabled: boolean;
  heading: string;
  subheading: string;
  imageUrls: string[];
  delaySeconds: number;
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(popupAction, initialState);

  function close() {
    setOpen(false);
    window.dispatchEvent(new Event(QUOTE_POPUP_CLOSED_EVENT));
  }

  useEffect(() => {
    function handleOpen() {
      setOpen(true);
    }
    window.addEventListener(OPEN_QUOTE_POPUP_EVENT, handleOpen);
    return () => window.removeEventListener(OPEN_QUOTE_POPUP_EVENT, handleOpen);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    let alreadyShown = false;
    try {
      alreadyShown = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      // Storage unavailable (private mode etc.) — fall through and show anyway.
    }
    if (alreadyShown) return;

    const timer = setTimeout(() => {
      setOpen(true);
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        // Ignore — worst case the popup shows again next load.
      }
    }, Math.max(0, delaySeconds) * 1000);

    return () => clearTimeout(timer);
  }, [enabled, delaySeconds]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-navy-dark/80 p-4"
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-label={heading}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative grid w-full max-w-3xl grid-cols-1 overflow-hidden rounded-2xl bg-navy shadow-2xl sm:grid-cols-2"
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-navy hover:bg-white"
        >
          ✕
        </button>

        {imageUrls.length > 0 ? (
          <ImageSlider imageUrls={imageUrls} heading={heading} />
        ) : (
          <div className="hidden flex-col justify-center bg-orange px-8 py-10 text-white sm:flex">
            <p className="font-display text-2xl font-semibold leading-snug">{heading}</p>
            {subheading && <p className="mt-3 text-sm text-white/85">{subheading}</p>}
          </div>
        )}

        <div className="max-h-[85vh] overflow-y-auto px-6 py-8 text-white sm:px-8">
          <p className="font-display text-xl font-semibold sm:hidden">{heading}</p>

          {state.success ? (
            <div className="flex min-h-64 flex-col items-center justify-center text-center">
              <p className="font-display text-xl font-semibold">Thanks — we&apos;ve got it!</p>
              <p className="mt-2 text-sm text-white/70">Our team will reach out with the best plan shortly.</p>
            </div>
          ) : (
            <form action={formAction} className="mt-4 space-y-3">
              <div className="absolute left-[-9999px]" aria-hidden="true">
                <label htmlFor="popup-company">Company</label>
                <input id="popup-company" name="company" tabIndex={-1} autoComplete="off" />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70">Name *</label>
                <input name="name" required placeholder="Enter your name" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/70">Email</label>
                <input name="email" type="email" placeholder="Your email ID" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/70">Phone *</label>
                <input name="phone" type="tel" required placeholder="Phone number" className={inputClass} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-white/70">Travel date</label>
                  <input name="travelDate" type="date" className={`${inputClass} [color-scheme-dark`} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/70">No. of travellers</label>
                  <input name="peopleCount" type="number" min={1} placeholder="Count" className={inputClass} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-white/70">Destination</label>
                <input name="destination" placeholder="Where do you want to go?" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/70">Message</label>
                <textarea name="message" rows={2} placeholder="Your message" className={inputClass} />
              </div>

              {state.error && (
                <p role="alert" className="text-sm text-orange">
                  {state.error}
                </p>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="mt-2 w-full rounded-full bg-orange px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {isPending ? "Sending…" : "Get Details"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
