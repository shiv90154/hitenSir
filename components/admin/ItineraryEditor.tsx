"use client";

import { useState } from "react";
import { inputClass } from "@/components/admin/FormField";

interface ItineraryDay {
  dayNumber: number;
  title: string;
  description: string;
}

export function ItineraryEditor({
  defaultValue = [],
}: {
  defaultValue?: ItineraryDay[];
}) {
  const [days, setDays] = useState<ItineraryDay[]>(defaultValue);

  function addDay() {
    setDays((prev) => [
      ...prev,
      { dayNumber: prev.length + 1, title: "", description: "" },
    ]);
  }

  function removeDay(index: number) {
    setDays((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((day, i) => ({ ...day, dayNumber: i + 1 }))
    );
  }

  function updateDay(index: number, patch: Partial<ItineraryDay>) {
    setDays((prev) => prev.map((day, i) => (i === index ? { ...day, ...patch } : day)));
  }

  return (
    <div className="space-y-3">
      <input type="hidden" name="itinerariesJson" value={JSON.stringify(days)} readOnly />

      {days.map((day, index) => (
        <div key={index} className="rounded-lg border border-border p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-ink">Day {day.dayNumber}</p>
            <button
              type="button"
              onClick={() => removeDay(index)}
              className="text-xs font-medium text-orange hover:underline"
            >
              Remove
            </button>
          </div>
          <input
            placeholder="Title"
            value={day.title}
            onChange={(e) => updateDay(index, { title: e.target.value })}
            className={`${inputClass} mt-2`}
          />
          <textarea
            placeholder="Description"
            value={day.description}
            onChange={(e) => updateDay(index, { description: e.target.value })}
            rows={2}
            className={`${inputClass} mt-2`}
          />
        </div>
      ))}

      <button
        type="button"
        onClick={addDay}
        className="rounded-full border border-border px-4 py-2 text-xs font-medium text-ink hover:border-navy hover:text-navy"
      >
        + Add Day
      </button>
    </div>
  );
}
