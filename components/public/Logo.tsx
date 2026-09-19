import Image from "next/image";

// BharatTrip logo image. Pass the height via className (e.g. "h-14"); on dark
// backgrounds (variant="light") it sits on a white rounded chip so the navy
// lettering stays readable.
export function Logo({
  siteName,
  variant = "dark",
  className = "h-14",
}: {
  siteName: string;
  variant?: "dark" | "light";
  className?: string;
}) {
  const image = (
    <Image
      src="/logo.png"
      alt={siteName}
      width={810}
      height={463}
      priority
      className={`w-auto ${className}`}
    />
  );

  if (variant === "light") {
    return <span className="inline-block rounded-xl bg-white px-3 py-2">{image}</span>;
  }

  return image;
}
