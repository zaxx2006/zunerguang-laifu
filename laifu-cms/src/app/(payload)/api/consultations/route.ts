import config from "@payload-config";
import { getPayload } from "payload";
import { consultationSchema } from "@/contracts/cms-site-page";
import { authorizedDraft } from "@/services/public-cms-api";

export async function POST(request: Request) {
  if (!authorizedDraft(request)) return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
  const raw = await request.text();
  if (raw.length > 12000) return Response.json({ error: "REQUEST_TOO_LARGE" }, { status: 413 });
  let input: unknown;
  try { input = JSON.parse(raw); } catch { return Response.json({ error: "INVALID_REQUEST" }, { status: 400 }); }
  const result = consultationSchema.safeParse(input);
  if (!result.success) return Response.json({ error: "INVALID_REQUEST" }, { status: 400 });
  const payload = await getPayload({ config });
  const recent = await payload.find({ collection: "consultation-requests", where: { and: [{ phone: { equals: result.data.phone } }, { createdAt: { greater_than: new Date(Date.now() - 60000).toISOString() } }] }, limit: 1, depth: 0, overrideAccess: true });
  if (recent.docs.length) return Response.json({ error: "PLEASE_RETRY_LATER" }, { status: 429 });
  const { website: _website, ...data } = result.data;
  await payload.create({ collection: "consultation-requests", overrideAccess: true, data: { ...data, status: "new" } });
  return Response.json({ received: true }, { status: 201, headers: { "Cache-Control": "no-store" } });
}
