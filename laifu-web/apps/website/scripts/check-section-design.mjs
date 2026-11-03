import fs from "node:fs";
import path from "node:path";
import { readDesign } from "./lib/design.mjs";

const root = process.cwd();
const plans = JSON.parse(fs.readFileSync(path.join(root, "src/content/section-design.json"), "utf8"));
const pages = JSON.parse(fs.readFileSync(path.join(root, "src/content/structured-pages.json"), "utf8"));
const design = readDesign(path.resolve(root, "../../docs/design/system.md"));
const failures = [];
const roles = new Set(["story", "feature", "principles", "cards", "steps", "faq", "tool", "comparison", "metrics", "directory", "notice", "media", "testimonials"]);
const illustrationRoles = new Set(["tool", "faq", "directory", "notice"]);
const visualDecisions = new Set(["none", "photo", "illustration"]);
const tones = new Set(["canvas", "sand", "stone"]);
const densities = new Set(["compact", "regular", "feature"]);
const mediaFiles = { walk: "hero-walk.webp", reflection: "self-reflection.webp", room: "sunlit-room.webp", path: "forest-path.webp", journal: "journal.webp", aboutWindow: "section-about-window.webp", aboutHome: "section-about-home.webp", collaborationCafe: "section-collaboration-cafe.webp", resourceNotes: "section-resources-notes.webp", articleReading: "section-articles-reading.webp", mediaRecording: "section-media-recording.webp", mediaReflection: "section-media-reflection.webp", remarriageRings: "section-remarriage-rings.webp", servicesRoad: "section-services-shanghai-road.webp", servicesOffice: "section-services-office.webp" };
const expectedLines = new Set([1, 1.2, 1.4, 1.5, 1.75]);
const serifTokens = new Set(["display-xl", "display-lg", "display-compact", "display-editorial", "section-editorial", "heading-xl", "heading-lg", "heading-md", "heading-sm", "card-title", "hero-long", "editorial-heading", "editorial-voice", "home-entry"]);
const registry = fs.readFileSync(path.join(root, "src/lib/page-registry.ts"), "utf8");
const heroImages = [...registry.matchAll(/heroImage: "([^"]+)"/g)].map((match) => match[1]);
const approvedHeroIllustrations = new Set(["/generated/illustrations/faq.svg", "/generated/illustrations/key-points.svg", "/generated/illustrations/team.svg"]);
const visualReferences = [...heroImages];
const heroPhotoTotal = heroImages.filter((image) => image.endsWith(".webp")).length;
let sectionPhotoTotal = 0;
let sectionIllustrationTotal = 0;

if (Object.keys(plans).join("|") !== Object.keys(pages).join("|")) failures.push("章节设计清单与结构化页面缺失、增加或顺序不一致");
if (heroImages.length !== 30) failures.push("页面资产登记数量与公开页面数量不一致");
for (const image of heroImages) if (!fs.existsSync(path.join(root, "public", image.slice(1)))) failures.push(`首屏图片不存在：${image}`);
for (const image of heroImages.filter((item) => item.endsWith(".svg"))) if (!approvedHeroIllustrations.has(image)) failures.push(`首屏插图未通过抽象信息场景判断：${image}`);
let sourceTotal = 0;
let sectionTotal = 0;
let mediaTotal = 0;
for (const [pageKey, page] of Object.entries(pages)) {
  const plan = plans[pageKey];
  if (!plan) continue;
  const sourceIds = page.sections.map((section) => section.id);
  const coveredIds = plan.sections.flatMap((section) => section.sourceIds);
  sourceTotal += sourceIds.length;
  sectionTotal += plan.sections.length;
  if (plan.sourceSectionCount !== sourceIds.length) failures.push(`${pageKey} 的 sourceSectionCount 与来源内容不一致`);
  if (plan.sectionCount !== plan.sections.length) failures.push(`${pageKey} 的 sectionCount 与设计章节不一致`);
  if (coveredIds.join("|") !== sourceIds.join("|")) failures.push(`${pageKey} 的来源章节存在遗漏、重复或顺序变化`);
  if (new Set(plan.sections.map((section) => section.id)).size !== plan.sections.length) failures.push(`${pageKey} 的设计章节 ID 重复`);
  for (const section of plan.sections) {
    const label = `${pageKey}/${section.id}`;
    if (!roles.has(section.role)) failures.push(`${label} 的 role 未登记`);
    if (!tones.has(section.tone)) failures.push(`${label} 的 tone 未登记`);
    if (!densities.has(section.density)) failures.push(`${label} 的 density 未登记`);
    if (![1, 2, 3, 4].includes(section.columns) || 12 % section.columns) failures.push(`${label} 的 columns 不能整除 12`);
    if (section.proseColumns !== undefined) failures.push(`${label} 的连续正文应保持单栏阅读，不通过字数阈值分栏`);
    if (section.sourceIds.length > 1 && section.columns > section.sourceIds.length) failures.push(`${label} 的并栏数超过归入该 section 的来源内容数`);
    if (section.sourceIds.length > 1 && section.columns === 1) failures.push(`${label} 归入多个来源章节却仍按单栏堆叠`);
    if (section.role === "feature" && section.sourceIds.length > 1 && section.columns < 2) failures.push(`${label} 的组合式 feature 必须至少使用两栏`);
    const source = section.sourceIds.length === 1 ? page.sections.find((item) => item.id === section.sourceIds[0]) : undefined;
    const collapsibleCardCount = source?.blocks.filter((block) => block.kind === "subsection" && block.collapsible).length ?? 0;
    if (section.role === "cards" && collapsibleCardCount === 7 && section.columns !== 4) failures.push(`${label} 的 7 项折叠卡片必须按桌面 4+3 编排`);
    const hasMedia = Boolean(section.media || section.illustration);
    const expectedVisualDecision = section.media ? "photo" : section.illustration ? "illustration" : "none";
    if (!visualDecisions.has(section.visualDecision) || section.visualDecision !== expectedVisualDecision) failures.push(`${label} 的 visualDecision 与实际配图不一致`);
    if (hasMedia) mediaTotal += 1;
    if (hasMedia ? (section.mediaRationale?.length ?? 0) < 12 : Boolean(section.mediaRationale)) failures.push(`${label} 未记录逐章节配图理由`);
    if (section.media) {
      sectionPhotoTotal += 1;
      const file = mediaFiles[section.media.asset];
      if (!file || !fs.existsSync(path.join(root, "public/images/editorial", file))) failures.push(`${label} 引用的照片不存在`);
      if (file) visualReferences.push(`/images/editorial/${file}`);
      if (!section.media.alt || section.media.alt.length < 4) failures.push(`${label} 的照片缺少有效替代文本`);
      if (!["portrait", "banner", "rail"].includes(section.media.placement)) failures.push(`${label} 的照片位置未登记`);
    }
    if (section.illustration) {
      if (!illustrationRoles.has(section.role)) failures.push(`${label} 的内容角色不适合使用插图`);
      sectionIllustrationTotal += 1;
      visualReferences.push(`/generated/illustrations/${section.illustration}`);
      if (!fs.existsSync(path.join(root, "public/generated/illustrations", section.illustration))) failures.push(`${label} 引用的插图不存在`);
    }
  }
}
if (new Set(visualReferences).size !== visualReferences.length) failures.push("页面首屏和内容配图存在重复资产，每一处配图必须唯一");
const photoReferences = visualReferences.filter((image) => image.startsWith("/images/editorial/") && image.endsWith(".webp"));
for (const image of photoReferences) {
  const sourcePath = path.join(root, "assets/photos", path.basename(image).replace(/\.webp$/, ".source.json"));
  if (!fs.existsSync(sourcePath)) failures.push(`照片缺少来源记录：${image}`);
  else {
    const source = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
    if (!source.source_url || !source.license || !source.license_url) failures.push(`照片来源记录不完整：${image}`);
  }
}
const photoTotal = heroPhotoTotal + sectionPhotoTotal;
const visualTotal = heroImages.length + mediaTotal;
if (design.layout.columns !== 12) failures.push("设计系统底层网格必须为 12 栏");
if (design.layout.gutter !== "48px" || design.layout["column-gap"] !== "32px" || design.responsive.tablet["layout-gutter"] !== "32px" || design.responsive.mobile["layout-gutter"] !== "24px" || design.responsive.mobile["layout-column-gap"] !== "16px") failures.push("全局网格必须固定为桌面 48px / 32px、平板 32px 外侧留白、手机 24px / 16px");
if (design.layout["canvas-max"] !== "1440px" || design.layout["reading-width"] !== "800px" || design.layout["editorial-reading-width"] !== "800px") failures.push("页面外框与正文宽度必须匹配参考版式的 1440px / 800px 约束");
if (design.size.header !== "72px" || design.size.subnavigation !== "48px" || design.layout["anchor-offset"] !== "92px") failures.push("固定顶栏、底部锚点栏与锚点偏移必须保持 72px / 48px / 92px");
if (design.layout["section-inset"] !== "0px" || design.layout["hero-copy-inset"] !== "0px") failures.push("章节与 Hero 不得叠加第二层水平 inset");
for (const [name, token] of Object.entries(design.typography)) {
  const expectedFamily = serifTokens.has(name) ? "Noto Serif SC" : "Noto Sans SC";
  if (token.fontFamily !== expectedFamily) failures.push(`${name} 必须使用 ${expectedFamily}，当前为 ${token.fontFamily}`);
}
if (design.leading.heading !== 1.2) failures.push("全项目标题行高必须统一为 1.2");
for (const [name, token] of Object.entries(design.typography)) {
  const lineHeight = token.lineHeight === "var(--leading-heading)" ? design.leading.heading : token.lineHeight;
  if (!expectedLines.has(lineHeight)) failures.push(`${name} 的行距 ${token.lineHeight} 未纳入排版规则`);
  if (serifTokens.has(name) && name !== "editorial-voice" && token.lineHeight !== "var(--leading-heading)") failures.push(`${name} 必须复用共享标题行高`);
}
for (const file of ["for-lawyers.mdx", "pre-legal-clarity.mdx"]) {
  const source = fs.readFileSync(path.join(root, "src/content/published", file), "utf8");
  const sectionTags = [...source.matchAll(/<Section\b[^>]*>/g)].map((match) => match[0]);
  if (sectionTags.length !== 3) failures.push(`${file} 的人工设计章节数量应为 3`);
  for (const tag of sectionTags) for (const attribute of ["id", "role", "columns", "tone", "density"]) if (!new RegExp(`\\b${attribute}=`).test(tag)) failures.push(`${file} 的 Section 缺少 ${attribute}`);
  for (const tag of source.matchAll(/<(?:CardGrid|Steps)\b[^>]*>/g)) if (!/\bcolumns=/.test(tag[0])) failures.push(`${file} 的 ${tag[0].split(/[\s>]/)[0].slice(1)} 未明确继承章节栏数`);
}

function createPlanDocument() {
  const lines = ["# 页面 Section 设计清单", "", "此清单由 `section-design.json` 生成。每个页面先确认来源章节数量，再完成语义归类；栏数表示该 section 的内容并列数，底层均换算到 12 栏。连续正文保持单栏，目录、服务和步骤按内容关系分组，不通过字数阈值决定版式。每个 section 必须先将 visualDecision 登记为 none、photo 或 illustration；真实照片承担主要视觉叙事，插图只允许用于抽象工具、问答、目录或提示。", "", `结构化页面合计：${Object.keys(plans).length} 页，${sourceTotal} 个来源章节归为 ${sectionTotal} 个设计 section，其中 ${sectionPhotoTotal} 个 section 使用照片、${sectionIllustrationTotal} 个 section 使用插图。另有 2 个人工 MDX 页面，各 3 个设计 section。`, ""];
  for (const [pageKey, plan] of Object.entries(plans)) {
    const intro = "单栏导语，保持连续阅读";
    lines.push(`## ${pages[pageKey].sourceSheet}（${pageKey}）`, "", `来源 ${plan.sourceSectionCount} 节 → 设计 ${plan.sectionCount} 节；页面导语：${intro}`, "", "| Section | 来源归类 | 内容角色 | 栏数 | 正文编排 | 色调 | 密度 | 图片判断 |", "| --- | --- | --- | ---: | --- | --- | --- | --- |");
    for (const section of plan.sections) {
      const media = section.media ? `photo · ${section.media.asset}；${section.mediaRationale}` : section.illustration ? `illustration · ${section.illustration}；${section.mediaRationale}` : "none · 内容结构本身足以表达";
      const prose = "正文单栏，集合按内容结构";
      lines.push(`| ${section.id}${section.title ? ` · ${section.title}` : ""} | ${section.sourceIds.join(" + ")} | ${section.role} | ${section.columns} | ${prose} | ${section.tone} | ${section.density} | ${media} |`);
    }
    lines.push("");
  }
  lines.push("## 人工 MDX 页面", "", "| 页面 | 设计 section |", "| --- | ---: |", "| 律师合作（for-lawyers） | 3 |", "| 法律前澄清（pre-legal-clarity） | 3 |", "");
  return lines.join("\n");
}

const documentPath = path.resolve(root, "../../docs/design/section-plan.md");
const expectedDocument = createPlanDocument();
if (process.argv.includes("--write")) fs.writeFileSync(documentPath, expectedDocument);
else if (!fs.existsSync(documentPath) || fs.readFileSync(documentPath, "utf8") !== expectedDocument) failures.push("docs/design/section-plan.md 与章节设计清单不一致，请运行 pnpm sections:document");
if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(`Section design audit passed: ${sourceTotal} source sections, ${sectionTotal} designed sections, ${photoTotal}/${visualTotal} visuals are photos, continuous single-column prose, 12-column divisibility, two font roles and shared 1.2 heading line height`);
