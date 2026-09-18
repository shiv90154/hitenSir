"use client";

import { useActionState } from "react";
import {
  updateHomepageSectionsAction,
  type HomepageSettingsFormState,
} from "@/lib/db/homepage-settings-actions";
import type { HomepageSections } from "@/lib/db/homepage-settings";
import { SavedNotice } from "@/components/admin/SavedNotice";

const initialState: HomepageSettingsFormState = {};

const labels: Record<keyof HomepageSections, string> = {
  showFeaturedDestinations: "Featured Destinations",
  showPackages: "Popular Travel Packages",
  showThingsToDo: "Things To Do",
  showPopularPlaces: "Popular Places",
  showBlog: "Latest Blog & Travel Guides",
  showGallery: "Photo Gallery",
  showWhyChooseUs: "Why Choose Us",
  showTestimonials: "Testimonials",
  showFaqs: "FAQs",
};

export function HomepageSectionsForm({ sections }: { sections: HomepageSections }) {
  const [state, formAction, isPending] = useActionState(updateHomepageSectionsAction, initialState);

  return (
    <form action={formAction} className="max-w-xl space-y-3">
      {(Object.keys(labels) as (keyof HomepageSections)[]).map((key) => (
        <label
          key={key}
          className="flex items-center justify-between rounded-lg border border-border bg-white px-4 py-3"
        >
          <span className="text-sm font-medium text-ink">{labels[key]}</span>
          <input type="checkbox" name={key} defaultChecked={sections[key]} />
        </label>
      ))}

      <SavedNotice state={state} />

      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-navy px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {isPending ? "Saving…" : "Save"}
      </button>
    </form>
  );
}
