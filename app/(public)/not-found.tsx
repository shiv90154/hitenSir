import Link from "next/link";

export default function PublicNotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-24 text-center lg:px-16">
      <p className="font-display text-sm font-semibold uppercase tracking-widest text-orange">404</p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
        We couldn&apos;t find that page
      </h1>
      <p className="mt-3 text-sm text-ink-soft">
        The page you&apos;re looking for may have moved or no longer exists.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className="rounded-full bg-orange px-6 py-3 text-sm font-semibold text-white">
          Back to homepage
        </Link>
        <Link
          href="/destinations"
          className="rounded-full border border-border px-6 py-3 text-sm font-semibold text-ink hover:border-navy hover:text-navy"
        >
          Browse destinations
        </Link>
      </div>
    </div>
  );
}
