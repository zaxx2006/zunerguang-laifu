import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const questionnaireRoot = root;
const questionnaireCss = fs.readdirSync(path.join(root, "styles")).filter((file) => file.endsWith(".css")).map((file) => fs.readFileSync(path.join(root, "styles", file), "utf8")).join("\n");
const riskCss = fs.readFileSync(path.join(questionnaireRoot, "components/narcissism-risk/narcissismRisk.module.css"), "utf8");
const questionnaireComponentDir = path.join(questionnaireRoot, "components");
const componentFiles = fs.readdirSync(questionnaireComponentDir, { recursive: true }).filter((file) => /\.(?:js|jsx|tsx)$/.test(file));
const componentSource = componentFiles.map((file) => fs.readFileSync(path.join(questionnaireComponentDir, file), "utf8")).join("\n");
const failures = [];
const fontCoverage = new Set(JSON.parse(fs.readFileSync(path.join(root, "assets/fonts/source.json"), "utf8")).codepoints);
const copySources = ["app", "components", "lib", "data"].flatMap(folder => fs.readdirSync(path.join(root, folder), { recursive: true }).filter(name => name.endsWith(".js")).map(file => path.join(root, folder, file)));
copySources.push(path.resolve(root, "../../shared/site-navigation.ts"));
for (const file of copySources) {
  const missing = [...new Set(fs.readFileSync(file, "utf8").match(/[\u3400-\u9fff]/gu) ?? [])].filter((character) => !fontCoverage.has(character.codePointAt(0)));
  if (missing.length) failures.push(`${path.relative(root, file)}: regenerate font subsets for ${missing.join("")}`);
}
const contracts = [
  [questionnaireCss, /\.hero-card\s*\{(?:(?!border-bottom)[\s\S])*?\}/s, "问卷首页 Hero 与页脚重复绘制交界线"],
  [questionnaireCss, /\.hero-card > \.hero-tag\s*\{[^}]*margin-top:\s*48px/s, "问卷首页标签未保留统一顶部间距"],
  [questionnaireCss, /\.result-hero,\s*\.result-main-card,\s*\.result-side-card\s*\{(?:(?!border-bottom)[\s\S])*?\}/s, "问卷结果双栏与页脚重复绘制交界线"],
  [questionnaireCss, /\.radar-legend\s*\{[^}]*gap:\s*1px;[^}]*border:\s*1px solid var\(--color-hairline\);[^}]*background:\s*var\(--color-hairline\)/s, "问卷雷达图例未使用单层分隔线"],
  [questionnaireCss, /\.radar-chart-wrap\s*\{[^}]*gap:\s*32px;[^}]*padding:\s*32px;[^}]*border:\s*1px solid var\(--color-hairline\)/s, "问卷雷达图与图例仍会贴合外框"],
  [questionnaireCss, /\.radar-legend\s*\{[^}]*width:\s*100%;[^}]*margin:\s*0;/s, "问卷雷达图例未与内容框统一对齐"],
  [questionnaireCss, /\.radar-legend-short\s*\{[^}]*width:\s*max-content;[^}]*white-space:\s*nowrap;/s, "问卷雷达图例标签仍可能换行截断"],
  [questionnaireCss, /\.radar-legend-item\s*\{(?:(?!border-right|border-bottom)[\s\S])*?\}/s, "问卷雷达图例子项仍会叠加边线"],
  [questionnaireCss, /\.export-weakness-list\s*\{[^}]*margin:\s*0;[^}]*padding:\s*0;/s, "结果导出网格未清除浏览器默认缩进"],
  [questionnaireCss, /\.export-weakness-item:last-child:nth-child\(odd\)\s*\{[^}]*grid-column:\s*1\s*\/\s*-1/s, "结果导出网格奇数末项未闭合整行"],
  [questionnaireCss, /\.radar-legend-item:last-child:nth-child\(odd\)\s*\{[^}]*grid-column:\s*1\s*\/\s*-1/s, "雷达图图例奇数末项未闭合整行"],
  [riskCss, /\.contentPanel\s*\{(?:(?!border-bottom)[\s\S])*?\}/s, "风险问卷内容区与页脚重复绘制交界线"],
  [riskCss, /\.disclaimerPanel\s*\{(?:(?!border-bottom)[\s\S])*?\}/s, "风险结果免责声明与页脚重复绘制交界线"],
  [riskCss, /\.heroPanel > \.topLabel\s*\{[^}]*margin-top:\s*48px/s, "风险问卷首页标签未保留统一顶部间距"],
  [riskCss, /\.radarLegend\s*\{[^}]*gap:\s*1px;[^}]*border:\s*1px solid var\(--color-hairline\);[^}]*background:\s*var\(--color-hairline\)/s, "风险雷达图例未使用单层分隔线"],
  [riskCss, /\.radarChartWrap\s*\{[^}]*gap:\s*32px;[^}]*padding:\s*32px;[^}]*border:\s*1px solid var\(--color-hairline\)/s, "风险雷达图与图例仍会贴合外框"],
  [riskCss, /\.radarLegend\s*\{[^}]*width:\s*100%;[^}]*margin:\s*0;/s, "风险雷达图例未与内容框统一对齐"],
  [riskCss, /\.radarShortName\s*\{[^}]*width:\s*max-content;[^}]*white-space:\s*nowrap;/s, "风险雷达图例标签仍可能换行截断"],
  [riskCss, /\.radarLegendItem\s*\{(?:(?!border-right|border-bottom)[\s\S])*?\}/s, "风险雷达图例子项仍会叠加边线"],
  [riskCss, /\.simpleExportFocusItem:last-child:nth-child\(odd\)\s*\{[^}]*grid-column:\s*1\s*\/\s*-1/s, "风险结果导出网格奇数末项未闭合整行"],
  [riskCss, /@media \(max-width:\s*920px\)[\s\S]*?\.metricItem:last-child\s*\{[^}]*grid-column:\s*1\s*\/\s*-1/s, "风险指标响应式末行未闭合"],
];

for (const [source, pattern, message] of contracts) if (!pattern.test(source)) failures.push(message);
if (/<(?:ul|ol)[^>]*className=(?:"[^"]*(?:radar|export)[^"]*"|\{styles\.(?:radar|simpleExport))/i.test(componentSource)) failures.push("视觉网格仍使用带浏览器默认缩进的原生列表结构");
if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log("Assessment structure audit passed: questionnaire boundaries and radar/export grids");
