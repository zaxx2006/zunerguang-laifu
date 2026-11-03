import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import pages from "@/content/structured-pages.json";
import { StructuredContent } from "@/components/content/StructuredContent";
import { ContentBlock } from "@/components/content/ContentBlock";
import { blockText, groupStageEntries, splitNumberedTitle } from "@/lib/content-layout";
import type { Block, PageContent, SubsectionBlock } from "@/components/content/content-types";

const source = (pages.services as PageContent).sections.find((section) => section.id === "Q160")!;
const subsection = (title: string, blocks: Block[] = []): SubsectionBlock => ({ kind: "subsection", title, blocks, collapsible: true });

describe("semantic directory layout", () => {
  it("separates heading labels while preserving duration-led titles", () => {
    expect(splitNumberedTitle("04参与流程", true)).toEqual(["04", "参与流程"]);
    expect(splitNumberedTitle("1.主题工作坊与讲座", true)).toEqual(["01", "主题工作坊与讲座"]);
    expect(splitNumberedTitle("4.1 需求诊断", true)).toEqual(["4.1", "需求诊断"]);
    expect(splitNumberedTitle("30 分钟轻量咨询", true)).toBeNull();
  });
  it("groups thirteen services under seven explicit source stages without changing text or data", () => {
    const before = JSON.stringify(source);
    const groups = groupStageEntries(source.blocks)!;
    expect(groups.map((group) => group.entries.length)).toEqual([3, 3, 1, 2, 1, 1, 2]);
    expect(groups.flatMap((group) => group.entries).map((entry) => Number(entry.title.match(/^\d+/u)![0]))).toEqual(Array.from({ length: 13 }, (_, index) => index + 1));
    expect(groups.map((group) => group.label + group.title + group.entries.map(blockText).join("")).join("")).toBe(source.blocks.map(blockText).join(""));
    expect(groups[0].entries[0].blocks).toEqual((source.blocks[0] as SubsectionBlock).blocks.slice(1));
    expect(groups[6].entries[1]).toBe(source.blocks.at(-1));
    expect(JSON.stringify(source)).toBe(before);
  });
  it("preserves source anchors and renders stage headings instead of empty disclosures", () => {
    const html = renderToStaticMarkup(createElement(StructuredContent, { pageKey: "services" }));
    for (const block of source.blocks as SubsectionBlock[]) expect(html.match(new RegExp(`id="${block.id}"`, "gu"))).toHaveLength(1);
    expect(html.match(/class="stage-directory__group"/gu)).toHaveLength(7);
    expect(html).not.toMatch(/<summary[^>]*>[^<]*阶段/u);
    expect(html).toContain("咨询律师前准备指南｜免费资源");
    expect(html).toContain('href="/resources/#resources-availability"');
    expect(html).toContain('href="/retreats-workshops/#community-availability"');
  });
  it("only groups the explicitly staged directory, not unrelated cards or FAQ collections", () => {
    const matches = Object.entries(pages).flatMap(([key, page]) => (page as PageContent).sections.filter((section) => groupStageEntries(section.blocks)).map((section) => `${key}/${section.id}`));
    expect(matches).toEqual(["services/Q160"]);
  });
  it("falls back without losing content if a stage structure is incomplete or ambiguous", () => {
    const service = subsection("1. 支持", [{ kind: "copy", text: "原始正文" }]);
    expect(groupStageEntries([service, subsection("阶段一：准备"), subsection("阶段二：行动")])).toBeNull();
    expect(groupStageEntries([subsection("阶段一：准备", [{ kind: "copy", text: "普通段落" }]), service, subsection("阶段二：行动"), service])).toBeNull();
    expect(groupStageEntries([subsection("阶段一：准备"), service, subsection("阶段二：行动")])).toBeNull();
    expect(groupStageEntries([subsection("阶段一：准备"), service])).toBeNull();
  });
  it("reserves a semantic-free number slot for unnumbered siblings when requested", () => {
    const html = renderToStaticMarkup(createElement(ContentBlock, { block: subsection("补充说明", [{ kind: "copy", text: "正文" }]), reserveNumber: true, presentation: "editorial" }));
    expect(html).toContain('data-reserve-number="true"');
    expect(html).toContain('class="structured-disclosure__number" aria-hidden="true"></span>');
    expect(html).not.toContain('data-numbered="true"');
  });
});
