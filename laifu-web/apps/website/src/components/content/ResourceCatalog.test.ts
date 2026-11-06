import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ResourceCatalog } from "./ResourceCatalog";
import type { CatalogBlock } from "@/contracts/page-content";

const item: CatalogBlock["items"][number] = { title: "资源验收", summary: "说明", kind: "guide", stage: "decision", href: "/resources/#resources-q06", duration: null };
describe("资源文件入口", () => {
  it("资源列表每页只展示八条，并显示总页数和翻页按钮", () => {
    const items = Array.from({ length: 17 }, (_, index) => ({ ...item, title: `分页资源-${index + 1}` }));
    const html = renderToStaticMarkup(createElement(ResourceCatalog, { block: { kind: "catalog", items } }));
    expect(html.match(/class="resource-card"/g)).toHaveLength(8);
    expect(html).toContain("分页资源-8");
    expect(html).not.toContain("分页资源-9");
    expect(html).toContain("第 1 / 3 页");
    expect(html).toMatch(/<button[^>]*disabled=""[^>]*>上一页<\/button>/);
    expect(html).toContain("下一页");
  });

  it("已上传文件使用真实文件地址，未上传时保留目录入口", () => {
    const html = renderToStaticMarkup(createElement(ResourceCatalog, { block: { kind: "catalog", items: [item, { ...item, title: "已上传指南", file: { url: "https://cms.example.com/api/media/file/guide.pdf", filename: "guide.pdf", mimeType: "application/pdf" } }] } }));
    expect(html).toContain('href="/resources/#resources-q06"');
    expect(html).toContain('href="https://cms.example.com/api/media/file/guide.pdf"');
    expect(html).toContain("查看／下载文件");
    expect(html).toContain("查看分类介绍");
  });
  it("音视频资源提供播放入口", () => {
    const html = renderToStaticMarkup(createElement(ResourceCatalog, { block: { kind: "catalog", items: [{ ...item, kind: "media", file: { url: "https://cms.example.com/recording.mp4", filename: "recording.mp4", mimeType: "video/mp4" } }] } }));
    expect(html).toContain("播放音视频");
    expect(html).toContain('href="https://cms.example.com/recording.mp4"');
  });
  it("DOCX、PDF、EPUB 使用新标签页阅读器，其余附件保留文件入口", () => {
    for (const mimeType of ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/epub+zip"]) {
      const html = renderToStaticMarkup(createElement(ResourceCatalog, { block: { kind: "catalog", items: [{ ...item, id: "guide-one", file: { url: "https://cms.example.com/api/media/file/guide", filename: "guide", mimeType } }] } }));
      expect(html).toContain('href="/resources/read/?resource=guide-one"');
      expect(html).toContain('target="_blank"');
      expect(html).toContain('rel="noopener noreferrer"');
      expect(html).toContain("在线阅读");
    }
  });
});
