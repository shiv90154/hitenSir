import Link from "next/link";

export default function AdminNotFound() {
  return (
    <div className="flex flex-col items-center py-24 text-center">
      <p className="font-display text-sm font-semibold uppercase tracking-widest text-orange">404</p>
      <h1 className="mt-3 font-display text-2xl font-semibold text-ink">Page not found</h1>
      <p className="mt-2 text-sm text-ink-soft">
        That admin page doesn&apos;t exist or may have been moved.
      </p>
      <Link
        href="/admin"
        className="mt-6 rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
