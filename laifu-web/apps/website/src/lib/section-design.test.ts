import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import pages from "@/content/structured-pages.json";
import { StructuredContent } from "@/components/content/StructuredContent";
import { pageRegistry } from "@/lib/page-registry";
import { resolveSectionMedia, sectionPlans } from "@/lib/section-design";
import type { PageKey } from "@/lib/section-design";

describe("section-led page design", () => {
  it("classifies every source section exactly once and in source order", () => {
    expect(Object.keys(sectionPlans)).toEqual(Object.keys(pages));
    for (const pageKey of Object.keys(pages) as PageKey[]) {
      const sourceIds = pages[pageKey].sections.map((section) => section.id);
      const plan = sectionPlans[pageKey];
      expect(plan.sourceSectionCount, pageKey).toBe(sourceIds.length);
      expect(plan.sectionCount, pageKey).toBe(plan.sections.length);
      expect(plan.sections.flatMap((section) => section.sourceIds), pageKey).toEqual(sourceIds);
    }
  });
  it("uses explicit section settings that divide the 12-column foundation", () => {
    for (const [pageKey, plan] of Object.entries(sectionPlans)) for (const section of plan.sections) {
      expect(12 % section.columns, `${pageKey}/${section.id}`).toBe(0);
      expect(section.role, `${pageKey}/${section.id}`).toBeTruthy();
      expect(section.tone, `${pageKey}/${section.id}`).toBeTruthy();
      expect(section.density, `${pageKey}/${section.id}`).toBeTruthy();
      if (section.sourceIds.length > 1) expect(section.columns, `${pageKey}/${section.id}`).toBeGreaterThan(1);
    }
  });
  it("keeps prose in reading order independently of collection columns", () => {
    for (const [pageKey, plan] of Object.entries(sectionPlans)) {
      expect(plan.introProseColumns, pageKey).toBeUndefined();
      for (const section of plan.sections) expect(section.proseColumns, `${pageKey}/${section.id}`).toBeUndefined();
    }
  });
  it("balances long collapsible card collections into two desktop rows", () => {
    for (const [pageKey, plan] of Object.entries(sectionPlans) as [PageKey, (typeof sectionPlans)[PageKey]][]) for (const section of plan.sections) {
      const source = section.sourceIds.length === 1 ? pages[pageKey].sections.find((item) => item.id === section.sourceIds[0]) : undefined;
      const collapsibleCardCount = source?.blocks.filter((block) => block.kind === "subsection" && "collapsible" in block && block.collapsible).length ?? 0;
      if (section.role === "cards" && collapsibleCardCount === 7) expect(section.columns, `${pageKey}/${section.id}`).toBe(4);
    }
  });
  it("requires an explicit visual decision before rendering any image", () => {
    const illustrationRoles = new Set(["tool", "faq", "directory", "notice"]);
    for (const [pageKey, plan] of Object.entries(sectionPlans)) for (const section of plan.sections) {
      const hasMedia = Boolean(section.media || section.illustration);
      const expectedDecision = section.media ? "photo" : section.illustration ? "illustration" : "none";
      expect(section.visualDecision, `${pageKey}/${section.id}`).toBe(expectedDecision);
      expect(Boolean(section.mediaRationale), `${pageKey}/${section.id}`).toBe(hasMedia);
      if (hasMedia) expect(section.mediaRationale!.length, `${pageKey}/${section.id}`).toBeGreaterThanOrEqual(12);
      if (section.illustration) expect(illustrationRoles.has(section.role), `${pageKey}/${section.id}`).toBe(true);
    }
  });
  it("never repeats a hero or content image across pages", () => {
    const images = pageRegistry.map((page) => page.heroImage);
    for (const plan of Object.values(sectionPlans)) for (const section of plan.sections) {
      const media = resolveSectionMedia(section.media);
      if (media) images.push(media.src);
      if (section.illustration) images.push(`/generated/illustrations/${section.illustration}`);
    }
    expect(new Set(images).size).toBe(images.length);
  });
  it("renders each designed section with its declared role, columns, tone and density", () => {
    for (const pageKey of Object.keys(pages) as PageKey[]) {
      const html = renderToStaticMarkup(createElement(StructuredContent, { pageKey }));
      for (const section of sectionPlans[pageKey].sections) {
        const id = `${pageKey}-${section.id.toLowerCase()}`;
        const start = html.indexOf(`id="${id}"`);
        expect(start, id).toBeGreaterThan(-1);
        const tagStart = html.lastIndexOf("<section", start);
        const tagEnd = html.indexOf(">", start);
        const tag = html.slice(tagStart, tagEnd);
        expect(tag, id).toContain(`content-section--${section.tone}`);
        expect(tag, id).toContain(`data-role="${section.role}"`);
        expect(tag, id).toContain(`data-columns="${section.columns}"`);
        expect(tag, id).toContain(`data-density="${section.density}"`);
        if (section.proseColumns) expect(tag, id).toContain(`data-prose-columns="${section.proseColumns}"`);
      }
      if (sectionPlans[pageKey].introProseColumns) expect(html).toContain(`class="structured-intro" data-grid-section="12" data-prose-columns="${sectionPlans[pageKey].introProseColumns}"`);
    }
  });
});
