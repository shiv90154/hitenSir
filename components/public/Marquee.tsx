const DURATIONS: Record<"slow" | "normal" | "fast", string> = {
  slow: "60s",
  normal: "35s",
  fast: "18s",
};

export function Marquee({
  items,
  speed = "normal",
}: {
  items: string[];
  speed?: "slow" | "normal" | "fast";
}) {
  if (items.length === 0) return null;

  const track = (
    <>
      {items.map((item, index) => (
        <span key={index} className="mx-6 inline-flex items-center gap-6 text-sm font-medium text-white/90">
          {item}
          <span className="text-orange">●</span>
        </span>
      ))}
    </>
  );

  return (
    <div className="overflow-hidden border-y border-white/10 bg-navy py-3">
      {/* Decorative, continuously-animating duplicate — hidden from assistive
          tech; the real content is announced once via the sr-only list below. */}
      <div
        aria-hidden="true"
        className="animate-marquee flex w-max whitespace-nowrap"
        style={{ animationDuration: DURATIONS[speed] }}
      >
        <div className="flex shrink-0">{track}</div>
        <div className="flex shrink-0">{track}</div>
      </div>
      <p className="sr-only">{items.join(". ")}</p>
    </div>
  );
}
