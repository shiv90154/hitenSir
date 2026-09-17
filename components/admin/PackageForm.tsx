"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import type { PackageFormState } from "@/lib/db/packages-actions";
import { slugify } from "@/lib/validation/slug";
import { Field, inputClass } from "@/components/admin/FormField";
import { ItineraryEditor } from "@/components/admin/ItineraryEditor";

type Action = (prevState: PackageFormState, formData: FormData) => Promise<PackageFormState>;

interface PackageFormProps {
  action: Action;
  submitLabel: string;
  destinations: { id: string; name: string }[];
  categories: { id: string; name: string }[];
  defaultValues?: {
    name?: string;
    slug?: string;
    shortDescription?: string | null;
    description?: string | null;
    duration?: string | null;
    priceFrom?: string | number | null;
    destinationId?: string | null;
    included?: unknown;
    excluded?: unknown;
    highlights?: unknown;
    status?: string;
    categoryIds?: string[];
    itineraries?: { dayNumber: number; title: string; description: string | null }[];
  };
}

const initialState: PackageFormState = {};

function arrayToLines(value: unknown): string {
  if (Array.isArray(value)) return value.join("\n");
  return "";
}

export function PackageForm({
  action,
  submitLabel,
  destinations,
  categories,
  defaultValues,
}: PackageFormProps) {
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
          className={inputClass}
        >
          <option value="">None</option>
          {destinations.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Short description" error={errors.shortDescription}>
        <input
          name="shortDescription"
          defaultValue={defaultValues?.shortDescription ?? ""}
          maxLength={280}
          className={inputClass}
        />
      </Field>

      <Field label="Description" error={errors.description}>
        <textarea
          name="description"
          defaultValue={defaultValues?.description ?? ""}
          rows={6}
          className={inputClass}
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Duration" error={errors.duration}>
          <input
            name="duration"
            placeholder="e.g. 5 Days / 4 Nights"
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

      {categories.length > 0 && (
        <Field label="Categories" error={errors.categoryIds}>
          <div className="mt-1 flex flex-wrap gap-3">
            {categories.map((category) => (
              <label key={category.id} className="flex items-center gap-2 text-sm text-ink">
                <input
                  type="checkbox"
                  name="categoryIds"
                  value={category.id}
                  defaultChecked={defaultValues?.categoryIds?.includes(category.id)}
                />
                {category.name}
              </label>
            ))}
          </div>
        </Field>
      )}

      <Field label="Highlights (one per line)" error={errors.highlights}>
        <textarea
          name="highlights"
          defaultValue={arrayToLines(defaultValues?.highlights)}
          rows={4}
          className={inputClass}
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Included (one per line)" error={errors.included}>
          <textarea
            name="included"
            defaultValue={arrayToLines(defaultValues?.included)}
            rows={5}
            className={inputClass}
          />
        </Field>
        <Field label="Excluded (one per line)" error={errors.excluded}>
          <textarea
            name="excluded"
            defaultValue={arrayToLines(defaultValues?.excluded)}
            rows={5}
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Day-by-day itinerary" error={errors.itineraries}>
        <ItineraryEditor
          defaultValue={defaultValues?.itineraries?.map((it) => ({
            dayNumber: it.dayNumber,
            title: it.title,
            description: it.description ?? "",
          }))}
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
