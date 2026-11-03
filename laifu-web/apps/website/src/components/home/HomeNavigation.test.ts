import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { HomeHeader } from "./HomeNavigation";

describe("header first paint", () => {
  it("renders the homepage's transparent state before scripts run", () => {
    const html = renderToStaticMarkup(createElement(HomeHeader, { onHero: true }));
    expect(html).toContain('<header id="header" class="on-hero"');
  });

  it("keeps the solid header on inner pages", () => {
    const html = renderToStaticMarkup(createElement(HomeHeader, { breadcrumbSlug: "about" }));
    expect(html).toContain('data-has-breadcrumbs="true"');
    expect(html).not.toContain('class="on-hero"');
  });
});
