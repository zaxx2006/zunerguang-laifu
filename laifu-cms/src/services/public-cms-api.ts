import { createHash, timingSafeEqual } from "node:crypto";
import config from "@payload-config";
import { getPayload } from "payload";
import { createCmsEnvelope } from "@/contracts/cms-home";
import { createServiceEnvelope } from "@/contracts/cms-service";
import { projectHome, projectNavigation } from "./cms-presentations";
import { projectService } from "./cms-service-presentations";
import { publishedReaderResources } from "./reader-resources";

export type CmsPresentationKind = "home" | "navigation" | "service";
type CachedRepresentation = { body: string; contentVersion: string; etag: string };
const cache = new Map<CmsPresentationKind | `service:${string}`, CachedRepresentation>();

const settings = {
  home: { collection: "home-presentations" as const, key: "home", missingCode: "HOME_PRESENTATION_NOT_PUBLISHED" },
  navigation: { collection: "navigation" as const, key: "primary", missingCode: "NAVIGATION_NOT_PUBLISHED" },
  service: { collection: "service-presentations" as const, key: "divorce-coaching", missingCode: "SERVICE_PRESENTATION_NOT_PUBLISHED" },
};

function headers(etag: string, contentVersion: string): HeadersInit { return { "Cache-Control": "public, max-age=0, s-maxage=60, stale-while-revalidate=86400", "Content-Type": "application/json; charset=utf-8", ETag: etag, "Last-Modified": new Date(contentVersion).toUTCString() }; }
function project(kind: CmsPresentationKind, document: unknown) { return kind === "home" ? projectHome(document) : kind === "navigation" ? projectNavigation(document) : projectService(document); }
export function authorizedDraft(request: Request): boolean {
  const expected = process.env.LAIFU_PREVIEW_SECRET;
  const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  if (!expected || expected.length < 32 || supplied.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(supplied), Buffer.from(expected));
}

export async function cmsResponse(kind: CmsPresentationKind, request: Request, draftId?: string, serviceKey = "divorce-coaching"): Promise<Response> {
  const payload = await getPayload({ config });
  const setting = { ...settings[kind], key: kind === "service" ? serviceKey : settings[kind].key };
  const cacheKey = kind === "service" ? `service:${serviceKey}` as const : kind;
  let document: unknown;
  if (draftId) {
    if (!authorizedDraft(request)) return Response.json({ error: { code: "PREVIEW_UNAUTHORIZED" } }, { status: 401, headers: { "Cache-Control": "no-store" } });
    document = await payload.findByID({ collection: setting.collection, id: draftId, depth: 3, draft: true, overrideAccess: true });
  } else if (kind === "home") {
    const result = await payload.find({ collection: "home-presentations", depth: 3, draft: false, limit: 1, overrideAccess: true, pagination: false, where: { and: [{ key: { equals: setting.key } }, { _status: { equals: "published" } }] } });
    document = result.docs[0];
  } else {
    const latest = await payload.find({ collection: setting.collection, depth: 0, draft: false, limit: 1, overrideAccess: true, pagination: false, select: { updatedAt: true }, sort: "-updatedAt", where: { and: [{ key: { equals: setting.key } }, { _status: { equals: "published" } }] } });
    const contentVersion = latest.docs[0]?.updatedAt;
    if (!contentVersion) return Response.json({ error: { code: setting.missingCode } }, { status: 404, headers: { "Cache-Control": "no-store" } });
    const etag = `"${createHash("sha256").update(`${cacheKey}:${contentVersion}`).digest("base64url")}"`;
    if (request.headers.get("if-none-match")?.split(",").some(value => value.trim() === etag)) return new Response(null, { status: 304, headers: headers(etag, contentVersion) });
    const cached = cache.get(cacheKey);
    if (cached?.etag === etag) return new Response(cached.body, { headers: headers(etag, contentVersion) });
    const result = await payload.find({ collection: setting.collection, depth: 3, draft: false, limit: 1, overrideAccess: true, pagination: false, sort: "-updatedAt", where: { and: [{ key: { equals: setting.key } }, { _status: { equals: "published" } }] } });
    document = result.docs[0];
  }
  if (!document || typeof document !== "object" || !("updatedAt" in document)) return Response.json({ error: { code: setting.missingCode } }, { status: 404, headers: { "Cache-Control": "no-store" } });
  const contentVersion = String(document.updatedAt);
  const etag = `"${createHash("sha256").update(`${cacheKey}:${contentVersion}`).digest("base64url")}"`;
  try {
    const presentation = kind === "home" ? projectHome(document, await publishedReaderResources(payload)) : project(kind, document);
    const body = JSON.stringify(kind === "service" ? createServiceEnvelope(contentVersion, presentation as ReturnType<typeof projectService>) : createCmsEnvelope(contentVersion, presentation));
    if (!draftId && kind !== "home") cache.set(cacheKey, { body, contentVersion, etag });
    return new Response(body, { headers: draftId || kind === "home" ? { "Cache-Control": "private, no-store", "Content-Type": "application/json; charset=utf-8" } : headers(etag, contentVersion) });
  } catch (error) {
    payload.logger.error({ err: error, msg: `Invalid Laifu ${kind} presentation` });
    return Response.json({ error: { code: "PRESENTATION_INVALID" } }, { status: 500, headers: { "Cache-Control": "no-store" } });
  }
}
