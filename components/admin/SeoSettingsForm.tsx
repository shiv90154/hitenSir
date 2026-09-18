"use client";

import { useActionState } from "react";
import { updateSeoDefaultsAction, type SeoSettingsFormState } from "@/lib/db/seo-settings-actions";
import type { SeoDefaults } from "@/lib/db/seo-settings";
import { Field, inputClass } from "@/components/admin/FormField";
import { SavedNotice } from "@/components/admin/SavedNotice";

const initialState: SeoSettingsFormState = {};

export function SeoSettingsForm({ seo }: { seo: SeoDefaults }) {
  const [state, formAction, isPending] = useActionState(updateSeoDefaultsAction, initialState);

  return (
    <form action={formAction} className="max-w-2xl space-y-4">
      <Field label="Default title suffix">
        <input
          name="defaultTitleSuffix"
          defaultValue={seo.defaultTitleSuffix}
          className={inputClass}
        />
      </Field>
      <Field label="Default meta description">
        <textarea
          name="defaultDescription"
          defaultValue={seo.defaultDescription}
          rows={3}
          className={inputClass}
        />
      </Field>

      <SavedNotice state={state} />

      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-navy px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {isPending ? "Saving…" : "Save"}
      </button>
    </form>
  );
}
