"use client";

import { useEffect, useRef, useState } from "react";

export function ConfirmSubmitButton({
  children,
  confirmMessage,
  className,
}: {
  children: React.ReactNode;
  confirmMessage: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    confirmButtonRef.current?.focus();
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        className={className}
        onClick={(e) => {
          formRef.current = e.currentTarget.form;
          setOpen(true);
        }}
      >
        {children}
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-xl border border-border bg-white p-5 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <p id="confirm-dialog-title" className="text-sm font-medium text-ink">
              {confirmMessage}
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full px-4 py-2 text-sm font-medium text-ink-soft hover:text-navy"
              >
                Cancel
              </button>
              <button
                ref={confirmButtonRef}
                type="button"
                onClick={() => {
                  setOpen(false);
                  formRef.current?.requestSubmit();
                }}
                className="rounded-full bg-orange px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
