import type { Metadata } from "next";
import { getPublicPath } from "@/lib/page-registry";
import type { PageMeta } from "@/lib/page-schema";
import { siteConfig } from "@/lib/site-config";

export function metadataForPage(page: PageMeta): Metadata {
  const path = getPublicPath(page);
  const url = siteConfig.siteUrl ? `${siteConfig.siteUrl}${path}` : undefined;
  const title = page.seoTitle ?? `${page.titleZh}｜${siteConfig.nameZh}`;
  const description = page.seoDescription ?? page.description;
  return {
    title,
    description,
    keywords: page.keywords,
    alternates: url ? { canonical: url } : undefined,
    openGraph: {
      type: "website",
      locale: "zh_CN",
      title,
      description,
      url,
      siteName: `${siteConfig.nameZh} | ${siteConfig.nameEn}`,
    },
  };
}
