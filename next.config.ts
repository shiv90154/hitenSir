import type { NextConfig } from "next";

// All media is uploaded to and served from this server's own /public/uploads
// directory (see lib/media/storage.ts), so next/image never needs an
// external remotePatterns entry.
const nextConfig: NextConfig = {};

export default nextConfig;
