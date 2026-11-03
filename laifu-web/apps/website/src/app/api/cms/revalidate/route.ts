import { createHmac, timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";

function validSignature(timestamp: string, body: string, signature: string): boolean {
  const secret = process.env.LAIFU_REVALIDATE_SECRET || "";
  if (secret.length < 32 || Math.abs(Date.now() - Date.parse(timestamp)) > 300_000) return false;
  const expected = createHmac("sha256", secret).update(`${timestamp}.${body}`).digest("hex");
  return signature.length === expected.length && timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

export async function POST(request: Request) {
  const body = await request.text();
  const timestamp = request.headers.get("x-laifu-timestamp") || "";
  const signature = request.headers.get("x-laifu-signature") || "";
  if (!validSignature(timestamp, body, signature)) return Response.json({ error: "unauthorized" }, { status: 401 });
  const event = JSON.parse(body) as { resource?: string };
  if (event.resource === "home-presentations" || event.resource === "faqs" || event.resource === "media") revalidateTag("laifu:home", { expire: 0 });
  if (event.resource === "navigation") revalidateTag("laifu:navigation", { expire: 0 });
  if (event.resource === "site-pages" || event.resource === "media") revalidateTag("laifu:site-pages", { expire: 0 });
  if (event.resource === "service-presentations" || event.resource === "media") revalidateTag("laifu:service-presentations", { expire: 0 });
  return Response.json({ revalidated: true });
}
