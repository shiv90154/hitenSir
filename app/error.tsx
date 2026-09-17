"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ivory px-6 text-center">
      <p className="font-display text-sm font-semibold uppercase tracking-widest text-orange">
        Something went wrong
      </p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
        We hit a snag loading this page
      </h1>
      <p className="mt-3 max-w-md text-sm text-ink-soft">
        Please try again — if the problem keeps happening, get in touch and we&apos;ll take a look.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-orange px-6 py-3 text-sm font-semibold text-white"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-full border border-border px-6 py-3 text-sm font-semibold text-ink hover:border-navy hover:text-navy"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
