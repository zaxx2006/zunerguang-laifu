import fs from "node:fs";
import path from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { TemplatePage } from "@/components/coaching/TemplatePage";
import { sitePageSchema } from "@/contracts/cms-site-page";
import { getPage } from "./page-registry";
import { normalizeSiteHref } from "./site-links";

const seeds = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), "../../../laifu-cms/seed-data/site-pages.json"), "utf8"));
vi.mock("@/lib/cms-content-client", () => ({
  getNavigationPresentation: async () => null,
  getHomePresentation: async () => null,
  getSitePagePresentation: async (route: string) => {
    const seed = seeds.find((page: { route: string }) => page.route === route);
    return sitePageSchema.parse({ ...seed, image: seed.originalImage });
  },
}));

describe("booking with concise FAQ", () => {
  it("keeps three main sections, one form and seven collapsed questions", async () => {
    const seed = seeds.find((page: { route: string }) => page.route === "/book-consultation/");
    expect(seed.content.sections.map((section: { id: string }) => section.id)).toEqual(["Q15", "channel", "faq"]);
    const html = renderToStaticMarkup(await TemplatePage({ page: getPage("book-consultation")! }));
    expect(html).toContain('id="booking-faq"');
    expect(html).toContain('id="booking-channel"');
    expect(html.match(/<form\b/g)).toHaveLength(1);
    expect(html.match(/<details class="structured-disclosure"/g)).toHaveLength(7);
    expect(html).not.toMatch(/<details class="structured-disclosure"[^>]*\sopen/);
    expect(html).not.toContain('id="closing-invitation"');
    expect(html).toContain("法律另有规定或存在人身安全等紧急风险的情形除外");
    expect(html).toContain("正式服务说明或协议为准");
    expect(html).not.toContain("全程严格保密");
  });

  it("removes the standalone FAQ route and sends existing links to booking", () => {
    expect(getPage("faq")).toBeUndefined();
    for (const href of ["/faq", "/faq/", "/faq/#faq-q72"]) expect(normalizeSiteHref(href)).toBe("/book-consultation/#booking-faq");
  });
});
