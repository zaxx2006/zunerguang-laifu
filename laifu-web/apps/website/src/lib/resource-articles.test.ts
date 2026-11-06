import fs from "node:fs";
import path from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { TemplatePage } from "@/components/coaching/TemplatePage";
import { sitePageSchema } from "@/contracts/cms-site-page";
import pages from "@/content/structured-pages.json";
import { includeResourceArticles } from "./resource-articles";
import { getPage, pageRegistry } from "./page-registry";
import { normalizeSiteHref } from "./site-links";
import type { PageContent } from "@/contracts/page-content";

const seeds = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), "../../../laifu-cms/seed-data/site-pages.json"), "utf8"));
vi.mock("@/lib/cms-content-client", () => ({
  getNavigationPresentation: async () => ({ footerColumns: [{ title: "学习与专业成长", links: [{ label: "文章专栏", href: "/blog/" }, { label: "资源中心", href: "/resources/" }] }] }),
  getHomePresentation: async () => null,
  getSitePagePresentation: async (route: string) => {
    const seed = seeds.find((page: { route: string }) => page.route === route);
    return sitePageSchema.parse({ ...seed, image: seed.originalImage });
  },
}));

describe("articles within the resource center", () => {
  it("renders articles inside resources and removes the stale CMS footer entry", async () => {
    const html = renderToStaticMarkup(await TemplatePage({ page: getPage("resources")! }));
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    expect(html).toContain('id="resources-articles"');
    expect(html).toContain('href="#resources-articles"');
    expect(html).toContain('id="articles-q09"');
    expect(html.match(/class="blog-topic-entry"/g)).toHaveLength(6);
    expect(html).not.toContain('href="/blog/"');
    expect(html.match(/<footer[\s\S]*<\/footer>/)?.[0]).not.toContain("文章专栏");
  });

  it("includes article summaries and topics without a second page hero or sales sections", () => {
    const resources = pages.resources as PageContent;
    const before = JSON.stringify(resources);
    const merged = includeResourceArticles(resources, pages.articles as PageContent);
    const ids = merged.sections.map(section => section.id);
    expect(ids.slice(ids.indexOf("articles"), ids.indexOf("articles") + 5)).toEqual(["articles", "articles-q04", "articles-q07", "articles-q09", "articles-q32"]);
    expect(JSON.stringify(merged)).toContain("总忍不住反复回想过去，怎么办？");
    expect(JSON.stringify(merged)).toContain("/blog/topics/high-conflict/");
    expect(ids).not.toContain("articles-q23");
    expect(new Set(ids).size).toBe(ids.length);
    expect(JSON.stringify(resources)).toBe(before);
  });

  it("removes the standalone page from public routes and places topics under resources", () => {
    expect(getPage("blog")).toBeUndefined();
    expect(pageRegistry.some(page => page.slug === "blog")).toBe(false);
    expect(getPage("blog/topics/high-conflict")?.parentSlug).toBe("resources");
  });

  it("sends article index links to resources while preserving topic destinations", () => {
    expect(normalizeSiteHref("/blog/")).toBe("/resources/#resources-articles");
    expect(normalizeSiteHref("/blog/#articles-q09")).toBe("/resources/#articles-q09");
    expect(normalizeSiteHref("/blog/topics/high-conflict/")).toBe("/blog/topics/high-conflict/");
  });
});
