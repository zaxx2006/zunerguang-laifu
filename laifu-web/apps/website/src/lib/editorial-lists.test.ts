import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { RichText } from "@/components/content/RichText";
import { StructuredContent } from "@/components/content/StructuredContent";
import { editorialListLayout, parseEditorialRuns, splitEditorialStatement } from "@/lib/editorial-text";
import pages from "@/content/structured-pages.json";

const bulletCount = (text: string) => text.split("\n").filter((line) => /^[·•🔹]/u.test(line.trim())).length;
const renderedBulletCount = (html: string) => [...html.matchAll(/data-source-bullets="(\d+)"/gu)].reduce((total, match) => total + Number(match[1]), 0);
const normalize = (text: string) => text.replace(/^[·•🔹]\s*/gmu, "").replace(/[\s：:｜|]/gu, "");
const plainText = (html: string) => html.replace(/<[^>]*>/gu, "").replace(/&(amp|lt|gt|quot|#x27);/gu, (_, entity: string) => ({ amp: "&", lt: "<", gt: ">", quot: '"', "#x27": "'" })[entity]!);

function bulletTexts(value: unknown, path = ""): { path: string; text: string }[] {
  if (typeof value === "string") return bulletCount(value) ? [{ path, text: value }] : [];
  return value && typeof value === "object" ? Object.entries(value).flatMap(([key, item]) => bulletTexts(item, `${path}.${key}`)) : [];
}

describe("site-wide editorial lists", () => {
  it("accounts for every source bullet, including nested headings and resource descriptions", () => {
    const sources = bulletTexts(pages);
    expect(sources.length).toBe(140);
    expect(sources.reduce((total, source) => total + bulletCount(source.text), 0)).toBe(1113);
    for (const source of sources) {
      const runs = parseEditorialRuns(source.text);
      expect(runs.reduce((total, run) => total + (run.sourceBullets ?? 0), 0), source.path).toBe(bulletCount(source.text));
      const html = renderToStaticMarkup(createElement(RichText, { text: source.text, presentation: "editorial" }));
      expect(renderedBulletCount(html), source.path).toBe(bulletCount(source.text));
      expect(normalize(plainText(html)), source.path).toBe(normalize(source.text));
      expect(html, source.path).not.toContain("rich-bullet-list");
      expect(html, source.path).not.toMatch(/<ul(?![^>]*data-list-design=)/u);
    }
  });
  it("covers all bullets in the final composed pages, not only isolated text blocks", () => {
    let rendered = 0;
    for (const pageKey of Object.keys(pages) as (keyof typeof pages)[]) {
      const html = renderToStaticMarkup(createElement(StructuredContent, { pageKey }));
      const expected = bulletTexts(pages[pageKey]).reduce((total, source) => total + bulletCount(source.text), 0);
      expect(renderedBulletCount(html), pageKey).toBe(expected);
      expect(html, pageKey).not.toMatch(/<ul(?![^>]*data-list-design=)/u);
      rendered += renderedBulletCount(html);
    }
    expect(rendered).toBe(1113);
  });
  it("keeps question prompts, compact points and full statements distinct", () => {
    expect(editorialListLayout(["情绪与身心稳定", "律师咨询准备"])).toBe("index");
    expect(editorialListLayout(["孩子和谁居住", "如何共同安排时间", "发生分歧时，怎样避免孩子受到牵连。"])).toBe("index");
    expect(editorialListLayout(["哪些信息需要回复", "何时可以暂停"])).toBe("prompts");
    expect(editorialListLayout(["对方通过亲友、学校、单位、投诉或法律程序持续施压，让你无法维持正常生活"])).toBe("statements");
    expect(editorialListLayout(["准备咨询律师，却无法清晰整理事实、问题和目标"])).toBe("statements");
    expect(splitEditorialStatement("准备咨询律师，却无法清晰整理事实、问题和目标")).toEqual(["准备咨询律师，", "却无法清晰整理事实、问题和目标"]);
    expect(parseEditorialRuns("·《准备指南》\n·《生活重建指南》")[0].kind).toBe("reading");
  });
  it("keeps ordinary list lead-ins in body typography across blank lines", () => {
    const text = "我们可以陪你：\n\n·梳理当前处境\n·明确现阶段重点";
    const html = renderToStaticMarkup(createElement(RichText, { text, presentation: "editorial" }));
    expect(parseEditorialRuns(text).map((run) => run.kind)).toEqual(["paragraph", "list"]);
    expect(html).not.toContain('class="rich-list-section"');
    expect(html).toContain('class="rich-paragraph">我们可以陪你：</p>');
    expect(html).toContain('class="rich-point-list"');
    expect(normalize(plainText(html))).toBe(normalize(text));
  });
  it("does not leave default presentation bullet lists unstyled", () => {
    const html = renderToStaticMarkup(createElement(RichText, { text: "·整理材料\n·准备问题", presentation: "default" }));
    expect(html).toContain('data-list-design="index"');
    expect(html).toContain('role="list"');
    expect(renderedBulletCount(html)).toBe(2);
  });
});
