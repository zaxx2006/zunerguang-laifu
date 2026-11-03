import { ArrowRight } from "lucide-react";
import { ContentBlock, splitNumberedTitle } from "@/components/content/ContentBlock";
import type { Block, Section, SubsectionBlock } from "@/components/content/content-types";

type ResourceCategory = { id: string; number: string; title: string; lead: string; blocks: Block[] };

function prepareCategory(section: Section, index: number): ResourceCategory {
  const disclosure = section.blocks[0] as SubsectionBlock;
  const first = disclosure.blocks[0];
  const guide = index === 0 && first?.kind === "subsection" ? first : undefined;
  const markedTitle = splitNumberedTitle(guide?.title ?? section.title, true);
  const sourceBlocks = guide ? [...guide.blocks, ...disclosure.blocks.slice(1)] : [...disclosure.blocks];
  const copyIndex = sourceBlocks.findIndex((block) => block.kind === "copy");
  const copy = copyIndex >= 0 && sourceBlocks[copyIndex].kind === "copy" ? sourceBlocks[copyIndex] : undefined;
  const [lead = "精品文章与往期主题分享，按议题继续阅读。", ...remainingLines] = copy?.text.split("\n") ?? [];
  const remainingText = remainingLines.join("\n").trim();
  const blocks = copyIndex < 0 ? sourceBlocks : sourceBlocks.flatMap((block, blockIndex) => blockIndex !== copyIndex ? [block] : remainingText ? [{ ...block, text: remainingText }] : []);
  return { id: guide?.id ?? `resources-${section.id.toLowerCase()}`, number: markedTitle?.[0] ?? String(index + 1).padStart(2, "0"), title: markedTitle?.[1] ?? section.title, lead, blocks };
}

export function ResourceCategories({ sections }: { sections: Section[] }) {
  const categories = sections.map(prepareCategory);
  return <div className="resource-category-browser" data-collection="categories">{categories.map((category) => {
    const hasSubsections = category.blocks.some((block) => block.kind === "subsection");
    return <details className="resource-category" id={category.id} name="resource-category" key={category.id}><summary><span className="resource-category__heading"><span className="resource-category__number">{category.number}</span><span className="resource-category__title">{category.title}</span></span><span className="resource-category__lead">{category.lead}</span><span className="resource-category__action"><span className="resource-category__action-label">查看详情</span><ArrowRight aria-hidden="true" size={18} /></span></summary><div className="resource-category__body" data-content-mode={hasSubsections ? "sections" : "prose"}>{category.blocks.map((block, index) => <ContentBlock block={block} columns={hasSubsections ? 2 : 1} presentation="editorial" key={index} />)}</div></details>;
  })}</div>;
}
