import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const nextConfig: NextConfig = { output: "standalone", outputFileTracingRoot: dirname, distDir: process.env.LAIFU_PREVIEW_DIR ?? ".next" };

export default withPayload(nextConfig);
