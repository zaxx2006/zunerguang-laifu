import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { applyIllustrationTheme, createDiagonalHatch, illustrationFiles } from "./lib/assets.mjs";
import { readDesign } from "./lib/design.mjs";

const root = process.cwd();
const design = readDesign(path.resolve(root, "../../docs/design/system.md"));
const inputDir = path.join(root, "assets/illustration");
const outputDir = path.join(root, "public/generated/illustrations");
const logoInput = path.join(root, "assets/images/logo.svg");
const logoOutput = path.join(root, "public/generated/logo");
const patternOutput = path.join(root, "public/generated/patterns");
const palette = {
  primary: design.colors.primary,
};

for (const directory of [outputDir, logoOutput, patternOutput]) fs.rmSync(directory, { force: true, recursive: true });
fs.mkdirSync(outputDir, { recursive: true });
fs.mkdirSync(logoOutput, { recursive: true });
fs.mkdirSync(patternOutput, { recursive: true });
for (const [input, output] of Object.entries(illustrationFiles)) {
  const source = fs.readFileSync(path.join(inputDir, input), "utf8");
  fs.writeFileSync(path.join(outputDir, output), applyIllustrationTheme(source, palette.primary));
}
const logo = fs.readFileSync(logoInput, "utf8");
fs.writeFileSync(path.join(logoOutput, "original.svg"), logo);
const faviconPng = await sharp(Buffer.from(logo)).resize(32, 32).png().toBuffer();
const appleTouchIcon = await sharp(Buffer.from(logo)).resize(180, 180).png().toBuffer();
const icoHeader = Buffer.alloc(22);
icoHeader.writeUInt16LE(0, 0);
icoHeader.writeUInt16LE(1, 2);
icoHeader.writeUInt16LE(1, 4);
icoHeader.writeUInt8(32, 6);
icoHeader.writeUInt8(32, 7);
icoHeader.writeUInt16LE(1, 10);
icoHeader.writeUInt16LE(32, 12);
icoHeader.writeUInt32LE(faviconPng.length, 14);
icoHeader.writeUInt32LE(22, 18);
fs.writeFileSync(path.join(root, "public/favicon.ico"), Buffer.concat([icoHeader, faviconPng]));
fs.writeFileSync(path.join(root, "public/favicon-32x32.png"), faviconPng);
fs.writeFileSync(path.join(root, "public/apple-touch-icon.png"), appleTouchIcon);
fs.writeFileSync(path.join(patternOutput, "diagonal-hatch.svg"), createDiagonalHatch(design.colors["hairline-strong"]));
console.log(`Generated ${Object.keys(illustrationFiles).length + 5} brand assets`);
