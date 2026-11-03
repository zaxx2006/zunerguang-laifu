import { color } from "../helpers/design";
import { expect, test } from "@playwright/test";

for (const route of ["/", "/book-consultation/", "/resources/"]) {
  test(`button and navigation labels keep regular undecorated text on ${route}`, async ({ page }) => {
    await page.goto(route);
    const assertTypography = async () => {
      const changes = await page.locator(".button, .header-utility, .hero-rail a, .menu-column a").evaluateAll((elements) => elements.filter((element) => {
        const style = getComputedStyle(element);
        return style.fontWeight !== "400" || style.textDecorationLine !== "none";
      }).map((element) => ({ text: element.textContent, weight: getComputedStyle(element).fontWeight, decoration: getComputedStyle(element).textDecorationLine })));
      expect(changes).toEqual([]);
    };
    await assertTypography();
    for (const link of await page.locator(".desktop-cta, .header-utility, .button--hero, .hero-rail a").all()) {
      if (!await link.isVisible()) continue;
      await link.hover();
      await assertTypography();
      await link.focus();
      await page.keyboard.press("Shift+Tab");
      await page.keyboard.press("Tab");
      await expect(link).toBeFocused();
      await expect(link).toHaveCSS("outline-style", "solid");
      await assertTypography();
    }
    await page.locator(".menu-button").click();
    const current = page.locator(".menu-column a[aria-current]").first();
    const menuLink = await current.count() ? current : page.locator(".menu-column a").first();
    await menuLink.hover();
    await assertTypography();
  });
}

function contrast(first: string, second: string) {
  const luminance = (color: string) => color.match(/[\d.]+/gu)!.slice(0, 3).map(Number).map((value) => value / 255).map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4).reduce((total, value, index) => total + value * [0.2126, 0.7152, 0.0722][index], 0);
  const values = [luminance(first), luminance(second)];
  return (Math.max(...values) + 0.05) / (Math.min(...values) + 0.05);
}

test("named support outcomes use responsive title-description groups", async ({ page }) => {
  await page.goto("/");
  const entries = page.locator("#home-assessment .rich-entry-list");
  await expect(entries.locator("dt")).toHaveCount(4);
  await expect(entries.locator("dd")).toHaveCount(4);
  const boxes = await entries.locator(":scope > div").evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect().toJSON()));
  const width = await entries.evaluate((element) => element.getBoundingClientRect().width);
  const columns = width >= 536 ? 2 : 1;
  expect(Math.abs(boxes[0].y - boxes[1].y) < 1).toBe(columns === 2);
  const overflow = await entries.evaluate((element) => [...element.querySelectorAll("dt, dd")].filter((item) => item.scrollWidth > item.clientWidth + 1).map((item) => item.textContent));
  expect(overflow).toEqual([]);
});

test("service intro shares the photo edge and does not inherit the narrow prose width", async ({ page }) => {
  await page.goto("/#home-services");
  const result = await page.locator("#home-services").evaluate((section) => {
    const picture = section.querySelector(".section-illustration")!.getBoundingClientRect();
    const heading = section.querySelector(".section-heading")!.getBoundingClientRect();
    const body = section.querySelector(".section-body")!.getBoundingClientRect();
    const intro = section.querySelector(".section-body > .structured-section-body > .structured-rich-text")!.getBoundingClientRect();
    return { picture: picture.toJSON(), heading: heading.toJSON(), body: body.toJSON(), intro: intro.toJSON() };
  });
  for (const box of [result.heading, result.body, result.intro]) expect(Math.abs(box.left - result.picture.left)).toBeLessThan(1);
  expect(result.intro.width).toBeCloseTo(Math.min(result.body.width, 800), 0);
  expect(result.body.width).toBeCloseTo(result.picture.width, 0);
});

test("actions and navigation follow their documented hover and contrast rules", async ({ page }) => {
  await page.goto("/");
  const button = page.locator(".button--hero");
  const colors = async () => button.evaluate((element) => {
    const style = getComputedStyle(element);
    const panel = getComputedStyle(element.closest(".page-hero__copy")!);
    return { text: style.color, background: style.backgroundColor, border: style.borderColor, panel: panel.backgroundColor };
  });
  for (const hovered of [false, true]) {
    if (hovered) {
      await button.hover();
      await expect(button).toHaveCSS("background-color", color("action-hover"));
    }
    const state = await colors();
    await expect(button).toHaveCSS("color", color(hovered ? "on-primary-hover" : "ink"));
    await expect(button).toHaveCSS("font-size", "20px");
    await expect(button).toHaveCSS("font-weight", "400");
    await expect(button).toHaveCSS("text-decoration-line", "none");
    expect(contrast(state.text, state.background)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(state.border, state.panel)).toBeGreaterThanOrEqual(3);
  }
  for (const link of await page.locator(".hero-rail a").all()) {
    await link.hover();
    await expect(link).toHaveCSS("color", color("ink"));
    await expect(link).toHaveCSS("text-decoration-line", "none");
    const state = await link.evaluate((element) => {
      const background = getComputedStyle(element.closest(".hero-rail")!).backgroundColor;
      const elements = [element, element.querySelector("span")!, element.querySelector("svg")!];
      return { background, colors: elements.map((item) => getComputedStyle(item).color), border: getComputedStyle(element).borderBottomColor, height: element.getBoundingClientRect().height };
    });
    for (const color of state.colors) expect(contrast(color, state.background)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(state.border, state.background)).toBeGreaterThanOrEqual(3);
    expect(state.height).toBeGreaterThanOrEqual(44);
    await link.focus();
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Tab");
    await expect(link).toBeFocused();
    await expect(link).toHaveCSS("outline-style", "solid");
    expect(contrast(await link.evaluate((element) => getComputedStyle(element).outlineColor), state.background)).toBeGreaterThanOrEqual(3);
  }
  await page.locator('.hero-rail a[href="#home-services"]').click();
  await expect(page).toHaveURL(/#home-services$/u);
});

test("black closing sections meet the footer without a white spacer", async ({ page }) => {
  await page.goto("/retreats-workshops/");
  const edges = await page.evaluate(() => ({ cta: document.querySelector(".cta-strip")!.getBoundingClientRect().bottom, main: document.querySelector("main")!.getBoundingClientRect().bottom, footer: document.querySelector(".site-footer")!.getBoundingClientRect().top }));
  expect(edges.main).toBeCloseTo(edges.cta, 0);
  expect(edges.footer).toBeCloseTo(edges.cta, 0);
  for (const selector of [".cta-strip a", ".site-footer a"]) {
    const link = page.locator(selector).first();
    await link.focus();
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Tab");
    await expect(link).toBeFocused();
    const state = await link.evaluate((element) => ({ outline: getComputedStyle(element).outlineColor, background: getComputedStyle(element.closest(".cta-strip, .site-footer")!).backgroundColor }));
    expect(contrast(state.outline, state.background)).toBeGreaterThanOrEqual(3);
  }
});

test("actions keep accessible text colors inside neutral sections without bold or underline", async ({ page }) => {
  await page.goto("/book-consultation/");
  const button = page.locator("#booking-q23 .button--primary").first();
  await expect(button).toHaveCSS("color", color("ink"));
  await expect(button).toHaveCSS("font-weight", "400");
  await button.hover();
  await expect(button).toHaveCSS("color", color("ink"));
  await expect(button).toHaveCSS("text-decoration-line", "none");
});

test("FAQ actions do not collide with the disclosure border", async ({ page }) => {
  await page.goto("/faq/");
  const result = await page.locator('[data-role="faq"] .structured-section-body > .structured-actions').first().evaluate((element) => {
    const previous = element.previousElementSibling!.getBoundingClientRect();
    const current = element.getBoundingClientRect();
    return { marginTop: getComputedStyle(element).marginTop, separation: current.top - previous.bottom };
  });
  expect(result.marginTop).toBe("24px");
  expect(result.separation).toBeGreaterThanOrEqual(24);
});
