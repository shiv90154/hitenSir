"use client";

import { useActionState } from "react";
import { createTestimonialAction, type TestimonialFormState } from "@/lib/db/testimonials-actions";
import { Field, inputClass } from "@/components/admin/FormField";
import { MediaPicker, type MediaOption } from "@/components/admin/MediaPicker";

const initialState: TestimonialFormState = {};

export function TestimonialForm({ media }: { media: MediaOption[] }) {
  const [state, formAction, isPending] = useActionState(createTestimonialAction, initialState);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="max-w-2xl space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Author name" error={errors.authorName}>
          <input name="authorName" required className={inputClass} />
        </Field>
        <Field label="Location" error={errors.authorLocation}>
          <input name="authorLocation" className={inputClass} />
        </Field>
      </div>
      <Field label="Quote" error={errors.quote}>
        <textarea name="quote" rows={3} required className={inputClass} />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Rating (1-5)" error={errors.rating}>
          <input name="rating" type="number" min={1} max={5} defaultValue={5} className={inputClass} />
        </Field>
        <Field label="Sort order" error={errors.sortOrder}>
          <input name="sortOrder" type="number" defaultValue={0} className={inputClass} />
        </Field>
      </div>
      <Field label="Photo (optional — shown as a small round avatar)">
        <MediaPicker name="avatarMediaId" media={media} />
      </Field>

      {state.error && <p className="text-sm text-orange">{state.error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-navy px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {isPending ? "Saving…" : "Add Testimonial"}
      </button>
    </form>
  );
}
