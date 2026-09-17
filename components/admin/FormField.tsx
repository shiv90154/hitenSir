export const inputClass =
  "mt-1 w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-navy";

export function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-ink">
        {label} {required && <span className="text-orange">*</span>}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-1 text-xs text-orange">
          {error}
        </p>
      )}
    </div>
  );
}
