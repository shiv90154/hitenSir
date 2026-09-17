"use client";

import { useActionState, useState } from "react";
import { updateFaqAction, type FaqFormState } from "@/lib/db/faqs-actions";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { inputClass } from "@/components/admin/FormField";
import type { FaqContextOptions } from "@/components/admin/FaqForm";

export interface FaqRowData {
  id: string;
  question: string;
  answer: string;
  context: "GLOBAL" | "PACKAGE" | "DESTINATION" | "GUIDE";
  contextId: string | null;
  sortOrder: number;
}

const initialState: FaqFormState = {};

export function FaqRow({
  faq,
  contextOptions,
  deleteAction,
}: {
  faq: FaqRowData;
  contextOptions: FaqContextOptions;
  deleteAction: () => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const boundUpdate = updateFaqAction.bind(null, faq.id);
  const [state, formAction, isPending] = useActionState(boundUpdate, initialState);
  const [context, setContext] = useState(faq.context);
  const options = context === "GLOBAL" ? [] : contextOptions[context];

  if (!editing) {
    return (
      <tr className="hover:bg-admin-surface">
        <td className="px-4 py-3 font-medium text-ink">{faq.question}</td>
        <td className="px-4 py-3 capitalize text-ink-soft">{faq.context.toLowerCase()}</td>
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
                confirmMessage="Delete this FAQ?"
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
          <div>
            <label className="block text-xs font-medium text-ink-soft">Question</label>
            <input name="question" defaultValue={faq.question} required className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-soft">Answer</label>
            <textarea name="answer" defaultValue={faq.answer} rows={2} required className={inputClass} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-ink-soft">Context</label>
              <select
                name="context"
                value={context}
                onChange={(e) => setContext(e.target.value as typeof context)}
                className={inputClass}
              >
                <option value="GLOBAL">Global</option>
                <option value="PACKAGE">Package</option>
                <option value="DESTINATION">Destination</option>
                <option value="GUIDE">Guide</option>
              </select>
            </div>
            {context !== "GLOBAL" && (
              <div>
                <label className="block text-xs font-medium text-ink-soft">Which {context.toLowerCase()}</label>
                <select name="contextId" defaultValue={faq.contextId ?? ""} className={inputClass}>
                  <option value="" disabled>
                    Select one…
                  </option>
                  {options.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="block text-xs font-medium text-ink-soft">Sort order</label>
              <input name="sortOrder" type="number" defaultValue={faq.sortOrder} className={inputClass} />
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
