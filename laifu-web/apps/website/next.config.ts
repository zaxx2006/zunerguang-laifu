import type { NextConfig } from "next";

const cmsMedia = new URL("/api/media/file/**", process.env.LAIFU_CMS_URL || "http://127.0.0.1:5158");

const nextConfig: NextConfig = {
  distDir: process.env.LAIFU_PREVIEW_DIR ?? ".next",
  allowedDevOrigins: ["127.0.0.1"],
  outputFileTracingRoot: process.cwd(),
  trailingSlash: true,
  images: {
    remotePatterns: [cmsMedia],
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
