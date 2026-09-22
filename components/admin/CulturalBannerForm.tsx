"use client";

import { useActionState } from "react";
import {
  updateCulturalBannerAction,
  type CulturalBannerFormState,
} from "@/lib/db/cultural-banner-actions";
import type { CulturalBannerSettings } from "@/lib/db/cultural-banner";
import { Field, inputClass } from "@/components/admin/FormField";
import { MultiImagePicker, type MultiImageOption } from "@/components/admin/MultiImagePicker";
import { SavedNotice } from "@/components/admin/SavedNotice";

const initialState: CulturalBannerFormState = {};

export function CulturalBannerForm({
  banner,
  media,
}: {
  banner: CulturalBannerSettings;
  media: MultiImageOption[];
}) {
  const [state, formAction, isPending] = useActionState(updateCulturalBannerAction, initialState);

  return (
    <form action={formAction} className="max-w-2xl space-y-4">
      <label className="flex items-center justify-between rounded-lg border border-border bg-white px-4 py-3">
        <span>
          <span className="block text-sm font-medium text-ink">Show cultural travel banner</span>
          <span className="block text-xs text-ink-soft">
            A wide banner near the bottom of the homepage with photos that rotate automatically.
          </span>
        </span>
        <input type="checkbox" name="enabled" defaultChecked={banner.enabled} />
      </label>

      <Field label="Heading" required>
        <input name="heading" defaultValue={banner.heading} required className={inputClass} />
      </Field>
      <Field label="Subheading">
        <input name="subheading" defaultValue={banner.subheading} className={inputClass} />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Button label">
          <input name="ctaLabel" defaultValue={banner.ctaLabel} className={inputClass} />
        </Field>
        <Field label="Button link">
          <input name="ctaHref" defaultValue={banner.ctaHref} className={inputClass} />
        </Field>
      </div>
      <Field label="Rotating photos (pick a few — they cycle automatically)">
        <MultiImagePicker name="imageIds" media={media} defaultValue={banner.imageIds} />
      </Field>

      <SavedNotice state={state} />
      {state.error && <p className="text-sm text-orange">{state.error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-navy px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {isPending ? "Saving…" : "Save Banner"}
      </button>
    </form>
  );
}
