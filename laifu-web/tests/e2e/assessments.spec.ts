import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { homeFooterColumns } from "../../shared/site-navigation";

const assessmentBaseUrl = process.env.ASSESSMENT_BASE_URL || "http://127.0.0.1:4174";

for (const route of ["/", "/narcissism-risk/"]) {
  test(`assessment route ${route} uses the current website theme and navigation`, async ({ page }) => {
    await page.goto(`${assessmentBaseUrl}${route}`);
    await expect(page.locator(".questionnaire-header")).toHaveCSS("background-color", "rgb(243, 245, 241)");
    const menu = page.locator(".questionnaire-menu-button");
    if (await menu.isVisible()) {
      await menu.click();
      await expect(page.locator(".questionnaire-mobile-drawer")).toBeVisible();
      await expect(page.locator(".questionnaire-mobile-booking")).toHaveCSS("background-color", "rgb(41, 75, 61)");
      await menu.click();
    } else {
      await expect(page.locator(".questionnaire-booking-button")).toHaveCSS("background-color", "rgb(41, 75, 61)");
    }
    await expect(page.locator(".questionnaire-footer")).toHaveCSS("background-color", "rgb(36, 61, 53)");
    const links = page.locator(".questionnaire-footer-grid a");
    expect(await links.allTextContents()).toEqual(homeFooterColumns.flatMap(column => column.links.map(([, label]) => label)));
    for (const link of await links.all()) await expect(link).toHaveAttribute("target", "_blank");
    const contrast = await new AxeBuilder({ page }).include(".questionnaire-header").include(".questionnaire-footer").withRules(["color-contrast"]).analyze();
    expect(contrast.violations).toEqual([]);
  });
  test(`assessment route ${route} renders cleanly`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`${assessmentBaseUrl}${route}`, { waitUntil: "networkidle" });
    await expect(page.locator("h1")).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    expect(errors).toEqual([]);
  });
}

test("divorce readiness questionnaire enters the question flow", async ({ page }) => {
  await page.goto(`${assessmentBaseUrl}/`);
  await page.getByRole("button", { name: "开始离婚准备测评", exact: true }).first().click();
  await expect(page.getByRole("heading", { name: /您当前是否存在/ })).toBeVisible();
  await page.getByRole("button", { name: "否", exact: true }).click();
  await expect(page.getByText("第 2 / 2 题")).toBeVisible();
});

test("marriage interaction questionnaire enters the question flow", async ({ page }) => {
  await page.goto(`${assessmentBaseUrl}/narcissism-risk/`);
  await page.getByRole("button", { name: "开始婚姻互动风险测评" }).click();
  await expect(page.getByText("第 1 / 40 题")).toBeVisible();
  await expect(page.locator("h1")).toBeVisible();
});

for (const risk of [false, true]) {
  test(`${risk ? "interaction risk" : "readiness"} completes, exports a report and keeps support optional`, async ({ page }, testInfo) => {
    await page.goto(`${assessmentBaseUrl}${risk ? "/narcissism-risk/" : "/"}`);
    await page.getByRole("button", { name: risk ? "开始婚姻互动风险测评" : "开始离婚准备测评" }).first().click();
    const options = page.locator(risk ? 'button[class*="optionButton"]' : '.option-item');
    const counter = page.locator(risk ? '[class*="counterBox"]' : '.counter-box');
    for (let answered = 0; answered < 80; answered++) {
      const previousCount = await counter.innerText();
      const gate = options.filter({ hasText: /^否$/ });
      if (await gate.count()) await gate.click();
      else await options.nth(2).click();
      const resultButton = page.getByRole("button", { name: risk ? "提交查看结果" : "查看结果", exact: true });
      if (await resultButton.isVisible()) {
        await resultButton.click();
        break;
      }
      await expect(counter).not.toHaveText(previousCount);
    }
    await expect(page.locator('#result-overview h1')).toBeVisible();
    await expect(page.locator('#result-dimensions svg')).toBeVisible();
    await expect(page.getByRole("button", { name: "保存结果并提交信息" })).toBeDisabled();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    const downloadEvent = page.waitForEvent("download");
    await page.getByRole("button", { name: risk ? "下载简版测评结果" : "下载简要测评报告" }).click();
    const download = await downloadEvent;
    expect(await download.failure()).toBeNull();
    await download.saveAs(testInfo.outputPath("assessment-report.png"));
    await page.getByRole("link", { name: "后续支持 ↓" }).click();
    await expect(page.locator('#result-support')).toBeInViewport();
    await page.screenshot({ path: testInfo.outputPath("result.png"), fullPage: true });
  });
}
