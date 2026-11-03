import { cmsPresentationEndpoints, createCmsEnvelope, type CmsPresentationData, type CmsPresentationKind } from "@/contracts/cms-presentation";

export const publishedCacheControl = "public, max-age=0, must-revalidate";

export function publishedCmsResponse<K extends CmsPresentationKind>(kind: K, contentVersion: string, data: CmsPresentationData[K]): Response { return Response.json(createCmsEnvelope(contentVersion, data), { headers: { "Cache-Control": publishedCacheControl } }); }
export function missingCmsResponse(kind: CmsPresentationKind): Response { return Response.json({ error: { code: cmsPresentationEndpoints[kind].missingCode } }, { status: 404, headers: { "Cache-Control": "no-store" } }); }
