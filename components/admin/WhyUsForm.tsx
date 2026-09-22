"use client";

import { useActionState, useState } from "react";
import { updateWhyUsAction, type WhyUsFormState } from "@/lib/db/why-us-actions";
import type { WhyUsSettings, WhyUsStat } from "@/lib/db/why-us";
import { Field, inputClass } from "@/components/admin/FormField";
import { MediaPicker, type MediaOption } from "@/components/admin/MediaPicker";
import { SavedNotice } from "@/components/admin/SavedNotice";

const initialState: WhyUsFormState = {};

export function WhyUsForm({ whyUs, media }: { whyUs: WhyUsSettings; media: MediaOption[] }) {
  const [state, formAction, isPending] = useActionState(updateWhyUsAction, initialState);
  const [stats, setStats] = useState<WhyUsStat[]>(whyUs.stats);

  function updateStat(index: number, patch: Partial<WhyUsStat>) {
    setStats((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  }

  function removeStat(index: number) {
    setStats((prev) => prev.filter((_, i) => i !== index));
  }

  function addStat() {
    setStats((prev) => [...prev, { icon: "", value: "", label: "" }]);
  }

  return (
    <form action={formAction} className="max-w-2xl space-y-4">
      <p className="text-xs text-ink-soft">
        Shown/hidden with the &ldquo;Why Choose Us&rdquo; toggle in Sections below.
      </p>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Eyebrow label">
          <input name="eyebrow" defaultValue={whyUs.eyebrow} className={inputClass} />
        </Field>
        <Field label="Heading" required>
          <input name="heading" defaultValue={whyUs.heading} required className={inputClass} />
        </Field>
      </div>
      <Field label="Description">
        <textarea name="description" defaultValue={whyUs.description} rows={4} className={inputClass} />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Photo 1 (larger, top)">
          <MediaPicker name="imageId1" media={media} defaultValue={whyUs.imageId1} />
        </Field>
        <Field label="Photo 2 (smaller, overlapping)">
          <MediaPicker name="imageId2" media={media} defaultValue={whyUs.imageId2} />
        </Field>
      </div>

      <div>
        <p className="text-sm font-medium text-ink">Stats</p>
        <p className="text-xs text-ink-soft">Icon can be any emoji, e.g. 🛡️ 📅 🙂 🚩 🕐 🎁</p>
        <div className="mt-2 space-y-3">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="grid grid-cols-1 gap-2 rounded-lg border border-border p-3 sm:grid-cols-[4rem_1fr_1.4fr_auto]"
            >
              <input
                name="statIcon"
                value={stat.icon}
                onChange={(e) => updateStat(i, { icon: e.target.value })}
                placeholder="🛡️"
                className={`${inputClass} text-center`}
              />
              <input
                name="statValue"
                value={stat.value}
                onChange={(e) => updateStat(i, { value: e.target.value })}
                placeholder="100%"
                className={inputClass}
              />
              <input
                name="statLabel"
                value={stat.label}
                onChange={(e) => updateStat(i, { label: e.target.value })}
                placeholder="Money Safe"
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => removeStat(i)}
                className="rounded-lg border border-border px-3 py-2 text-xs font-medium text-ink-soft hover:border-orange hover:text-orange"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addStat}
          className="mt-3 rounded-full border border-navy px-4 py-1.5 text-xs font-semibold text-navy hover:bg-navy/5"
        >
          + Add stat
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Button label">
          <input name="buttonLabel" defaultValue={whyUs.buttonLabel} className={inputClass} />
        </Field>
        <Field label="Button link">
          <input name="buttonHref" defaultValue={whyUs.buttonHref} className={inputClass} />
        </Field>
      </div>

      <SavedNotice state={state} />
      {state.error && <p className="text-sm text-orange">{state.error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-navy px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {isPending ? "Saving…" : "Save Why Us"}
      </button>
    </form>
  );
}
