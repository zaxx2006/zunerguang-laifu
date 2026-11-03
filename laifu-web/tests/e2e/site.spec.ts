import { color } from "../helpers/design";
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import sectionPlans from "../../apps/website/src/content/section-design.json";

const routes = ["/", "/about/", "/about/founder/", "/services/", "/services/divorce-coaching/", "/services/decision-support/", "/services/co-parenting/", "/services/post-divorce-recovery/", "/services/pre-legal-clarity/", "/services/mediation-preparation/", "/collaborative-law/", "/services/high-conflict-divorce/", "/services/nuptial-agreements/", "/services/remarriage-preparation/", "/signature-program/", "/retreats-workshops/", "/faq/", "/book-consultation/", "/media/", "/blog/", "/resources/", "/courses-workshops/", "/for-lawyers/", "/academy/", "/blog/topics/high-conflict/", "/blog/topics/decision/", "/blog/topics/separation/", "/blog/topics/co-parenting/", "/blog/topics/finances/", "/blog/topics/rebuilding/"];
const structuredRoutes = { "/": "home", "/about/": "about", "/about/founder/": "founder", "/services/": "services", "/services/divorce-coaching/": "divorceCoaching", "/services/decision-support/": "decisionAlias", "/services/co-parenting/": "coParenting", "/services/post-divorce-recovery/": "recovery", "/services/mediation-preparation/": "mediation", "/collaborative-law/": "collaboration", "/services/high-conflict-divorce/": "highConflict", "/services/nuptial-agreements/": "highNetWorth", "/services/remarriage-preparation/": "remarriage", "/signature-program/": "fullCycleAlias", "/retreats-workshops/": "community", "/faq/": "faq", "/book-consultation/": "booking", "/media/": "media", "/blog/": "articles", "/resources/": "resources", "/courses-workshops/": "courses", "/academy/": "academy", "/blog/topics/high-conflict/": "topic0", "/blog/topics/decision/": "topic1", "/blog/topics/separation/": "topic2", "/blog/topics/co-parenting/": "topic3", "/blog/topics/finances/": "topic4", "/blog/topics/rebuilding/": "topic5" } as const;

function inspectLayout() {
  const visible = (element: Element) => element.checkVisibility({ contentVisibilityAuto: true, visibilityProperty: true }) && element.getBoundingClientRect().width > 0 && element.getBoundingClientRect().height > 0;
  const containedClosingPunctuation = (element: Element) => {
    const excess = element.scrollWidth - element.clientWidth;
    const boundary = element.closest("article, aside, .section-body");
    const style = getComputedStyle(element);
    return /[》）】」』”]$/.test(element.textContent?.trim() || "") && excess <= Number.parseFloat(style.fontSize) / 2 + 1 && style.overflowX === "visible" && boundary !== null && element.getBoundingClientRect().right + excess <= boundary.getBoundingClientRect().right - Number.parseFloat(getComputedStyle(boundary).borderRightWidth);
  };
  const paragraphs = [...document.querySelectorAll("main p, main li, main dd")].filter((element) => visible(element) && (element.textContent?.match(/[\u3400-\u9fff]/g) || []).length >= 32);
  const narrow = paragraphs.filter((element) => element.getBoundingClientRect().width / Number.parseFloat(getComputedStyle(element).fontSize) < 12).map((element) => element.textContent?.slice(0, 50));
  const clipped = [...document.querySelectorAll("main article, main aside, main p, main h2, main h3, main .button, main .section-body")].filter((element) => visible(element) && !element.closest(".comparison-table-wrap") && !element.querySelector(".testimonial-rail__viewport") && element.scrollWidth > element.clientWidth + 2 && !containedClosingPunctuation(element)).map((element) => element.className + ": " + element.textContent?.slice(0, 50));
  const boldButtons = [...document.querySelectorAll("button, a.button, [role='button']")].filter(visible).filter((element) => Number.parseFloat(getComputedStyle(element).fontWeight) > 500).map((element) => `${element.tagName}.${element.className}: ${getComputedStyle(element).fontWeight}`);
  const wrongHeadingFonts = [...document.querySelectorAll("main h1, main h2, main h3, main h4, main h5, main h6, main .rich-heading")].filter(visible).filter((element) => !getComputedStyle(element).fontFamily.includes("Noto Serif SC")).map((element) => `${element.tagName}.${element.className}: ${getComputedStyle(element).fontFamily}`);
  const auxiliaryEnglish = [...document.querySelectorAll("main .hero-title-en, main .section-subtitle, main .section-cluster__subtitle, main [lang='en']")].filter(visible).map((element) => element.textContent?.trim());
  const numberedSeparators = [...document.querySelectorAll("main .structured-disclosure--subsection > summary, main .selfcheck__item > label")].filter(visible).filter((element) => /^\s*\d{2}[｜|]/u.test(element.textContent || "") || /[｜|]/u.test(element.querySelector(".structured-disclosure__number")?.textContent || "")).map((element) => element.textContent?.trim());
  const malformedDisclosureTitles = [...document.querySelectorAll<HTMLElement>('main .structured-disclosure--subsection > summary[data-numbered="true"]')].filter(visible).filter((summary) => !summary.querySelector(":scope > .structured-disclosure__number") || !summary.querySelector(":scope > .structured-disclosure__title")).map((summary) => summary.textContent?.trim());
  const duplicatedPageMapNumbers = [...document.querySelectorAll<HTMLElement>(".structured-page-map__inner a")].filter(visible).filter((link) => /^\d{2}/u.test(link.querySelector<HTMLElement>(".page-map-item__label")?.textContent?.trim() ?? "")).map((link) => link.textContent?.trim());
  const misplacedActions = [...document.querySelectorAll<HTMLElement>("main .structured-actions")].filter(visible).filter((element) => [...element.parentElement!.children].filter(visible).at(-1) !== element).map((element) => `${element.parentElement?.className}: ${element.textContent?.trim()}`);
  const invalidBaselines = [...new Set([":is(.page-map-rail__inner, .structured-page-map__inner) a", ".structured-step-card:has(> h4)", ".structured-facts > div", ".rich-media-list > li"].flatMap((selector) => [...document.querySelectorAll<HTMLElement>(selector)]))].filter((element) => getComputedStyle(element).alignItems !== "baseline").map((element) => `${element.tagName}.${element.className}: ${getComputedStyle(element).alignItems}`);
  const mismatchedNumberedTitles = [...document.querySelectorAll<HTMLElement>('.structured-disclosure > summary[data-numbered="true"]')].filter(visible).flatMap((summary) => {
    const number = summary.querySelector<HTMLElement>(":scope > .structured-disclosure__number");
    const title = summary.querySelector<HTMLElement>(":scope > .structured-disclosure__title");
    if (!number || !title) return [`${summary.closest("section")?.id}: missing numbered title part`];
    const sizeDelta = Math.abs(Number.parseFloat(getComputedStyle(number).fontSize) - Number.parseFloat(getComputedStyle(title).fontSize));
    const topDelta = Math.abs(number.getBoundingClientRect().top - title.getBoundingClientRect().top);
    return sizeDelta > 0.1 || topDelta > 1 ? [`${summary.closest("section")?.id}: size ${sizeDelta}px / top ${topDelta}px`] : [];
  });
  const misalignedRows: string[] = [];
  const checkRows = (containerSelector: string, childSelector: string, slots: string[], label: string) => {
    for (const container of document.querySelectorAll<HTMLElement>(containerSelector)) {
      const children = [...container.querySelectorAll<HTMLElement>(childSelector)].filter((element) => element.parentElement === container && visible(element));
      const rows: { top: number; items: HTMLElement[] }[] = [];
      for (const child of children) {
        const top = child.getBoundingClientRect().top;
        const row = rows.find((entry) => Math.abs(entry.top - top) <= 1);
        if (row) row.items.push(child);
        else rows.push({ top, items: [child] });
      }
      for (const row of rows.filter((entry) => entry.items.length > 1)) for (const slot of slots) {
        const nodes = row.items.map((item) => item.querySelector<HTMLElement>(`:scope > ${slot}`));
        const present = nodes.filter((node): node is HTMLElement => node !== null);
        if (!present.length) continue;
        if (present.length !== row.items.length) {
          misalignedRows.push(`${label} ${slot}: ${present.length}/${row.items.length} slots`);
          continue;
        }
        const tops = present.map((node) => node.getBoundingClientRect().top);
        if (Math.max(...tops) - Math.min(...tops) > 1) misalignedRows.push(`${label} ${slot}: ${Math.max(...tops) - Math.min(...tops)}px`);
      }
    }
  };
  checkRows(".card-grid[data-rows]", ":scope > article", [".content-card__category", ".content-card__number", ".structured-subsection__number", "h3", ".content-card__body", ".structured-subsection__body", ".content-card__details", ".content-card__footer"], "card-grid");
  checkRows(".section-cluster[data-rows]", ":scope > .section-cluster__item", ["h3", ".structured-section-body"], "section-cluster");
  checkRows(".content-metrics", ":scope > div", ["dd", "dt"], "metrics-grid");
  const overlappingContent: string[] = [];
  const overlaps = (first: Element, second: Element) => {
    const a = first.getBoundingClientRect();
    const b = second.getBoundingClientRect();
    return Math.min(a.right, b.right) - Math.max(a.left, b.left) > 2 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 2;
  };
  for (const grid of document.querySelectorAll(".section-grid")) {
    const parts = [...grid.children].filter((element) => element.matches(".section-heading,.section-body,.section-illustration") && visible(element));
    for (let index = 0; index < parts.length; index += 1) for (const sibling of parts.slice(index + 1)) if (overlaps(parts[index], sibling)) overlappingContent.push(`${grid.parentElement?.id}: ${parts[index].className} / ${sibling.className}`);
  }
  for (const card of document.querySelectorAll(".content-card")) {
    const title = card.querySelector(":scope > h3");
    const body = card.querySelector(":scope > .content-card__body");
    if (title && body && visible(title) && visible(body) && overlaps(title, body)) overlappingContent.push(`card: ${title.textContent}`);
  }
  const splitProse = [...document.querySelectorAll(".structured-section-body > .structured-rich-text")].filter(visible).filter((element) => Number.parseInt(getComputedStyle(element).columnCount, 10) > 1).map((element) => element.closest("section")?.id);
  const irregularCollectionRows = window.innerWidth > 600 ? [...document.querySelectorAll<HTMLElement>(":is(.card-grid, .steps, .section-cluster)[data-columns]")].flatMap((container) => {
    const frame = container.getBoundingClientRect();
    const children = [...container.children].filter((element): element is HTMLElement => element instanceof HTMLElement && visible(element));
    if (!children.length) return [];
    const rows: { top: number; items: DOMRect[] }[] = [];
    for (const child of children) {
      const rect = child.getBoundingClientRect();
      const row = rows.find((entry) => Math.abs(entry.top - rect.top) <= 1);
      if (row) row.items.push(rect);
      else rows.push({ top: rect.top, items: [rect] });
    }
    const label = container.closest("section")?.id || container.className;
    const reference = rows.reduce((widest, row) => row.items.length > widest.items.length ? row : widest, rows[0]);
    const referenceStarts = reference.items.map((item) => item.left).sort((a, b) => a - b);
    const widths = rows.flatMap((row) => row.items.map((item) => item.width));
    const widthDrift = Math.max(...widths) - Math.min(...widths);
    const declaredColumns = Number(container.dataset.columns);
    const singleColumnDisclosure = container.matches('[data-role="faq"] .card-grid[data-collection="disclosures"]');
    const responsiveColumns = singleColumnDisclosure ? 1 : window.innerWidth > 1200 ? declaredColumns : window.innerWidth > 960 ? Math.min(declaredColumns, 2) : 1;
    const expectedMaxItems = Math.min(responsiveColumns, children.length);
    const actualMaxItems = Math.max(...rows.map((row) => row.items.length));
    const issues = widthDrift > 1.1 ? [`${label}: card width drift ${widthDrift}px`] : [];
    if (actualMaxItems !== expectedMaxItems) issues.push(`${label}: ${actualMaxItems} columns, expected ${expectedMaxItems}`);
    issues.push(...rows.flatMap((row, index) => {
      const left = Math.min(...row.items.map((item) => item.left));
      const inset = Math.abs(left - frame.left);
      const offsets = row.items.map((item) => Math.min(...referenceStarts.map((start) => Math.abs(start - item.left))));
      const columnDrift = Math.max(...offsets);
      return inset > 1.1 || columnDrift > 1.1 ? [`${label} row ${index + 1}: left inset ${inset}px / column drift ${columnDrift}px`] : [];
    }));
    return issues;
  }) : [];
  const unruledSubsectionCards = [...document.querySelectorAll<HTMLElement>('[data-role="cards"] .card-grid[data-collection="subsections"] > .structured-disclosure--subsection')].filter(visible).filter((card) => Number.parseFloat(getComputedStyle(card).borderTopWidth) < 0.5).map((card) => card.closest("section")?.id);
  const sections = [...document.querySelectorAll("main section")].filter(visible);
  const gridElements = [...document.querySelectorAll<HTMLElement>('[data-grid="12"]')].filter(visible);
  const semanticGrids = [...document.querySelectorAll<HTMLElement>('[data-role="steps"] > .section-grid > .section-body > .structured-section-body > .structured-rich-text:has(> .structured-flow), [data-role="steps"] .structured-subsection__body')].filter(visible);
  const gridContract = {
    sectionCount: sections.length,
    gridCount: gridElements.length,
    unregisteredSections: sections.filter((element) => element.getAttribute("data-grid-section") !== "12").map((element) => element.className),
    sectionsWithoutOwnGrid: sections.filter((section) => !gridElements.some((grid) => grid.closest("section") === section)).map((element) => element.className),
    invalidGrids: gridElements.filter((element) => { const style = getComputedStyle(element); return style.display !== "grid" || style.gridTemplateColumns.split(" ").length !== 12; }).map((element) => `${element.className}: ${getComputedStyle(element).display} / ${getComputedStyle(element).gridTemplateColumns}`),
    autoPlacedChildren: gridElements.flatMap((grid) => [...grid.children].filter((child) => visible(child) && getComputedStyle(child).position !== "absolute").filter((child) => { const style = getComputedStyle(child); return style.gridColumnStart === "auto" && style.gridColumnEnd === "auto"; }).map((child) => `${grid.className} > ${child.tagName}.${child.className}`)),
    invalidSemanticGrids: semanticGrids.filter((element) => { const style = getComputedStyle(element); return style.display !== "grid" || style.gridTemplateColumns.split(" ").length !== 12; }).map((element) => `${element.className}: ${getComputedStyle(element).display} / ${getComputedStyle(element).gridTemplateColumns}`),
    autoPlacedSemanticChildren: semanticGrids.flatMap((grid) => [...grid.children].filter((child) => visible(child)).filter((child) => { const style = getComputedStyle(child); return style.gridColumnStart === "auto" && style.gridColumnEnd === "auto"; }).map((child) => `${grid.className} > ${child.tagName}.${child.className}`)),
  };
  const escapedSectionPhotos = [...document.querySelectorAll<HTMLImageElement>(".section-illustration--photo img")].filter(visible).flatMap((image) => {
    const rect = image.getBoundingClientRect();
    const frame = image.closest("figure")!.getBoundingClientRect();
    const sourceWidth = Number(image.getAttribute("width"));
    const sourceHeight = Number(image.getAttribute("height"));
    const ratioDelta = Math.abs(rect.width / rect.height - sourceWidth / sourceHeight);
    const outsideFrame = Math.max(frame.left - rect.left, rect.right - frame.right, frame.top - rect.top, rect.bottom - frame.bottom);
    return !["contain", "cover"].includes(getComputedStyle(image).objectFit) || getComputedStyle(image).objectFit === "contain" && ratioDelta > 0.02 || outsideFrame > 1 ? [`${image.getAttribute("src")}: fit ${getComputedStyle(image).objectFit}, ratio ${ratioDelta}, overflow ${outsideFrame}`] : [];
  });
  const hero = document.querySelector(".page-hero__inner")!.getBoundingClientRect();
  const heroVisual = document.querySelector<HTMLElement>(".page-hero__visual")?.getBoundingClientRect();
  const heroComposition = document.querySelector<HTMLElement>(".page-hero")?.dataset.composition;
  const button = document.querySelector(".button--hero")?.getBoundingClientRect();
  const breadcrumb = document.querySelector<HTMLElement>(".hero-breadcrumb");
  const heroCopy = document.querySelector<HTMLElement>(".page-hero__context");
  const heroTitle = document.querySelector<HTMLElement>(".page-hero h1");
  const breadcrumbPlacement = breadcrumb && heroCopy && heroTitle ? { topInset: breadcrumb.getBoundingClientRect().top - heroCopy.getBoundingClientRect().top, leftDelta: Math.abs(breadcrumb.getBoundingClientRect().left - heroCopy.getBoundingClientRect().left - parseFloat(getComputedStyle(heroCopy).paddingLeft)), belowTitle: breadcrumb.getBoundingClientRect().top >= heroTitle.getBoundingClientRect().bottom } : null;
  return { narrow, clipped, boldButtons, wrongHeadingFonts, auxiliaryEnglish, numberedSeparators, malformedDisclosureTitles, duplicatedPageMapNumbers, misplacedActions, escapedSectionPhotos, breadcrumbPlacement, alignmentContract: { invalidBaselines, mismatchedNumberedTitles, misalignedRows }, densityContract: { overlappingContent, splitProse, irregularCollectionRows, unruledSubsectionCards }, gridContract, overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1, heroOverflow: button ? button.bottom > hero.bottom + 1 : false, heroVisualOverflow: heroVisual ? heroVisual.left < -1 || heroVisual.right > window.innerWidth + 1 : false, heroComposition, unframed: [...document.querySelector("#main-content")!.children].filter((element) => element.tagName !== "SECTION").length, brokenImages: [...document.images].filter((image) => image.complete && !image.naturalWidth).length };
}

for (const route of routes) {
  test(route + " obeys the rendered layout contract", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    await page.goto(route);
    await expect(page.locator("main h1")).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    const layout = await page.evaluate(inspectLayout);
    expect(layout.overflow).toBe(false);
    expect(layout.heroOverflow).toBe(false);
    expect(layout.heroVisualOverflow).toBe(false);
    expect(layout.heroComposition).toBeTruthy();
    expect(layout.narrow).toEqual([]);
    expect(layout.clipped).toEqual([]);
    expect(layout.boldButtons).toEqual([]);
    expect(layout.wrongHeadingFonts).toEqual([]);
    expect(layout.auxiliaryEnglish).toEqual([]);
    expect(layout.numberedSeparators).toEqual([]);
    expect(layout.malformedDisclosureTitles).toEqual([]);
    expect(layout.duplicatedPageMapNumbers).toEqual([]);
    expect(layout.misplacedActions).toEqual([]);
    expect(layout.escapedSectionPhotos).toEqual([]);
    if (route === "/") expect(layout.breadcrumbPlacement).toBeNull();
    else {
      expect(layout.breadcrumbPlacement).not.toBeNull();
      expect(layout.breadcrumbPlacement!.topInset).toBeGreaterThanOrEqual(0);
      expect(layout.breadcrumbPlacement!.topInset).toBeLessThanOrEqual(40);
      expect(layout.breadcrumbPlacement!.leftDelta).toBeLessThanOrEqual(1);
      expect(layout.breadcrumbPlacement!.belowTitle).toBe(true);
    }
    expect(layout.alignmentContract.invalidBaselines).toEqual([]);
    expect(layout.alignmentContract.mismatchedNumberedTitles).toEqual([]);
    expect(layout.alignmentContract.misalignedRows).toEqual([]);
    expect(layout.densityContract.overlappingContent).toEqual([]);
    expect(layout.densityContract.splitProse).toEqual([]);
    expect(layout.densityContract.irregularCollectionRows).toEqual([]);
    expect(layout.densityContract.unruledSubsectionCards).toEqual([]);
    expect(layout.gridContract.sectionCount).toBeGreaterThan(0);
    expect(layout.gridContract.gridCount).toBeGreaterThanOrEqual(layout.gridContract.sectionCount);
    expect(layout.gridContract.unregisteredSections).toEqual([]);
    expect(layout.gridContract.sectionsWithoutOwnGrid).toEqual([]);
    expect(layout.gridContract.invalidGrids).toEqual([]);
    expect(layout.gridContract.autoPlacedChildren).toEqual([]);
    expect(layout.gridContract.invalidSemanticGrids).toEqual([]);
    expect(layout.gridContract.autoPlacedSemanticChildren).toEqual([]);
    expect(layout.unframed).toBe(0);
    expect(layout.brokenImages).toBe(0);
    expect(errors).toEqual([]);
  });
}

test("collections keep identical column tracks at the intermediate breakpoint", async ({ page }) => {
  test.skip(test.info().project.name !== "desktop", "single-browser intermediate breakpoint contract");
  test.setTimeout(60_000);
  await page.setViewportSize({ width: 1024, height: 1000 });
  for (const route of routes) {
    await page.goto(route);
    await expect(page.locator("main h1")).toBeVisible();
    expect((await page.evaluate(inspectLayout)).densityContract.irregularCollectionRows, route).toEqual([]);
  }
});

test("courses belong to offline activities in desktop, mobile and breadcrumbs", async ({ page }) => {
  await page.goto("/");
  await page.locator(".menu-button").click();
  await page.getByRole("navigation", { name: "主导航" }).locator("..").getByRole("link", { name: "课程与工作坊", exact: true }).click();
  await expect(page).toHaveURL(/\/courses-workshops\/$/);
  await expect(page.getByRole("navigation", { name: "面包屑" })).toHaveText("首页线下活动与社群陪伴课程、工作坊与疗愈营");
  await expect(page.locator(".footer-column").filter({ hasText: "线下活动" }).getByRole("link", { name: "课程与工作坊", exact: true })).toHaveAttribute("href", "/courses-workshops/");
  await page.goto("/retreats-workshops/");
  await expect(page.locator("main").getByRole("link", { name: "查看课程与工作坊", exact: true })).toHaveAttribute("href", "/courses-workshops/");
});

test("service navigation remains reachable and contained", async ({ page }) => {
  await page.goto("/");
  await page.locator(".menu-button").click();
  const panel = page.locator(".site-menu__panel");
  const frame = await panel.boundingBox();
  expect(frame!.x).toBe(0);
  expect(frame!.y).toBe(72);
  expect(frame!.width).toBe(page.viewportSize()!.width);
  expect(frame!.height).toBe(page.viewportSize()!.height - 72);
  await expect(panel.getByRole("link", { name: "高冲突婚姻专项辅导", exact: true })).toBeVisible();
  await panel.getByRole("link", { name: "离婚陪伴辅导", exact: true }).click();
  await expect(page).toHaveURL(/\/services\/divorce-coaching\/$/);
});

test("breakpoint edges do not leave missing navigation or squeezed text", async ({ page }) => {
  for (const width of [320, 390, 600, 601, 768, 960, 961, 1024, 1172, 1200, 1201, 1440, 1920, 3598]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/book-consultation/");
    const layout = await page.evaluate(inspectLayout);
    expect(layout.overflow, String(width)).toBe(false);
    expect(layout.narrow, String(width)).toEqual([]);
    expect(layout.clipped, String(width)).toEqual([]);
    expect(layout.gridContract.unregisteredSections, String(width)).toEqual([]);
    expect(layout.gridContract.sectionsWithoutOwnGrid, String(width)).toEqual([]);
    expect(layout.gridContract.invalidGrids, String(width)).toEqual([]);
    expect(layout.gridContract.autoPlacedChildren, String(width)).toEqual([]);
    await expect(page.locator(".menu-button")).toBeVisible();
    const header = await page.evaluate(() => {
      const frame = document.querySelector<HTMLElement>(".primary-nav__inner")!.getBoundingClientRect();
      const brand = document.querySelector<HTMLElement>(".brand")!.getBoundingClientRect();
      const menu = document.querySelector<HTMLElement>(".menu-button")!.getBoundingClientRect();
      const action = document.querySelector<HTMLElement>(".desktop-cta")!;
      return { brandLeftDelta: Math.abs(frame.left - brand.left), menuRightDelta: Math.abs(frame.right - menu.right), overlap: Math.max(0, brand.right - menu.left), actionVisible: action.getBoundingClientRect().width > 0 };
    });
    expect(header.brandLeftDelta, String(width)).toBeLessThanOrEqual(1);
    expect(header.menuRightDelta, String(width)).toBeLessThanOrEqual(1);
    expect(header.overlap, String(width)).toBe(0);
    expect(header.actionVisible, String(width)).toBe(width > 600);
    const notice = await page.locator(".status-notice").evaluate((element) => {
      const title = element.querySelector(".status-notice__title")!.getBoundingClientRect();
      const body = element.querySelector(".status-notice__body")!.getBoundingClientRect();
      return { bodyBelowTitle: body.top >= title.bottom, bodyWidth: body.width, height: element.getBoundingClientRect().height };
    });
    expect(notice.bodyBelowTitle).toBe(true);
    expect(notice.bodyWidth).toBeGreaterThanOrEqual(190);
    expect(notice.height).toBeLessThan(360);
  }
});

test("open details keep readable content and correct local navigation", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto("/faq/");
  const question = page.locator(".structured-disclosure summary").first();
  await question.click();
  await expect(question.locator("..")).toHaveAttribute("open", "");
  await expect(question.locator("..").locator(".structured-disclosure__body")).toBeVisible();
  expect((await page.evaluate(inspectLayout)).narrow).toEqual([]);
  await page.locator(".page-map-disclosure > summary").click();
  await expect(page.getByRole("navigation", { name: "本页内容" })).toBeVisible();
});

test("faq sections use an editorial rail and full-width accordion rows at every breakpoint", async ({ page }) => {
  test.skip(test.info().project.name !== "desktop", "single-browser responsive contract");
  for (const width of [390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of ["/faq/", "/services/co-parenting/", "/services/remarriage-preparation/"]) {
      await page.goto(route);
      const grids = await page.locator('[data-role="faq"] .card-grid[data-collection="disclosures"]').evaluateAll((elements) => elements.map((element) => {
        const section = element.closest<HTMLElement>('[data-role="faq"]')!;
        const heading = section.querySelector<HTMLElement>(':scope > .section-grid > .section-heading')!.getBoundingClientRect();
        const body = section.querySelector<HTMLElement>(':scope > .section-grid > .section-body')!.getBoundingClientRect();
        const frame = element.getBoundingClientRect();
        const cards = [...element.children].map((child) => child.getBoundingClientRect());
        const frameDeltas = cards.map((card) => Math.max(Math.abs(card.left - frame.left), Math.abs(card.right - frame.right)));
        const arrowInsets = [...element.querySelectorAll<HTMLElement>(":scope > details > summary > svg")].map((arrow) => arrow.closest("details")!.getBoundingClientRect().right - arrow.getBoundingClientRect().right);
        const styles = [...element.children].map((child) => ({ background: getComputedStyle(child).backgroundColor, borderLeft: Number.parseFloat(getComputedStyle(child).borderLeftWidth), borderRight: Number.parseFloat(getComputedStyle(child).borderRightWidth), borderTop: Number.parseFloat(getComputedStyle(child).borderTopWidth) }));
        const lastBottom = Number.parseFloat(getComputedStyle(element.lastElementChild!).borderBottomWidth);
        return { heading, body, count: cards.length, frameDeltas, arrowInsetDelta: Math.max(...arrowInsets) - Math.min(...arrowInsets), styles, lastBottom };
      }));
      for (const grid of grids) {
        expect(Math.max(...grid.frameDeltas), `${route} ${width}`).toBeLessThanOrEqual(1);
        expect(grid.arrowInsetDelta, `${route} ${width}`).toBeLessThanOrEqual(1);
        expect(grid.styles.every((style) => style.background === "rgba(0, 0, 0, 0)" && style.borderLeft === 0 && style.borderRight === 0 && style.borderTop > 0), `${route} ${width}`).toBe(true);
        expect(grid.lastBottom, `${route} ${width}`).toBeGreaterThan(0);
        if (width > 960) {
          expect(Math.abs(grid.heading.top - grid.body.top), `${route} ${width}`).toBeLessThanOrEqual(1);
          expect(grid.body.left, `${route} ${width}`).toBeGreaterThan(grid.heading.left);
        } else {
          expect(grid.body.top, `${route} ${width}`).toBeGreaterThanOrEqual(grid.heading.bottom);
        }
      }
    }
  }
});

test("page map numbers and titles share one baseline", async ({ page }) => {
  await page.goto("/about/");
  await page.evaluate(() => document.fonts.ready);
  const compact = (page.viewportSize()?.width ?? 1440) <= 960;
  if (compact) await page.locator(".page-map-disclosure > summary").click();
  const links = await page.locator(compact ? ".structured-page-map__inner a" : ".page-map-rail__inner a").evaluateAll((elements) => elements.map((element) => {
    const firstLine = (target: Element) => {
      const range = document.createRange();
      range.selectNodeContents(target);
      return [...range.getClientRects()][0];
    };
    const number = firstLine(element.querySelector(".page-map-item__number")!);
    const label = firstLine(element.querySelector(".page-map-item__label")!);
    return { alignItems: getComputedStyle(element).alignItems, lineBottomDelta: Math.abs(number.bottom - label.bottom) };
  }));
  expect(links).toHaveLength(6);
  expect(links.every((link) => link.alignItems === "baseline")).toBe(true);
  expect(links.every((link) => link.lineBottomDelta <= 2.1)).toBe(true);
  const layout = await page.evaluate(inspectLayout);
  expect(layout.alignmentContract.invalidBaselines).toEqual([]);
  expect(layout.alignmentContract.misalignedRows).toEqual([]);
});

test("booking stays disabled and does not collect information", async ({ page }) => {
  await page.goto("/book-consultation/");
  await expect(page.getByText("预约尚未开放", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "提交预约申请（暂未开放）" })).toBeDisabled();
  await expect(page.locator(".booking-preparation select")).toHaveCount(3);
  await expect(page.locator("form")).toHaveCount(0);
});

test("resource filters combine format and stage and results expand one at a time", async ({ page }) => {
  await page.goto("/resources/");
  await page.getByLabel("按资源形式筛选").selectOption("worksheet");
  await page.getByLabel("按所处阶段筛选").selectOption("parenting");
  await expect(page.locator(".resource-card:visible")).toHaveCount(1);
  await expect(page.locator(".resource-card:visible .resource-card__title")).toHaveText(["共同养育边界整理表"]);
  await page.locator(".resource-card:visible > summary").click();
  await expect(page.locator(".resource-card:visible .resource-card__body")).toBeVisible();
  await page.getByRole("button", { name: "清除筛选" }).click();
  await expect(page.locator(".resource-card:visible")).toHaveCount(24);
  await page.locator(".resource-card > summary").nth(0).click();
  await page.locator(".resource-card > summary").nth(1).click();
  await expect(page.locator(".resource-card[open]")).toHaveCount(1);
});

test("selfchecks reveal support without collecting personal data", async ({ page }) => {
  for (const route of ["/services/co-parenting/", "/services/remarriage-preparation/"]) {
    await page.goto(route);
    await page.locator(".selfcheck__start").click();
    await expect(page.locator('.selfcheck input[type="checkbox"]')).toHaveCount(7);
    await page.locator('.selfcheck input[type="checkbox"]').first().check();
    await expect(page.locator(".selfcheck__result").first()).toBeVisible();
    expect((await page.evaluate(inspectLayout)).narrow).toEqual([]);
    await expect(page.locator("form")).toHaveCount(0);
    await expect(page.locator('script:not([type="application/ld+json"])')).toHaveCount(0);
  }
});

test("tokens govern type, spacing, stroke and responsive frames", async ({ page }) => {
  await page.goto("/");
  const result = await page.evaluate(() => {
    const root = getComputedStyle(document.documentElement);
    const section = getComputedStyle(document.querySelector(".section-grid")!);
    const body = getComputedStyle(document.body);
    return { font: body.fontSize, line: body.lineHeight, columns: root.getPropertyValue("--layout-columns").trim(), gap: section.columnGap, gapToken: root.getPropertyValue("--layout-column-gap").trim(), padding: section.paddingTop, paddingToken: root.getPropertyValue("--layout-section-feature-block").trim(), stroke: section.borderLeftWidth, strokeToken: root.getPropertyValue("--stroke-hairline").trim() };
  });
  expect(result.columns).toBe("12");
  expect(result.font).toBe("16px");
  expect(result.line).toBe("28px");
  expect(result.gap).toBe(result.gapToken);
  expect(result.padding).toBe(result.paddingToken);
  expect(result.stroke).toBe("0px");
});

test("every structured page renders its declared section plan", async ({ page }) => {
  for (const [route, pageKey] of Object.entries(structuredRoutes)) {
    await page.goto(route);
    const rendered = await page.locator("main > .content-section[data-role]").evaluateAll((elements) => elements.map((element) => ({ id: element.id, role: element.getAttribute("data-role"), columns: Number(element.getAttribute("data-columns")), density: element.getAttribute("data-density"), tone: [...element.classList].find((name) => name.startsWith("content-section--"))?.replace("content-section--", "") })));
    expect(rendered, route).toEqual(sectionPlans[pageKey].sections.map((section) => ({ id: `${pageKey}-${section.id.toLowerCase()}`, role: section.role, columns: section.columns, density: section.density, tone: section.tone })));
  }
});

test("grouped feature sections occupy both halves of the desktop grid", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  for (const [route, selector] of [["/book-consultation/", "#booking-q23"], ["/blog/", "#articles-q30"]]) {
    await page.goto(route);
    const layout = await page.locator(selector).evaluate((section) => {
      const grid = section.querySelector(":scope > .section-grid")!.getBoundingClientRect();
      const body = section.querySelector(":scope > .section-grid > .section-body")!.getBoundingClientRect();
      const items = [...section.querySelectorAll(":scope .section-cluster__item")].map((item) => item.getBoundingClientRect());
      return { bodyWidth: body.width, gridWidth: grid.width, itemWidths: items.map((item) => item.width), itemTops: items.map((item) => item.top) };
    });
    expect(layout.bodyWidth / layout.gridWidth, route).toBeGreaterThan(0.99);
    expect(layout.itemWidths, route).toHaveLength(2);
    expect(layout.itemWidths.every((width) => width / layout.gridWidth > 0.45), route).toBe(true);
    expect(Math.abs(layout.itemTops[0] - layout.itemTops[1]), route).toBeLessThan(1);
  }
});

test("illustrated card sections use the full grid without overlapping numbered titles", async ({ page }) => {
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/about/#about-q41");
    await page.evaluate(() => document.fonts.ready);
    const layout = await page.locator("#about-q41").evaluate((section) => {
      const grid = section.querySelector(":scope > .section-grid")!.getBoundingClientRect();
      const body = section.querySelector(":scope > .section-grid > .section-body")!.getBoundingClientRect();
      const cards = [...section.querySelectorAll(":scope .card-grid[data-collection=\"subsections\"] > .structured-subsection")].map((card) => {
        const number = card.querySelector(":scope > .structured-subsection__number")!.getBoundingClientRect();
        const title = card.querySelector(":scope > h3")!.getBoundingClientRect();
        const content = card.querySelector(":scope > .structured-subsection__body")!.getBoundingClientRect();
        return { numberBeforeTitle: number.right <= title.left + 0.5 && Math.abs(number.top - title.top) <= 1, titleBeforeContent: title.bottom <= content.top + 0.5 };
      });
      return { bodyWidth: body.width, gridWidth: grid.width, rows: section.querySelector(".card-grid")?.getAttribute("data-rows"), cards };
    });
    expect(layout.bodyWidth / layout.gridWidth, String(width)).toBeGreaterThan(0.99);
    expect(layout.rows).toBe("3");
    expect(layout.cards).toHaveLength(5);
    expect(layout.cards.every((card) => card.numberBeforeTitle && card.titleBeforeContent), String(width)).toBe(true);
    expect((await page.evaluate(inspectLayout)).clipped).toEqual([]);
  }
});

test("editorial collections use four, two and one columns on the same 12-column grid", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  for (const [route, selector, columns] of [["/", ".card-grid", "2"], ["/", ".steps", "1"], ["/services/co-parenting/", ".steps", "4"]]) {
    await page.goto(route);
    const collection = page.locator(`${selector}[data-columns="${columns}"]`).first();
    const layout = await collection.evaluate((element) => ({ tracks: getComputedStyle(element).gridTemplateColumns.split(" ").length, span: getComputedStyle(element.firstElementChild!).gridColumnStart }));
    expect(layout.tracks).toBe(12);
    expect(layout.span).toBe(`span ${12 / Number(columns)}`);
  }
  const heading = page.locator(".section-heading h2:has(.section-heading__number)").first();
  const marker = heading.locator(".section-heading__number");
  await expect(marker).not.toBeVisible();
});

test("step grids use one number and shared whitespace without decorative rules", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/services/");
  const contract = await page.locator("#services-q90 .steps").evaluate((element) => {
    const cards = [...element.children];
    const style = (index: number) => getComputedStyle(cards[index]);
    return { outer: getComputedStyle(element).borderTopWidth, firstRight: style(0).borderRightWidth, secondLeft: style(1).borderLeftWidth, fourthTop: style(3).borderTopWidth, heights: cards.map((card) => card.getBoundingClientRect().height), numberTitleGaps: cards.map((card) => card.querySelector("h3")!.getBoundingClientRect().top - card.querySelector(".content-card__number")!.getBoundingClientRect().bottom), numbers: cards.map((card) => card.querySelectorAll(".content-card__number").length), headings: cards.map((card) => card.querySelector("h3")?.textContent) };
  });
  expect(contract.outer).toBe("0px");
  expect(contract.firstRight).toBe("0px");
  expect(contract.secondLeft).toBe("0px");
  expect(contract.fourthTop).toBe("0px");
  expect(Math.max(...contract.heights)).toBeLessThanOrEqual(176);
  expect(Math.max(...contract.numberTitleGaps)).toBeLessThanOrEqual(16);
  expect(contract.numbers).toEqual([1, 1, 1, 1, 1, 1]);
  expect(contract.headings.every((heading) => heading && !/^\d+[.、｜]/u.test(heading))).toBe(true);
});

test("mobile subpage images follow the title band without overflowing", async ({ page }) => {
  test.skip(test.info().project.name !== "desktop", "single-browser responsive contract");
  for (const width of [390, 466, 768]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/about/");
    const layout = await page.locator(".page-hero__inner").evaluate((element) => {
      const frame = element.getBoundingClientRect();
      const copy = element.querySelector(".page-hero__masthead")!.getBoundingClientRect();
      const visual = element.querySelector(".page-hero__visual")!.getBoundingClientRect();
      return { leftInset: visual.left - frame.left, rightInset: frame.right - visual.right, belowCopy: visual.top >= copy.bottom };
    });
    expect(layout.leftInset, String(width)).toBeGreaterThanOrEqual(0);
    expect(Math.abs(layout.rightInset), String(width)).toBeLessThanOrEqual(1);
    expect(layout.belowCopy, String(width)).toBe(true);
  }
});

test("global gutter, Noto Sans SC body, Noto Serif SC headings and shared heading line height stay consistent", async ({ page }) => {
  for (const [width, gutter] of [[390, 24], [768, 32], [1440, 48], [1920, 288]] as const) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    const contract = await page.evaluate(() => {
      const position = (selector: string) => document.querySelector(selector)!.getBoundingClientRect().left;
      const bodyFont = getComputedStyle(document.body).fontFamily;
      const featureFont = getComputedStyle(document.querySelector(".page-hero--home h1")!).fontFamily;
      const allowed = [1, 1.2, 1.4, 1.5, 1.75];
      const invalidLines = [...document.querySelectorAll("main h1, main h2, main h3, main h4, main p, main li, main dd, main a")].filter((element) => {
        const style = getComputedStyle(element);
        const ratio = Number.parseFloat(style.lineHeight) / Number.parseFloat(style.fontSize);
        return element.matches("h1, h2, h3, h4, h5, h6") ? Math.abs(ratio - 1.2) > 0.001 : !allowed.some((value) => Math.abs(value - ratio) < 0.015);
      }).map((element) => `${element.tagName}:${element.textContent?.slice(0, 24)}`);
      const nonLeft = [...document.querySelectorAll("main h1, main h2")].filter((element) => getComputedStyle(element).textAlign !== "left" && getComputedStyle(element).textAlign !== "start").length;
      const frameToken = getComputedStyle(document.documentElement).getPropertyValue("--layout-canvas-max").trim();
      const frame = frameToken.endsWith("vw") ? window.innerWidth * Number.parseFloat(frameToken) / 100 : Number.parseFloat(frameToken);
      const layoutGutter = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--layout-gutter"));
      return { bodyFont, featureFont, invalidLines, nonLeft, expectedLeft: Math.max(layoutGutter, (window.innerWidth - frame) / 2 + layoutGutter), positions: [position(".primary-nav__inner"), position(".hero-rail a span"), position(".section-grid"), position(".footer-brand")] };
    });
    expect(Math.abs(contract.expectedLeft - gutter), `${width}px gutter`).toBeLessThan(1);
    expect(contract.positions.every((position) => Math.abs(position - contract.expectedLeft) < 1), String(width)).toBe(true);
    expect(contract.bodyFont).toContain("Noto Sans SC");
    expect(contract.featureFont).toContain("Noto Serif SC");
    expect(contract.featureFont).not.toBe(contract.bodyFont);
    expect(contract.invalidLines, String(width)).toEqual([]);
    expect(contract.nonLeft, String(width)).toBe(0);
    await page.goto("/services/");
    const pageMap = width > 960 ? page.locator(".page-map-rail__inner") : page.locator(".page-map-disclosure > summary");
    const pageMapLeft = await pageMap.evaluate((element) => element.getBoundingClientRect().left);
    expect(Math.abs(pageMapLeft - contract.expectedLeft), `${width}/${gutter}`).toBeLessThan(1);
  }
});

test("fixed header and sticky section navigation preserve the shared anchor landing position", async ({ page }) => {
  test.skip(test.info().project.name !== "desktop", "desktop fixed navigation contract");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/about/");
  const link = page.locator('.page-map-rail__inner a[href="#about-q23"]');
  await link.click();
  await expect(page).toHaveURL(/#about-q23$/);
  await expect.poll(() => page.locator("#about-q23").evaluate((element) => Math.abs(element.getBoundingClientRect().top - Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--layout-anchor-offset"))))).toBeLessThanOrEqual(2);
  const placement = await page.evaluate(() => {
    const header = document.querySelector<HTMLElement>(".site-header")!.getBoundingClientRect();
    const rail = document.querySelector<HTMLElement>(".structured-page-map")!.getBoundingClientRect();
    const target = document.querySelector<HTMLElement>("#about-q23")!.getBoundingClientRect();
    const anchorOffset = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--layout-anchor-offset"));
    return { headerTop: header.top, headerBottom: header.bottom, railHeight: rail.height, railTop: rail.top, targetTop: target.top, anchorOffset };
  });
  expect(Math.abs(placement.headerTop)).toBeLessThanOrEqual(1);
  expect(Math.abs(placement.headerBottom - 72)).toBeLessThanOrEqual(1);
  expect(Math.abs(placement.railHeight - 49)).toBeLessThanOrEqual(1);
  expect(Math.abs(placement.railTop - placement.headerBottom)).toBeLessThanOrEqual(1);
  expect(Math.abs(placement.targetTop - placement.anchorOffset)).toBeLessThanOrEqual(2);
});

test("direct section links land at the shared anchor offset on mobile and desktop", async ({ page }) => {
  test.skip(test.info().project.name !== "desktop", "single-browser responsive contract");
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const [route, selector] of [["/about/#about-q23", "#about-q23"], ["/media/#media-q22", "#media-q22"]] as const) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready.then(() => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())))));
      await expect.poll(() => page.locator(selector).evaluate((element) => Math.abs(element.getBoundingClientRect().top - Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--layout-anchor-offset")))), { message: `${width} ${route}` }).toBeLessThanOrEqual(2);
    }
  }
});

test("visitor feedback uses an equal-height responsive testimonial rail with working controls", async ({ page }) => {
  test.skip(test.info().project.name !== "desktop", "single-browser responsive contract");
  for (const width of [390, 960, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/media/#media-q22");
    await page.evaluate(() => document.fonts.ready);
    const rail = page.locator("#media-q22 .testimonial-rail");
    const cards = rail.locator(".testimonial-card");
    await expect(cards).toHaveCount(5);
    const contract = await rail.evaluate((element) => {
      const viewport = element.querySelector<HTMLElement>(".testimonial-rail__viewport")!;
      const items = [...element.querySelectorAll<HTMLElement>(".testimonial-card")];
      const quote = items[0].querySelector<HTMLElement>("blockquote p")!;
      const sourceOffsets = items.map((item) => item.getBoundingClientRect().bottom - item.querySelector<HTMLElement>(".testimonial-card__source")!.getBoundingClientRect().bottom);
      return { viewportWidth: viewport.getBoundingClientRect().width, cardWidths: items.map((item) => item.getBoundingClientRect().width), cardHeights: items.map((item) => item.getBoundingClientRect().height), scrollable: viewport.scrollWidth > viewport.clientWidth, quoteFont: getComputedStyle(quote).fontFamily, sourceOffsetDelta: Math.max(...sourceOffsets) - Math.min(...sourceOffsets), controlWeights: [...element.querySelectorAll<HTMLElement>(".testimonial-rail__state")].map((control) => Number.parseFloat(getComputedStyle(control).fontWeight)) };
    });
    const expectedViewportWidth = width <= 600 ? width - 24 : width;
    expect(Math.abs(contract.viewportWidth - expectedViewportWidth), String(width)).toBeLessThanOrEqual(1);
    expect(Math.max(...contract.cardHeights) - Math.min(...contract.cardHeights), String(width)).toBeLessThanOrEqual(1);
    expect(contract.scrollable, String(width)).toBe(true);
    expect(contract.quoteFont).toContain("Noto Serif SC");
    expect(contract.sourceOffsetDelta, String(width)).toBeLessThanOrEqual(1);
    expect(contract.controlWeights.every((weight) => weight <= 500), String(width)).toBe(true);
    const expectedVisible = width <= 600 ? 1 : width <= 960 ? 2 : 3;
    expect(Math.abs(contract.cardWidths[0] * expectedVisible - contract.viewportWidth), String(width)).toBeLessThanOrEqual(2);
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/media/#media-q22");
  await expect.poll(() => page.locator("#media-q22").evaluate((element) => Math.abs(element.getBoundingClientRect().top - Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--layout-anchor-offset"))))).toBeLessThanOrEqual(2);
  const viewport = page.locator("#media-q22 .testimonial-rail__viewport");
  const viewportLeft = await viewport.evaluate((element) => element.getBoundingClientRect().left);
  const initialScroll = await page.evaluate(() => window.scrollY);
  await page.getByRole("radio", { name: "查看最后一组反馈" }).click();
  await expect(page).toHaveURL(/#media-q22$/);
  await expect.poll(() => page.locator("#media-q22-quote-3").evaluate((element, left) => Math.abs(element.getBoundingClientRect().left - left), viewportLeft)).toBeLessThan(2);
  expect(Math.abs(await page.evaluate(() => window.scrollY) - initialScroll)).toBeLessThanOrEqual(1);
  await page.getByRole("radio", { name: "查看第一组反馈" }).click();
  await expect(page).toHaveURL(/#media-q22$/);
  await expect.poll(() => page.locator("#media-q22-quote-1").evaluate((element, left) => Math.abs(element.getBoundingClientRect().left - left), viewportLeft)).toBeLessThan(2);
});

test("resource categories stay ordered and allow only one readable panel at a time", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/resources/");
  const categories = page.locator('[data-collection="categories"]');
  const media = page.locator("#resources-q20");
  const assessment = page.locator("#resources-q14");
  await expect(categories.locator(":scope > details")).toHaveCount(6);
  expect((await media.boundingBox())!.width).toBeCloseTo((await categories.boundingBox())!.width, 0);
  await media.locator(":scope > summary").click();
  await expect(media).toHaveAttribute("open", "");
  await assessment.locator(":scope > summary").click();
  await expect(assessment).toHaveAttribute("open", "");
  await expect(media).not.toHaveAttribute("open", "");
  expect((await page.evaluate(inspectLayout)).narrow).toEqual([]);
  await page.setViewportSize({ width: 320, height: 900 });
  await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
  const mobile = await page.evaluate(inspectLayout);
  expect(mobile.overflow).toBe(false);
  expect(mobile.clipped).toEqual([]);
  expect(mobile.narrow).toEqual([]);
});

test("card headings, bodies and footers align within each responsive row", async ({ page }) => {
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/blog/");
    const cards = await page.locator("#articles-q07 .content-card").evaluateAll((elements) => elements.map((element) => ({ top: element.getBoundingClientRect().top, bottom: element.getBoundingClientRect().bottom, title: element.querySelector("h3")!.getBoundingClientRect().top, body: element.querySelector(".content-card__body")!.getBoundingClientRect().top, footer: element.querySelector(".content-card__footer")!.getBoundingClientRect().bottom })));
    for (const card of cards) {
      expect(Math.abs(card.footer - card.bottom)).toBeLessThanOrEqual(33);
      for (const sibling of cards.filter((entry) => Math.abs(entry.top - card.top) < 1)) {
        expect(Math.abs(sibling.title - card.title)).toBeLessThan(1);
        expect(Math.abs(sibling.body - card.body)).toBeLessThan(1);
        expect(Math.abs(sibling.footer - card.footer)).toBeLessThan(1);
      }
    }
    expect((await page.evaluate(inspectLayout)).clipped).toEqual([]);
  }
});

test("recommendation cards align their internal sections and share list styling", async ({ page }) => {
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/blog/#articles-q23");
    const cards = await page.locator("#articles-q23 .content-card").evaluateAll((elements) => elements.map((element) => ({ top: element.getBoundingClientRect().top, details: element.querySelector(".content-card__details")!.getBoundingClientRect().top, footer: element.querySelector(".content-card__footer")!.getBoundingClientRect().bottom, list: element.querySelector("ul")!.className, rules: getComputedStyle(element.querySelector("li")!).borderBottomWidth })));
    expect(cards).toHaveLength(3);
    for (const card of cards) {
      expect(card.list).toBe("rich-recommendation-list");
      expect(card.rules).toBe("0px");
      for (const sibling of cards.filter((entry) => Math.abs(entry.top - card.top) < 1)) {
        expect(Math.abs(sibling.details - card.details)).toBeLessThan(1);
        expect(Math.abs(sibling.footer - card.footer)).toBeLessThan(1);
      }
    }
    expect((await page.evaluate(inspectLayout)).clipped).toEqual([]);
  }
});

test("visible interactions do not shift layout and reduced motion remains respected", async ({ page }) => {
  await page.goto("/");
  const button = page.locator(".button--hero");
  await button.scrollIntoViewIfNeeded();
  const start = await button.boundingBox();
  await button.hover();
  expect(await button.boundingBox()).toEqual(start);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(button).toHaveCSS("transition-duration", "0s");
});

test("editorial media spreads and high-contrast primary actions retain responsive contracts", async ({ page }) => {
  for (const width of [375, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/media/");
    const section = page.locator("#media-q05");
    await expect(section).toHaveAttribute("data-layout", "spread");
    await expect(section.locator(".section-illustration--photo img")).toHaveAttribute("loading", "lazy");
    await expect(section.locator('.editorial-spread > .card-grid > article')).toHaveCount(3);
    const layout = await page.evaluate(inspectLayout);
    expect(layout.clipped).toEqual([]);
    expect(layout.narrow).toEqual([]);
    const action = page.locator(".cta-strip .button--primary");
    await expect(action).toHaveCSS("color", color("ink"));
    await expect(action).toHaveCSS("font-size", "20px");
    await expect(action).toHaveCSS("font-weight", "400");
  }
});

test("pages keep the zero-runtime and critical asset budgets", async ({ page }) => {
  await page.goto("/");
  const payload = await page.evaluate(() => {
    const resources = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
    return { runtimeScripts: document.querySelectorAll('script:not([type="application/ld+json"])').length, scriptRequests: resources.filter((entry) => entry.initiatorType === "script").length, cssBytes: resources.filter((entry) => entry.initiatorType === "link" && entry.name.endsWith(".css")).reduce((total, entry) => total + entry.encodedBodySize, 0), fontBytes: resources.filter((entry) => entry.initiatorType === "css" && entry.name.endsWith(".woff2")).reduce((total, entry) => total + entry.encodedBodySize, 0) };
  });
  expect(payload.runtimeScripts).toBe(0);
  expect(payload.scriptRequests).toBe(0);
  expect(payload.cssBytes).toBeLessThan(46_000);
  expect(payload.fontBytes).toBeLessThan(1_950_000);
});

for (const route of routes) {
  test(route + " passes accessibility checks in default and expanded states", async ({ page }) => {
    await page.goto(route);
    const initial = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    expect(initial.violations, route + " default: " + initial.violations.map((item) => item.id).join(", ")).toEqual([]);
    const details = page.locator("main details");
    if (await details.count()) {
      await details.evaluateAll((elements) => elements.forEach((element) => element.setAttribute("open", "")));
      const expanded = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
      expect(expanded.violations, route + " expanded: " + expanded.violations.map((item) => item.id).join(", ")).toEqual([]);
    }
  });
}

test("capture representative responsive evidence", async ({ page }, testInfo) => {
  for (const route of ["/", "/retreats-workshops/", "/courses-workshops/", "/resources/", "/book-consultation/"]) {
    await page.goto(route);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.evaluate(() => document.fonts.ready);
    const name = route === "/" ? "home" : route.replaceAll("/", "-").replace(/^-|-$/g, "");
    await page.screenshot({ path: testInfo.outputPath(name + ".png"), fullPage: true });
  }
});
