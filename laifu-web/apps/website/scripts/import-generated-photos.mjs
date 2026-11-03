import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const folder = path.resolve("../../../artifacts/image-replacement-20261027");
const plan = JSON.parse(await fs.readFile(path.join(folder, "replacement-plan.json"), "utf8"));
const manifestPath = "src/content/photo-manifest.json";
const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
await fs.mkdir(path.join(folder, "website-backup/src/content"), { recursive: true });
await fs.copyFile(manifestPath, path.join(folder, "website-backup", manifestPath), fs.constants.COPYFILE_EXCL);
const report = [];
for (const item of plan) {
  const original = path.join(folder, "originals", `${item.id}.png`);
  const source = path.resolve("assets/photos", item.asset);
  await sharp(original).rotate().webp({ quality: 90, effort: 6 }).toFile(source);
  const metadata = await sharp(source).metadata();
  const sources = [];
  let bytes = 0;
  for (const width of [640, 960, 1280]) {
    const filename = width === 1280 ? item.asset : item.asset.replace(".webp", `-${width}.webp`);
    const destination = path.resolve("public/images/editorial", filename);
    const output = await sharp(source).resize({ width, withoutEnlargement: true }).webp({ quality: 65, effort: 6 }).toFile(destination);
    sources.push(`/images/editorial/${filename} ${width}w`);
    if (width === 1280) bytes = output.size;
  }
  manifest[`/images/editorial/${item.asset}`] = { width: 1280, height: Math.round(metadata.height * 1280 / metadata.width), srcSet: sources.join(", ") };
  report.push({ id: item.id, asset: item.asset, bytes, originalBytes: (await fs.stat(original)).size, ...manifest[`/images/editorial/${item.asset}`] });
}
await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
await fs.writeFile(path.join(folder, "asset-import-result.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ images: report.length, originalBytes: report.reduce((sum, item) => sum + item.originalBytes, 0), webBytes: report.reduce((sum, item) => sum + item.bytes, 0) }));
