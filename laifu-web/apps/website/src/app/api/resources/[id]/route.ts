import { getReaderResource } from "@/lib/reader-resources";

export const dynamic = "force-dynamic";
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const resource = await getReaderResource(id);
    if (!resource) return Response.json({ error: "资源尚未发布或已下架。" }, { status: 404 });
    const base = new URL(process.env.LAIFU_CMS_URL || "http://127.0.0.1:5158");
    const url = new URL(resource.file.url, base);
    if (url.origin !== base.origin || !url.pathname.startsWith("/api/media/file/")) return Response.json({ error: "文件地址不正确。" }, { status: 400 });
    const response = await fetch(url, { cache: "no-store", redirect: "error", signal: AbortSignal.timeout(30000) });
    if (!response.ok) return Response.json({ error: "文件暂时无法读取。" }, { status: response.status === 404 ? 404 : 502 });
    if (Number(response.headers.get("content-length")) > 25 * 1024 * 1024) return Response.json({ error: "文件超过 25MB，请联系运营人员压缩后重新上传。" }, { status: 413 });
    return new Response(response.body, { headers: { "Content-Type": resource.file.mimeType, "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(resource.file.filename)}`, "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" } });
  } catch (error) {
    console.error("阅读文件读取失败", error);
    return Response.json({ error: "文件暂时无法读取，请稍后重试。" }, { status: 503 });
  }
}
