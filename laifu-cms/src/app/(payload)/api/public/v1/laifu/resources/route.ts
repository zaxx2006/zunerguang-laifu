import config from "@payload-config";
import { getPayload } from "payload";
import { publishedReaderResources } from "@/services/reader-resources";

export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const payload = await getPayload({ config });
    return Response.json({ resources: await publishedReaderResources(payload) }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("资源中心读取失败", error);
    return Response.json({ error: "资源中心暂时无法读取，请稍后重试。" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
