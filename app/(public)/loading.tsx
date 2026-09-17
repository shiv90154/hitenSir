export default function PublicLoading() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-24 lg:px-16">
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <span
          aria-hidden="true"
          className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-navy"
        />
        <p className="text-sm text-ink-soft">Loading…</p>
      </div>
    </div>
  );
}
