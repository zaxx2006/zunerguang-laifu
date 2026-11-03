import "server-only";
import { cache } from "react";
import { contentBlockSchema } from "@/contracts/cms-site-page";
import { readerFormat, type ReaderResource } from "@/contracts/resource-reader";

export const getReaderResources = cache(async (): Promise<ReaderResource[]> => {
  const base = process.env.LAIFU_CMS_URL || "http://127.0.0.1:5158";
  const response = await fetch(new URL("/api/public/v1/laifu/resources", base), { cache: "no-store", signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error("资源中心暂时无法读取，请稍后重试。");
  const data = await response.json() as { resources: unknown };
  const catalog = contentBlockSchema.parse({ kind: "catalog", items: data.resources });
  if (catalog.kind !== "catalog") throw new Error("资源列表格式不正确。");
  return catalog.items.filter((item): item is ReaderResource => Boolean(item.id && readerFormat(item.file)));
});

export async function getReaderResource(id: string) {
  return (await getReaderResources()).find(resource => resource.id === id) ?? null;
}
