"use client";

import { useActionState } from "react";
import { updateHeroSettingsAction, type HeroSettingsFormState } from "@/lib/db/hero-settings-actions";
import type { HeroSettings } from "@/lib/db/hero-settings";
import { Field, inputClass } from "@/components/admin/FormField";
import { MediaPicker, type MediaOption } from "@/components/admin/MediaPicker";
import { SavedNotice } from "@/components/admin/SavedNotice";

const initialState: HeroSettingsFormState = {};

export function HeroSettingsForm({ hero, media }: { hero: HeroSettings; media: MediaOption[] }) {
  const [state, formAction, isPending] = useActionState(updateHeroSettingsAction, initialState);

  return (
    <form action={formAction} className="max-w-2xl space-y-4">
      <Field label="Eyebrow (small label above headline)">
        <input name="eyebrow" defaultValue={hero.eyebrow} className={inputClass} />
      </Field>
      <Field label="Headline" required>
        <input name="title" defaultValue={hero.title} required className={inputClass} />
      </Field>
      <Field label="Subheading">
        <textarea name="subtitle" defaultValue={hero.subtitle} rows={2} className={inputClass} />
      </Field>
      <Field label="Background image">
        <MediaPicker name="imageId" media={media} defaultValue={hero.imageId} />
        <p className="mt-2 text-xs text-ink-soft">
          Leave unselected to keep the plain navy background. A wide, dark-toned photo works best —
          white text sits on top of it.
        </p>
      </Field>

      <SavedNotice state={state} />
      {state.error && <p className="text-sm text-orange">{state.error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-navy px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {isPending ? "Saving…" : "Save Hero"}
      </button>
    </form>
  );
}
