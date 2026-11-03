import { APIError } from "payload";
import { randomUUID } from "node:crypto";
import type { Block, CatalogBlock, PageContent } from "@/contracts/page-content";
import { catalogItems, resourceId } from "@/contracts/resource-reader";

type ResourceFile = { id: number; url?: string | null; filename?: string | null; mimeType?: string | null; publicApproved?: boolean | null; rightsConfirmed?: boolean | null; deletedAt?: string | null };

function mapBlocks(blocks: Block[], visit: (block: CatalogBlock) => CatalogBlock): Block[] {
  return blocks.map(block => {
    if (block.kind === "catalog") return visit(block);
    if (block.kind === "subsection") return { ...block, blocks: mapBlocks(block.blocks, visit) };
    if (block.kind === "grid" || block.kind === "selfcheck") return { ...block, items: block.items.map(item => ({ ...item, blocks: mapBlocks(item.blocks, visit) })) };
    return block;
  });
}

function mapContent(content: PageContent, visit: (block: CatalogBlock) => CatalogBlock): PageContent {
  return { ...content, intro: mapBlocks(content.intro, visit), sections: content.sections.map(section => ({ ...section, blocks: mapBlocks(section.blocks, visit) })) };
}

export function stabilizeResourceIds(content: PageContent, original?: PageContent): PageContent {
  const previous = original ? catalogItems(original) : [];
  let index = 0;
  const ids = new Set<string>();
  return mapContent(content, block => ({ ...block, items: block.items.map(item => {
    const old = previous[index++];
    const id = item.id || (old && resourceId(old)) || resourceId(item) || randomUUID();
    if (ids.has(id)) throw new APIError("资源标识重复，请重新添加重复的条目。", 400);
    ids.add(id);
    return { ...item, id };
  }) }));
}

export function resourceAttachmentIds(content: PageContent): number[] {
  const ids = new Set<number>();
  mapContent(content, block => { for (const item of block.items) if (item.attachmentId) ids.add(item.attachmentId); return block; });
  return [...ids];
}

function approved(file: ResourceFile | undefined): file is ResourceFile & { url: string; filename: string; mimeType: string } {
  return Boolean(file?.publicApproved && file.rightsConfirmed && !file.deletedAt && file.url && file.filename && file.mimeType);
}

export function assertResourceFilesApproved(content: PageContent, files: ResourceFile[]) {
  const byId = new Map(files.map(file => [file.id, file]));
  mapContent(content, block => {
    for (const item of block.items) if (item.attachmentId && !approved(byId.get(item.attachmentId))) throw new APIError(`资源“${item.title}”的文件不存在或未完成使用权与公开授权确认。`, 400);
    return block;
  });
}

export function projectResourceFiles(content: PageContent, files: ResourceFile[], baseURL: string): PageContent {
  const byId = new Map(files.map(file => [file.id, file]));
  return mapContent(content, block => ({ ...block, items: block.items.map(item => {
    const { attachmentId, file: _ignoredFile, ...entry } = item;
    const file = attachmentId ? byId.get(attachmentId) : undefined;
    return { ...entry, id: resourceId(item), ...(approved(file) ? { file: { url: new URL(file.url, baseURL).toString(), filename: file.filename, mimeType: file.mimeType } } : {}) };
  }) }));
}
