import type { Block, CopyBlock, GridItem, SubsectionBlock } from "@/components/content/content-types";
import { recommendationLabelPattern } from "@/lib/editorial-text";

const decimalNumberPattern = /^(\d{1,2}[.．]\d{1,2})\s*(.+)$/u;
const delimitedNumberPattern = /^(?:[（(](\d{1,2})[）)]|(\d{1,2})[.、｜|：:])\s*(.+)$/u;
const bareTwoDigitPattern = /^(\d{2})(.*)$/u;
const durationUnitPattern = /^\s*(?:分钟|小时|天|周|月|年|项|个|页|次)/u;
const stageTitlePattern = /^(阶段[一二三四五六七八九十\d]+[：:])\s*(.+)$/u;
export type StageGroup = { id?: string; label: string; title: string; entries: SubsectionBlock[] };

export function splitNumberedTitle(title: string, allowBareTwoDigit = false): readonly [string, string] | null {
  const decimal = title.match(decimalNumberPattern);
  if (decimal) return [decimal[1], decimal[2].trim()] as const;
  const delimited = title.match(delimitedNumberPattern);
  if (delimited) return [(delimited[1] ?? delimited[2]).padStart(2, "0"), delimited[3].trim()] as const;
  const bare = allowBareTwoDigit ? title.match(bareTwoDigitPattern) : null;
  if (!bare || !bare[2].trim() || durationUnitPattern.test(bare[2])) return null;
  return /^[\s\p{Script=Han}《“"（(]/u.test(bare[2]) ? [bare[1], bare[2].trim()] as const : null;
}

export function groupStageEntries(blocks: Block[]): StageGroup[] | null {
  const stages: StageGroup[] = [];
  for (const block of blocks) {
    if (block.kind !== "subsection" || !block.collapsible) return null;
    const heading = block.title.match(stageTitlePattern);
    if (heading) {
      const stage: StageGroup = { id: block.id, label: heading[1], title: heading[2], entries: [] };
      if (block.blocks.length) {
        const [first, ...body] = block.blocks;
        if (first.kind !== "copy" || first.text.includes("\n") || !splitNumberedTitle(first.text) || !body.length) return null;
        stage.entries.push({ kind: "subsection", title: first.text, blocks: body, collapsible: true });
      }
      stages.push(stage);
    } else {
      const stage = stages.at(-1);
      if (!stage || !splitNumberedTitle(block.title, true) || !block.blocks.length) return null;
      stage.entries.push(block);
    }
  }
  return stages.length > 1 && stages.every((stage) => stage.entries.length) ? stages : null;
}

export function gridItemParts(item: GridItem): { category?: CopyBlock; body: Block[]; details: Block[]; footer: Block[] } {
  const first = item.blocks[0];
  const category = first?.kind === "copy" && /^[（(]\d+[）)][^\n]+$/u.test(first.text) ? first : undefined;
  const body = item.blocks.filter((block) => block !== category);
  const footer: Block[] = [];
  while (body.length) {
    const last = body.at(-1)!;
    if (last.kind !== "actions" && !(last.kind === "copy" && /^(?:摘要预览|目录预览|全文待发布|内容待发布)[^\n]*$/u.test(last.text))) break;
    footer.unshift(body.pop()!);
  }
  const details: Block[] = [];
  for (let index = 0; index < body.length; index += 1) {
    const block = body[index];
    if (block.kind !== "copy") continue;
    const lines = block.text.split("\n");
    const labelIndex = lines.findIndex((line) => recommendationLabelPattern.test(line.trim()));
    if (labelIndex < 0) continue;
    const intro = lines.slice(0, labelIndex).join("\n").trim();
    details.push({ ...block, text: lines.slice(labelIndex).join("\n") }, ...body.slice(index + 1));
    body.splice(index, body.length - index, ...(intro ? [{ ...block, text: intro }] : []));
    break;
  }
  return { category, body, details, footer };
}

export function blockText(block: Block): string {
  if (block.kind === "copy" || block.kind === "notice") return block.text;
  if (block.kind === "disclosure") return `${block.summary}${block.text}`;
  if (block.kind === "subsection") return block.title + block.blocks.map(blockText).join("");
  if (block.kind === "grid" || block.kind === "selfcheck") return block.items.map((item) => item.title + item.blocks.map(blockText).join("")).join("");
  return "";
}
