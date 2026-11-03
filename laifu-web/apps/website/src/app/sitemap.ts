import type { MetadataRoute } from "next";
import { getPublicPath, pageRegistry } from "@/lib/page-registry";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteConfig.siteUrl) return [];
  return pageRegistry.map((page) => ({
    url: `${siteConfig.siteUrl}${getPublicPath(page)}`,
    lastModified: new Date("2026-07-25"),
    changeFrequency: page.status === "prelaunch" ? "monthly" : "weekly",
    priority: page.slug === "" ? 1 : page.group === "service" ? 0.8 : 0.6,
  }));
}
