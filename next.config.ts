import type { NextConfig } from "next";

const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [];

if (process.env.STORAGE_PUBLIC_URL) {
  try {
    const url = new URL(process.env.STORAGE_PUBLIC_URL);
    remotePatterns.push({
      protocol: url.protocol.replace(":", "") as "http" | "https",
      hostname: url.hostname,
      pathname: "/**",
    });
  } catch {
    // Invalid STORAGE_PUBLIC_URL — leave remotePatterns empty; local uploads
    // still work since they're served from /public.
  }
}

const nextConfig: NextConfig = {
  images: { remotePatterns },
};

export default nextConfig;
