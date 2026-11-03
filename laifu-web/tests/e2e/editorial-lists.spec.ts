import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, test } from "@playwright/test";

const registry = readFileSync(resolve(__dirname, "../../apps/website/src/lib/page-registry.ts"), "utf8");
const routes = [...registry.matchAll(/\{ slug: "([^"]*)", contentFile:/gu)].map((match) => match[1] ? `/${match[1]}/` : "/");

function inspectLists() {
  const visible = (element: Element) => !element.closest("details:not([open])") && element.getBoundingClientRect().width > 0 && element.getBoundingClientRect().height > 0;
  const luminance = (color: string) => color.match(/[\d.]+/gu)!.slice(0, 3).map(Number).map((value) => value / 255).map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4).reduce((total, value, index) => total + value * [0.2126, 0.7152, 0.0722][index], 0);
  const contrast = (first: string, second: string) => (Math.max(luminance(first), luminance(second)) + 0.05) / (Math.min(luminance(first), luminance(second)) + 0.05);
  const background = (element: Element): string => {
    const color = getComputedStyle(element).backgroundColor;
    return color === "rgba(0, 0, 0, 0)" && element.parentElement ? background(element.parentElement) : color;
  };
  const lists = [...document.querySelectorAll<HTMLElement>("main ul[data-list-design], main dl[data-list-design]")].filter(visible);
  const sourceLists = [...document.querySelectorAll<HTMLElement>("main [data-source-bullets]")];
  const issues: string[] = [];
  for (const list of lists) {
    const box = list.getBoundingClientRect();
    const label = `${list.closest("section")?.id}: ${list.dataset.listDesign}`;
    if (list.tagName === "UL" && getComputedStyle(list).listStyleType !== "none") issues.push(`${label}: native bullet marker`);
    for (const item of list.querySelectorAll<HTMLElement>(":scope > li, :scope > div > dt, :scope > div > dd")) {
      const rect = item.getBoundingClientRect();
      if (rect.left < box.left - 1 || rect.right > box.right + 1) issues.push(`${label}: escaped item`);
      if (item.scrollWidth > item.clientWidth + 2) issues.push(`${label}: clipped text ${item.textContent?.slice(0, 30)}`);
      if ((item.textContent?.length ?? 0) > 24 && rect.width / parseFloat(getComputedStyle(item).fontSize) < 12) issues.push(`${label}: narrow text`);
      if (contrast(getComputedStyle(item).color, background(item)) < 4.5) issues.push(`${label}: text contrast ${item.textContent?.slice(0, 30)}`);
    }
  }
  for (const group of [...document.querySelectorAll<HTMLElement>(".structured-rich-text, .rich-group, .rich-list-section")].filter(visible)) {
    if (getComputedStyle(group).alignContent !== "start") issues.push("Text groups must not stretch their paragraph spacing to fill a neighbouring list");
  }
  return { issues, unclassified: [...document.querySelectorAll("main ul:not([data-list-design])")].map((element) => element.className), overflow: document.documentElement.scrollWidth > innerWidth + 1, seen: sourceLists.flatMap((element, index) => visible(element) ? [index] : []) };
}

for (const route of routes) test(`${route} applies editorial list layouts in every disclosure state`, async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(route);
  await page.evaluate(() => document.fonts.ready);
  const total = await page.locator("main [data-source-bullets]").evaluateAll((elements) => elements.reduce((count, element) => count + Number(element.getAttribute("data-source-bullets")), 0));
  const initial = await page.evaluate(inspectLists);
  const seen = new Set(initial.seen);
  expect(initial.unclassified).toEqual([]);
  expect(initial.issues).toEqual([]);
  expect(initial.overflow).toBe(false);
  for (const disclosure of await page.locator("main details:not(.page-map-disclosure)").all()) {
    await disclosure.evaluate((element) => { (element as HTMLDetailsElement).open = true; });
    const expanded = await page.evaluate(inspectLists);
    for (const index of expanded.seen) seen.add(index);
    expect(expanded.issues, route).toEqual([]);
    expect(expanded.overflow, route).toBe(false);
  }
  for (const input of await page.locator('.selfcheck input[type="checkbox"]').all()) {
    await input.check();
    const checked = await page.evaluate(inspectLists);
    for (const index of checked.seen) seen.add(index);
    expect(checked.issues, route).toEqual([]);
  }
  expect(seen.size, "Every source list must be reachable in a rendered state").toBe(await page.locator("main [data-source-bullets]").count());
  await test.info().attach("list-coverage", { body: JSON.stringify({ route, sourceBullets: total, reachableLists: seen.size }), contentType: "application/json" });
  expect(await page.locator("main [data-source-bullets]").evaluateAll((elements) => elements.reduce((count, element) => count + Number(element.getAttribute("data-source-bullets")), 0))).toBe(total);
  expect(errors).toEqual([]);
});

test("list-bearing story clusters use the full section width", async ({ page }) => {
  for (const route of ["/services/divorce-coaching/", "/services/co-parenting/", "/services/high-conflict-divorce/"]) {
    await page.goto(route);
    const boxes = await page.locator('[data-role="story"]:not([data-illustrated="true"]):has(.section-cluster)').evaluateAll((sections) => sections.map((section) => ({ heading: section.querySelector(".section-heading")!.getBoundingClientRect().toJSON(), body: section.querySelector(".section-body")!.getBoundingClientRect().toJSON() })));
    for (const { heading, body } of boxes) {
      expect(body.width).toBeCloseTo(heading.width, 0);
      expect(body.left).toBeCloseTo(heading.left, 0);
      expect(body.top).toBeGreaterThanOrEqual(heading.bottom);
    }
  }
});
