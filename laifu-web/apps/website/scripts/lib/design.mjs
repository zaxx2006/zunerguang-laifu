import fs from "node:fs";
import YAML from "yaml";

export function readDesign(filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  const match = source.match(/^---\n([\s\S]*?)\n---/);
  if (!match) throw new Error("docs/design/system.md 缺少 YAML frontmatter");
  return YAML.parse(match[1]);
}

function tokenName(value) {
  return value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

export function createTokenCss(design) {
  const lines = ["@layer tokens {", ":root {"];
  for (const [name, value] of Object.entries(design.colors)) lines.push(`  --color-${tokenName(name)}: ${value};`);
  for (const [name, value] of Object.entries(design.spacing)) lines.push(`  --space-${tokenName(name)}: ${value};`);
  for (const [name, value] of Object.entries(design.rounded)) lines.push(`  --radius-${tokenName(name)}: ${value};`);
  for (const [name, value] of Object.entries(design.motion ?? {})) lines.push(`  --motion-${tokenName(name)}: ${value};`);
  for (const group of ["layout", "stroke", "size", "tracking", "opacity", "layer", "leading"]) for (const [name, value] of Object.entries(design[group] ?? {})) lines.push(`  --${group}-${tokenName(name)}: ${value};`);
  for (const [name, values] of Object.entries(design.typography)) {
    const prefix = `--type-${tokenName(name)}`;
    const isSerif = values.fontFamily === "Noto Serif SC";
    const fontVariable = isSerif ? "--font-noto-serif-sc" : "--font-noto-sans-sc";
    const fallback = isSerif ? "serif" : "sans-serif";
    lines.push(`  ${prefix}-family: ${values.fontStack ?? `var(${fontVariable}), "${values.fontFamily}", ${fallback}`};`);
    lines.push(`  ${prefix}-size: ${values.fontSize};`);
    lines.push(`  ${prefix}-weight: ${values.fontWeight};`);
    lines.push(`  ${prefix}-line: ${values.lineHeight};`);
    lines.push(`  ${prefix}-tracking: ${values.letterSpacing};`);
  }
  lines.push("}");
  for (const [breakpoint, values] of Object.entries(design.responsive ?? {})) {
    lines.push(`@media (max-width: ${design.breakpoints[breakpoint]}) {`, "  :root {");
    for (const [name, value] of Object.entries(values)) lines.push(`    --${name}: ${value};`);
    lines.push("  }", "}");
  }
  lines.push("}", "");
  return lines.join("\n");
}

export function createSharedTokenCss(design) {
  const lines = ["@layer tokens {", "  :root {"];
  for (const group of ["colors", "rounded", "motion", "leading"]) for (const [name, value] of Object.entries(design[group])) lines.push(`    --${group === "colors" ? "color" : group === "rounded" ? "radius" : group}-${tokenName(name)}: ${value};`);
  return [...lines, "  }", "}", ""].join("\n");
}
