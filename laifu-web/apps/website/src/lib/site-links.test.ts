import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { SiteLink } from "@/components/site/SiteLink";
import { assessmentUrl, siteLinkAttributes } from "./site-links";

describe("site links", () => {
  it.each(["development", "production"] as const)("routes hosted assessment links correctly in %s", async environment => {
    vi.stubEnv("NODE_ENV", environment);
    vi.resetModules();
    try {
      const { assessmentUrl: baseUrl, siteLinkAttributes: attributes } = await import("./site-links");
      expect(baseUrl).toBe(environment === "development" ? "http://localhost:3002/" : "https://laifu-assessments.pages.dev/");
      for (const suffix of ["", "narcissism-risk/", "narcissism-risk/?from=website#intro"]) {
        expect(attributes({ href: `https://laifu-assessments.pages.dev/${suffix}` })).toEqual({ href: `${baseUrl}${suffix}`, target: "_self", rel: undefined });
      }
      expect(attributes({ href: "https://laifu-assessments.pages.dev?from=home" }).href).toBe(`${baseUrl}?from=home`);
      expect(attributes({ href: "https://laifu-assessments.pages.dev.example.com/" }).href).toBe("https://laifu-assessments.pages.dev.example.com/");
    } finally {
      vi.unstubAllEnvs();
      vi.resetModules();
    }
  });

  it.each(["#assessment", "/#assessment", "#home-assessment", "/#home-assessment", "/assessment", "/assessment/", "/assessments/?from=home"])("redirects legacy assessment entry %s to the assessment website", href => {
    expect(siteLinkAttributes({ href, target: "_self" })).toEqual({ href: assessmentUrl, target: "_self", rel: undefined });
  });

  it.each(["https://example.com/page", "http://example.com/", "//example.com/", `${assessmentUrl}narcissism-risk/`])("opens external destination %s in the current tab despite CMS flags", href => {
    expect(siteLinkAttributes({ href, target: "_blank", rel: "nofollow noopener" })).toEqual({ href, target: "_self", rel: "nofollow noopener" });
  });

  it.each(["/", "/services/", "/#faq-title", "./about/", "../resources/", "?stage=decision"])("opens internal destination %s in the current tab despite CMS flags", href => {
    expect(siteLinkAttributes({ href, target: "_blank" })).toEqual({ href, target: "_self", rel: undefined });
  });

  it.each(["#support", "#faq-title", "tel:15000973537", "mailto:hello@example.com", "", undefined])("preserves native behavior for %s", href => {
    expect(siteLinkAttributes({ href })).toEqual({ href, target: undefined, rel: undefined });
  });

  it("overrides old new-tab requests while preserving native downloads", () => {
    expect(siteLinkAttributes({ href: "/services/", target: "_blank" }).target).toBe("_self");
    expect(siteLinkAttributes({ href: "https://example.com/file.pdf", download: "guide.pdf" }).target).toBeUndefined();
  });

  it("renders the correct destination before client JavaScript and retains anchor attributes", () => {
    const html = renderToStaticMarkup(createElement(SiteLink, { href: "/#assessment", className: "invitation-button", "aria-label": "开始自测", children: "开始自测" }));
    expect(html).toContain(`href="${assessmentUrl}"`);
    expect(html).toContain('target="_self"');
    expect(html).not.toContain('target="_blank"');
    expect(html).toContain('class="invitation-button"');
    expect(html).toContain('aria-label="开始自测"');
  });
});
