import "server-only";
import { cookies, draftMode } from "next/headers";
import { homeEnvelopeSchema, navigationEnvelopeSchema, type HomePresentation, type NavigationPresentation } from "@/contracts/cms-home";
import { serviceEnvelopeSchema, type AnyServicePresentation } from "@/contracts/cms-service";
import { sitePageEnvelopeSchema, type SitePagePresentation } from "@/contracts/cms-site-page";

const cmsBaseURL = () => (process.env.LAIFU_CMS_URL || "http://127.0.0.1:5158").replace(/\/$/, "");

async function fetchPresentation<T>(kind: "home" | "navigation" | "service" | "page", publicPath: string, parse: (value: unknown) => { data: { presentation: T } }, tag: string, allowPreview = true, previewCookie = `laifu_preview_${kind}_id`): Promise<T | null> {
  const preview = allowPreview ? await draftMode() : null;
  const previewID = preview?.isEnabled ? (await cookies()).get(previewCookie)?.value : undefined;
  const path = previewID ? `/api/preview/v1/laifu/${kind}?id=${encodeURIComponent(previewID)}` : publicPath;
  try {
    const response = await fetch(`${cmsBaseURL()}${path}`, {
      headers: previewID ? { Authorization: `Bearer ${process.env.LAIFU_PREVIEW_SECRET || ""}` } : undefined,
      cache: previewID ? "no-store" : undefined,
      next: previewID ? undefined : { revalidate: 60, tags: [tag] },
      signal: AbortSignal.timeout(4000),
    });
    if (!response.ok) return null;
    return parse(await response.json()).data.presentation;
  } catch (error) {
    console.warn(`CMS ${kind} unavailable; using the checked-in presentation fallback.`, error);
    return null;
  }
}

export function getHomePresentation({ preview = true }: { preview?: boolean } = {}): Promise<HomePresentation | null> { return fetchPresentation("home", "/api/public/v1/laifu/home-presentation", value => homeEnvelopeSchema.parse(value), "laifu:home", preview); }
export function getNavigationPresentation({ preview = true }: { preview?: boolean } = {}): Promise<NavigationPresentation | null> { return fetchPresentation("navigation", "/api/public/v1/laifu/navigation", value => navigationEnvelopeSchema.parse(value), "laifu:navigation", preview); }
export function getServicePresentation(key: "divorce-coaching" | "high-conflict-divorce", { preview = true }: { preview?: boolean } = {}): Promise<AnyServicePresentation | null> { return fetchPresentation("service", `/api/public/v1/laifu/service-presentations/${key}`, value => { const envelope = serviceEnvelopeSchema.parse(value); if (envelope.data.presentation.key !== key) throw new Error("CMS service key mismatch"); return envelope; }, "laifu:service-presentations", preview, `laifu_preview_service_${key}_id`); }

export async function getSitePagePresentation(route: string): Promise<SitePagePresentation> {
  const previewRoute = (await draftMode()).isEnabled ? (await cookies()).get("laifu_preview_page_route")?.value : undefined;
  const content = await fetchPresentation("page", `/api/public/v1/laifu/site-pages?route=${encodeURIComponent(route)}`, value => {
    const envelope = sitePageEnvelopeSchema.parse(value);
    if (envelope.data.presentation.route !== route) throw new Error("CMS page route mismatch");
    return envelope;
  }, "laifu:site-pages", previewRoute === route);
  if (!content) throw new Error(`官网页面内容尚未发布或无法读取：${route}`);
  return content;
}
