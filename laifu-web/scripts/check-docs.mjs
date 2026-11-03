import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const markdownAllowlist = new Set(["README.md", "apps/website/AGENTS.md", "apps/website/CLAUDE.md", "docs/architecture.md", "docs/checklists/website-update-2026-08-05.md", "docs/design/compliance.md", "docs/design/section-plan.md", "docs/design/system.md", "docs/requirements/update-2026-09-03.md"]);
const ignoredDirectories = new Set([".agents", ".cache", ".claude", ".codex", ".continue", ".cursor", ".git", ".history", ".idea", ".next", ".roo", ".turbo", ".vercel", ".vscode", ".workspace", "blob-report", "build", "coverage", "dist", "node_modules", "out", "playwright-report", "screenshots", "test-artifacts", "test-results"]);
const failures = [];
const files = [];
const requiredWorkspacePackages = new Map([
  ["apps/website/package.json", "@laifu/website"],
  ["apps/assessments/package.json", "@laifu/assessments"],
  ["apps/admin/package.json", "@laifu/admin"],
  ["workers/assessment-api/package.json", "@laifu/assessment-api"],
]);

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(fullPath);
    if (entry.isFile()) files.push(path.relative(root, fullPath));
  }
}

function checkRelativeLinks(file, source) {
  for (const match of source.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
    const target = match[1].split("#")[0];
    if (!target || /^(?:https?:|mailto:|tel:|\/)/.test(target)) continue;
    const resolved = path.resolve(root, path.dirname(file), target);
    if (!fs.existsSync(resolved)) failures.push(`${file} 含失效相对链接 ${match[1]}`);
  }
}

walk(root);
const markdownFiles = files.filter((file) => file.endsWith(".md")).sort();
const mdxFiles = files.filter((file) => file.endsWith(".mdx")).sort();
for (const file of markdownFiles) if (!markdownAllowlist.has(file)) failures.push(`发现未归档 Markdown：${file}`);
for (const file of markdownAllowlist) if (!markdownFiles.includes(file)) failures.push(`缺少长期工程文档：${file}`);
if (mdxFiles.length !== 30) failures.push(`发布 MDX 应为 30 个，实际为 ${mdxFiles.length}`);
for (const file of mdxFiles) if (!file.startsWith("apps/website/src/content/published/")) failures.push(`MDX 位于发布目录之外：${file}`);
const forbiddenReferences = [/divorce_scale_web/, /DESIGN-laifu\.md/, /\.agents\//, /\.workspace\//, /admin-mvp\.edgeone\.dev/, /\bnpm (?:install|run)/];
for (const file of markdownFiles) {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  for (const pattern of forbiddenReferences) if (pattern.test(source)) failures.push(`${file} 含过期或内部引用 ${pattern}`);
  checkRelativeLinks(file, source);
}
const architecture = fs.readFileSync(path.join(root, "docs/architecture.md"), "utf8");
const environmentNames = ["NEXT_PUBLIC_SITE_URL", "NEXT_PUBLIC_ASSESSMENT_API_URL", "NEXT_PUBLIC_MAIN_SITE_URL", "NEXT_PUBLIC_BASE_PATH", "ASSESSMENT_API_URL", "ASSESSMENT_API_ADMIN_TOKEN", "ADMIN_ALLOWED_ORIGINS", "ADMIN_MVP_USERNAME", "ADMIN_MVP_PASSWORD", "ADMIN_MVP_SESSION_SECRET", "ADMIN_API_TOKEN", "PUBLIC_ORIGINS", "DB"];
for (const name of environmentNames) if (!architecture.includes(`\`${name}\``)) failures.push(`架构文档缺少配置 ${name}`);
for (const [file, name] of requiredWorkspacePackages) {
  if (!fs.existsSync(path.join(root, file))) failures.push(`架构所述工作区不存在：${file}`);
  else if (JSON.parse(fs.readFileSync(path.join(root, file), "utf8")).name !== name) failures.push(`工作区包名与架构不一致：${file}`);
}
const workerSource = fs.readFileSync(path.join(root, "workers/assessment-api/src/index.ts"), "utf8");
for (const endpoint of ["/health", "/v1/submissions", "/v1/admin/leads", "/report-preview"]) if (!workerSource.includes(endpoint)) failures.push(`Worker 缺少文档所述接口：${endpoint}`);
for (const statement of ["30 个发布 MDX 页面", "公开提交、后台鉴权、筛选、详情、更新、报告预览和删除"]) if (!architecture.includes(statement)) failures.push(`架构文档缺少验收事实：${statement}`);
const environmentExamples = new Map([
  ["apps/assessments/.env.example", ["NEXT_PUBLIC_ASSESSMENT_API_URL", "NEXT_PUBLIC_MAIN_SITE_URL", "NEXT_PUBLIC_BASE_PATH"]],
  ["apps/admin/.env.example", ["ASSESSMENT_API_URL", "ASSESSMENT_API_ADMIN_TOKEN", "ADMIN_ALLOWED_ORIGINS", "ADMIN_MVP_USERNAME", "ADMIN_MVP_PASSWORD", "ADMIN_MVP_SESSION_SECRET"]],
  ["workers/assessment-api/.dev.vars.example", ["ADMIN_API_TOKEN", "PUBLIC_ORIGINS"]],
]);
for (const [file, names] of environmentExamples) {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  for (const name of names) if (!source.split("\n").some((line) => line.startsWith(`${name}=`))) failures.push(`${file} 缺少配置示例 ${name}`);
}
const gitignore = fs.readFileSync(path.join(root, ".gitignore"), "utf8");
for (const ignored of [".agents/", ".workspace/", ".claude/", ".codex/", ".cursor/", ".idea/", ".vscode/", ".github/workflows/", "**/.dev.vars", "package-lock.json", "yarn.lock", "bun.lock", "**/.next/", "**/out/", "**/.wrangler/", "playwright-report/", "test-results/", "*.log", "*.tsbuildinfo", "next-env.d.ts"]) if (!gitignore.split("\n").includes(ignored)) failures.push(`忽略规则缺少：${ignored}`);
const rootPackage = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
for (const command of ["dev:website", "dev:assessments", "dev:admin", "dev:api", "check"]) if (!rootPackage.scripts?.[command]) failures.push(`根命令缺失：${command}`);
if (rootPackage.packageManager !== "pnpm@12.3.4") failures.push("README 所述 pnpm 版本与 packageManager 不一致");
if (failures.length) {
  console.error([...new Set(failures)].join("\n"));
  process.exit(1);
}
console.log(`Documentation audit passed: ${markdownFiles.length} maintained Markdown files and ${mdxFiles.length} published MDX files`);
