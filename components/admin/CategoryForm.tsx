"use client";

import { useActionState, useState } from "react";
import { createCategoryAction, type CategoryFormState } from "@/lib/db/categories-actions";
import { slugify } from "@/lib/validation/slug";
import { Field, inputClass } from "@/components/admin/FormField";

const initialState: CategoryFormState = {};

export function CategoryForm() {
  const [state, formAction, isPending] = useActionState(createCategoryAction, initialState);
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-4">
      <div className="sm:col-span-2">
        <Field label="Name" error={errors.name}>
          <input
            name="name"
            onChange={(e) => {
              if (!slugTouched) setSlug(slugify(e.target.value));
            }}
            required
            className={inputClass}
          />
        </Field>
      </div>
      <div>
        <Field label="Slug" error={errors.slug}>
          <input
            name="slug"
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
            required
            className={inputClass}
          />
        </Field>
      </div>
      <div>
        <Field label="Applies to" error={errors.appliesTo}>
          <select name="appliesTo" defaultValue="PACKAGE" className={inputClass}>
            <option value="PACKAGE">Package</option>
            <option value="ACTIVITY">Activity</option>
            <option value="BLOG">Blog</option>
          </select>
        </Field>
      </div>
      <div className="sm:col-span-4">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-navy px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {isPending ? "Saving…" : "Add Category"}
        </button>
      </div>
    </form>
  );
}
