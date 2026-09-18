"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

export interface PackagePhoto {
  id: string;
  url: string;
  alt: string;
}

function PlaceholderBlock({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center border border-placeholder-border bg-placeholder text-xs font-medium uppercase tracking-wide text-placeholder-label ${className}`}
    >
      Photo
    </div>
  );
}

export function PackagePhotoGallery({ photos, title }: { photos: PackagePhoto[]; title: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const showPrev = useCallback(
    () => setOpenIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length)),
    [photos.length]
  );
  const showNext = useCallback(
    () => setOpenIndex((i) => (i === null ? null : (i + 1) % photos.length)),
    [photos.length]
  );

  useEffect(() => {
    if (openIndex === null) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    }
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [openIndex, close, showPrev, showNext]);

  if (photos.length === 0) {
    return (
      <div className="mx-auto mt-4 grid max-w-7xl grid-cols-1 gap-3 px-6 sm:grid-cols-3 lg:px-16">
        <PlaceholderBlock className="h-[320px] sm:col-span-2" />
        <div className="grid grid-rows-2 gap-3">
          <PlaceholderBlock />
          <PlaceholderBlock />
        </div>
      </div>
    );
  }

  const [cover, ...rest] = photos;
  const sideThumbs = rest.slice(0, 2);
  const active = openIndex !== null ? photos[openIndex] : null;

  return (
    <>
      <div className="mx-auto mt-4 grid max-w-7xl grid-cols-1 gap-3 px-6 sm:grid-cols-3 lg:px-16">
        <button
          type="button"
          onClick={() => setOpenIndex(0)}
          aria-label={`View ${cover.alt} full size`}
          className="relative block h-[320px] overflow-hidden rounded-lg border border-border bg-placeholder sm:col-span-2"
        >
          <Image src={cover.url} alt={cover.alt} fill className="object-cover" priority />
        </button>
        <div className="grid grid-rows-2 gap-3">
          {sideThumbs.map((photo, i) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setOpenIndex(i + 1)}
              aria-label={`View ${photo.alt} full size`}
              className="relative block overflow-hidden rounded-lg border border-border bg-placeholder"
            >
              <Image src={photo.url} alt={photo.alt} fill className="object-cover" />
              {i === 1 && photos.length > 3 && (
                <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-sm font-semibold text-white">
                  +{photos.length - 3} more
                </span>
              )}
            </button>
          ))}
          {sideThumbs.length < 2 && Array.from({ length: 2 - sideThumbs.length }).map((_, i) => (
            <PlaceholderBlock key={`empty-${i}`} />
          ))}
        </div>
      </div>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${title} — photo viewer`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>

          {photos.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                showPrev();
              }}
              aria-label="Previous photo"
              className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-4"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}

          <div className="relative h-[80vh] w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <Image src={active.url} alt={active.alt} fill className="object-contain" priority />
          </div>

          {photos.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                showNext();
              }}
              aria-label="Next photo"
              className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-4"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
              </svg>
            </button>
          )}
        </div>
      )}
    </>
  );
}
