const configuredBasePath = process.env.NEXT_PUBLIC_BASE_PATH?.trim() ?? "";
const projectBasePath = configuredBasePath && configuredBasePath !== "/" ? `/${configuredBasePath.replace(/^\/+|\/+$/g, "")}` : "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.LAIFU_PREVIEW_DIR ?? ".next",
  output: "export",
  outputFileTracingRoot: process.cwd(),
  env: {
    NEXT_PUBLIC_BASE_PATH: projectBasePath,
  },
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  ...(projectBasePath
    ? {
        basePath: projectBasePath,
        assetPrefix: projectBasePath,
      }
    : {}),
};

export default nextConfig;
