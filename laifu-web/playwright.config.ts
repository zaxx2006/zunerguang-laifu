import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  outputDir: "test-results",
  fullyParallel: true,
  retries: 0,
  reporter: [["list"], ["html", { outputFolder: "playwright-report", open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 1000 } } },
    { name: "tablet", use: { ...devices["Desktop Chrome"], viewport: { width: 768, height: 1024 } } },
    { name: "mobile", use: { ...devices["iPhone 13"], browserName: "chromium", viewport: { width: 390, height: 844 } } },
  ],
  webServer: [
    {
      command: "pnpm --filter @laifu/admin start --port 4176",
      url: "http://127.0.0.1:4176/login",
      reuseExistingServer: false,
      timeout: 30000,
      env: { ASSESSMENT_API_URL: "http://127.0.0.1:4175", ASSESSMENT_API_ADMIN_TOKEN: "laifu-e2e-admin-token-32-characters", ADMIN_MVP_USERNAME: "css-audit", ADMIN_MVP_PASSWORD: "local-audit-password", ADMIN_MVP_SESSION_SECRET: "local-css-audit-session", ADMIN_ALLOWED_ORIGINS: "127.0.0.1:4176" },
    },
    {
      command: "pnpm --filter @laifu/website preview",
      url: "http://127.0.0.1:4173",
      reuseExistingServer: false,
      timeout: 30000,
    },
    {
      command: "pnpm exec serve apps/assessments/out -l 4174",
      url: "http://127.0.0.1:4174",
      reuseExistingServer: false,
      timeout: 30000,
    },
    {
      command: "CI=1 pnpm --filter @laifu/assessment-api db:migrate:local && pnpm --filter @laifu/assessment-api exec wrangler dev --local --port 4175 --var ADMIN_API_TOKEN:laifu-e2e-admin-token-32-characters --var PUBLIC_ORIGINS:http://127.0.0.1:4174",
      url: "http://127.0.0.1:4175/health",
      reuseExistingServer: false,
      timeout: 30000,
    },
  ],
});
