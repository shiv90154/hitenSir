"use client";

import { useActionState, useState } from "react";
import { updateCtaPopupAction, type CtaPopupFormState } from "@/lib/db/cta-popup-actions";
import type { CtaButton, CtaPopupSettings } from "@/lib/db/cta-popup";
import { Field, inputClass } from "@/components/admin/FormField";
import { SavedNotice } from "@/components/admin/SavedNotice";

const initialState: CtaPopupFormState = {};

export function CtaPopupForm({ popup }: { popup: CtaPopupSettings }) {
  const [state, formAction, isPending] = useActionState(updateCtaPopupAction, initialState);
  const [buttons, setButtons] = useState<CtaButton[]>(popup.buttons);

  function updateButton(index: number, patch: Partial<CtaButton>) {
    setButtons((prev) => prev.map((btn, i) => (i === index ? { ...btn, ...patch } : btn)));
  }

  function removeButton(index: number) {
    setButtons((prev) => prev.filter((_, i) => i !== index));
  }

  function addButton() {
    setButtons((prev) => [...prev, { label: "", type: "call", value: "" }]);
  }

  return (
    <form action={formAction} className="max-w-2xl space-y-4">
      <label className="flex items-center justify-between rounded-lg border border-border bg-white px-4 py-3">
        <span>
          <span className="block text-sm font-medium text-ink">Show CTA popup</span>
          <span className="block text-xs text-ink-soft">
            A small popup with quick action buttons (Call Now, WhatsApp, etc.), shown after the delay
            below.
          </span>
        </span>
        <input type="checkbox" name="enabled" defaultChecked={popup.enabled} />
      </label>

      <Field label="Heading" required>
        <input name="heading" defaultValue={popup.heading} required className={inputClass} />
      </Field>
      <Field label="Message">
        <textarea name="message" defaultValue={popup.message} rows={2} className={inputClass} />
      </Field>
      <Field label="Auto-show delay (seconds)">
        <input
          name="delaySeconds"
          type="number"
          min={0}
          defaultValue={popup.delaySeconds}
          className={inputClass}
        />
      </Field>

      <div>
        <p className="text-sm font-medium text-ink">Buttons</p>
        <p className="text-xs text-ink-soft">
          Call and WhatsApp buttons always use the phone number from{" "}
          <a href="/admin/settings" className="underline hover:text-navy">
            Settings
          </a>{" "}
          — change it there and it updates everywhere on the site.
        </p>
        <div className="mt-2 space-y-3">
          {buttons.map((btn, i) => (
            <div key={i} className="grid grid-cols-1 gap-2 rounded-lg border border-border p-3 sm:grid-cols-[1fr_1fr_1.4fr_auto]">
              <input
                name="buttonLabel"
                value={btn.label}
                onChange={(e) => updateButton(i, { label: e.target.value })}
                placeholder="Label, e.g. Call Now"
                className={inputClass}
              />
              <select
                name="buttonType"
                value={btn.type}
                onChange={(e) => updateButton(i, { type: e.target.value as CtaButton["type"] })}
                className={inputClass}
              >
                <option value="call">Call</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="quote">Open quote popup</option>
                <option value="link">Custom link</option>
              </select>
              <input
                name="buttonValue"
                value={btn.type === "link" ? btn.value : ""}
                onChange={(e) => updateButton(i, { value: e.target.value })}
                placeholder={
                  btn.type === "link"
                    ? "https://…"
                    : btn.type === "quote"
                      ? "Opens the quote popup"
                      : "Uses the phone number from Settings"
                }
                readOnly={btn.type !== "link"}
                className={`${inputClass} ${btn.type !== "link" ? "opacity-50" : ""}`}
              />
              <button
                type="button"
                onClick={() => removeButton(i)}
                className="rounded-lg border border-border px-3 py-2 text-xs font-medium text-ink-soft hover:border-orange hover:text-orange"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addButton}
          className="mt-3 rounded-full border border-navy px-4 py-1.5 text-xs font-semibold text-navy hover:bg-navy/5"
        >
          + Add button
        </button>
      </div>

      <SavedNotice state={state} />
      {state.error && <p className="text-sm text-orange">{state.error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-navy px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {isPending ? "Saving…" : "Save CTA Popup"}
      </button>
    </form>
  );
}
