"use client";

import { useMemo, useState } from "react";

/**
 * Chip-style multi-value input with autocomplete against existing values,
 * but still free-typing for a brand-new one. Submits as a single hidden
 * comma-separated field, so it's a drop-in replacement for a plain text
 * input wherever the server already parses "a, b, c" — no action/schema
 * changes needed.
 */
export function TagInput({
  name,
  options,
  defaultValue = [],
  placeholder,
}: {
  name: string;
  options: string[];
  defaultValue?: string[];
  placeholder?: string;
}) {
  const [selected, setSelected] = useState<string[]>(defaultValue);
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);

  const suggestions = useMemo(() => {
    const query = inputValue.trim().toLowerCase();
    return options
      .filter((option) => !selected.some((s) => s.toLowerCase() === option.toLowerCase()))
      .filter((option) => !query || option.toLowerCase().includes(query))
      .slice(0, 8);
  }, [options, selected, inputValue]);

  function addValue(value: string) {
    const trimmed = value.trim();
    if (!trimmed) return;
    if (selected.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setInputValue("");
      return;
    }
    setSelected((prev) => [...prev, trimmed]);
    setInputValue("");
    setOpen(false);
  }

  function removeValue(value: string) {
    setSelected((prev) => prev.filter((s) => s !== value));
  }

  return (
    <div className="relative">
      <input type="hidden" name={name} value={selected.join(", ")} />
      <div className="flex min-h-[2.75rem] flex-wrap items-center gap-1.5 rounded-lg border border-border bg-white px-2 py-1.5 focus-within:border-navy">
        {selected.map((value) => (
          <span
            key={value}
            className="flex items-center gap-1 rounded-full bg-admin-surface px-2.5 py-1 text-xs font-medium text-ink"
          >
            {value}
            <button
              type="button"
              onClick={() => removeValue(value)}
              aria-label={`Remove ${value}`}
              className="text-ink-soft hover:text-orange"
            >
              ×
            </button>
          </span>
        ))}
        <input
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addValue(inputValue);
            }
            if (e.key === "Backspace" && inputValue === "" && selected.length > 0) {
              removeValue(selected[selected.length - 1]);
            }
          }}
          placeholder={selected.length === 0 ? placeholder : undefined}
          className="min-w-[8rem] flex-1 border-none bg-transparent px-1 py-1 text-sm outline-none"
        />
      </div>

      {open && suggestions.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full max-w-xs rounded-lg border border-border bg-white py-1 shadow-lg">
          {suggestions.map((option) => (
            <li key={option}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => addValue(option)}
                className="block w-full px-3 py-1.5 text-left text-sm text-ink hover:bg-admin-surface"
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
