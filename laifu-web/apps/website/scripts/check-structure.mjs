import fs from "node:fs";
import path from "node:path";
import postcss from "postcss";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const failures = [];
const rules = new Map();
for (const file of fs.readdirSync(path.join(root, "src/styles"))) {
  const source = postcss.parse(read("src/styles/" + file));
  source.walkRules((rule) => {
    if (rule.parent?.name !== "layer") return;
    for (const selector of rule.selectors) {
      if (!rules.has(selector)) rules.set(selector, new Map());
      rule.walkDecls((decl) => rules.get(selector).set(decl.prop, decl.value));
    }
  });
}
const expectDeclaration = (selector, property, value) => {
  if (rules.get(selector)?.get(property) !== value) failures.push(selector + " 的 " + property + " 不符合结构约定");
};
const gridSelectors = [".section-grid", ".page-hero__inner", ".cta-strip__inner", ".structured-intro__inner", ".page-map-rail__inner", ".page-map-disclosure > summary", ".structured-page-map__inner", ".structured-page-map__inner ol", ".section-cluster", ".card-grid", ".steps", ".content-metrics", ".resource-catalog__grid", ".editorial-spread__opening", ".editorial-spread--prose", ".footer-grid", ".footer-brand"];
for (const selector of gridSelectors) expectDeclaration(selector, "grid-template-columns", "repeat(var(--layout-columns), minmax(0, 1fr))");
expectDeclaration(".status-notice", "display", "flex");
expectDeclaration(".status-notice", "flex-direction", "column");
expectDeclaration(".status-notice__body", "min-width", "0");
expectDeclaration(".section-body", "max-width", "var(--layout-reading-width)");
expectDeclaration(".comparison-table-wrap", "overflow-x", "auto");
for (const selector of [".card-grid > article", ".steps > article", ".resource-card"]) expectDeclaration(selector, "min-width", "0");
const primitives = read("src/components/content/ContentPrimitives.tsx");
for (const name of ["CardGrid", "Steps", "CTAFrame", "SectionFrame", "StatusNotice"]) if (!primitives.includes("export function " + name)) failures.push("缺少共享组件 " + name);
for (const file of ["StructuredContent.tsx", "MdxComponents.tsx"]) if (!read("src/components/content/" + file).includes("SectionFrame")) failures.push(file + " 未复用页面框架");
const componentFiles = fs.readdirSync(path.join(root, "src/components"), { recursive: true }).map((file) => file.split(path.sep).join("/")).filter((file) => file.endsWith(".tsx"));
for (const file of componentFiles) {
  const source = read("src/components/" + file);
  if (/style=\{\{/.test(source)) failures.push(file + " 含未登记行内样式");
  if (file !== "content/ContentPrimitives.tsx" && /className="status-notice"/.test(source)) failures.push(file + " 绕过共享提示组件");
  const isHome = file.startsWith("home/");
  for (const line of source.split("\n")) {
    const sections = line.match(/<section\b/g)?.length ?? 0;
    const contracts = line.match(isHome ? /data-home-section=/g : /data-grid-section="12"/g)?.length ?? 0;
    if (sections !== contracts) failures.push(`${file} 含未登记${isHome ? "首页布局" : " 12 栏"}契约的 section`);
  }
}
if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(`Website structure audit passed: every section declares its grid contract and ${gridSelectors.length} canonical layouts use 12 columns`);
