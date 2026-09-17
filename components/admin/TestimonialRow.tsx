"use client";

import { useActionState, useState } from "react";
import { updateTestimonialAction, type TestimonialFormState } from "@/lib/db/testimonials-actions";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { inputClass } from "@/components/admin/FormField";

export interface TestimonialRowData {
  id: string;
  authorName: string;
  authorLocation: string | null;
  quote: string;
  rating: number;
  sortOrder: number;
}

const initialState: TestimonialFormState = {};

export function TestimonialRow({
  testimonial,
  deleteAction,
}: {
  testimonial: TestimonialRowData;
  deleteAction: () => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const boundUpdate = updateTestimonialAction.bind(null, testimonial.id);
  const [state, formAction, isPending] = useActionState(boundUpdate, initialState);

  if (!editing) {
    return (
      <tr className="hover:bg-admin-surface">
        <td className="px-4 py-3 font-medium text-ink">{testimonial.authorName}</td>
        <td className="max-w-md truncate px-4 py-3 text-ink-soft">{testimonial.quote}</td>
        <td className="px-4 py-3 text-right">
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="text-xs font-medium text-navy hover:underline"
            >
              Edit
            </button>
            <form action={deleteAction}>
              <ConfirmSubmitButton
                confirmMessage="Delete this testimonial?"
                className="text-xs font-medium text-orange hover:underline"
              >
                Delete
              </ConfirmSubmitButton>
            </form>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className="bg-admin-surface">
      <td colSpan={3} className="px-4 py-4">
        <form action={formAction} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-ink-soft">Author name</label>
              <input name="authorName" defaultValue={testimonial.authorName} required className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-soft">Location</label>
              <input
                name="authorLocation"
                defaultValue={testimonial.authorLocation ?? ""}
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-soft">Quote</label>
            <textarea name="quote" defaultValue={testimonial.quote} rows={2} required className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-ink-soft">Rating (1-5)</label>
              <input
                name="rating"
                type="number"
                min={1}
                max={5}
                defaultValue={testimonial.rating}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-soft">Sort order</label>
              <input name="sortOrder" type="number" defaultValue={testimonial.sortOrder} className={inputClass} />
            </div>
          </div>
          {state.error && <p className="text-sm text-orange">{state.error}</p>}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isPending}
              className="rounded-full bg-navy px-4 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
            >
              {isPending ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="text-xs font-medium text-ink-soft hover:text-navy"
            >
              Cancel
            </button>
          </div>
        </form>
      </td>
    </tr>
  );
}
