"use client";

import { useActionState, useRef } from "react";
import { uploadMediaAction, type MediaFormState } from "@/lib/db/media-actions";
import { inputClass } from "@/components/admin/FormField";

const initialState: MediaFormState = {};

export function MediaUploadForm() {
  const [state, formAction, isPending] = useActionState(uploadMediaAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await formAction(formData);
        formRef.current?.reset();
      }}
      className="relative grid grid-cols-1 gap-4 sm:grid-cols-4"
    >
      <div className="sm:col-span-2">
        <label className="block text-sm font-medium text-ink">Image file</label>
        <input
          type="file"
          name="file"
          accept="image/*"
          required
          disabled={isPending}
          className={`${inputClass} py-2 disabled:opacity-60`}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-ink">Alt text</label>
        <input name="altText" required disabled={isPending} className={`${inputClass} disabled:opacity-60`} />
      </div>
      <div>
        <label className="block text-sm font-medium text-ink">Title (optional)</label>
        <input name="title" disabled={isPending} className={`${inputClass} disabled:opacity-60`} />
      </div>
      <div className="sm:col-span-4">
        {state.error && <p className="mb-2 text-sm text-orange">{state.error}</p>}
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-full bg-navy px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {isPending && (
            <span
              aria-hidden="true"
              className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white"
            />
          )}
          {isPending ? "Uploading…" : "Upload"}
        </button>
      </div>

      {isPending && (
        <div
          role="status"
          aria-live="polite"
          className="absolute inset-0 flex items-center justify-center gap-2 rounded-lg bg-white/70 text-sm font-medium text-ink backdrop-blur-sm"
        >
          <span
            aria-hidden="true"
            className="h-4 w-4 animate-spin rounded-full border-2 border-navy/30 border-t-navy"
          />
          Uploading image — please wait…
        </div>
      )}
    </form>
  );
}
