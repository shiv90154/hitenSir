"use client";

import { useTransition } from "react";
import { updateEnquiryStatusAction } from "@/lib/db/enquiries-actions";

const statuses = ["NEW", "CONTACTED", "IN_PROGRESS", "CONVERTED", "CLOSED"] as const;

export function EnquiryStatusSelect({
  id,
  status,
}: {
  id: string;
  status: (typeof statuses)[number];
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      defaultValue={status}
      disabled={isPending}
      onChange={(e) => {
        const next = e.target.value as (typeof statuses)[number];
        startTransition(() => {
          updateEnquiryStatusAction(id, next);
        });
      }}
      className="rounded-md border border-border px-2 py-1 text-xs capitalize disabled:opacity-60"
    >
      {statuses.map((s) => (
        <option key={s} value={s}>
          {s.toLowerCase().replace("_", " ")}
        </option>
      ))}
    </select>
  );
}
