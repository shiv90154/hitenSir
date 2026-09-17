export default function AdminLoading() {
  return (
    <div className="flex items-center justify-center gap-3 py-24 text-sm text-ink-soft">
      <span
        aria-hidden="true"
        className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-navy"
      />
      Loading…
    </div>
  );
}
