import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const registry = readFileSync(resolve(__dirname, "../../apps/website/src/lib/page-registry.ts"), "utf8");
const routes = [...registry.matchAll(/\{ slug: "([^"]*)", contentFile:/gu)].map((match) => match[1] ? `/${match[1]}/` : "/");

function inspectDisclosures() {
  const issues: string[] = [];
  const summaries = [...document.querySelectorAll<HTMLElement>("main .structured-disclosure > summary")];
  for (const summary of summaries) {
    const frame = summary.getBoundingClientRect();
    if (!frame.width || !frame.height) continue;
    const style = getComputedStyle(summary);
    const title = summary.querySelector<HTMLElement>(".structured-disclosure__title")!;
    const number = summary.querySelector<HTMLElement>(".structured-disclosure__number");
    const arrow = summary.querySelector("svg")!.getBoundingClientRect();
    const titleBox = title.getBoundingClientRect();
    const expectedLeft = number ? number.getBoundingClientRect().right + parseFloat(style.columnGap) : frame.left + parseFloat(style.paddingLeft);
    const label = `${summary.closest("section")?.id}: ${title.textContent}`;
    if (style.display !== "grid") issues.push(`${label}: inconsistent summary grid`);
    if (number && Math.abs(number.getBoundingClientRect().top - titleBox.top) > 1) issues.push(`${label}: number and title are not aligned`);
    if (Math.abs(titleBox.left - expectedLeft) > 1) issues.push(`${label}: title is not left-aligned to its slot`);
    if (Math.abs(arrow.right - (frame.right - parseFloat(style.paddingRight))) > 1) issues.push(`${label}: arrow drift`);
    if (titleBox.right + parseFloat(style.columnGap) > arrow.left + 1) issues.push(`${label}: overlapping arrow`);
    if (title.scrollWidth > title.clientWidth + 2) issues.push(`${label}: clipped title`);
    if (frame.height < 44) issues.push(`${label}: short touch target`);
    if (!summary.parentElement!.querySelector(".structured-disclosure__body")!.textContent?.trim()) issues.push(`${label}: empty disclosure`);
  }
  return { issues, count: summaries.length, overflow: document.documentElement.scrollWidth > innerWidth + 1 };
}

function inspectStepCardEdges() {
  const issues: string[] = [];
  const cards = [...document.querySelectorAll<HTMLElement>('[data-role="steps"] .card-grid[data-collection="disclosures"] > .structured-disclosure')];
  for (const card of cards) {
    const summary = card.querySelector<HTMLElement>(":scope > summary");
    if (!summary) continue;
    const cardFrame = card.getBoundingClientRect();
    const summaryFrame = summary.getBoundingClientRect();
    const cardStyle = getComputedStyle(card);
    const summaryStyle = getComputedStyle(summary);
    const label = `${card.closest("section")?.id}: ${summary.textContent?.trim()}`;
    if (Math.abs(summaryFrame.left - cardFrame.left) > 1 || Math.abs(cardFrame.right - summaryFrame.right) > 1) issues.push(`${label}: step summary does not fill card`);
    if (cardStyle.backgroundColor !== summaryStyle.backgroundColor) issues.push(`${label}: step card uses mismatched colors`);
  }
  return { issues, count: cards.length };
}

for (const route of routes) test(`${route} aligns disclosure titles and arrows in closed and open states`, async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(route);
  await page.evaluate(() => document.fonts.ready);
  const closed = await page.evaluate(inspectDisclosures);
  expect(closed.issues).toEqual([]);
  expect(closed.overflow).toBe(false);
  const stepCards = await page.evaluate(inspectStepCardEdges);
  expect(stepCards.issues).toEqual([]);
  await page.locator("main details:not(.page-map-disclosure)").evaluateAll((elements) => elements.forEach((element) => { (element as HTMLDetailsElement).open = true; }));
  const opened = await page.evaluate(inspectDisclosures);
  expect(opened.issues).toEqual([]);
  expect(opened.count).toBe(closed.count);
  expect(opened.overflow).toBe(false);
  const openedStepCards = await page.evaluate(inspectStepCardEdges);
  expect(openedStepCards.issues).toEqual([]);
  expect(errors).toEqual([]);
});

test("service stages retain ordered entries, working disclosures and source anchors", async ({ page }) => {
  await page.goto("/services/");
  await page.evaluate(() => document.fonts.ready);
  const directory = page.locator("#services-q160 .stage-directory");
  const groups = directory.locator(".stage-directory__group");
  expect(await groups.count()).toBe(7);
  expect(await groups.evaluateAll((elements) => elements.map((element) => element.querySelectorAll("details").length))).toEqual([3, 3, 1, 2, 1, 1, 2]);
  expect(await directory.locator(".structured-disclosure__number").allTextContents()).toEqual(Array.from({ length: 13 }, (_, index) => String(index + 1).padStart(2, "0")));
  for (const [index, id] of ["services-q161", "services-q169", "services-q176", "services-q179", "services-q184", "services-q187", "services-q190"].entries()) {
    await expect(groups.nth(index)).toHaveAttribute("id", id);
    await expect(groups.nth(index).locator(":scope > h3")).toHaveCount(1);
  }
  const first = directory.locator("details").first();
  const summary = first.locator(":scope > summary");
  await summary.focus();
  await expect(summary).toHaveCSS("outline-style", "solid");
  await page.keyboard.press("Enter");
  await expect(first).toHaveAttribute("open", "");
  await expect(first.getByRole("link", { name: /免费领取指南/u })).toHaveAttribute("href", "/resources/#resources-availability");
  await page.keyboard.press("Enter");
  await expect(first).not.toHaveAttribute("open", "");
  for (const entry of await directory.locator("details").all()) {
    const trigger = entry.locator(":scope > summary");
    await trigger.click();
    await expect(entry).toHaveAttribute("open", "");
    await trigger.click();
    await expect(entry).not.toHaveAttribute("open", "");
  }
  const accessibility = await new AxeBuilder({ page }).include("#services-q160").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(accessibility.violations).toEqual([]);
});

test("stage directory follows one reading axis across narrow and wide viewports", async ({ page }) => {
  test.skip(test.info().project.name !== "desktop", "one browser covers breakpoint widths");
  await page.goto("/services/");
  for (const width of [320, 390, 600, 768, 960, 961, 1200, 1440, 1920, 2560]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.evaluate(() => document.fonts.ready);
    const layout = await page.locator(".stage-directory__group").evaluateAll((elements) => elements.map((element) => {
      const heading = element.querySelector("h3")!.getBoundingClientRect();
      const entries = element.querySelector(".card-grid")!.getBoundingClientRect();
      const titles = [...element.querySelectorAll(".structured-disclosure__title")].map((title) => title.getBoundingClientRect().left);
      return { heading: heading.toJSON(), entries: entries.toJSON(), titleDrift: Math.max(...titles) - Math.min(...titles) };
    }));
    for (const group of layout) {
      expect(group.titleDrift, String(width)).toBeLessThanOrEqual(1);
      if (width <= 960) {
        expect(group.entries.top).toBeGreaterThanOrEqual(group.heading.bottom);
        expect(group.entries.left).toBeCloseTo(group.heading.left, 0);
      } else expect(group.entries.left).toBeGreaterThan(group.heading.right);
    }
    const inspection = await page.evaluate(inspectDisclosures);
    expect(inspection.issues, String(width)).toEqual([]);
    expect(inspection.overflow, String(width)).toBe(false);
  }
});

test("parallel steps use their full inner width for body text", async ({ page }) => {
  await page.goto("/resources/");
  await page.evaluate(() => document.fonts.ready);
  const steps = await page.locator('[data-role="steps"] > .section-grid > .section-body > .structured-section-body > .structured-rich-text > .structured-flow > .structured-step-card').evaluateAll((elements) => elements.flatMap((element) => {
    const body = element.querySelector<HTMLElement>(":scope > .structured-step-card__content");
    if (!body) return [];
    const frame = element.getBoundingClientRect();
    const rect = body.getBoundingClientRect();
    const style = getComputedStyle(element);
    return [{ cardTop: frame.top, bodyTop: rect.top, bodyWidth: rect.width, innerWidth: frame.width - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight) - parseFloat(style.borderLeftWidth) - parseFloat(style.borderRightWidth), clipped: body.scrollWidth > body.clientWidth + 2 }];
  }));
  expect(steps.length).toBeGreaterThan(0);
  for (const step of steps) {
    expect(step.bodyWidth).toBeCloseTo(step.innerWidth, 0);
    expect(step.bodyWidth).toBeGreaterThanOrEqual(192);
    expect(step.clipped).toBe(false);
    for (const sibling of steps.filter((candidate) => Math.abs(candidate.cardTop - step.cardTop) <= 1)) expect(Math.abs(sibling.bodyTop - step.bodyTop)).toBeLessThanOrEqual(1);
  }
});
