import type { NextConfig } from "next";

const cmsMedia = new URL("/api/media/file/**", process.env.LAIFU_CMS_URL || "http://127.0.0.1:5158");
const publicCmsMedia = process.env.LAIFU_CMS_PUBLIC_URL ? new URL("/api/media/file/**", process.env.LAIFU_CMS_PUBLIC_URL) : undefined;

const nextConfig: NextConfig = {
  distDir: process.env.LAIFU_PREVIEW_DIR ?? ".next",
  allowedDevOrigins: ["127.0.0.1", "192.168.0.83"],
  outputFileTracingRoot: process.cwd(),
  trailingSlash: true,
  async redirects() {
    return [
      { source: "/blog", destination: "/resources/#resources-articles", permanent: true },
      { source: "/faq", destination: "/book-consultation/#booking-faq", permanent: true },
    ];
  },
  images: {
    remotePatterns: [cmsMedia, ...(publicCmsMedia ? [publicCmsMedia] : [])],
    localPatterns: [{ pathname: "/images/editorial/**", search: "" }, { pathname: "/home-preview/**", search: "" }],
    dangerouslyAllowLocalIP: ["127.0.0.1", "localhost", "[::1]"].includes(cmsMedia.hostname),
    maximumRedirects: 0,
    minimumCacheTTL: 60,
    deviceSizes: [640, 960, 1280],
    imageSizes: [320, 480],
    qualities: [75],
  },
};

export default nextConfig;
