import type { Block, CatalogBlock, PageContent } from "./page-content";

export type ResourceItem = CatalogBlock["items"][number];
export type ReaderFormat = "pdf" | "docx" | "epub";
export type ReaderResource = ResourceItem & { id: string; file: NonNullable<ResourceItem["file"]> };

export function readerFormat(file: ResourceItem["file"]): ReaderFormat | null {
  if (!file) return null;
  if (file.mimeType === "application/pdf") return "pdf";
  if (file.mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") return "docx";
  if (file.mimeType === "application/epub+zip") return "epub";
  return null;
}

export function resourceId(item: ResourceItem): string | undefined {
  return item.id || (item.attachmentId ? `file-${item.attachmentId}` : undefined);
}

export function readerHref(id: string): string {
  return `/resources/read/?resource=${encodeURIComponent(id)}`;
}

export function readerIdFromHref(href: string): string | null {
  if (!href.startsWith("/resources/read/?")) return null;
  const url = new URL(href, "https://reader.invalid");
  return url.origin === "https://reader.invalid" && url.pathname === "/resources/read/" ? url.searchParams.get("resource") : null;
}

export function catalogItems(content: PageContent): ResourceItem[] {
  const result: ResourceItem[] = [];
  function visit(blocks: Block[]) {
    for (const block of blocks) {
      if (block.kind === "catalog") result.push(...block.items);
      else if (block.kind === "subsection") visit(block.blocks);
      else if (block.kind === "grid" || block.kind === "selfcheck") for (const item of block.items) visit(item.blocks);
    }
  }
  visit(content.intro);
  for (const section of content.sections) visit(section.blocks);
  return result;
}

export function readableResources(content: PageContent): ReaderResource[] {
  return catalogItems(content).filter((item): item is ReaderResource => Boolean(item.id && readerFormat(item.file)));
}
