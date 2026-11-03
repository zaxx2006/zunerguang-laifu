import type { Block, GridItem, Section } from "@/components/content/content-types";

export type EditorialComposition = { lead: string; items: GridItem[]; columns: 2 | 3; supplements: GridItem[] };

function copyItem(text: string): GridItem {
  const [title, ...body] = text.trim().split("\n");
  return { title, blocks: [{ kind: "copy", text: body.join("\n").trim() }] };
}

export function mediaComposition(section: Section): EditorialComposition | undefined {
  if (!section.blocks.every((block) => block.kind === "copy")) return undefined;
  const texts = section.blocks.map((block) => block.text);
  if (section.id === "Q05") {
    const topicStart = texts[0].indexOf("你不是反应过度");
    const supplementStart = texts[2].indexOf("内容形式：");
    if (topicStart < 0 || supplementStart < 0) return undefined;
    const supplements = texts[2].slice(supplementStart).split(/\n\n(?=选题示例：)/u).map(copyItem);
    return { lead: texts[0].slice(0, topicStart).trim(), items: [texts[0].slice(topicStart), texts[1], texts[2].slice(0, supplementStart)].map(copyItem), columns: 3, supplements };
  }
  if (section.id === "Q09" || section.id === "Q16") return { lead: texts[0], items: texts.slice(1).map(copyItem), columns: 2, supplements: [] };
  return undefined;
}

export function hasNumberedFlow(block: Block): boolean {
  return block.kind === "copy" && /(?:^|\n)(?:[（(]\d+[）)]|\d+[.．])\s*\S/u.test(block.text);
}
