"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { createEnquiryAction, type EnquiryFormState } from "@/lib/db/enquiries-actions";

const initialState: EnquiryFormState = {};

const inputClass =
  "mt-1 w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm outline-none focus:border-navy";

const todayIso = () => new Date().toISOString().split("T")[0];

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(createEnquiryAction, initialState);
  const errors = state.fieldErrors ?? {};
  const searchParams = useSearchParams();

  const destinationId = searchParams.get("destinationId");
  const destinationName = searchParams.get("destinationName");
  const packageId = searchParams.get("packageId");
  const packageName = searchParams.get("packageName");
  // Activities have no dedicated foreign key on Enquiry, so there's no hidden
  // id field for them — just carry the name through into the message.
  const activityName = searchParams.get("activityName");
  const enquiringAbout = packageName ?? destinationName ?? activityName;
  const prefilledTravelDate = searchParams.get("travelDate");
  const prefilledPeopleCount = searchParams.get("peopleCount");

  if (state.success) {
    return (
      <div className="rounded-xl border border-border bg-white p-8 text-center">
        <p className="font-display text-xl font-semibold text-ink">Thanks — we&apos;ve got it!</p>
        <p className="mt-2 text-sm text-ink-soft">
          Our team will get back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="relative space-y-4">
      {/* Honeypot — hidden from real visitors via CSS, not display:none, so
          it still receives bot autofill. `relative` on the form above scopes
          this absolute positioning so it can't affect page-level scroll. */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      {enquiringAbout && (
        <div className="flex items-center gap-2 rounded-lg border border-border bg-admin-surface px-3 py-2 text-sm text-ink">
          <span className="text-ink-soft">Enquiring about:</span>
          <span className="font-medium">{enquiringAbout}</span>
          {destinationId && <input type="hidden" name="destinationId" value={destinationId} />}
          {packageId && <input type="hidden" name="packageId" value={packageId} />}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-ink">
            Name <span className="text-orange">*</span>
          </label>
          <input name="name" required className={inputClass} />
          {errors.name && (
            <p role="alert" className="mt-1 text-xs text-orange">
              {errors.name}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-ink">
            Email <span className="text-orange">*</span>
          </label>
          <input name="email" type="email" required className={inputClass} />
          {errors.email && (
            <p role="alert" className="mt-1 text-xs text-orange">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-ink">Phone</label>
          <input name="phone" type="tel" inputMode="tel" autoComplete="tel" className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink">Travel date</label>
          <input
            name="travelDate"
            type="date"
            min={todayIso()}
            defaultValue={prefilledTravelDate ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-ink">Number of travellers</label>
        <input
          name="peopleCount"
          type="number"
          min={1}
          defaultValue={prefilledPeopleCount ?? ""}
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-ink">Message</label>
        <textarea
          name="message"
          rows={4}
          defaultValue={!destinationId && !packageId && activityName ? `Interested in: ${activityName}\n` : ""}
          className={inputClass}
        />
      </div>

      {state.error && (
        <p role="alert" className="text-sm text-orange">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-orange px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {isPending ? "Sending…" : "Send Enquiry"}
      </button>
    </form>
  );
}
