"use client";

import { useActionState } from "react";
import { updateSiteSettingsAction, type SettingsFormState } from "@/lib/db/settings-actions";
import type { SiteSettings } from "@/lib/db/settings";
import { Field, inputClass } from "@/components/admin/FormField";
import { SavedNotice } from "@/components/admin/SavedNotice";

const initialState: SettingsFormState = {};

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, formAction, isPending] = useActionState(updateSiteSettingsAction, initialState);

  return (
    <form action={formAction} className="max-w-2xl space-y-8">
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-soft">
          Site Settings
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Site name">
            <input name="siteName" defaultValue={settings.siteName} className={inputClass} />
          </Field>
          <Field label="Tagline">
            <input name="tagline" defaultValue={settings.tagline} className={inputClass} />
          </Field>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-soft">
          Contact Info
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Contact email">
            <input name="contactEmail" type="email" defaultValue={settings.contactEmail} className={inputClass} />
          </Field>
          <Field label="Contact phone (used for WhatsApp, include country code)">
            <input name="contactPhone" defaultValue={settings.contactPhone} className={inputClass} />
          </Field>
          <Field label="Second phone (optional)">
            <input name="contactPhone2" defaultValue={settings.contactPhone2} className={inputClass} />
          </Field>
        </div>
        <Field label="Address">
          <input name="address" defaultValue={settings.address} className={inputClass} />
        </Field>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-soft">
          Social Links
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Facebook">
            <input name="socialFacebook" defaultValue={settings.socialFacebook} className={inputClass} />
          </Field>
          <Field label="Instagram">
            <input name="socialInstagram" defaultValue={settings.socialInstagram} className={inputClass} />
          </Field>
          <Field label="Twitter / X">
            <input name="socialTwitter" defaultValue={settings.socialTwitter} className={inputClass} />
          </Field>
          <Field label="YouTube">
            <input name="socialYoutube" defaultValue={settings.socialYoutube} className={inputClass} />
          </Field>
        </div>
      </section>

      <SavedNotice state={state} />
      {state.error && <p className="text-sm text-orange">{state.error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-navy px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {isPending ? "Saving…" : "Save Settings"}
      </button>
    </form>
  );
}
