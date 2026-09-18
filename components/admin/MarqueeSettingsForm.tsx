"use client";

import { useActionState } from "react";
import { updateMarqueeSettingsAction, type MarqueeSettingsFormState } from "@/lib/db/marquee-settings-actions";
import type { MarqueeSettings } from "@/lib/db/marquee-settings";
import { Field, inputClass } from "@/components/admin/FormField";
import { SavedNotice } from "@/components/admin/SavedNotice";

const initialState: MarqueeSettingsFormState = {};

export function MarqueeSettingsForm({ marquee }: { marquee: MarqueeSettings }) {
  const [state, formAction, isPending] = useActionState(updateMarqueeSettingsAction, initialState);

  return (
    <form action={formAction} className="max-w-2xl space-y-4">
      <label className="flex items-center justify-between rounded-lg border border-border bg-white px-4 py-3">
        <span>
          <span className="block text-sm font-medium text-ink">Show scrolling marquee</span>
          <span className="block text-xs text-ink-soft">Appears as a strip below the hero.</span>
        </span>
        <input type="checkbox" name="enabled" defaultChecked={marquee.enabled} />
      </label>

      <Field label="Lines of text (one per line)">
        <textarea
          name="items"
          defaultValue={marquee.items.join("\n")}
          rows={5}
          placeholder={"Free cancellation up to 48 hours before travel\n4.9/5 rated by 500+ travellers\nLocal experts, real support"}
          className={inputClass}
        />
        <p className="mt-1 text-xs text-ink-soft">Each line scrolls as a separate item, repeating in a loop.</p>
      </Field>

      <Field label="Speed">
        <select name="speed" defaultValue={marquee.speed} className={inputClass}>
          <option value="slow">Slow</option>
          <option value="normal">Normal</option>
          <option value="fast">Fast</option>
        </select>
      </Field>

      <SavedNotice state={state} />
      {state.error && <p className="text-sm text-orange">{state.error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-navy px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {isPending ? "Saving…" : "Save Marquee"}
      </button>
    </form>
  );
}
