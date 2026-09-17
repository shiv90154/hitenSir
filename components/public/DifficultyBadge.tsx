const styles: Record<string, string> = {
  EASY: "border-transparent bg-emerald-100 text-emerald-800",
  MODERATE: "border-transparent bg-amber-100 text-amber-800",
  DIFFICULT: "border-transparent bg-rose-100 text-rose-800",
};

export function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const className = styles[difficulty] ?? "border-border text-ink-soft";
  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-medium capitalize ${className}`}>
      {difficulty.toLowerCase()}
    </span>
  );
}
