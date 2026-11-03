import type { CollectionConfig, GeneratePreviewURL } from "payload";
const previewCollections = new Set(["home-presentations", "service-presentations", "site-pages", "navigation"]);

export const previewBreakpoints = [
  { name: "desktop", label: "桌面", width: 1440, height: 900 },
  { name: "tablet", label: "平板", width: 1024, height: 768 },
  { name: "mobile", label: "手机", width: 390, height: 844 }
];

function previewURL(collection: string, doc: Record<string, unknown>): string {
  const url = new URL("/api/cms/preview", process.env.LAIFU_WEB_URL || "http://127.0.0.1:3001");
  url.searchParams.set("secret", process.env.LAIFU_PREVIEW_SECRET || "");
  url.searchParams.set("collection", collection);
  if (doc.id !== undefined && doc.id !== null) url.searchParams.set("id", String(doc.id));
  if (collection === "service-presentations" && typeof doc.key === "string") url.searchParams.set("key", doc.key);
  if (collection === "site-pages" && typeof doc.route === "string") url.searchParams.set("route", doc.route);
  return url.toString();
}

function staticPreview(collection: string): GeneratePreviewURL {
  return doc => previewURL(collection, doc);
}

export function withPreview(collection: CollectionConfig): CollectionConfig {
  if (!previewCollections.has(collection.slug)) return collection;
  return {
    ...collection,
    admin: {
      ...collection.admin,
      preview: staticPreview(collection.slug),
      livePreview: { url: ({ data }) => previewURL(collection.slug, data), breakpoints: previewBreakpoints, openByDefault: false }
    }
  };
}
