import Image from "next/image";
import Link from "next/link";
import type { WhyUsStat } from "@/lib/db/why-us";

export function WhyUs({
  eyebrow,
  heading,
  description,
  imageUrl1,
  imageUrl2,
  stats,
  buttonLabel,
  buttonHref,
}: {
  eyebrow: string;
  heading: string;
  description: string;
  imageUrl1: string | null;
  imageUrl2: string | null;
  stats: WhyUsStat[];
  buttonLabel: string;
  buttonHref: string;
}) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 lg:px-16">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div className="flex gap-4">
          {eyebrow && (
            <p className="hidden shrink-0 [writing-mode:vertical-rl] font-display text-lg italic text-orange sm:block">
              {eyebrow}
            </p>
          )}
          <div className="relative h-96 w-full sm:h-[26rem]">
            {imageUrl1 ? (
              <div className="absolute left-0 top-0 h-[85%] w-[72%] overflow-hidden rounded-2xl">
                <Image src={imageUrl1} alt="" fill className="object-cover" />
              </div>
            ) : (
              <div className="absolute left-0 top-0 flex h-[85%] w-[72%] items-center justify-center rounded-2xl border border-placeholder-border bg-placeholder text-xs font-medium uppercase tracking-wide text-placeholder-label">
                Add photo 1
              </div>
            )}
            {imageUrl2 ? (
              <div className="absolute bottom-0 right-0 h-[58%] w-[62%] overflow-hidden rounded-2xl border-4 border-ivory shadow-xl">
                <Image src={imageUrl2} alt="" fill className="object-cover" />
              </div>
            ) : (
              <div className="absolute bottom-0 right-0 flex h-[58%] w-[62%] items-center justify-center rounded-2xl border-4 border-ivory bg-placeholder text-xs font-medium uppercase tracking-wide text-placeholder-label shadow-xl">
                Add photo 2
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="font-display text-4xl font-semibold text-ink">{heading}</h2>
          {description && <p className="mt-4 text-sm leading-relaxed text-ink-soft">{description}</p>}

          {stats.length > 0 && (
            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-status-published-bg text-lg">
                    {stat.icon}
                  </span>
                  <p className="text-sm text-ink">
                    <span className="block font-semibold">{stat.value}</span>
                    <span className="text-ink-soft">{stat.label}</span>
                  </p>
                </div>
              ))}
            </div>
          )}

          {buttonLabel && (
            <Link
              href={buttonHref || "/contact"}
              className="mt-8 inline-block rounded-full bg-navy px-8 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              {buttonLabel}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
