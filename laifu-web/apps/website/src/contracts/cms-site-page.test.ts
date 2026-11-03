import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { consultationSchema, contentBlockSchema, pageContentSchema, sitePageSchema } from "./cms-site-page";
import { pageRegistry } from "@/lib/page-registry";

const seeds = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), "../../../laifu-cms/seed-data/site-pages.json"), "utf8")) as Array<Record<string, unknown>>;
describe("官网模板内容合同", () => {
  it("保留具体资源附件并拒绝非法文件地址和引用", () => {
    const block = { kind: "catalog", items: [{ title: "指南", summary: "说明", kind: "guide", stage: "decision", href: "/resources/", duration: null, attachmentId: 12, file: { url: "http://127.0.0.1:5158/api/media/file/guide.pdf", filename: "guide.pdf", mimeType: "application/pdf" } }] };
    expect(contentBlockSchema.parse(block)).toEqual(block);
    expect(contentBlockSchema.safeParse({ ...block, items: [{ ...block.items[0], attachmentId: -1 }] }).success).toBe(false);
    expect(contentBlockSchema.safeParse({ ...block, items: [{ ...block.items[0], file: { ...block.items[0].file, url: "javascript:alert(1)" } }] }).success).toBe(false);
  });
  it("前后台使用相同的内容与校验合同", () => {
    for (const name of ["cms-site-page.ts", "page-content.ts"]) expect(fs.readFileSync(path.resolve("../../../laifu-cms/src/contracts", name), "utf8")).toBe(fs.readFileSync(path.resolve("src/contracts", name), "utf8"));
  });
  it("覆盖每个通用页面，且导出的完整正文均可交给 CMS 使用", () => {
    const expected = pageRegistry.filter(page => page.slug && !["services/divorce-coaching", "services/high-conflict-divorce"].includes(page.slug)).map(page => `/${page.slug}/`).sort();
    expect(seeds.map(seed => seed.route).sort()).toEqual(expected);
    for (const seed of seeds) expect(() => sitePageSchema.parse({ ...seed, image: seed.originalImage }), String(seed.route)).not.toThrow();
  });
  it("拒绝脚本链接、不完整表格和重复章节标识", () => {
    const source = { sourceSheet: "验收", intro: [], sections: [{ id: "one", title: "正文", blocks: [{ kind: "actions", actions: [{ label: "链接", href: "javascript:alert(1)" }] }] }], cta: null };
    expect(pageContentSchema.safeParse(source).success).toBe(false);
    source.sections[0].blocks = [];
    expect(pageContentSchema.safeParse({ ...source, sections: [source.sections[0], source.sections[0]] }).success).toBe(false);
    expect(pageContentSchema.safeParse({ ...source, intro: [{ kind: "table", headers: ["一", "二"], rows: [["缺列"]] }] }).success).toBe(false);
  });
});
describe("预约信息校验", () => {
  const valid = { name: "验收测试", phone: "13800000000", wechat: "", consultationType: "深度咨询", concern: "这是开发环境的验收数据", consent: true, website: "" };
  it("要求有效联系方式、明确同意和具体咨询内容", () => {
    expect(consultationSchema.safeParse(valid).success).toBe(true);
    for (const patch of [{ phone: "abc" }, { consent: false }, { concern: "" }, { name: "" }, { website: "bot" }]) expect(consultationSchema.safeParse({ ...valid, ...patch }).success).toBe(false);
  });
});
