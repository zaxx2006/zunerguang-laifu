import { cmsResponse } from "@/services/public-cms-api";
import { servicePresentationKeySchema } from "@/contracts/cms-service";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ key: string }> }) {
  const result = servicePresentationKeySchema.safeParse((await params).key);
  if (!result.success) return Response.json({ error: { code: "SERVICE_PRESENTATION_NOT_FOUND" } }, { status: 404, headers: { "Cache-Control": "no-store" } });
  return cmsResponse("service", request, undefined, result.data);
}
