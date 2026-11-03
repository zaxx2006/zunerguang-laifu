import { resolve } from "node:path";
import { readDesign } from "../../apps/website/scripts/lib/design.mjs";

const design = readDesign(resolve(__dirname, "../../docs/design/system.md"));
export function color(name: string): string {
  const hex = design.colors[name].slice(1);
  return `rgb(${[0, 2, 4].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16)).join(", ")})`;
}
