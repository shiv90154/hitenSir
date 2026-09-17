"use client";

import { useActionState, useState } from "react";
import { createFaqAction, type FaqFormState } from "@/lib/db/faqs-actions";
import { Field, inputClass } from "@/components/admin/FormField";

export interface FaqContextOption {
  id: string;
  name: string;
}

export interface FaqContextOptions {
  PACKAGE: FaqContextOption[];
  DESTINATION: FaqContextOption[];
  GUIDE: FaqContextOption[];
}

const initialState: FaqFormState = {};

export function FaqForm({ contextOptions }: { contextOptions: FaqContextOptions }) {
  const [state, formAction, isPending] = useActionState(createFaqAction, initialState);
  const [context, setContext] = useState<"GLOBAL" | "PACKAGE" | "DESTINATION" | "GUIDE">("GLOBAL");
  const errors = state.fieldErrors ?? {};
  const options = context === "GLOBAL" ? [] : contextOptions[context];

  return (
    <form action={formAction} className="max-w-2xl space-y-4">
      <Field label="Question" required error={errors.question}>
        <input name="question" required className={inputClass} />
      </Field>
      <Field label="Answer" required error={errors.answer}>
        <textarea name="answer" rows={3} required className={inputClass} />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Context" error={errors.context}>
          <select
            name="context"
            value={context}
            onChange={(e) => setContext(e.target.value as typeof context)}
            className={inputClass}
          >
            <option value="GLOBAL">Global (homepage)</option>
            <option value="PACKAGE">Package</option>
            <option value="DESTINATION">Destination</option>
            <option value="GUIDE">Guide</option>
          </select>
        </Field>
        {context === "GLOBAL" ? (
          <input type="hidden" name="contextId" value="" />
        ) : (
          <Field label={`Which ${context.toLowerCase()}`} error={errors.contextId}>
            <select name="contextId" defaultValue="" className={inputClass}>
              <option value="" disabled>
                Select one…
              </option>
              {options.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </Field>
        )}
      </div>
      <Field label="Sort order" error={errors.sortOrder}>
        <input name="sortOrder" type="number" defaultValue={0} className={inputClass} />
      </Field>

      {state.error && <p className="text-sm text-orange">{state.error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-navy px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {isPending ? "Saving…" : "Add FAQ"}
      </button>
    </form>
  );
}
