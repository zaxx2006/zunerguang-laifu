import AxeBuilder from "@axe-core/playwright";
import { statSync } from "node:fs";
import { expect, test } from "@playwright/test";

const adminUrl = "http://127.0.0.1:4176";
const apiUrl = "http://127.0.0.1:4175";
const headers = { Authorization: "Bearer laifu-e2e-admin-token-32-characters" };

test("admin login, management and both report layouts survive the CSS consolidation", async ({ page, request }) => {
  test.setTimeout(120_000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`${adminUrl}/login`);
  await expect(page.getByRole("heading", { name: "后台登录" })).toBeVisible();
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze()).violations).toEqual([]);
  await page.getByLabel("内部账号").fill("css-audit");
  await page.getByLabel("密码", { exact: true }).fill("local-audit-password");
  await page.getByRole("button", { name: "登录后台" }).click();
  await page.waitForURL(`${adminUrl}/leads`);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
  for (const type of ["divorce_readiness", "spousal_narcissism_risk"]) {
    const response = await request.post(`${apiUrl}/v1/submissions`, { headers: { Origin: "http://127.0.0.1:4174" }, data: { assessment_type: type, service_intent: "professional_support", total_score: 18, dynamic_full_score: 30, score_rate: 0.6, result_level: "medium", result_label: "需要进一步准备", child_gate_answer: true, cross_border_gate_answer: false, weaknesses: ["D1"], dimension_scores: { D1: 3, D2: 3, D3: 3, D4: 3, D5: 3, D6: 3, N1: 3, N2: 3, N3: 3, N4: 3, N5: 3 }, answers: { q1: 3 }, contact_name: "本地样式审计", contact_phone: "+86 138 0000 0000", submission_source: "playwright-css-audit" } });
    expect(response.status()).toBe(201);
    const { data: { id } } = await response.json();
    try {
      await page.goto(`${adminUrl}/leads/${id}/report`);
      await expect(page.locator(".a4-report-page").first()).toBeVisible();
      const layout = await page.locator(".a4-report-page").first().evaluate((element) => ({ width: element.getBoundingClientRect().width, background: getComputedStyle(element).backgroundColor, border: getComputedStyle(element).borderRadius }));
      expect(layout.width).toBeGreaterThan(700);
      expect(layout.background).not.toBe("rgba(0, 0, 0, 0)");
      expect(layout.border).toBe("2px");
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
      await page.screenshot({ path: test.info().outputPath(`${type}-preview.png`), fullPage: true });
      if (test.info().project.name === "desktop") await page.locator(".a4-report-page").first().screenshot({ path: test.info().outputPath(`${type}-cover.png`) });
      if (test.info().project.name === "desktop") for (const [label, extension] of [["导出图片 PNG", ".png"], ["导出 PDF", ".pdf"]]) {
        await page.getByRole("button", { name: "导出报告", exact: true }).click();
        const downloadPromise = page.waitForEvent("download", { timeout: 60_000 });
        await page.getByRole("menuitem", { name: label, exact: true }).click();
        const download = await downloadPromise;
        expect(await download.failure()).toBeNull();
        expect(download.suggestedFilename()).toMatch(new RegExp(`${extension.replace(".", "\\.")}$`));
        await download.saveAs(test.info().outputPath(`${type}${extension}`));
        expect(statSync(test.info().outputPath(`${type}${extension}`)).size).toBeGreaterThan(10_000);
        expect(statSync(test.info().outputPath(`${type}${extension}`)).size).toBeLessThan(10_000_000);
      }
    } finally {
      await request.delete(`${apiUrl}/v1/admin/leads`, { headers, data: { ids: [id] } });
    }
  }
  expect(errors).toEqual([]);
});
