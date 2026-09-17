"use client";

import { useActionState } from "react";
import { createNavigationItemAction, type NavigationFormState } from "@/lib/db/navigation-actions";
import { Field, inputClass } from "@/components/admin/FormField";

const initialState: NavigationFormState = {};

export function NavigationItemForm({
  parentOptions,
}: {
  parentOptions: { id: string; label: string }[];
}) {
  const [state, formAction, isPending] = useActionState(createNavigationItemAction, initialState);

  return (
    <form action={formAction} className="grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-5">
      <div className="sm:col-span-1">
        <Field label="Label">
          <input name="label" required className={inputClass} />
        </Field>
      </div>
      <div className="sm:col-span-1">
        <Field label="URL">
          <input name="url" placeholder="/destinations" required className={inputClass} />
        </Field>
      </div>
      <div className="sm:col-span-1">
        <Field label="Parent">
          <select name="parentId" defaultValue="" className={inputClass}>
            <option value="">None (top level)</option>
            {parentOptions.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <div className="sm:col-span-1">
        <Field label="Sort order">
          <input name="sortOrder" type="number" defaultValue={0} className={inputClass} />
        </Field>
      </div>
      <div className="flex items-end sm:col-span-1">
        {state.error && <p className="mb-2 text-xs text-orange">{state.error}</p>}
        <button
          type="submit"
          disabled={isPending}
          className="h-fit rounded-full bg-navy px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {isPending ? "Saving…" : "Add"}
        </button>
      </div>
    </form>
  );
}
