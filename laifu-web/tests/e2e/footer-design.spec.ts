import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { color } from "../helpers/design";

const registry = readFileSync(resolve(__dirname, "../../apps/website/src/lib/page-registry.ts"), "utf8");
const routes = [...registry.matchAll(/\{ slug: "([^"]*)", contentFile:/gu)].map((match) => `/${match[1]}${match[1] ? "/" : ""}`);

for (const route of routes) test(`${route} keeps a coherent footer and aligned closing actions`, async ({ page }) => {
  await page.goto(route);
  await page.evaluate(() => document.fonts.ready);
  const footer = page.getByRole("contentinfo");
  await expect(footer).toHaveCount(1);
  await expect(footer.locator("a")).toHaveCount(24);
  await expect(footer.locator(".footer-column").filter({ has: page.getByRole("heading", { name: "探索", exact: true }) }).locator("a")).toHaveCount(4);
  await expect(footer.locator(".footer-column")).toHaveCount(6);
  await expect(footer.locator("details, summary, button, [role=button]")).toHaveCount(0);
  for (const link of await footer.locator("a").all()) await expect(link).toBeVisible();
  const layout = await footer.evaluate((element) => {
    const brand = element.querySelector(".footer-brand")!.getBoundingClientRect();
    const nav = element.querySelector(".footer-grid")!.getBoundingClientRect();
    const legal = element.querySelector(".footer-copyright")!.getBoundingClientRect();
    const columns = [...element.querySelectorAll(".footer-column")].map((column) => column.getBoundingClientRect());
    return { viewport: innerWidth, brand: brand.toJSON(), nav: nav.toJSON(), legal: legal.toJSON(), columns: columns.map((column) => column.toJSON()), clipped: [...element.querySelectorAll<HTMLElement>("a, p, h2")].filter((node) => node.scrollWidth > node.clientWidth + 2).map((node) => node.textContent), overflow: document.documentElement.scrollWidth > innerWidth + 1, textWidth: element.querySelector(".footer-brand p")!.getBoundingClientRect().width };
  });
  expect(layout.clipped).toEqual([]);
  expect(layout.overflow).toBe(false);
  expect(layout.textWidth).toBeGreaterThanOrEqual(240);
  expect(layout.brand.top).toBeGreaterThanOrEqual(layout.nav.bottom);
  expect(layout.brand.left).toBeCloseTo(layout.nav.left, 0);
  expect(layout.brand.width).toBeCloseTo(layout.nav.width, 0);
  if (layout.viewport > 960) for (const column of layout.columns) expect(column.top).toBeCloseTo(layout.columns[0].top, 0);
  expect(layout.legal.top).toBeGreaterThanOrEqual(layout.brand.top);
  expect(layout.legal.bottom).toBeLessThanOrEqual(layout.brand.bottom);
  const actions = page.locator(".cta-strip .structured-actions > .button");
  const boxes = await actions.evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect().toJSON()));
  for (const [index, button] of (await actions.all()).entries()) {
    expect(boxes[index].left).toBeCloseTo(boxes[0].left, 0);
    expect(boxes[index].width).toBeCloseTo(boxes[0].width, 0);
    expect(boxes[index].height).toBeGreaterThanOrEqual(44);
    if (index) expect(boxes[index].top).toBeGreaterThanOrEqual(boxes[index - 1].bottom);
    await expect(button).toHaveCSS("font-weight", "400");
    await expect(button).toHaveCSS("text-decoration-line", "none");
    await button.hover();
    const primary = await button.evaluate((element) => element.classList.contains("button--primary"));
    await expect(button).toHaveCSS("background-color", primary ? color("action-hover") : "rgba(0, 0, 0, 0)");
    await expect(button).toHaveCSS("color", color(primary ? "on-primary-hover" : "on-dark"));
  }
  const cta = page.locator(".cta-strip");
  if (await cta.count()) expect((await cta.boundingBox())!.y + (await cta.boundingBox())!.height).toBeCloseTo((await footer.boundingBox())!.y, 0);
});

test("footer navigation stays visible and accessible by keyboard", async ({ page }) => {
  await page.goto("/media/");
  const footer = page.getByRole("contentinfo");
  const navigation = footer.getByRole("navigation", { name: "页脚导航" });
  await navigation.getByRole("link", { name: "首页", exact: true }).focus();
  await page.keyboard.press("Tab");
  const link = navigation.getByRole("link", { name: "关于焕屿", exact: true });
  await expect(link).toBeFocused();
  await expect(link).toHaveCSS("outline-color", color("on-dark"));
  await expect(link).toHaveCSS("outline-style", "solid");
  await expect(link).toHaveCSS("color", color("primary"));
  await expect(link).toHaveCSS("font-weight", "400");
  await expect(link).toHaveCSS("text-decoration-line", "none");
  const accessibility = await new AxeBuilder({ page }).include(".site-footer").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(accessibility.violations).toEqual([]);
});

test("footer and closing actions fit narrow and wide breakpoint edges", async ({ page }) => {
  test.skip(test.info().project.name !== "desktop", "one browser covers the full breakpoint sweep");
  for (const width of [320, 600, 601, 960, 961, 1200, 1201, 1920, 2560]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/media/");
    await page.evaluate(() => document.fonts.ready);
    const issues = await page.evaluate(() => [...document.querySelectorAll<HTMLElement>(".site-footer a, .site-footer h2, .cta-strip a, .cta-strip h2")].filter((element) => element.scrollWidth > element.clientWidth + 2).map((element) => element.textContent));
    expect(issues, String(width)).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), String(width)).toBe(false);
    const columns = await page.locator(".footer-column").evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect().toJSON()));
    expect(new Set(columns.map((column) => Math.round(column.left))).size).toBe(width > 960 ? 6 : width > 600 ? 3 : 2);
  }
});
