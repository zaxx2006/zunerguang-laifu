import fs from "node:fs";
import path from "node:path";
import { createSharedTokenCss, createTokenCss, readDesign } from "./lib/design.mjs";

const root = process.cwd();
const design = readDesign(path.resolve(root, "../../docs/design/system.md"));
const output = path.join(root, "src/app/design-tokens.css");
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, createTokenCss(design));
console.log(`Generated ${path.relative(root, output)}`);
const sharedOutput = path.resolve(root, "../../styles/brand-tokens.css");
fs.mkdirSync(path.dirname(sharedOutput), { recursive: true });
fs.writeFileSync(sharedOutput, createSharedTokenCss(design));
