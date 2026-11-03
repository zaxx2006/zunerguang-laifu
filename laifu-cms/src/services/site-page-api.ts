import config from "@payload-config";
import { getPayload } from "payload";
import { sitePageProjectionVersion } from "@/contracts/cms-site-page";
import { authorizedDraft } from "./public-cms-api";
import { projectSitePage } from "./cms-site-pages";

export async function sitePageResponse(request: Request, draftId?: string) {
  const payload = await getPayload({ config });
  if (draftId && !authorizedDraft(request)) return Response.json({ error: "PREVIEW_UNAUTHORIZED" }, { status: 401 });
  const route = new URL(request.url).searchParams.get("route");
  const document = draftId ? await payload.findByID({ collection: "site-pages", id: draftId, draft: true, depth: 1, overrideAccess: true }) : (await payload.find({ collection: "site-pages", where: { and: [{ route: { equals: route } }, { _status: { equals: "published" } }] }, draft: false, depth: 1, limit: 1, overrideAccess: true })).docs[0];
  if (!document) return Response.json({ error: "PAGE_NOT_PUBLISHED" }, { status: 404, headers: { "Cache-Control": "no-store" } });
  try {
    return Response.json({ apiVersion: "v1", projectionVersion: sitePageProjectionVersion, contentVersion: document.updatedAt, data: { presentation: await projectSitePage(document, payload) } }, { headers: { "Cache-Control": draftId ? "private, no-store" : "public, max-age=0, s-maxage=60, must-revalidate" } });
  } catch (error) {
    payload.logger.error({ err: error, msg: "官网页面内容校验失败" });
    return Response.json({ error: "PAGE_CONTENT_INVALID" }, { status: 500, headers: { "Cache-Control": "no-store" } });
  }
}
