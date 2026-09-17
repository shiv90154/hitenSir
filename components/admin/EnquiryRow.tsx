"use client";

import { useState, useTransition } from "react";
import { updateEnquiryNotesAction } from "@/lib/db/enquiries-actions";
import { EnquiryStatusSelect } from "@/components/admin/EnquiryStatusSelect";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";

export interface EnquiryRowData {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  interestedIn: string;
  travelDate: Date | null;
  peopleCount: number | null;
  message: string | null;
  adminNotes: string | null;
  receivedAt: Date;
  status: "NEW" | "CONTACTED" | "IN_PROGRESS" | "CONVERTED" | "CLOSED";
}

export function EnquiryRow({
  enquiry,
  deleteAction,
}: {
  enquiry: EnquiryRowData;
  deleteAction: () => Promise<void>;
}) {
  const [expanded, setExpanded] = useState(false);
  const [notes, setNotes] = useState(enquiry.adminNotes ?? "");
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function saveNotes() {
    startTransition(async () => {
      await updateEnquiryNotesAction(enquiry.id, notes);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  return (
    <>
      <tr className="hover:bg-admin-surface">
        <td className="px-4 py-3">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="flex items-start gap-2 text-left"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className={`mt-1 h-3.5 w-3.5 shrink-0 text-ink-soft transition-transform ${expanded ? "rotate-90" : ""}`}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
            </svg>
            <span>
              <span className="block font-medium text-ink">{enquiry.name}</span>
              <span className="block text-xs text-ink-soft">{enquiry.email}</span>
              {enquiry.phone && <span className="block text-xs text-ink-soft">{enquiry.phone}</span>}
            </span>
          </button>
        </td>
        <td className="px-4 py-3 text-ink-soft">{enquiry.interestedIn}</td>
        <td className="px-4 py-3 text-ink-soft">
          {enquiry.receivedAt.toLocaleDateString("en-IN", { dateStyle: "medium" })}
        </td>
        <td className="px-4 py-3">
          <EnquiryStatusSelect id={enquiry.id} status={enquiry.status} />
        </td>
        <td className="px-4 py-3 text-right">
          <form action={deleteAction}>
            <ConfirmSubmitButton
              confirmMessage="Delete this enquiry?"
              className="text-xs font-medium text-orange hover:underline"
            >
              Delete
            </ConfirmSubmitButton>
          </form>
        </td>
      </tr>
      {expanded && (
        <tr className="bg-admin-surface">
          <td colSpan={5} className="px-4 py-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 text-sm">
                {enquiry.travelDate && (
                  <p>
                    <span className="text-ink-soft">Travel date: </span>
                    {enquiry.travelDate.toLocaleDateString("en-IN", { dateStyle: "medium" })}
                  </p>
                )}
                {enquiry.peopleCount && (
                  <p>
                    <span className="text-ink-soft">Travellers: </span>
                    {enquiry.peopleCount}
                  </p>
                )}
                <div>
                  <p className="text-ink-soft">Message:</p>
                  <p className="mt-1 whitespace-pre-line rounded-lg border border-border bg-white p-3 text-ink">
                    {enquiry.message || "No message provided."}
                  </p>
                </div>
              </div>
              <div>
                <label htmlFor={`notes-${enquiry.id}`} className="text-sm text-ink-soft">
                  Admin notes
                </label>
                <textarea
                  id={`notes-${enquiry.id}`}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-navy"
                />
                <div className="mt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={saveNotes}
                    disabled={isPending}
                    className="rounded-full bg-navy px-4 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
                  >
                    {isPending ? "Saving…" : "Save notes"}
                  </button>
                  {saved && <span className="text-xs text-navy">Saved.</span>}
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
