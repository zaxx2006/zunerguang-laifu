import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const contentDir = path.join(root, "src/content/published");
const registry = fs.readFileSync(path.join(root, "src/lib/page-registry.ts"), "utf8");
const files = fs.readdirSync(contentDir).filter((file) => file.endsWith(".mdx")).sort();
const registeredFiles = [...registry.matchAll(/contentFile: "([^"]+\.mdx)"/g)].map((match) => match[1]).sort();
const forbidden = [/raw\.files/i, /utm_source=/i, /当然可以/, /下面是我/, /建议新增/, /建议位置/, /页面结构建议/, /可发展文章/, /SEO Title/i, /Meta Description/i];
const allowedComponents = new Set(["Section", "CardGrid", "Steps", "DetailList", "ActionLinks", "SmallCopy", "FAQList", "Callout", "CTA", "AssessmentLink", "StatusNotice", "StructuredContent"]);
const prelaunchFiles = new Set(["media.mdx"]);
const routePaths = new Set(["/", ...[...registry.matchAll(/\{ slug: "([^"]+)"/g)].map((match) => `/${match[1]}/`)]);
const failures = [];
const structuredPages = JSON.parse(fs.readFileSync(path.join(root, "src/content/structured-pages.json"), "utf8"));

function checkActionOrder(value, location = "structured-pages") {
  if (Array.isArray(value)) {
    for (const [index, entry] of value.entries()) if (entry?.kind === "actions" && index !== value.length - 1) failures.push(`${location} 的行动按钮必须位于内容组末尾`);
    for (const [index, entry] of value.entries()) checkActionOrder(entry, `${location}.${index}`);
    return;
  }
  if (value && typeof value === "object") for (const [key, entry] of Object.entries(value)) checkActionOrder(entry, `${location}.${key}`);
}

if (files.length !== 30) failures.push(`发布内容文件应为 30 个，实际为 ${files.length}`);
if (registeredFiles.length !== 30) failures.push(`页面注册项应为 30 个，实际为 ${registeredFiles.length}`);
if (JSON.stringify(files) !== JSON.stringify(registeredFiles)) failures.push("页面注册文件与发布目录不一致");
checkActionOrder(structuredPages);
for (const file of files) {
  const source = fs.readFileSync(path.join(contentDir, file), "utf8");
  for (const pattern of forbidden) if (pattern.test(source)) failures.push(`${file} 命中编辑痕迹 ${pattern}`);
  if (!source.includes("<Section") && !source.includes("<StructuredContent")) failures.push(`${file} 缺少内容区结构`);
  if (/^\s*import\s/m.test(source)) failures.push(`${file} 不应自行导入组件或运行时代码`);
  if (prelaunchFiles.has(file) && !source.includes("<StatusNotice>") && !source.includes('<StructuredContent pageKey="media"')) failures.push(`${file} 缺少明确筹备状态`);
  if (!prelaunchFiles.has(file) && /当前没有开放|正在筹备/.test(source) && file !== "book-consultation.mdx") failures.push(`${file} 的发布状态与正文不一致`);
  if (/<a\b[^>]*\bhref=["']https?:/i.test(source)) failures.push(`${file} 含未经配置的外部链接`);
  if (/<a\b[^>]*\bdownload\b/i.test(source)) failures.push(`${file} 含下载入口`);
  if (/\b[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}\b/.test(source)) failures.push(`${file} 含未经配置的邮箱`);
  for (const match of source.matchAll(/href="(\/[^"]*)"/g)) if (!routePaths.has(match[1])) failures.push(`${file} 含未注册内部链接 ${match[1]}`);
  for (const match of source.matchAll(/<([A-Z][A-Za-z0-9]*)\b/g)) if (!allowedComponents.has(match[1])) failures.push(`${file} 使用未登记 MDX 组件 ${match[1]}`);
  let sectionDepth = 0;
  for (const [index, line] of source.split("\n").entries()) {
    if (line.startsWith("<Section")) sectionDepth += 1;
    if (line.startsWith("<Callout>") && sectionDepth === 0) failures.push(`${file}:${index + 1} Callout 必须位于 Section 内`);
    if (line.startsWith("</Section>")) sectionDepth -= 1;
  }
}
for (const file of prelaunchFiles) if (!registry.includes(`contentFile: "${file}"`) || !new RegExp(`contentFile: "${file.replace(".", "\\.")}"[^\\n]+status: "prelaunch"`).test(registry)) failures.push(`${file} 未在注册表标为 prelaunch`);
const booking = fs.readFileSync(path.join(root, "src/components/content/ContentBlock.tsx"), "utf8");
if (!booking.includes("当前不收集姓名、电话、邮箱或任何个人情况")) failures.push("预约页缺少当前不收集个人信息的明确说明");
if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(`Content audit passed: ${files.length} published MDX files`);
