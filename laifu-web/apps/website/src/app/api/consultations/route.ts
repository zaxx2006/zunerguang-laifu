import { consultationSchema } from "@/contracts/cms-site-page";

export async function POST(request: Request) {
  const requestOrigin = new URL(request.url);
  requestOrigin.host = request.headers.get("host") ?? requestOrigin.host;
  if (request.headers.get("origin") !== requestOrigin.origin) return Response.json({ error: "INVALID_ORIGIN" }, { status: 403 });
  const raw = await request.text();
  if (raw.length > 12000) return Response.json({ error: "REQUEST_TOO_LARGE" }, { status: 413 });
  let input: unknown;
  try { input = JSON.parse(raw); } catch { return Response.json({ error: "INVALID_REQUEST" }, { status: 400 }); }
  const result = consultationSchema.safeParse(input);
  if (!result.success) return Response.json({ error: "INVALID_REQUEST" }, { status: 400 });
  const secret = process.env.LAIFU_PREVIEW_SECRET;
  if (!secret || secret.length < 32) return Response.json({ error: "SERVICE_UNAVAILABLE" }, { status: 503 });
  try {
    const response = await fetch(`${(process.env.LAIFU_CMS_URL || "http://127.0.0.1:5158").replace(/\/$/, "")}/api/consultations`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${secret}` }, body: JSON.stringify(result.data), cache: "no-store", signal: AbortSignal.timeout(10000) });
    return Response.json(response.ok ? { received: true } : { error: "SUBMISSION_FAILED" }, { status: response.ok ? 201 : response.status === 429 ? 429 : 503, headers: { "Cache-Control": "no-store" } });
  } catch { return Response.json({ error: "SERVICE_UNAVAILABLE" }, { status: 503, headers: { "Cache-Control": "no-store" } }); }
}
