// Text wordmark styled after the BharatTrip logo: the site name in navy
// (or white on dark backgrounds), with a trailing "Trip" picked out in
// italic orange (falls back to plain text if the name doesn't end in "Trip").
export function Logo({
  siteName,
  variant = "dark",
  className = "",
}: {
  siteName: string;
  variant?: "dark" | "light";
  className?: string;
}) {
  const leadColor = variant === "light" ? "text-white" : "text-navy";
  const match = siteName.match(/^(.*?)(Trip)$/i);

  if (!match) {
    return <span className={`font-display font-semibold ${leadColor} ${className}`}>{siteName}</span>;
  }

  const [, lead, trip] = match;

  return (
    <span className={`font-display font-semibold ${className}`}>
      <span className={leadColor}>{lead}</span>
      <span className="text-orange italic">{trip}</span>
    </span>
  );
}
