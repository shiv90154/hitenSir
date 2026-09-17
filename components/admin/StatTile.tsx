import Link from "next/link";

export function StatTile({
  label,
  value,
  href,
}: {
  label: string;
  value: number;
  href?: string;
}) {
  const content = (
    <>
      <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">{label}</p>
      <p className="mt-2 font-display text-3xl font-semibold text-ink">{value}</p>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block rounded-lg border border-border bg-white p-5 transition-colors hover:border-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2"
      >
        {content}
      </Link>
    );
  }

  return <div className="rounded-lg border border-border bg-white p-5">{content}</div>;
}
