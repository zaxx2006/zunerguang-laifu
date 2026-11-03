import { color } from "../helpers/design";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, test } from "@playwright/test";

const registry = readFileSync(resolve(__dirname, "../../apps/website/src/lib/page-registry.ts"), "utf8");
const pages = registry.split("\n").filter((line) => line.includes('{ slug: "') && !line.includes('slug: "",')).map((line) => ({ route: `/${line.match(/slug: "([^"]+)"/u)![1]}/`, title: JSON.parse(line.match(/titleZh: ("(?:[^"\\]|\\.)*")/u)![1]) as string, description: JSON.parse(line.match(/description: ("(?:[^"\\]|\\.)*")/u)![1]) as string, image: line.match(/heroImage: "([^"]+)"/u)![1] }));
const textOnlyRoutes = new Set(["/faq/", "/resources/", "/book-consultation/", "/blog/", "/about/founder/"]);
const photoFocus: Record<string, string> = { "/services/co-parenting/": "50% 100%", "/services/post-divorce-recovery/": "50% 100%", "/retreats-workshops/": "50% 100%", "/signature-program/": "50% 100%", "/blog/topics/decision/": "50% 100%", "/media/": "50% 0%", "/blog/topics/separation/": "50% 22%" };

for (const entry of pages) test(`${entry.route} uses the shared subpage opening`, async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(entry.route);
  await page.evaluate(() => document.fonts.ready);
  const hero = page.locator('.page-hero[data-composition="banner"]');
  await expect(hero).toHaveCount(1);
  await expect(page.locator("main h1")).toHaveCount(1);
  expect(await hero.locator("h1").textContent()).toBe(entry.title);
  expect(await hero.locator(".hero-description").textContent()).toBe(entry.description);
  const image = hero.locator(".page-hero__visual img");
  await expect(image).toHaveCount(textOnlyRoutes.has(entry.route) ? 0 : 1);
  if (!textOnlyRoutes.has(entry.route)) {
    await expect(image).toHaveAttribute("src", entry.image);
    await expect(image).toHaveAttribute("alt", /.+/u);
    await expect(image).toHaveCSS("object-position", photoFocus[entry.route] ?? "50% 50%");
  }
  const contract = await hero.evaluate((element) => {
    const box = (selector: string) => element.querySelector(selector)!.getBoundingClientRect();
    const band = box(".page-hero__masthead");
    const category = box(".page-hero__category");
    const title = box("h1");
    const intro = box(".page-hero__introduction");
    const description = box(".hero-description");
    const photo = element.querySelector<HTMLImageElement>(".page-hero__visual img");
    const photoBox = photo?.getBoundingClientRect();
    const titleStyle = getComputedStyle(element.querySelector("h1")!);
    const texts = [...element.querySelectorAll<HTMLElement>("h1, p, a, .hero-breadcrumb span")];
    return { viewport: innerWidth, bandLeft: band.left, bandWidth: band.width, categoryRight: category.right, categoryWidth: category.width, categoryBottom: category.bottom, titleLeft: title.left, titleTop: title.top, titleWidth: title.width, titleBottom: title.bottom, bandBottom: band.bottom, titleInset: parseFloat(titleStyle.paddingLeft), introTop: intro.top, descriptionLeft: description.left, descriptionWidth: description.width, photo: photoBox ? { left: photoBox.left, width: photoBox.width, top: photoBox.top, bottom: photoBox.bottom, loaded: photo!.complete && photo!.naturalWidth > 0 } : null, overflow: document.documentElement.scrollWidth > innerWidth + 1, clipped: texts.filter((node) => node.scrollWidth > node.clientWidth + 2).map((node) => node.textContent), categoryColor: getComputedStyle(element.querySelector(".page-hero__category")!).backgroundColor, titleColor: getComputedStyle(element.querySelector(".page-hero__masthead")!).backgroundColor };
  });
  expect(contract.overflow).toBe(false);
  expect(contract.clipped).toEqual([]);
  expect(contract.bandLeft).toBe(0);
  expect(contract.bandWidth).toBe(contract.viewport);
  expect(contract.categoryColor).toBe(color("hero-category"));
  expect(contract.titleColor).toBe(color("hero-heading"));
  expect(contract.descriptionWidth).toBeLessThanOrEqual(800);
  expect(contract.descriptionWidth).toBeGreaterThanOrEqual(Math.min(320, contract.viewport - 48));
  expect(Math.abs(contract.descriptionLeft - contract.titleLeft - contract.titleInset)).toBeLessThanOrEqual(1);
  if (contract.viewport > 960) {
    expect(Math.abs(contract.categoryWidth - contract.viewport / 6)).toBeLessThanOrEqual(1);
    expect(Math.abs(contract.titleLeft - contract.categoryRight)).toBeLessThanOrEqual(1);
  } else {
    expect(contract.categoryWidth).toBe(contract.viewport);
    expect(contract.titleWidth).toBe(contract.viewport);
    expect(Math.abs(contract.titleTop - contract.categoryBottom)).toBeLessThanOrEqual(1);
  }
  if (contract.photo) {
    expect(contract.photo.loaded).toBe(true);
    expect(contract.photo.left).toBe(0);
    expect(contract.photo.width).toBe(contract.viewport);
    expect(Math.abs(contract.photo.top - contract.bandBottom)).toBeLessThanOrEqual(1);
    expect(Math.abs(contract.introTop - contract.photo.bottom)).toBeLessThanOrEqual(1);
  } else expect(Math.abs(contract.introTop - contract.bandBottom)).toBeLessThanOrEqual(1);
  for (const button of await hero.locator(".button").all()) {
    await expect(button).toHaveCSS("font-weight", "400");
    await expect(button).toHaveCSS("text-decoration-line", "none");
    const outline = await button.evaluate((element) => element.classList.contains("button--outline"));
    await expect(button).toHaveCSS("background-color", outline ? "rgba(0, 0, 0, 0)" : color("primary"));
    await expect(button).toHaveCSS("color", color("ink"));
    await button.hover();
    await expect(button).toHaveCSS("background-color", outline ? "rgba(0, 0, 0, 0)" : color("action-hover"));
    await expect(button).toHaveCSS("color", color(outline ? "ink" : "on-primary-hover"));
    await expect(button).toHaveCSS("font-weight", "400");
    await expect(button).toHaveCSS("text-decoration-line", "none");
  }
});

test("home keeps its existing cover and four navigation entries", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('.page-hero[data-composition="cover"]')).toHaveCount(1);
  await expect(page.locator(".page-hero__masthead")).toHaveCount(0);
  await expect(page.locator(".hero-rail a")).toHaveCount(4);
  await expect(page.locator(".page-hero__text h1")).toHaveText(JSON.parse(registry.split("\n").find((line) => line.includes('slug: "",'))!.match(/titleZh: ("(?:[^"\\]|\\.)*")/u)![1]));
});
