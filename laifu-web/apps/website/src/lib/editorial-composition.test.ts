import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import pages from "@/content/structured-pages.json";
import { StructuredContent } from "@/components/content/StructuredContent";
import { blockText } from "@/lib/content-layout";
import { mediaComposition } from "@/lib/editorial-composition";
import type { PageContent } from "@/components/content/content-types";

describe("editorial section composition", () => {
  it("rearranges media topics without deleting, inventing or mutating source text", () => {
    const page = pages.media as PageContent;
    const before = JSON.stringify(page);
    for (const id of ["Q05", "Q09", "Q16"]) {
      const section = page.sections.find((entry) => entry.id === id)!;
      const composed = mediaComposition(section)!;
      const original = section.blocks.map(blockText).join("").replace(/\s/gu, "");
      const output = [composed.lead, ...composed.items.map((item) => item.title + item.blocks.map(blockText).join("")), ...composed.supplements.map((item) => item.title + item.blocks.map(blockText).join(""))].join("").replace(/\s/gu, "");
      expect(output, id).toBe(original);
    }
    expect(JSON.stringify(page)).toBe(before);
  });
  it("keeps availability visible without treating it as a numbered chapter", () => {
    const html = renderToStaticMarkup(createElement(StructuredContent, { pageKey: "media" }));
    const notice = html.match(/<section[^>]+id="media-availability"[\s\S]*?<\/section>/u)![0];
    expect(notice).toContain('data-layout="notice"');
    expect(notice).toContain("暂未提供可播放音视频");
    expect(notice).not.toContain('class="section-heading__number"');
  });
  it("uses only necessary, lazy and accessible photos below the hero", () => {
    const html = renderToStaticMarkup(createElement(StructuredContent, { pageKey: "media" }));
    const images = html.match(/<img[^>]+>/gu)!;
    expect(images).toHaveLength(2);
    for (const image of images) expect(image).toContain('loading="lazy"');
    expect(images.filter((image) => image.includes('/images/editorial/'))).toHaveLength(2);
    for (const image of images.filter((entry) => entry.includes('/images/editorial/'))) expect(image).not.toContain('alt=""');
    expect(images.some((image) => image.includes('/generated/illustrations/'))).toBe(false);
    for (const section of pages.media.sections) expect(html).toContain(`id="media-${section.id.toLowerCase()}"`);
    expect(html).toContain('data-columns="3"');
    expect(html).toContain('data-columns="2"');
  });
});
