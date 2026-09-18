import Image from "next/image";

export interface MultiImageOption {
  id: string;
  url: string;
  altText: string | null;
}

export function MultiImagePicker({
  name,
  media,
  defaultValue,
}: {
  name: string;
  media: MultiImageOption[];
  defaultValue?: string[];
}) {
  if (media.length === 0) {
    return (
      <p className="mt-1 text-sm text-ink-soft">
        No media uploaded yet — add some in the Media Library first.
      </p>
    );
  }

  return (
    <div className="mt-1 grid grid-cols-3 gap-3 sm:grid-cols-4">
      {media.map((item) => (
        <label key={item.id} className="relative block cursor-pointer">
          <input
            type="checkbox"
            name={name}
            value={item.id}
            defaultChecked={defaultValue?.includes(item.id)}
            className="peer absolute right-1 top-1 z-10 h-4 w-4"
          />
          <div className="relative h-20 w-full overflow-hidden rounded-md border border-border bg-placeholder peer-checked:ring-2 peer-checked:ring-navy">
            <Image src={item.url} alt={item.altText ?? ""} fill className="object-cover" />
          </div>
        </label>
      ))}
    </div>
  );
}
