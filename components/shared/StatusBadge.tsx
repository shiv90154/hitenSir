const styles: Record<string, string> = {
  PUBLISHED: "bg-status-published-bg text-status-published-text",
  CONVERTED: "bg-status-published-bg text-status-published-text",
  DRAFT: "bg-status-draft-bg text-status-draft-text",
  NEW: "bg-status-draft-bg text-status-draft-text",
  CONTACTED: "bg-status-progress-bg text-status-progress-text",
  IN_PROGRESS: "bg-status-progress-bg text-status-progress-text",
  CLOSED: "bg-status-closed-bg text-status-closed-text",
};

export function StatusBadge({ status }: { status: string }) {
  const className = styles[status] ?? styles.CLOSED;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize ${className}`}
    >
      {status.toLowerCase().replace("_", " ")}
    </span>
  );
}
