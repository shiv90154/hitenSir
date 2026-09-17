"use client";

import { useActionState, useState } from "react";
import { updateNavigationItemAction, type NavigationFormState } from "@/lib/db/navigation-actions";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { inputClass } from "@/components/admin/FormField";

export interface NavigationItemRowData {
  id: string;
  label: string;
  url: string;
  parentId: string | null;
  parentLabel: string | null;
  sortOrder: number;
}

const initialState: NavigationFormState = {};

export function NavigationItemRow({
  item,
  parentOptions,
  deleteAction,
}: {
  item: NavigationItemRowData;
  parentOptions: { id: string; label: string }[];
  deleteAction: () => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const boundUpdate = updateNavigationItemAction.bind(null, item.id);
  const [state, formAction, isPending] = useActionState(boundUpdate, initialState);

  if (!editing) {
    return (
      <tr className="hover:bg-admin-surface">
        <td className="px-4 py-3 font-medium text-ink">{item.label}</td>
        <td className="px-4 py-3 text-ink-soft">{item.url}</td>
        <td className="px-4 py-3 text-ink-soft">{item.parentLabel ?? "—"}</td>
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
                confirmMessage={`Delete "${item.label}"?`}
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
      <td colSpan={4} className="px-4 py-4">
        <form action={formAction} className="grid grid-cols-1 gap-3 sm:grid-cols-5">
          <div>
            <label className="block text-xs font-medium text-ink-soft">Label</label>
            <input name="label" defaultValue={item.label} required className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-soft">URL</label>
            <input name="url" defaultValue={item.url} required className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-soft">Parent</label>
            <select name="parentId" defaultValue={item.parentId ?? ""} className={inputClass}>
              <option value="">None (top level)</option>
              {parentOptions
                .filter((p) => p.id !== item.id)
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-soft">Sort order</label>
            <input name="sortOrder" type="number" defaultValue={item.sortOrder} className={inputClass} />
          </div>
          <div className="flex items-end gap-3">
            <button
              type="submit"
              disabled={isPending}
              className="rounded-full bg-navy px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
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
          {state.error && <p className="text-xs text-orange sm:col-span-5">{state.error}</p>}
        </form>
      </td>
    </tr>
  );
}
