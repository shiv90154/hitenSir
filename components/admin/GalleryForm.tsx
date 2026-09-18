"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import type { GalleryFormState } from "@/lib/db/galleries-actions";
import { slugify } from "@/lib/validation/slug";
import { Field, inputClass } from "@/components/admin/FormField";
import { MultiImagePicker } from "@/components/admin/MultiImagePicker";

type Action = (prevState: GalleryFormState, formData: FormData) => Promise<GalleryFormState>;

interface MediaOption {
  id: string;
  url: string;
  altText: string | null;
}

interface GalleryFormProps {
  action: Action;
  submitLabel: string;
  media: MediaOption[];
  defaultValues?: {
    title?: string;
    slug?: string;
    description?: string | null;
    mediaIds?: string[];
  };
}

const initialState: GalleryFormState = {};

export function GalleryForm({ action, submitLabel, media, defaultValues }: GalleryFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [slug, setSlug] = useState(defaultValues?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(defaultValues?.slug));
  const router = useRouter();

  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <Field label="Title" error={errors.title}>
        <input
          name="title"
          defaultValue={defaultValues?.title}
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

      <Field label="Description" error={errors.description}>
        <textarea
          name="description"
          defaultValue={defaultValues?.description ?? ""}
          rows={3}
          className={inputClass}
        />
      </Field>

      <Field label="Images" error={errors.mediaIds}>
        <MultiImagePicker name="mediaIds" media={media} defaultValue={defaultValues?.mediaIds} />
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
