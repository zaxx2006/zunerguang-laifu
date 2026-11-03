import { color } from "../helpers/design";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, test } from "@playwright/test";

const root = resolve(__dirname, "../../apps/website/src");
const registry = readFileSync(resolve(root, "lib/page-registry.ts"), "utf8");
const sourcePages = JSON.parse(readFileSync(resolve(root, "content/structured-pages.json"), "utf8"));
const pages = [...registry.matchAll(/\{ slug: "([^"]*)", contentFile: "([^"]+)"/gu)].filter((match) => match[1]).map((match) => ({ route: `/${match[1]}/`, key: readFileSync(resolve(root, "content/published", match[2]), "utf8").match(/<StructuredContent\s+pageKey="([^"]+)"/u)?.[1] }));

for (const entry of pages) test(`${entry.route} gives introduction actions a shared content context`, async ({ page }) => {
  await page.goto(entry.route);
  await page.evaluate(() => document.fonts.ready);
  const narrative = page.locator(".page-hero__narrative");
  await expect(narrative).toHaveCount(1);
  await expect(page.locator("main .structured-intro")).toHaveCount(0);
  for (const block of entry.key ? sourcePages[entry.key].intro : []) {
    if (block.kind === "actions") for (const action of block.actions) await expect(narrative.locator(`a[href="${action.href}"]`)).toContainText(action.label.replace(/\s*→$/u, ""));
    if (block.kind === "copy") for (const paragraph of block.text.split(/\n+/u).filter(Boolean)) expect((await narrative.textContent())!.replace(/\s/gu, "")).toContain(paragraph.replace(/\s/gu, ""));
  }
  const layout = await narrative.evaluate((element) => {
    const box = element.getBoundingClientRect();
    const actions = element.querySelector(".structured-actions");
    const previous = actions?.previousElementSibling?.getBoundingClientRect();
    const buttons = [...element.querySelectorAll<HTMLElement>(".button")];
    return { width: box.width, maxWidth: getComputedStyle(element).maxWidth, left: box.left, actionsLeft: actions?.getBoundingClientRect().left, gap: previous ? actions!.getBoundingClientRect().top - previous.bottom : 0, overflow: document.documentElement.scrollWidth > innerWidth + 1, heights: buttons.map((button) => button.getBoundingClientRect().height) };
  });
  expect(layout.width).toBeLessThanOrEqual(800);
  expect(layout.width).toBeGreaterThanOrEqual(300);
  expect(layout.overflow).toBe(false);
  expect(layout.gap).toBeLessThanOrEqual(32);
  if (layout.actionsLeft !== undefined) expect(layout.actionsLeft).toBeCloseTo(layout.left, 0);
  for (const height of layout.heights) expect(height).toBeGreaterThanOrEqual(56);
  await page.locator("main details:not(.page-map-disclosure)").evaluateAll((elements) => elements.forEach((element) => { (element as HTMLDetailsElement).open = true; }));
  for (const button of await page.locator(".button:not(:disabled)").all()) {
    if (!await button.isVisible()) continue;
    await page.mouse.move(0, 0);
    const role = await button.evaluate((element) => ({ outline: element.classList.contains("button--outline") || element.matches('[data-typography="editorial"] :is(.card-grid, .steps, .structured-subsection, .structured-disclosure) .structured-actions > .button'), dark: Boolean(element.closest(".cta-strip, .content-section--ink")) }));
    await expect(button).toHaveCSS("background-color", role.outline ? "rgba(0, 0, 0, 0)" : color("primary"));
    await expect(button).toHaveCSS("color", role.outline ? role.dark ? color("on-dark") : color("ink") : color("ink"));
    if (role.outline) await expect(button).toHaveCSS("border-color", role.dark ? color("on-dark") : color("hairline-strong"));
    await expect(button).toHaveCSS("font-weight", "400");
    await expect(button).toHaveCSS("text-decoration-line", "none");
    await button.hover();
    await expect(button).toHaveCSS("background-color", role.outline ? "rgba(0, 0, 0, 0)" : color("action-hover"));
    await expect(button).toHaveCSS("color", color(role.outline ? role.dark ? "on-dark" : "ink" : "on-primary-hover"));
    await expect(button).toHaveCSS("font-weight", "400");
    await expect(button).toHaveCSS("text-decoration-line", "none");
  }
});

test("home service modules use outline actions while the consultation stays primary", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  const grid = page.locator(".card-grid").filter({ has: page.getByRole("link", { name: "了解离婚陪跑", exact: true }) });
  const buttons = grid.locator(".content-card__footer .button");
  await expect(buttons).toHaveCount(8);
  for (const button of await buttons.all()) {
    await expect(button).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    await expect(button).toHaveCSS("color", color("ink"));
    await expect(button).toHaveCSS("border-color", color("hairline-strong"));
    await expect(button).toHaveCSS("border-width", "1px");
    await expect(button).toHaveCSS("font-weight", "400");
    const initial = await button.boundingBox();
    await button.hover();
    await expect(button).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    await expect(button).toHaveCSS("color", color("ink"));
    const hovered = await button.boundingBox();
    expect(hovered!.width).toBe(initial!.width);
    expect(hovered!.height).toBe(initial!.height);
    await page.mouse.move(0, 0);
    await button.focus();
    await expect(button).toHaveCSS("outline-style", "solid");
    await expect(button).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    await expect(button).toHaveCSS("text-decoration-line", "none");
    await button.evaluate((element) => (element as HTMLElement).blur());
    await expect(button).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  }
  await expect(page.locator(".button--hero")).toHaveCSS("background-color", color("primary"));
  await expect(page.locator(".button--hero")).toHaveCSS("color", color("ink"));
});

test("topics keep criteria, reading entries and actions inside complete modules", async ({ page }) => {
  await page.goto("/blog/");
  await page.evaluate(() => document.fonts.ready);
  const description = await page.locator(".hero-description").textContent();
  expect((await page.locator(".page-hero__narrative").textContent())!.split(description!).length - 1).toBe(1);
  const cards = page.locator('#articles-q09 .card-grid[data-collection="modules"] > .content-card');
  await expect(cards).toHaveCount(6);
  const colors = await cards.evaluateAll((elements) => elements.map((element) => getComputedStyle(element).backgroundColor));
  expect(new Set(colors)).toEqual(new Set([color("surface-soft")]));
  for (const card of await cards.all()) {
    const layout = await card.evaluate((element) => {
      const box = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      const points = [...element.querySelectorAll<HTMLElement>(".rich-point-list > li")];
      const footer = element.querySelector(".content-card__footer")!.getBoundingClientRect();
      return { background: style.backgroundColor, border: style.borderTopWidth, points: points.map((point) => ({ left: point.getBoundingClientRect().left, width: point.getBoundingClientRect().width, border: getComputedStyle(point).borderTopWidth, display: getComputedStyle(point).display })), footer: { left: footer.left, right: footer.right, bottom: footer.bottom }, card: { left: box.left, right: box.right, bottom: box.bottom } };
    });
    expect(layout.border).toBe("1px");
    expect(layout.background).not.toBe("rgba(0, 0, 0, 0)");
    for (const point of layout.points) {
      expect(point.width).toBeGreaterThanOrEqual(280);
      expect(point.left).toBeCloseTo(layout.points[0].left, 0);
      expect(point.border).toBe("0px");
      expect(point.display).toBe("block");
    }
    expect(layout.footer.left).toBeGreaterThan(layout.card.left);
    expect(layout.footer.right).toBeLessThan(layout.card.right);
    expect(layout.footer.bottom).toBeLessThan(layout.card.bottom);
    const button = card.locator(".content-card__footer .button").first();
    await button.hover();
    await expect(button).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    await expect(button).toHaveCSS("color", color("ink"));
    await expect(button).toHaveCSS("font-weight", "400");
    await expect(button).toHaveCSS("text-decoration-line", "none");
  }
});

test("coaching stages and support choices are separate coherent groups", async ({ page }) => {
  await page.goto("/services/divorce-coaching/");
  await page.evaluate(() => document.fonts.ready);
  const section = page.locator(".content-section").filter({ has: page.getByRole("heading", { name: "我们怎样开展辅导？", exact: true }) });
  const tiles = section.locator('.card-grid[data-collection="disclosures"] > details');
  await expect(tiles).toHaveCount(3);
  const companion = section.locator(".content-companion");
  await expect(companion).toHaveCount(1);
  await expect(companion.getByRole("heading", { name: "支持方式由你决定" })).toBeVisible();
  for (const tile of await tiles.all()) {
    await expect(tile).toHaveCSS("border-top-width", "1px");
    await expect(tile).toHaveCSS("border-bottom-width", "1px");
    await expect(tile).toHaveCSS("background-color", color("canvas"));
    const summary = tile.locator(":scope > summary");
    const geometry = await tile.evaluate((element) => {
      const card = element.getBoundingClientRect();
      const summary = element.querySelector<HTMLElement>(":scope > summary")!.getBoundingClientRect();
      return { leftGap: summary.left - card.left, rightGap: card.right - summary.right };
    });
    expect(geometry.leftGap).toBeCloseTo(1, 0);
    expect(geometry.rightGap).toBeCloseTo(1, 0);
    await expect(summary).toHaveCSS("font-weight", "400");
    await summary.hover();
    await expect(summary).toHaveCSS("background-color", color("surface-soft"));
    await expect(summary).toHaveCSS("color", color("ink"));
    await summary.click();
    await expect(tile.locator(".structured-disclosure__body")).toBeVisible();
    await expect(summary).toHaveCSS("font-weight", "400");
  }
  const boxes = await section.evaluate((element) => ({ grid: element.querySelector(".card-grid")!.getBoundingClientRect().toJSON(), support: element.querySelector(".content-companion")!.getBoundingClientRect().toJSON() }));
  expect(boxes.support.top).toBeGreaterThan(boxes.grid.bottom);
  expect(boxes.support.width).toBeCloseTo(boxes.grid.width, 0);
});

test("all menu groups have neutral hover and keyboard feedback", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("打开或关闭全站导航").click();
  for (const name of ["关于焕屿", "服务总览", "线下活动总览"]) {
    const link = page.locator(".site-menu__panel").getByRole("link", { name, exact: true });
    await link.hover();
    const primary = await link.evaluate((element) => Boolean(element.closest(".menu-column--primary")));
    await expect(link).toHaveCSS("color", color("ink"));
    await expect(link).toHaveCSS("font-weight", "400");
    await expect(link).toHaveCSS("text-decoration-line", "none");
    await expect(link).toHaveCSS("border-bottom-width", "0px");
    await page.mouse.move(0, 0);
    await page.keyboard.press("Tab");
    await link.focus();
    await expect(link).toHaveCSS("background-color", color(primary ? "canvas" : "surface-soft"));
    await expect(link).toHaveCSS("outline-style", "solid");
  }
  await page.getByLabel("打开或关闭全站导航").focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".site-menu__panel")).not.toBeVisible();
});
