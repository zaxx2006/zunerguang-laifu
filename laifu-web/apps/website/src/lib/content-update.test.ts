import fs from "node:fs";
import path from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { StructuredContent, RichText } from "@/components/content/StructuredContent";
import pages from "@/content/structured-pages.json";
import { getPage } from "@/lib/page-registry";
import { activityLinks, primaryLinks, serviceGroups } from "@/lib/navigation";

const read = (file: string) => fs.readFileSync(path.join(process.cwd(), file), "utf8");
const render = (key: keyof typeof pages) => renderToStaticMarkup(createElement(StructuredContent, { pageKey: key }));
const plain = (html: string) => html.replace(/<[^>]*>/g, "").replace(/\s/g, "");

describe("September workbook revision", () => {
  it("retains every line around mixed lists and numbered groups", () => {
    const source = "说明\n·第一项\n列表后的专业边界\n·第二项\n最后的补充\n\n第一步：稳定\n·观察\n不要替代专业判断";
    const result = renderToStaticMarkup(createElement(RichText, { text: source }));
    for (const text of source.split("\n").filter(Boolean)) expect(plain(result).replace(/：/g, "")).toContain(text.replace(/^·/, "").replace(/[\s：]/g, ""));
  });
  it("uses the updated service versions and removes superseded independent offers", () => {
    const parent = render("coParenting");
    expect(parent).toContain("父母分开后，怎样更好地保护和照顾孩子");
    expect(plain(parent)).toContain("服务六协议或判决后的执行支持");
    expect(parent).not.toContain("服务六｜协议或判决后的执行支持");
    expect(parent).toContain("书面沟通");
    expect(parent).toContain("Substance");
    expect(render("collaboration")).toContain("信息分享须经书面同意");
    expect(render("collaboration")).toContain("家事协同支持暂停或结束时");
    expect(render("decisionAlias")).not.toContain("三大核心准备模块");
    expect(render("fullCycleAlias")).not.toContain("通常为 3—12个月");
    expect(getPage("services/co-parenting")?.titleZh).toBe("孩子养育支持辅导");
    for (const slug of ["about", "academy", "retreats-workshops"]) expect(getPage(slug)?.eyebrow).toBe("");
  });
  it("adds founder, remarriage and complete article topic pages", () => {
    expect(render("founder")).toContain("PCA-TJ");
    expect(render("founder")).toContain("300亿元+");
    expect(render("remarriage")).toContain("父母出资");
    expect(render("remarriage")).toContain("不替代律师");
    expect(Object.keys(pages).filter((key) => key.startsWith("topic"))).toHaveLength(6);
    expect(getPage("about/founder")).toBeDefined();
    expect(getPage("services/remarriage-preparation")).toBeDefined();
  });
  it("implements source suggestions using semantic controls and real availability labels", () => {
    expect(render("divorceCoaching")).toContain("<table");
    expect(render("divorceCoaching")).toContain("<details");
    expect(render("collaboration").match(/<table/g)).toHaveLength(2);
    expect(render("resources")).toContain('aria-label="按资源形式筛选"');
    expect(render("resources")).toContain('aria-label="按所处阶段筛选"');
    expect(render("resources")).toContain('name="resource-catalog-item"');
    expect(render("coParenting").match(/type="checkbox"/g)).toHaveLength(7);
    expect(render("remarriage").match(/type="checkbox"/g)).toHaveLength(7);
    expect(render("booking")).toContain("预约尚未开放");
    expect(render("booking")).toMatch(/<fieldset[^>]*\sdisabled(?:=|\s|>)/u);
    expect(render("media")).toContain("暂未提供可播放音视频");
    expect(render("courses")).toContain("童年里的两个家");
    expect(render("faq").match(/structured-disclosure"/g)?.length).toBeGreaterThan(30);
  });
  it("publishes the required top navigation and updated footer", () => {
    expect(primaryLinks.map(([, label]) => label)).toEqual(["文章专栏", "资源中心", "线下活动", "媒体动态", "常见问题"]);
    expect(activityLinks).toContainEqual(["/courses-workshops/", "课程与工作坊"]);
    expect(getPage("courses-workshops")?.parentSlug).toBe("retreats-workshops");
    expect(render("community")).toContain('href="/courses-workshops/"');
    const links = serviceGroups.flatMap((group) => [...group.links]);
    expect(links.map(([href]) => href)).not.toContain("/services/decision-support/");
    expect(links.some(([href]) => href === "/services/remarriage-preparation/")).toBe(true);
    expect(read("src/components/site/Footer.tsx")).toContain("重掌生活主动权");
    expect(render("home")).toContain("停止内耗，平稳状态");
    expect(render("home")).not.toContain("离婚启动期辅导体系");
  });
  it("keeps all content in framed sections and all internal hashes resolvable", () => {
    const html = Object.fromEntries(Object.keys(pages).map((key) => [key, render(key as keyof typeof pages)]));
    for (const [key, value] of Object.entries(html)) {
      expect(value, key).toMatch(/^<section/);
      const ids = [...value.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
      expect(new Set(ids).size, key).toBe(ids.length);
      expect(value, key).not.toMatch(/【建议】|链接地址：|建议跳转页面：|按钮文案：|SEO 标题/);
    }
  });
  it("keeps the brand story in a continuous reading column beside its portrait", () => {
    const html = render("about");
    const sectionStart = html.lastIndexOf("<section", html.indexOf('id="about-q06"'));
    const sectionEnd = html.indexOf(">", sectionStart);
    expect(html.slice(sectionStart, sectionEnd)).not.toContain("data-prose-columns");
    expect(html.slice(sectionStart, sectionEnd)).toContain('data-media="portrait"');
  });
});
