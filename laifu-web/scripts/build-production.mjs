import { spawnSync } from "node:child_process";

const env = {
  ...process.env,
  NEXT_PUBLIC_SITE_URL: "https://laifu-web.pages.dev",
  NEXT_PUBLIC_MAIN_SITE_URL: "https://laifu-web.pages.dev",
  NEXT_PUBLIC_ASSESSMENT_API_URL: "https://laifu-assessment-database.laifu-hubeitongren.workers.dev",
  NEXT_PUBLIC_BASE_PATH: "",
  ADMIN_ALLOWED_ORIGINS: "laifu-admin.laifu-hubeitongren.workers.dev",
};
for (const [app, command] of [["website", "build"], ["assessments", "build"], ["admin", "build:cf"]]) {
  const result = spawnSync("pnpm", ["--filter", `@laifu/${app}`, command], { env, stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
