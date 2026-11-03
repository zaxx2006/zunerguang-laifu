import fs from "node:fs";
import path from "node:path";
import { applyIllustrationTheme, createDiagonalHatch, illustrationFiles } from "./lib/assets.mjs";
import { auditStyles } from "./lib/style-contract.mjs";
import { createTokenCss, readDesign } from "./lib/design.mjs";
import { auditHomeStyles } from "./lib/home-style-contract.mjs";

const root = process.cwd();
const design = readDesign(path.resolve(root, "../../docs/design/system.md"));
const generatedPath = path.join(root, "src/app/design-tokens.css");
const globalCss = fs.readFileSync(path.join(root, "src/app/globals.css"), "utf8");
const failures = [];
const homeStyles = "src/components/home/home.css";
const homeTokens = "src/components/home/home-design-tokens.css";
failures.push(...auditHomeStyles({ tokens: fs.readFileSync(path.join(root, homeTokens), "utf8"), styles: fs.readFileSync(path.join(root, homeStyles), "utf8") }));
const homePrimitives = fs.readFileSync(path.join(root, "src/components/home/HomePrimitives.tsx"), "utf8");
for (const file of ["home.css", "home-design-tokens.css"]) if (!homePrimitives.includes(`import "./${file}";`)) failures.push(`首页样式未接入：${file}`);
const styleDirectory = path.join(root, "src/styles");
const sheets = Object.fromEntries(fs.readdirSync(styleDirectory).filter((file) => file.endsWith(".css")).map((file) => [file, fs.readFileSync(path.join(styleDirectory, file), "utf8")]));
failures.push(...auditStyles({ sheets, tokens: fs.readFileSync(generatedPath, "utf8"), breakpoints: Object.values(design.breakpoints) }));
const sectionPhotoRule = sheets["layout.css"].match(/\.section-illustration--photo img\s*\{([^}]*)\}/)?.[1] ?? "";
if (!/height:\s*auto\s*;/.test(sectionPhotoRule) || !/object-fit:\s*contain\s*;/.test(sectionPhotoRule)) failures.push("未指定构图的照片应保留原始比例，裁切须由具体构图规则控制");
for (const file of Object.keys(sheets)) if (!globalCss.includes(`@import "../styles/${file}";`)) failures.push(`未接入的样式模块：${file}`);
if (design.layout.columns !== 12) failures.push("页面网格必须使用 12 栏");
for (const name of ["button-lg", "button-md", "button-primary", "button-sm"]) if (design.typography[name].fontWeight !== 400) failures.push(`${name} 使用常规字重`);
if (/\{/.test(globalCss)) failures.push("globals.css 只能声明层级和导入模块，禁止追加覆盖");
const shadowFiles = [];
const sourceFiles = fs.readdirSync(path.join(root, "src"), { recursive: true }).map((file) => file.split(path.sep).join("/")).filter((file) => /\.(?:css|tsx?)$/.test(file));
const allowedCss = new Set(["app/globals.css", "app/design-tokens.css", "app/fonts.css", "components/coaching/coaching.css", "components/high-conflict/high-conflict.css", "components/home/home.css", "components/home/home-design-tokens.css", "components/site/breadcrumbs.css", "components/reader/reader.css", ...Object.keys(sheets).map((file) => "styles/" + file)]);
for (const file of sourceFiles) if (file.endsWith(".css") && !allowedCss.has(file)) failures.push("样式位于归属模块之外：" + file);

function collectShadowFiles(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (["node_modules", "out", "test-results", "playwright-report", ".next", ".agents", ".git"].includes(entry.name) || entry.name.startsWith(".next-")) continue;
    const target = path.join(directory, entry.name);
    if (path.relative(root, target).split(path.sep).join("/") === homeStyles) continue;
    if (entry.isDirectory()) collectShadowFiles(target);
    if (entry.isFile() && /\.(?:css|html|tsx?|jsx?)$/.test(entry.name) && /\b(?:box-shadow|text-shadow)\s*:|drop-shadow\s*\(/i.test(fs.readFileSync(target, "utf8"))) shadowFiles.push(path.relative(root, target));
  }
}

if (!fs.existsSync(generatedPath)) failures.push("设计令牌尚未生成");
if (fs.existsSync(generatedPath) && fs.readFileSync(generatedPath, "utf8") !== createTokenCss(design)) failures.push("生成令牌与 docs/design/system.md 不一致");
if (/\b(?:linear|radial|conic)-gradient\s*\(/i.test(globalCss)) failures.push("CSS 含禁止使用的渐变");
if (/var\(--color-(?:secondary|secondary-dark|success-deep|accent-[a-z-]+)\)/.test(Object.values(sheets).join("\n"))) failures.push("官网组件应使用中性表面令牌，不再引用历史彩色强调令牌");
collectShadowFiles(root);
if (shadowFiles.length) failures.push(`项目含阴影声明：${shadowFiles.join(", ")}`);
const hardcodedHex = [...globalCss.matchAll(/#[0-9a-fA-F]{3,8}\b/g)].map((match) => match[0]);
if (hardcodedHex.length) failures.push(`globals.css 含硬编码颜色：${hardcodedHex.join(", ")}`);
const hardcodedLineHeights = [...globalCss.matchAll(/line-height:\s*(?:\d|\.)[^;]*;/g)].map((match) => match[0]);
if (hardcodedLineHeights.length) failures.push(`globals.css 含未使用排版令牌的行距：${hardcodedLineHeights.join(", ")}`);
const illustrationSourceDir = path.join(root, "assets/illustration");
const illustrationDir = path.join(root, "public/generated/illustrations");
const registry = fs.readFileSync(path.join(root, "src/lib/page-registry.ts"), "utf8");
const sectionPlans = JSON.parse(fs.readFileSync(path.join(root, "src/content/section-design.json"), "utf8"));
const originalLogo = path.join(root, "assets/images/logo.svg");
const generatedLogo = path.join(root, "public/generated/logo/original.svg");
const generatedPattern = path.join(root, "public/generated/patterns/diagonal-hatch.svg");
const faviconFiles = ["favicon.ico", "favicon-32x32.png", "apple-touch-icon.png"];
const expectedInputs = Object.keys(illustrationFiles).sort();
const expectedOutputs = Object.values(illustrationFiles).sort();
const actualInputs = fs.readdirSync(illustrationSourceDir).filter((file) => file.endsWith(".svg")).sort();
const heroIllustrations = [...registry.matchAll(/heroImage: "\/generated\/illustrations\/([^"]+\.svg)"/g)].map((match) => match[1]);
const sectionIllustrations = Object.values(sectionPlans).flatMap((plan) => plan.sections.flatMap((section) => section.illustration ? [section.illustration] : []));
const referencedOutputs = [...new Set([...heroIllustrations, ...sectionIllustrations])].sort();
if (JSON.stringify(actualInputs) !== JSON.stringify(expectedInputs)) failures.push("源插图目录与资产登记表不一致");
if (JSON.stringify(referencedOutputs) !== JSON.stringify(expectedOutputs)) failures.push("资产登记表含未使用插图或页面引用缺失");
if (!fs.existsSync(illustrationDir)) failures.push("生成插图目录不存在");
if (fs.existsSync(illustrationDir)) {
  const actualOutputs = fs.readdirSync(illustrationDir).filter((file) => file.endsWith(".svg")).sort();
  if (JSON.stringify(actualOutputs) !== JSON.stringify(expectedOutputs)) failures.push("生成插图目录含缺失或过期文件");
  for (const [input, output] of Object.entries(illustrationFiles)) {
    const source = fs.readFileSync(path.join(illustrationSourceDir, input), "utf8");
    const generated = fs.readFileSync(path.join(illustrationDir, output), "utf8");
    if (applyIllustrationTheme(source, design.colors.primary) !== generated) failures.push(`${output} 未按主题色生成或存在额外改动`);
  }
}
const generatedLogos = fs.readdirSync(path.dirname(generatedLogo)).filter((file) => file.endsWith(".svg")).sort();
if (JSON.stringify(generatedLogos) !== JSON.stringify(["original.svg"])) failures.push("公开 Logo 目录含未使用变体");
if (!fs.existsSync(generatedLogo) || fs.readFileSync(originalLogo, "utf8") !== fs.readFileSync(generatedLogo, "utf8")) failures.push("公开 Logo 与原始 Logo 不一致");
if (!fs.existsSync(generatedPattern) || fs.readFileSync(generatedPattern, "utf8") !== createDiagonalHatch(design.colors["hairline-strong"])) failures.push("斜线纹理资产缺失或未使用设计令牌");
for (const file of faviconFiles) if (!fs.existsSync(path.join(root, "public", file))) failures.push(`缺少站点图标 ${file}`);
if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log("Design audit passed: 12 columns, token references, dimensions, typography, ownership, duplicate declarations, layers and brand assets");
