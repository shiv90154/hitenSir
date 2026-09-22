"use client";

import { useActionState } from "react";
import { updateQuotePopupAction, type QuotePopupFormState } from "@/lib/db/quote-popup-actions";
import type { QuotePopupSettings } from "@/lib/db/quote-popup";
import { Field, inputClass } from "@/components/admin/FormField";
import { MultiImagePicker, type MultiImageOption } from "@/components/admin/MultiImagePicker";
import { SavedNotice } from "@/components/admin/SavedNotice";

const initialState: QuotePopupFormState = {};

export function QuotePopupForm({ popup, media }: { popup: QuotePopupSettings; media: MultiImageOption[] }) {
  const [state, formAction, isPending] = useActionState(updateQuotePopupAction, initialState);

  return (
    <form action={formAction} className="max-w-2xl space-y-4">
      <label className="flex items-center justify-between rounded-lg border border-border bg-white px-4 py-3">
        <span>
          <span className="block text-sm font-medium text-ink">Show quote popup</span>
          <span className="block text-xs text-ink-soft">
            Appears automatically after the delay below.
          </span>
        </span>
        <input type="checkbox" name="enabled" defaultChecked={popup.enabled} />
      </label>

      <Field label="Heading" required>
        <input name="heading" defaultValue={popup.heading} required className={inputClass} />
      </Field>
      <Field label="Subheading">
        <textarea name="subheading" defaultValue={popup.subheading} rows={2} className={inputClass} />
      </Field>
      <Field label="Slider photos (pick a few — they cycle with arrows and dots)">
        <MultiImagePicker name="imageIds" media={media} defaultValue={popup.imageIds} />
      </Field>
      <Field label="Auto-show delay (seconds)">
        <input
          name="delaySeconds"
          type="number"
          min={0}
          defaultValue={popup.delaySeconds}
          className={inputClass}
        />
        <p className="mt-1 text-xs text-ink-soft">Shows once per visitor session.</p>
      </Field>

      <SavedNotice state={state} />
      {state.error && <p className="text-sm text-orange">{state.error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-navy px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {isPending ? "Saving…" : "Save Quote Popup"}
      </button>
    </form>
  );
}
