"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import type { PlaceFormState } from "@/lib/db/places-actions";
import { slugify } from "@/lib/validation/slug";
import { Field, inputClass } from "@/components/admin/FormField";

type Action = (prevState: PlaceFormState, formData: FormData) => Promise<PlaceFormState>;

interface PlaceFormProps {
  action: Action;
  submitLabel: string;
  destinations: { id: string; name: string }[];
  defaultValues?: {
    name?: string;
    slug?: string;
    description?: string | null;
    destinationId?: string;
    bestTimeToVisit?: string | null;
    status?: string;
  };
}

const initialState: PlaceFormState = {};

export function PlaceForm({ action, submitLabel, destinations, defaultValues }: PlaceFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [slug, setSlug] = useState(defaultValues?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(defaultValues?.slug));
  const router = useRouter();

  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <Field label="Name" error={errors.name}>
        <input
          name="name"
          defaultValue={defaultValues?.name}
          onChange={(e) => {
            if (!slugTouched) setSlug(slugify(e.target.value));
          }}
          required
          className={inputClass}
        />
      </Field>

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

      <Field label="Destination" error={errors.destinationId}>
        <select
          name="destinationId"
          defaultValue={defaultValues?.destinationId ?? ""}
          required
          className={inputClass}
        >
          <option value="" disabled>
            Choose a destination
          </option>
          {destinations.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Description" error={errors.description}>
        <textarea
          name="description"
          defaultValue={defaultValues?.description ?? ""}
          rows={5}
          className={inputClass}
        />
      </Field>

      <Field label="Best time to visit" error={errors.bestTimeToVisit}>
        <input
          name="bestTimeToVisit"
          defaultValue={defaultValues?.bestTimeToVisit ?? ""}
          className={inputClass}
        />
      </Field>

      <Field label="Status" error={errors.status}>
        <select name="status" defaultValue={defaultValues?.status ?? "DRAFT"} className={inputClass}>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </select>
      </Field>

      {state.error && <p className="text-sm text-orange">{state.error}</p>}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-navy px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {isPending ? "Saving…" : submitLabel}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm font-medium text-ink-soft hover:text-navy"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
