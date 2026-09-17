"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import type { DestinationFormState } from "@/lib/db/destinations-actions";
import { slugify } from "@/lib/validation/slug";
import { Field, inputClass } from "@/components/admin/FormField";
import { MediaPicker, type MediaOption } from "@/components/admin/MediaPicker";

type Action = (
  prevState: DestinationFormState,
  formData: FormData
) => Promise<DestinationFormState>;

interface DestinationFormProps {
  action: Action;
  submitLabel: string;
  media: MediaOption[];
  otherDestinations?: { id: string; name: string }[];
  defaultValues?: {
    name?: string;
    slug?: string;
    shortDescription?: string | null;
    description?: string | null;
    coverImageId?: string | null;
    state?: string | null;
    bestTimeToVisit?: string | null;
    howToReach?: string | null;
    travelTips?: string | null;
    status?: string;
    nearbyDestinationIds?: string[];
  };
}

const initialState: DestinationFormState = {};

export function DestinationForm({
  action,
  submitLabel,
  media,
  otherDestinations = [],
  defaultValues,
}: DestinationFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [slug, setSlug] = useState(defaultValues?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(defaultValues?.slug));
  const router = useRouter();

  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <Field label="Name" required error={errors.name}>
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

      <Field label="Slug" required error={errors.slug}>
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

      <Field label="Cover image" error={errors.coverImageId}>
        <MediaPicker name="coverImageId" media={media} defaultValue={defaultValues?.coverImageId} />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="State" error={errors.state}>
          <input name="state" defaultValue={defaultValues?.state ?? ""} className={inputClass} />
        </Field>
        <Field label="Best time to visit" error={errors.bestTimeToVisit}>
          <input
            name="bestTimeToVisit"
            defaultValue={defaultValues?.bestTimeToVisit ?? ""}
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="How to reach" error={errors.howToReach}>
        <textarea
          name="howToReach"
          defaultValue={defaultValues?.howToReach ?? ""}
          rows={3}
          className={inputClass}
        />
      </Field>

      <Field label="Travel tips" error={errors.travelTips}>
        <textarea
          name="travelTips"
          defaultValue={defaultValues?.travelTips ?? ""}
          rows={3}
          className={inputClass}
        />
      </Field>

      {otherDestinations.length > 0 && (
        <Field label="Nearby destinations">
          <div className="mt-1 flex flex-wrap gap-3">
            {otherDestinations.map((d) => (
              <label key={d.id} className="flex items-center gap-2 text-sm text-ink">
                <input
                  type="checkbox"
                  name="nearbyDestinationIds"
                  value={d.id}
                  defaultChecked={defaultValues?.nearbyDestinationIds?.includes(d.id)}
                />
                {d.name}
              </label>
            ))}
          </div>
        </Field>
      )}

      <Field label="Status" error={errors.status}>
        <select
          name="status"
          defaultValue={defaultValues?.status ?? "DRAFT"}
          className={inputClass}
        >
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
