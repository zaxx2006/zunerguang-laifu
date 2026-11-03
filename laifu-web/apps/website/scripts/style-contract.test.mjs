import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { auditStyles } from "./lib/style-contract.mjs";
import { readDesign } from "./lib/design.mjs";
import { auditHomeStyles } from "./lib/home-style-contract.mjs";

const homeTokens = fs.readFileSync(new URL("../src/components/home/home-design-tokens.css", import.meta.url), "utf8");
const homeStyles = fs.readFileSync(new URL("../src/components/home/home.css", import.meta.url), "utf8");

test("homepage theme is scoped and every token reference resolves", () => {
  assert.deepEqual(auditHomeStyles({ tokens: homeTokens, styles: homeStyles }), []);
});

test("homepage reset preserves SVG presentation attributes", () => {
  assert.match(homeStyles, /:where\([^{}]*\.home-preview\s+:not\(svg,\s*svg\s+\*\)[^{}]*\)\s*\{\s*all:\s*revert;/u);
});

test("homepage contract rejects leaked styles, undefined tokens and invented breakpoints", () => {
  const result = auditHomeStyles({ tokens: homeTokens, styles: homeStyles + "h1 { color: var(--home-missing); } @media (max-width: 777px) { .card { padding: 0; } }" }).join();
  for (const phrase of ["未定义令牌", "样式泄漏", "未登记响应式规则"]) assert.ok(result.includes(phrase));
});

test("homepage contract rejects raw colors and typography tokens used as dimensions", () => {
  const result = auditHomeStyles({ tokens: homeTokens, styles: homeStyles + ".home-preview { color: #fff; gap: var(--home-type-body); }" }).join();
  assert.ok(result.includes("颜色必须引用令牌"));
  assert.ok(result.includes("字号令牌不能用于布局尺寸"));
});

const tokens = "@layer tokens { :root { --space: 16px; --type: 16px; --line: 1.75; } }";
const audit = (source, extra = {}) => auditStyles({ tokens, sheets: { "component.css": source }, breakpoints: ["600px"], ...extra });
test("accepts token-owned dimensions and declared responsive variations", () => {
  assert.deepEqual(audit("@layer components { .card { padding: var(--space); } @media (max-width: 600px) { .card { padding: 0; } } }"), []);
});
test("rejects undefined tokens including the original body-xs typo", () => {
  assert.match(audit("@layer components { .notice { font-size: var(--type-body-xs-size); } }").join(), /未定义令牌/);
});
test("rejects raw dimensions, typography, color and important", () => {
  const result = audit("@layer components { .notice { padding: 17px; line-height: 1.3; color: #fff; display: block !important; } }").join();
  for (const phrase of ["硬编码尺寸", "排版", "硬编码颜色", "!important"]) assert.ok(result.includes(phrase));
});
test("rejects duplicate rules and cross-file component ownership", () => {
  assert.match(audit("@layer components { .notice { display: grid; } .notice { display: flex; } }").join(), /重复声明/);
  assert.match(audit("", { sheets: { "a.css": "@layer components { .notice { display: grid; } }", "b.css": "@layer components { .notice p { margin: 0; } }" } }).join(), /重复归属/);
});
test("rejects token cycles, unknown breakpoints and hidden overflow", () => {
  assert.match(audit("", { tokens: ":root { --a: var(--b); --b: var(--a); }" }).join(), /循环令牌/);
  assert.match(audit("@layer components { @media (max-width: 777px) { .notice { overflow-x: hidden; } } }").join(), /未登记断点/);
  assert.match(audit("@layer components { body { overflow-x: hidden; } }").join(), /掩盖布局/);
});
test("action colors preserve the brand orange and navigation ink meets contrast", () => {
  const design = readDesign(new URL("../../../docs/design/system.md", import.meta.url));
  const luminance = (hex) => hex.slice(1).match(/../g).map((value) => parseInt(value, 16) / 255).map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4).reduce((total, value, index) => total + value * [0.2126, 0.7152, 0.0722][index], 0);
  const contrast = (first, second) => (Math.max(luminance(first), luminance(second)) + 0.05) / (Math.min(luminance(first), luminance(second)) + 0.05);
  assert.equal(design.colors.primary, "#FF6B00");
  assert.equal(design.colors["on-primary"], "#1C1A16");
  assert.equal(design.colors["on-primary-hover"], "#FFFEFD");
  assert.equal(design.typography["button-primary"].fontWeight, 400);
  assert.equal(design.typography["button-primary"].fontSize, "20px");
  assert.equal(design.colors.action, design.colors.primary);
  assert.equal(design.colors["action-hover"], design.colors["primary-dark"]);
  assert.ok(contrast(design.colors["on-primary"], design.colors.action) >= 4.5, "primary label");
  assert.ok(contrast(design.colors["on-primary-hover"], design.colors["action-hover"]) >= 4.5, "hover label");
  for (const token of ["primary", "canvas", "surface-soft", "surface-dark"]) assert.ok(contrast(design.colors.ink, design.colors[token]) >= 4.5, token);
  assert.ok(contrast(design.colors["on-dark"], design.colors.ink) >= 3, "focus ring on dark sections");
});
test("interactive states do not reintroduce colored fills, hover underlines or whole-element jumps", () => {
  const stylesPath = new URL("../src/styles/", import.meta.url);
  const source = fs.readdirSync(stylesPath, { withFileTypes: true }).filter((entry) => entry.isFile() && entry.name.endsWith(".css")).map((entry) => fs.readFileSync(new URL(entry.name, stylesPath), "utf8")).join("\n");
  assert.doesNotMatch(source, /var\(--color-accent-[a-z-]+\)/u);
  for (const rule of source.matchAll(/([^{}]+)\{([^{}]*)\}/gu)) if (/background:\s*var\(--color-(?:action|primary)(?:-hover)?\)/u.test(rule[2])) assert.match(rule[1], /\.button--primary/u, "Orange fills are reserved for primary actions");
  assert.doesNotMatch(source, /text-decoration:\s*underline/u);
  assert.doesNotMatch(source, /page-map-rail__inner a::after/u);
  for (const selector of ["\\.button:is\\([^)]*\\):not\\([^)]*\\)", "\\.page-map-rail__inner a:is\\([^)]*\\)", "\\.resource-card > summary:is\\([^)]*\\)", "\\.resource-category > summary:is\\([^)]*\\)", "\\.menu-column a:is\\([^)]*\\)", "\\.footer-grid a:is\\([^)]*\\)", "\\.selfcheck__start:is\\([^)]*\\)"]) {
    assert.doesNotMatch(source, new RegExp(`${selector}\\s*\\{[^}]*transform:`, "u"));
  }
});
test("structured action groups use aligned tracks", () => {
  const source = fs.readFileSync(new URL("../src/styles/controls.css", import.meta.url), "utf8");
  assert.match(source, /\.structured-actions\s*\{[^}]*display:\s*grid;[^}]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\);/u);
  assert.match(source, /\.structured-actions:has\(> \.button:nth-child\(odd\):last-child\) > \.button:first-child\s*\{[^}]*grid-column:\s*1 \/ -1;/u);
});
test("numbered headings use aligned title tracks", () => {
  const layout = fs.readFileSync(new URL("../src/styles/layout.css", import.meta.url), "utf8");
  const content = fs.readFileSync(new URL("../src/styles/content.css", import.meta.url), "utf8");
  assert.match(layout, /\.section-cluster__item > h3\[data-numbered="true"\]\s*\{[^}]*display:\s*grid;[^}]*align-items:\s*start;/u);
  assert.match(layout, /\.structured-subsection\[data-numbered="true"\]\s*\{[^}]*display:\s*grid;[^}]*align-items:\s*start;/u);
  assert.match(content, /\.structured-step-card__content\s*\{[^}]*display:\s*grid;/u);
});
test("neutral reading surfaces and dark closing actions remain explicit", () => {
  const design = readDesign(new URL("../../../docs/design/system.md", import.meta.url));
  const plans = JSON.parse(fs.readFileSync(new URL("../src/content/section-design.json", import.meta.url), "utf8"));
  for (const plan of Object.values(plans)) for (const section of plan.sections) assert.ok(["canvas", "sand", "stone"].includes(section.tone), section.id);
  for (const name of ["canvas", "surface-soft", "surface-dark", "surface-elevated"]) {
    const channels = design.colors[name].slice(1).match(/../g).map((value) => parseInt(value, 16));
    assert.ok(Math.min(...channels) >= 230 && Math.max(...channels) - Math.min(...channels) <= 16, `${name} must remain a light neutral`);
  }
  const controls = fs.readFileSync(new URL("../src/styles/controls.css", import.meta.url), "utf8");
  assert.match(controls, /\.cta-strip \.structured-actions > \.button--outline\s*\{[^}]*color:\s*var\(--color-on-dark\);/u);
});

test("rejects undeclared modern range breakpoints", () => {
  assert.match(audit("@layer components { @media (601px < width <= 900px) { .notice { display: block; } } }").join(), /未登记断点/);
});
