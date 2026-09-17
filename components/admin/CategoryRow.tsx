"use client";

import { useActionState, useState } from "react";
import { updateCategoryAction, type CategoryFormState } from "@/lib/db/categories-actions";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { inputClass } from "@/components/admin/FormField";

export interface CategoryRowData {
  id: string;
  name: string;
  slug: string;
  appliesTo: "PACKAGE" | "BLOG" | "ACTIVITY";
}

const initialState: CategoryFormState = {};

export function CategoryRow({
  category,
  deleteAction,
}: {
  category: CategoryRowData;
  deleteAction: () => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const boundUpdate = updateCategoryAction.bind(null, category.id);
  const [state, formAction, isPending] = useActionState(boundUpdate, initialState);

  if (!editing) {
    return (
      <tr className="hover:bg-admin-surface">
        <td className="px-4 py-3 font-medium text-ink">{category.name}</td>
        <td className="px-4 py-3 capitalize text-ink-soft">{category.appliesTo.toLowerCase()}</td>
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
                confirmMessage={`Delete category "${category.name}"?`}
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
        <form action={formAction} className="grid grid-cols-1 gap-3 sm:grid-cols-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-ink-soft">Name</label>
            <input name="name" defaultValue={category.name} required className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-soft">Slug</label>
            <input name="slug" defaultValue={category.slug} required className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-soft">Applies to</label>
            <select name="appliesTo" defaultValue={category.appliesTo} className={inputClass}>
              <option value="PACKAGE">Package</option>
              <option value="ACTIVITY">Activity</option>
              <option value="BLOG">Blog</option>
            </select>
          </div>
          {state.fieldErrors?.slug && (
            <p className="text-xs text-orange sm:col-span-4">{state.fieldErrors.slug}</p>
          )}
          <div className="flex items-center gap-3 sm:col-span-4">
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
