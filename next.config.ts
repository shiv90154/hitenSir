import type { NextConfig } from "next";

// Uploaded media lives in /public/uploads and is served directly by nginx in
// production (files added after build aren't visible to Next's image
// optimizer), so images are served as-is instead of through /_next/image.
const nextConfig: NextConfig = {
  images: { unoptimized: true },
};

export default nextConfig;
