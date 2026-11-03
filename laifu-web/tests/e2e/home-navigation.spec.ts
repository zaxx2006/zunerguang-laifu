import { color } from "../helpers/design";
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const entries = [["自我梳理", "#home-assessment"], ["支持方案", "#home-services"], ["陪伴方式", "#home-approach"], ["资源与活动", "#home-learn"]] as const;

test("home chapter entries are full-area links with regular, undecorated titles", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  const rail = page.getByRole("navigation", { name: "首页内容", exact: true });
  await expect(rail.getByRole("link")).toHaveCount(4);
  await expect(rail).toHaveCSS("background-color", color("canvas"));
  for (const [label, href] of entries) {
    const link = rail.getByRole("link", { name: label, exact: true });
    await expect(link).toHaveAttribute("href", href);
    await expect(link.locator(".hero-rail__label")).toHaveText(label);
    await expect(link.locator("svg.lucide-arrow-down-right")).toHaveCount(1);
    const box = await link.boundingBox();
    expect(box!.height).toBeGreaterThanOrEqual(144);
    expect(box!.width).toBeGreaterThanOrEqual(160);
    for (const target of [link, link.locator(".hero-rail__label")]) {
      await expect(target).toHaveCSS("font-weight", "400");
      await expect(target).toHaveCSS("text-decoration-line", "none");
    }
    await link.hover();
    await expect(link).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    await expect(link).toHaveCSS("color", color("ink"));
    await link.click({ position: { x: box!.width / 2, y: box!.height / 2 } });
    await expect(page).toHaveURL(new RegExp(`${href}$`, "u"));
    const targetTop = await page.locator(href).evaluate(element => element.getBoundingClientRect().top);
    expect(Math.abs(targetTop - 92)).toBeLessThanOrEqual(1);
  }
});

test("home navigation is accessible by keyboard and retains text contrast", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const rail = page.getByRole("navigation", { name: "首页内容", exact: true });
  const links = rail.getByRole("link");
  await links.first().focus();
  for (let index = 0; index < entries.length; index += 1) {
    const link = links.nth(index);
    await expect(link).toBeFocused();
    await expect(link).toHaveCSS("outline-style", "solid");
    await expect(link).toHaveCSS("outline-width", "2px");
    await expect(link).toHaveCSS("text-decoration-line", "none");
    await expect(link).toHaveCSS("font-weight", "400");
    if (index < entries.length - 1) await page.keyboard.press("Tab");
  }
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#home-learn$/u);
  const accessibility = await new AxeBuilder({ page }).include(".hero-rail").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(accessibility.violations).toEqual([]);
});

test("home navigation keeps four columns or two-by-two without clipped labels", async ({ page }) => {
  test.skip(test.info().project.name !== "desktop", "one browser covers the breakpoint sweep");
  await page.goto("/");
  for (const width of [320, 390, 600, 768, 960, 961, 1440, 1920, 2560]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.evaluate(() => document.fonts.ready);
    const layout = await page.locator(".hero-rail").evaluate(element => ({ columns: getComputedStyle(element).gridTemplateColumns.split(" ").length, overflow: document.documentElement.scrollWidth > innerWidth + 1, clipped: [...element.querySelectorAll<HTMLElement>("a, span")].filter(node => node.scrollWidth > node.clientWidth + 1).map(node => node.textContent), firstLabel: element.querySelector("span")!.getBoundingClientRect().left, pageInset: document.querySelector(".primary-nav__inner")!.getBoundingClientRect().left }));
    expect(layout.columns, String(width)).toBe(width <= 960 ? 2 : 4);
    expect(layout.overflow, String(width)).toBe(false);
    expect(layout.clipped, String(width)).toEqual([]);
    expect(Math.abs(layout.firstLabel - layout.pageInset), String(width)).toBeLessThanOrEqual(1);
  }
});
