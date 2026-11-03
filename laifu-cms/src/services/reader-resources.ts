import type { Payload } from "payload";
import { readableResources, readerIdFromHref, type ReaderResource } from "@/contracts/resource-reader";
import { projectSitePage } from "./cms-site-pages";

export async function publishedReaderResources(payload: Payload): Promise<ReaderResource[]> {
  const pages = await payload.find({ collection: "site-pages", where: { and: [{ route: { equals: "/resources/" } }, { _status: { equals: "published" } }] }, draft: false, depth: 0, limit: 1, overrideAccess: true });
  if (!pages.docs[0]) return [];
  const page = await projectSitePage(pages.docs[0], payload);
  return readableResources(page.content);
}

export function selectedReaderResources(items: { href?: string | null }[], resources: ReaderResource[]): ReaderResource[] {
  return items.flatMap(item => {
    const id = item.href ? readerIdFromHref(item.href) : null;
    const resource = resources.find(resource => resource.id === id);
    return resource ? [resource] : [];
  });
}

export function validateHomeResources(items: { href?: string | null }[], resources: ReaderResource[]): string | null {
  if (items.length > 3) return "首页最多展示三个资源。";
  const selected = selectedReaderResources(items, resources);
  if (selected.length !== items.length) return "请从已发布的资源中心选择 DOCX、PDF 或 EPUB 资源，并确认文件已授权公开。";
  if (new Set(selected.map(resource => resource.id)).size !== selected.length) return "首页不能重复选择同一个资源。";
  return null;
}

