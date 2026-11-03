import { cmsResponse, type CmsPresentationKind } from "@/services/public-cms-api";
import { sitePageResponse } from "@/services/site-page-api";
export const dynamic = "force-dynamic";
export async function GET(request: Request, { params }: { params: Promise<{ kind: string }> }) {
  const { kind } = await params;
  const id = new URL(request.url).searchParams.get("id");
  if (kind === "page" && id) return sitePageResponse(request, id);
  if ((kind !== "home" && kind !== "navigation" && kind !== "service") || !id) return Response.json({ error: { code: "PREVIEW_REQUEST_INVALID" } }, { status: 400 });
  return cmsResponse(kind as CmsPresentationKind, request, id);
}
