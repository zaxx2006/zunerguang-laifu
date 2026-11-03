import fs from "node:fs";
import path from "node:path";
import postcss from "postcss";
import { createSharedTokenCss, readDesign } from "../apps/website/scripts/lib/design.mjs";

const root = process.cwd();
const failures = [];
const shared = fs.readFileSync("styles/brand-tokens.css", "utf8");
if (shared !== createSharedTokenCss(readDesign("docs/design/system.md"))) failures.push("Shared brand tokens do not match the design source; run tokens:generate");
const external = ["--font-noto-sans-sc", "--font-noto-serif-sc", "--pattern-hatch"];
for (const app of ["website", "assessments", "admin"]) {
  const directory = path.join(root, "apps", app);
  const files = fs.readdirSync(directory, { recursive: true }).filter((file) => file.endsWith(".css") && !file.split(path.sep).some((part) => part.startsWith(".") || ["node_modules", "out", "public"].includes(part)));
  const defined = new Set(external);
  const declarations = new Set();
  const sheets = files.map((file) => ({ file, ast: postcss.parse(fs.readFileSync(path.join(directory, file), "utf8")) }));
  for (const file of fs.readdirSync(path.join(directory, app === "website" ? "src/components" : "components"), { recursive: true }).filter((name) => /\.[jt]sx?$/.test(name))) {
    const source = fs.readFileSync(path.join(directory, app === "website" ? "src/components" : "components", file), "utf8");
    if (/["']#[\da-f]{3,8}["']/i.test(source)) failures.push(`${app}/${file}: SVG and export colors must also use shared tokens`);
  }
  for (const ast of [postcss.parse(shared), ...sheets.map((sheet) => sheet.ast)]) ast.walkDecls((decl) => { if (decl.prop.startsWith("--")) defined.add(decl.prop); });
  for (const { file, ast } of sheets) ast.walkDecls((decl) => {
    const location = `apps/${app}/${file}:${decl.source.start.line}`;
    if (decl.important) failures.push(`${location}: !important hides cascade problems`);
    for (const [, name] of decl.value.matchAll(/var\(\s*(--[\w-]+)/g)) if (!defined.has(name)) failures.push(`${location}: undefined token ${name}`);
    if (file.endsWith("design-tokens.css")) return;
    if (/(?:#[\da-f]{3,8}\b|rgba?\(|hsla?\()/i.test(decl.value.replace(/url\([^)]*\)/g, ""))) failures.push(`${location}: color must come from design tokens`);
    if (decl.prop === "transition" && /\ball\b/.test(decl.value)) failures.push(`${location}: transition: all`);
    const contexts = [];
    let parent = decl.parent;
    while (parent?.type !== "root") {
      contexts.unshift(parent.type === "rule" ? parent.selector.replace(/\s+/g, " ") : `@${parent.name} ${parent.params}`);
      parent = parent.parent;
    }
    if (decl.parent.type === "atrule" && decl.parent.name === "font-face") contexts.push(decl.parent.nodes.filter((node) => node.type === "decl" && ["font-family", "font-weight", "font-style", "unicode-range"].includes(node.prop)).map((node) => `${node.prop}:${node.value}`).join(";"));
    const moduleScope = file.endsWith(".module.css") ? file : "global";
    const key = `${moduleScope}|${contexts.join("|")}|${decl.prop}`;
    if (declarations.has(key)) failures.push(`${location}: repeated declaration ${decl.prop} in ${contexts.join(" ")}`);
    declarations.add(key);
  });
  console.log(`${app}: audited ${files.length} CSS files`);
}
if (failures.length) throw new Error([...new Set(failures)].join("\n"));
console.log("Project CSS audit passed: shared palette, valid tokens, no important or repeated declarations");
