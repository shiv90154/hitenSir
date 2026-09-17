"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import type { ActivityFormState } from "@/lib/db/activities-actions";
import { slugify } from "@/lib/validation/slug";
import { Field, inputClass } from "@/components/admin/FormField";

type Action = (prevState: ActivityFormState, formData: FormData) => Promise<ActivityFormState>;

interface ActivityFormProps {
  action: Action;
  submitLabel: string;
  destinations: { id: string; name: string }[];
  defaultValues?: {
    name?: string;
    slug?: string;
    description?: string | null;
    destinationId?: string;
    duration?: string | null;
    priceFrom?: string | number | null;
    difficulty?: string | null;
    bestSeason?: string | null;
    safetyInfo?: string | null;
    status?: string;
  };
}

const initialState: ActivityFormState = {};

export function ActivityForm({
  action,
  submitLabel,
  destinations,
  defaultValues,
}: ActivityFormProps) {
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

      <div className="grid grid-cols-2 gap-4">
        <Field label="Duration" error={errors.duration}>
          <input
            name="duration"
            placeholder="e.g. 3 hours"
            defaultValue={defaultValues?.duration ?? ""}
            className={inputClass}
          />
        </Field>
        <Field label="Price from (₹)" error={errors.priceFrom}>
          <input
            name="priceFrom"
            type="number"
            min="0"
            step="1"
            defaultValue={defaultValues?.priceFrom?.toString() ?? ""}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Difficulty" error={errors.difficulty}>
          <select
            name="difficulty"
            defaultValue={defaultValues?.difficulty ?? ""}
            className={inputClass}
          >
            <option value="">Not set</option>
            <option value="EASY">Easy</option>
            <option value="MODERATE">Moderate</option>
            <option value="DIFFICULT">Difficult</option>
          </select>
        </Field>
        <Field label="Best season" error={errors.bestSeason}>
          <input
            name="bestSeason"
            defaultValue={defaultValues?.bestSeason ?? ""}
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Safety info" error={errors.safetyInfo}>
        <textarea
          name="safetyInfo"
          defaultValue={defaultValues?.safetyInfo ?? ""}
          rows={3}
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
