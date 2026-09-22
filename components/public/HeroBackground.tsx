"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export function HeroBackground({ imageUrls }: { imageUrls: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (imageUrls.length < 2) return;
    const interval = setInterval(() => setIndex((i) => (i + 1) % imageUrls.length), 5000);
    return () => clearInterval(interval);
  }, [imageUrls.length]);

  if (imageUrls.length === 0) return null;

  return (
    <>
      {imageUrls.map((url, i) => (
        <Image
          key={url}
          src={url}
          alt=""
          fill
          priority={i === 0}
          className={`object-cover transition-opacity duration-1000 ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-navy-dark/70" aria-hidden="true" />
    </>
  );
}
