"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export function CulturalBanner({
  heading,
  subheading,
  ctaLabel,
  ctaHref,
  imageUrls,
}: {
  heading: string;
  subheading: string;
  ctaLabel: string;
  ctaHref: string;
  imageUrls: string[];
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (imageUrls.length < 2) return;
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % imageUrls.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [imageUrls.length]);

  return (
    <section className="mx-auto max-w-7xl px-6 lg:px-16">
      <div className="grid grid-cols-1 overflow-hidden rounded-2xl bg-cta-bg sm:grid-cols-2">
        <div className="flex flex-col justify-center px-8 py-12 sm:px-12">
          <h2 className="font-display text-2xl font-semibold leading-tight text-ink sm:text-3xl">
            {heading}
          </h2>
          {subheading && <p className="mt-3 text-sm text-ink-soft">{subheading}</p>}
          {ctaLabel && (
            <Link
              href={ctaHref || "/contact"}
              className="mt-6 inline-block w-fit rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              {ctaLabel}
            </Link>
          )}
        </div>
        <div className="relative h-64 sm:h-auto sm:min-h-[20rem]">
          {imageUrls.map((url, i) => (
            <Image
              key={url}
              src={url}
              alt=""
              fill
              className={`object-cover transition-opacity duration-1000 ease-in-out ${
                i === index ? "opacity-100" : "opacity-0"
              }`}
              priority={i === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
