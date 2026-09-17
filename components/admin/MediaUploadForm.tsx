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
      className="grid grid-cols-1 gap-4 sm:grid-cols-4"
    >
      <div className="sm:col-span-2">
        <label className="block text-sm font-medium text-ink">Image file</label>
        <input type="file" name="file" accept="image/*" required className={`${inputClass} py-2`} />
      </div>
      <div>
        <label className="block text-sm font-medium text-ink">Alt text</label>
        <input name="altText" required className={inputClass} />
      </div>
      <div>
        <label className="block text-sm font-medium text-ink">Title (optional)</label>
        <input name="title" className={inputClass} />
      </div>
      <div className="sm:col-span-4">
        {state.error && <p className="mb-2 text-sm text-orange">{state.error}</p>}
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-navy px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {isPending ? "Uploading…" : "Upload"}
        </button>
      </div>
    </form>
  );
}
