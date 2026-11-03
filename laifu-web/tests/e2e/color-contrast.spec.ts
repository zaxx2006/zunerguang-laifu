import AxeBuilder from "@axe-core/playwright";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, test } from "@playwright/test";

const registry = readFileSync(resolve(__dirname, "../../apps/website/src/lib/page-registry.ts"), "utf8");
const routes = ["/", "/404/", "/_not-found/", ...[...registry.matchAll(/\{ slug: "([^"]*)", contentFile:/gu)].map((match) => match[1] ? `/${match[1]}/` : "/")].filter((route, index, all) => all.indexOf(route) === index);

test("all published routes keep neutral reading surfaces and meet WCAG color contrast", async ({ page }) => {
  test.setTimeout(120000);
  test.skip(test.info().project.name !== "desktop", "run the full route matrix once on desktop");
  for (const route of routes) {
    await page.goto(route);
    const coloredSurfaces = await page.locator(".content-section, .hero-rail, .menu-column, .content-card, .content-companion, .structured-disclosure").evaluateAll((elements) => elements.filter((element) => {
      const channels = getComputedStyle(element).backgroundColor.match(/[\d.]+/g)?.map(Number) ?? [];
      return channels.length >= 3 && channels[3] !== 0 && (Math.min(...channels.slice(0, 3)) < 230 || Math.max(...channels.slice(0, 3)) - Math.min(...channels.slice(0, 3)) > 16);
    }).map((element) => ({ selector: element.className, color: getComputedStyle(element).backgroundColor })));
    expect(coloredSurfaces, route).toEqual([]);
    const accessibility = await new AxeBuilder({ page }).withRules(["color-contrast"]).analyze();
    expect(accessibility.violations, route).toEqual([]);
  }
});
