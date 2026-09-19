import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactForm } from "@/components/public/ContactForm";
import { getSiteSettings } from "@/lib/db/settings";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch to plan your trip to Himachal Pradesh.",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const hasDirectContact = settings.contactEmail || settings.contactPhone || settings.contactPhone2 || settings.address;

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 lg:px-16">
      <h1 className="font-display text-4xl font-semibold text-ink">Plan Your Trip</h1>
      <p className="mt-2 text-sm text-ink-soft">
        Tell us what you have in mind and our team will get back to you.
      </p>

      {hasDirectContact && (
        <div className="mt-6 rounded-xl border border-border bg-white p-5 text-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
            Prefer to talk?
          </p>
          <dl className="mt-2 space-y-1 text-ink">
            {settings.contactPhone && (
              <div className="flex gap-2">
                <dt className="text-ink-soft">Phone:</dt>
                <dd>
                  <a href={`tel:${settings.contactPhone}`} className="hover:underline">
                    {settings.contactPhone}
                  </a>
                </dd>
              </div>
            )}
            {settings.contactPhone2 && (
              <div className="flex gap-2">
                <dt className="text-ink-soft">Phone:</dt>
                <dd>
                  <a href={`tel:${settings.contactPhone2}`} className="hover:underline">
                    {settings.contactPhone2}
                  </a>
                </dd>
              </div>
            )}
            {settings.contactEmail && (
              <div className="flex gap-2">
                <dt className="text-ink-soft">Email:</dt>
                <dd>
                  <a href={`mailto:${settings.contactEmail}`} className="hover:underline">
                    {settings.contactEmail}
                  </a>
                </dd>
              </div>
            )}
            {settings.address && (
              <div className="flex gap-2">
                <dt className="text-ink-soft">Address:</dt>
                <dd>{settings.address}</dd>
              </div>
            )}
          </dl>
        </div>
      )}

      <div className="mt-8">
        <Suspense fallback={null}>
          <ContactForm />
        </Suspense>
      </div>
    </div>
  );
}
