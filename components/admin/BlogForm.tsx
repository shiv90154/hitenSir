"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import type { BlogFormState } from "@/lib/db/blogs-actions";
import { slugify } from "@/lib/validation/slug";
import { Field, inputClass } from "@/components/admin/FormField";
import { MediaPicker, type MediaOption } from "@/components/admin/MediaPicker";
import { TagInput } from "@/components/admin/TagInput";

type Action = (prevState: BlogFormState, formData: FormData) => Promise<BlogFormState>;

interface BlogFormProps {
  action: Action;
  submitLabel: string;
  postType: "ARTICLE" | "GUIDE";
  media: MediaOption[];
  cancelHref: string;
  existingCategories: string[];
  existingTags: string[];
  defaultValues?: {
    title?: string;
    slug?: string;
    excerpt?: string | null;
    body?: string | null;
    featuredImageId?: string | null;
    status?: string;
    categories?: { category: { name: string } }[];
    tags?: { tag: { name: string } }[];
  };
}

const initialState: BlogFormState = {};

export function BlogForm({
  action,
  submitLabel,
  postType,
  media,
  cancelHref,
  existingCategories,
  existingTags,
  defaultValues,
}: BlogFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [slug, setSlug] = useState(defaultValues?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(defaultValues?.slug));

  const errors = state.fieldErrors ?? {};
  const noun = postType === "GUIDE" ? "Guide" : "Post";

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <input type="hidden" name="postType" value={postType} />

      <Field label="Title" required error={errors.title}>
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

      <Field label="Excerpt" error={errors.excerpt}>
        <input
          name="excerpt"
          defaultValue={defaultValues?.excerpt ?? ""}
          maxLength={300}
          className={inputClass}
        />
      </Field>

      <Field label="Featured image" error={errors.featuredImageId}>
        <MediaPicker name="featuredImageId" media={media} defaultValue={defaultValues?.featuredImageId} />
      </Field>

      <Field label={`${noun} content`} error={errors.body}>
        <textarea
          name="body"
          defaultValue={defaultValues?.body ?? ""}
          rows={12}
          placeholder={"Supports Markdown: ## Heading, **bold**, *italic*, [link](https://...), - list item"}
          className={inputClass}
        />
        <p className="mt-1 text-xs text-ink-soft">
          Supports basic Markdown: <code>## Heading</code>, <code>**bold**</code>, <code>*italic*</code>,{" "}
          <code>[link](https://…)</code>, and <code>- list items</code>.
        </p>
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Categories" error={errors.categories}>
          <TagInput
            name="categories"
            options={existingCategories}
            defaultValue={defaultValues?.categories?.map((c) => c.category.name) ?? []}
            placeholder="Type to search or add…"
          />
        </Field>
        <Field label="Tags" error={errors.tags}>
          <TagInput
            name="tags"
            options={existingTags}
            defaultValue={defaultValues?.tags?.map((t) => t.tag.name) ?? []}
            placeholder="Type to search or add…"
          />
        </Field>
      </div>

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
        <Link href={cancelHref} className="text-sm font-medium text-ink-soft hover:text-navy">
          Cancel
        </Link>
      </div>
    </form>
  );
}
