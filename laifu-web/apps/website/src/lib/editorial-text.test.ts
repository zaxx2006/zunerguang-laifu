import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { parseEditorialRuns } from "@/lib/editorial-text";
import { RichText } from "@/components/content/RichText";
import { StructuredContent } from "@/components/content/StructuredContent";
import { ContentBlock } from "@/components/content/ContentBlock";
import { SectionFrame } from "@/components/content/ContentPrimitives";
import { gridItemParts } from "@/lib/content-layout";
import type { Block, GridItem, PageContent } from "@/components/content/content-types";
import pages from "@/content/structured-pages.json";

const renderCopy = (text: string, presentation: "default" | "editorial") => renderToStaticMarkup(createElement(RichText, { text, presentation }));
const plain = (html: string) => html.replace(/<[^>]*>/gu, "").replace(/相关阅读/gu, "").replace(/[\s：:｜|]/gu, "");

function copyTexts(blocks: Block[]): string[] {
  return blocks.flatMap((block) => {
    if (["copy", "notice", "disclosure"].includes(block.kind)) return [(block as { text: string }).text];
    if (block.kind === "subsection") return copyTexts(block.blocks);
    if (block.kind === "grid" || block.kind === "selfcheck") return block.items.flatMap((item) => copyTexts(item.blocks));
    return [];
  });
}

describe("global editorial typography", () => {
  it("applies editorial typography to every published content page", () => {
    for (const pageKey of Object.keys(pages) as (keyof typeof pages)[]) {
      const html = renderToStaticMarkup(createElement(StructuredContent, { pageKey }));
      expect(html.includes('data-typography="editorial"'), pageKey).toBe(true);
    }
  });
  it("preserves all source copy and professional boundary notes", () => {
    for (const pageKey of Object.keys(pages) as (keyof typeof pages)[]) {
      const page = pages[pageKey] as PageContent;
      const texts = [...copyTexts(page.intro), ...page.sections.flatMap((section) => copyTexts(section.blocks)), ...(page.cta ? [page.cta.body] : [])];
      for (const text of texts) expect(plain(renderCopy(text, "editorial")), `${pageKey}: ${text}`).toBe(plain(renderCopy(text, "default")));
    }
  });
  it("separates introduction, metadata and media titles without losing the closing note", () => {
    const runs = parseEditorialRuns("推荐内容\n·3 分钟｜第一个话题\n·5 分钟｜第二个话题\n更多深度对谈、播客与专业访谈。");
    expect(runs.map((run) => run.kind)).toEqual(["label", "media", "note"]);
    expect(runs[1].lines).toHaveLength(2);
    const html = renderCopy("推荐内容\n·3 分钟｜第一个话题\n·5 分钟｜第二个话题\n更多深度对谈、播客与专业访谈。", "editorial");
    expect(html).toContain('class="rich-media-list__duration"');
    expect(html).not.toContain("<a");
  });
  it("keeps labels separate from a card's descriptive heading", () => {
    expect(parseEditorialRuns("看清互动模式，建立边界\n适合你，如果：\n·第一个情形\n·第二个情形").map((run) => run.kind)).toEqual(["heading", "label", "list"]);
    expect(parseEditorialRuns("这是完整的一句话。\n这是另一句话。").map((run) => run.kind)).toEqual(["paragraph", "paragraph"]);
  });
  it("pairs tool descriptions and retains trailing safety text", () => {
    const runs = parseEditorialRuns("·准备清单\n第一份清单说明。\n·记录清单\n第二份清单说明。\n请咨询专业人士。");
    expect(runs.map((run) => run.kind)).toEqual(["entries", "paragraph"]);
    expect(runs[0].lines).toEqual(["准备清单\n第一份清单说明。", "记录清单\n第二份清单说明。"]);
  });
  it("gives named bullet points a title and description without changing the copy", () => {
    const text = "·精准处境研判：看清当下真实处境，识别核心压力来源；\n·个性化需求梳理：洞察你的真实诉求，厘清事情的轻重缓急；";
    const runs = parseEditorialRuns(text);
    expect(runs[0].kind).toBe("entries");
    expect(runs[0].lines[0]).toBe("精准处境研判：\n看清当下真实处境，识别核心压力来源；");
    const html = renderCopy(text, "editorial");
    expect(html).toContain('<dl class="rich-entry-list" data-list-design="entries"');
    expect(html).toContain("<dt>精准处境研判：</dt><dd>看清当下真实处境，识别核心压力来源；</dd>");
    expect(plain(html)).toBe(plain(renderCopy(text, "default")));
  });
  it("keeps mixed, incomplete and timed bullet points as ordinary lists", () => {
    for (const text of ["·帮助家庭成员理解：\n·家庭关系发生变化", "·清单：准备资料\n·梳理真实需求", "·09:30 开始\n·10:30 结束", "·https://example.com\n·https://example.org"]) expect(parseEditorialRuns(text)[0].kind).toBe("list");
  });
  it("renders the four homepage support outcomes as definition entries", () => {
    const html = renderToStaticMarkup(createElement(StructuredContent, { pageKey: "home" }));
    const section = html.match(/<section[^>]+id="home-assessment"[\s\S]*?<\/section>/u)?.[0];
    expect(section?.match(/<dt>/gu)).toHaveLength(4);
    expect(section).not.toContain('class="rich-bullet-list"');
  });
  it("distinguishes a guide description from a reading directory", () => {
    expect(parseEditorialRuns("《一份指南》\n这是这份指南的完整介绍内容。")[0].kind).toBe("heading");
    expect(parseEditorialRuns("《第一篇文章》\n《第二篇文章》")[0].kind).toBe("reading");
  });
  it("does not turn a standalone category label into a workflow", () => {
    const html = renderCopy("（2）实务与方法", "editorial");
    expect(html).toContain('class="rich-label"');
    expect(html).not.toContain("structured-flow");
  });
  it("keeps numbered headings with their paragraphs despite source blank lines", () => {
    const html = renderCopy("（1）专业边界\n\n第一段说明。\n\n第二段说明。\n\n（2）安全提示\n\n请联系专业人士。", "editorial");
    expect(html.match(/class="structured-flow"/gu)).toHaveLength(1);
    expect(html.match(/class="structured-step-card"/gu)).toHaveLength(2);
    expect(html).toMatch(/第一段说明。[\s\S]*第二段说明。[\s\S]*<\/article>/u);
  });
  it("keeps every numbered item and its full explanation in one shared flow", () => {
    const html = renderCopy("1. 第一项\n简短说明。\n\n第一项的补充段落。\n\n2. 第二项\n另一段说明。\n\n第二项的补充段落。", "editorial");
    expect(html.match(/class="structured-flow"/gu)).toHaveLength(1);
    expect(html.match(/class="structured-step-card"/gu)).toHaveLength(2);
    expect(html).toMatch(/第一项[\s\S]*第一项的补充段落。[\s\S]*<\/article>[\s\S]*第二项[\s\S]*第二项的补充段落。[\s\S]*<\/article>/u);
  });
  it("retains each resource category number inside its interactive row", () => {
    const html = renderToStaticMarkup(createElement(StructuredContent, { pageKey: "resources" }));
    const category = html.match(/<details[^>]+id="resources-q20"[\s\S]*?<\/details>/u)?.[0];
    expect(category).toContain('class="resource-category__number">05</span>');
    expect(category).toContain('class="resource-category__title">短音频与视频</span>');
    expect(category).not.toContain("05｜");
  });
  it("uses fixed columns according to collection semantics", () => {
    const html = renderToStaticMarkup(createElement(StructuredContent, { pageKey: "articles" }));
    expect(html).toContain('data-columns="2"');
    const home = renderToStaticMarkup(createElement(StructuredContent, { pageKey: "home" }));
    expect(home).toContain('class="card-grid" data-columns="2"');
    expect(home).toContain('class="steps" data-columns="1"');
  });
  it("separates source step numbers from their headings", () => {
    const source = pages.services as PageContent;
    const block = source.sections.find((section) => section.id === "Q90")!.blocks.find((entry) => entry.kind === "grid" && entry.mode === "steps")!;
    const html = renderToStaticMarkup(createElement(ContentBlock, { block, presentation: "editorial" }));
    expect(html.match(/class="content-card__number"/gu)).toHaveLength(6);
    expect(html).toContain('<span class="content-card__number">01</span><h3>想清楚：理清困惑 梳理思路</h3>');
    expect(html).not.toContain("1.想清楚");
  });
  it("keeps the revised participation heading and numbered process steps", () => {
    const html = renderToStaticMarkup(createElement(StructuredContent, { pageKey: "community" }));
    expect(html).toContain('<span class="section-cluster__title">参与流程</span>');
    expect(html).toContain("需求咨询：简述所处阶段、困扰、时间与预算");
    expect(html).not.toContain(">04参与流程<");
  });
  it("keeps each numbered flow label in a dedicated title track", () => {
    const html = renderCopy("（1）清晰梳理\n说明内容。", "editorial");
    expect(html).toContain('class="structured-step-card__marker">（1）</span><div class="structured-step-card__content"><h4>清晰梳理</h4>');
  });
  it("groups the six resource categories without changing source data or losing anchors", () => {
    const before = JSON.stringify(pages.resources);
    const html = renderToStaticMarkup(createElement(StructuredContent, { pageKey: "resources" }));
    expect(html).toContain('data-collection="categories"');
    expect(html.match(/name="resource-category"/gu)).toHaveLength(6);
    for (const id of ["q06", "q07", "q09", "q10", "q11", "q12", "q14", "q16", "q18", "q20", "q22", "q23", "q25"]) expect(html).toContain(`id="resources-${id}"`);
    expect(JSON.stringify(pages.resources)).toBe(before);
  });
  it("renders multiline title descriptions as body copy, not a single oversized heading", () => {
    const block: Block = { kind: "subsection", title: "资源分组\n第一段说明。\n\n第二段说明。", blocks: [] };
    const html = renderToStaticMarkup(createElement(ContentBlock, { block, presentation: "editorial" }));
    expect(html).toContain("<h3>资源分组</h3>");
    expect(html).toContain("第一段说明。");
    expect(html).toContain("第二段说明。");
  });
  it("distinguishes chapter numbers from durations and avoids duplicate markers", () => {
    const numbered = renderToStaticMarkup(createElement(SectionFrame, { index: 0, title: "01关于焕屿", children: null }));
    expect(numbered).toContain('<span aria-hidden="true" class="section-heading__number">01</span>');
    expect(numbered).toContain('<span class="section-heading__phrase">关于焕屿</span>');
    expect(numbered).not.toContain('class="section-index"');
    const duration = renderToStaticMarkup(createElement(SectionFrame, { index: 0, title: "5分钟自我梳理", children: null }));
    expect(duration).toContain('<span aria-hidden="true" class="section-heading__number">01</span>');
    expect(duration).toContain('<span class="section-heading__phrase">5分钟自我梳理</span>');
  });
  it("does not force a home title into one line per punctuation mark", () => {
    const html = renderToStaticMarkup(createElement(SectionFrame, { id: "home-approach", index: 0, title: "以人为本，立足现实，稳步破局", children: null }));
    expect(html.match(/class="section-heading__phrase"/gu)).toHaveLength(1);
    expect(html).toContain('>以人为本，立足现实，稳步破局</span>');
  });
  it("separates card body and trailing status without mutating source content", () => {
    const item: GridItem = { title: "文章", blocks: [{ kind: "copy", text: "（1）情绪与恢复" }, { kind: "copy", text: "正文说明。" }, { kind: "copy", text: "专业边界说明，不能替代专业意见。" }, { kind: "copy", text: "摘要预览 · 全文待发布" }] };
    const before = JSON.stringify(item);
    const parts = gridItemParts(item);
    expect(parts.category?.text).toBe("（1）情绪与恢复");
    expect(parts.body).toHaveLength(2);
    expect(parts.footer).toEqual([{ kind: "copy", text: "摘要预览 · 全文待发布" }]);
    expect(JSON.stringify(item)).toBe(before);
  });
  it("gives every article a category, body and footer slot for row alignment", () => {
    const block = (pages.articles as PageContent).sections.find((section) => section.id === "Q07")!.blocks.find((entry) => entry.kind === "grid")!;
    const html = renderToStaticMarkup(createElement(ContentBlock, { block, presentation: "editorial" }));
    expect(html).toContain('data-rows="4"');
    for (const slot of ["category", "body", "footer"]) expect(html.match(new RegExp(`class="content-card__${slot}"`, "g"))).toHaveLength(6);
    for (const label of ["（1）情绪与恢复", "（2）实务与方法", "（3）生活重建"]) expect(html.split(label)).toHaveLength(3);
  });
  it("uses one compact list model for guide, workshop and course recommendations", () => {
    for (const text of ["推荐指南：\n《第一份指南》\n《第二份指南》", "近期主题：\n·第一个主题\n·第二个主题", "推荐课程：\n第一门课程\n第二门课程"]) {
      expect(parseEditorialRuns(text).map((run) => run.kind)).toEqual(["label", "recommendations"]);
      expect(renderCopy(text, "editorial")).toContain('class="rich-recommendation-list"');
    }
    const runs = parseEditorialRuns("近期主题：\n·第一个主题\n·第二个主题\n·线上及线下场次以最新活动安排为准。");
    expect(runs.map((run) => run.kind)).toEqual(["label", "recommendations", "note"]);
    expect(runs[1].lines).toHaveLength(2);
  });
  it("separates recommendations from the introduction and preserves subsection anchors", () => {
    const source = pages.articles as PageContent;
    const section = source.sections.find((entry) => entry.id === "Q23")!;
    const before = JSON.stringify(section);
    for (const block of section.blocks) {
      if (block.kind !== "subsection") continue;
      const parts = gridItemParts(block);
      expect(parts.body).toHaveLength(1);
      expect(parts.details).toHaveLength(1);
      expect(parts.footer).toHaveLength(1);
      const joined = [...parts.body, ...parts.details].map((part) => part.kind === "copy" ? part.text : "").join("").replace(/\s/gu, "");
      const original = block.blocks.filter((part) => part.kind === "copy").map((part) => part.text).join("").replace(/\s/gu, "");
      expect(joined).toBe(original);
    }
    const html = renderToStaticMarkup(createElement(StructuredContent, { pageKey: "articles" }));
    const rendered = html.match(/<section[^>]+id="articles-q23"[\s\S]*?<\/section>/u)![0];
    expect(rendered.match(/class="content-card__details"/gu)).toHaveLength(3);
    expect(rendered.match(/class="rich-recommendation-list"/gu)).toHaveLength(3);
    expect(rendered).not.toContain('class="rich-reading-list"');
    for (const id of ["articles-q24", "articles-q26", "articles-q28"]) expect(rendered).toContain(`id="${id}"`);
    expect(JSON.stringify(section)).toBe(before);
  });
});
