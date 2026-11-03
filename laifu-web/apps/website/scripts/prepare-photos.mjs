import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const source = path.resolve("assets/photos");
const output = path.resolve("public/images/editorial");
await fs.mkdir(output, { recursive: true });
const manifest = {};
const expected = new Set();
for (const file of (await fs.readdir(source)).filter((name) => name.endsWith(".webp"))) {
  const input = path.join(source, file);
  const metadata = await sharp(input).metadata();
  const widths = [...new Set([640, 960, Math.min(metadata.width, 1280)].filter((width) => width <= metadata.width))].sort((a, b) => a - b);
  const sources = [];
  for (const width of widths) {
    const name = width === widths.at(-1) ? file : file.replace(".webp", `-${width}.webp`);
    const destination = path.join(output, name);
    expected.add(name);
    if (!(await fs.stat(destination).catch(() => null)) || (await fs.stat(destination)).mtimeMs < (await fs.stat(input)).mtimeMs || (await fs.stat(destination)).mtimeMs < (await fs.stat(new URL(import.meta.url))).mtimeMs) await sharp(input).resize({ width, withoutEnlargement: true }).webp({ quality: 65, effort: 6 }).toFile(destination);
    sources.push(`/images/editorial/${name} ${width}w`);
  }
  manifest[`/images/editorial/${file}`] = { width: widths.at(-1), height: Math.round(metadata.height * widths.at(-1) / metadata.width), srcSet: sources.join(", ") };
}
for (const file of await fs.readdir(output)) if (!expected.has(file)) await fs.unlink(path.join(output, file));
await fs.writeFile("src/content/photo-manifest.json", JSON.stringify(manifest, null, 2) + "\n");
console.log(`Prepared ${Object.keys(manifest).length} photos with responsive sources`);
