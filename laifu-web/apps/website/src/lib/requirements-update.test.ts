import fs from "node:fs";
import path from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { sitePageSchema } from "@/contracts/cms-site-page";
import pages from "@/content/structured-pages.json";
import { AboutPage } from "@/components/coaching/AboutPage";
import { CoursesWorkshopsPage } from "@/components/coaching/CoursesWorkshopsPage";
import { FamilyCollaborationPage } from "@/components/coaching/FamilyCollaborationPage";
import { WorkshopsPage } from "@/components/coaching/WorkshopsPage";

const seeds = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), "../../../laifu-cms/seed-data/site-pages.json"), "utf8"));
vi.mock("@/lib/cms-content-client", () => ({
  getNavigationPresentation: async () => null,
  getHomePresentation: async () => null,
  getSitePagePresentation: async (route: string) => {
    const source = seeds.find((page: { route: string }) => page.route === route);
    return sitePageSchema.parse({ ...source, image: source.originalImage });
  },
}));

describe("November workbook requirements", () => {
  it("keeps the seven changed page snapshots valid and consistent with CMS seeds", () => {
    const routes = { collaboration: "/collaborative-law/", about: "/about/", services: "/services/", resources: "/resources/", articles: "/blog/", courses: "/courses-workshops/", community: "/retreats-workshops/" } as const;
    for (const [key, route] of Object.entries(routes)) {
      const seed = seeds.find((page: { route: string }) => page.route === route);
      expect(sitePageSchema.safeParse({ ...seed, image: seed.originalImage }).success, route).toBe(true);
      expect(seed.content, route).toEqual(pages[key as keyof typeof routes]);
    }
  });
  it("renders all five series under the core curriculum and keeps all six revised courses", async () => {
    const html = renderToStaticMarkup(await CoursesWorkshopsPage());
    expect(html).toContain("核心课程体系");
    expect(html.match(/role="tab"/g)).toHaveLength(5);
    for (const title of ["高冲突离婚入门课", "离婚或谈判证据收集工作坊", "材料整理实战课", "高冲突关系沟通策略课", "书面沟通实战工作坊", "高冲突离婚程序准备课"]) expect(html).toContain(title);
    for (const id of ["q05", "q14", "q19", "q24", "q28"]) expect(html).toContain(`id="courses-${id}"`);
    expect(html).toContain("童年里的两个家");
  });
  it("renders four activity steps and preserves safety disclosures for inline numbered copy", async () => {
    const html = renderToStaticMarkup(await WorkshopsPage());
    expect(html.match(/id="workshop-process-tab-\d"/g)).toHaveLength(4);
    expect(html).toContain("需求咨询");
    expect(html).toContain("活动安全保障");
    expect(html).toContain("危机提示");
    expect(html).toContain("服务边界与重要说明");
  });
  it("keeps service principles and differentiated values collapsed until requested", async () => {
    const html = renderToStaticMarkup(await AboutPage());
    for (const id of ["about-q10", "about-q12", "about-q14", "about-q16", "about-q27", "about-q29", "about-q31"]) {
      const opening = html.match(new RegExp(`<details[^>]*id="${id}"[^>]*>`))?.[0];
      expect(opening, id).toBeDefined();
      expect(opening, id).not.toMatch(/\sopen(?:=|\s|>)/);
    }
    expect(html).toContain("把复杂变成可执行");
  });
  it("keeps booking and support content after removing the collaboration introduction disclosure", async () => {
    const html = renderToStaticMarkup(await FamilyCollaborationPage());
    expect(html).toContain("跨专业协同综合辅导");
    expect(html).not.toContain("各领域专业服务有序、高效推进");
    expect(html).toContain("预约初始评估");
    expect(html).not.toContain('id="collaboration-q11"');
    expect(html).toContain("02 跨领域专业协同");
    expect(html).toContain("跨专业协同综合辅导三种方式");
    expect(html).not.toContain("01 单方协同支持");
    expect(html).not.toContain("邀请对方时：先理清可告知");
    expect(html).toContain('id="collaboration-use-3"');
    expect(html).toContain("03 全周期全程陪伴");
    expect(html).toContain("同意的有效期限");
  });
});
