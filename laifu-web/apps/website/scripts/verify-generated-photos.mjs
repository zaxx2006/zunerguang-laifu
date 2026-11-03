import fs from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
import sharp from "sharp";

const folder = path.resolve("../../../artifacts/image-replacement-20261027");
const plan = JSON.parse(await fs.readFile(path.join(folder, "replacement-plan.json"), "utf8"));
const groups = [
  ["/", [1, 2, 3, 4, 5, 6, 7, 8]], ["/about/", [9, 10, 11, 12, 13]], ["/services/", [14]],
  ["/services/divorce-coaching/", [15, 16, 17]], ["/services/co-parenting/", [18, 19, 20]],
  ["/services/mediation-preparation/", [21]], ["/collaborative-law/", [22, 23]],
  ["/services/high-conflict-divorce/", [24, 25]], ["/services/nuptial-agreements/", [26, 27, 28, 29]],
  ["/retreats-workshops/", [30, 31, 32]], ["/courses-workshops/", [33]],
  ["/academy/", [34, 35, 36, 37, 38, 39]], ["/media/", [40]], ["/about/founder/", [41]],
  ["/services/remarriage-preparation/", [42]],
];
const results = [];
for (const [route, numbers] of groups) {
  const response = await fetch(`http://localhost:3001${route}`);
  assert.equal(response.status, 200, route);
  const html = await response.text();
  const images = [...html.matchAll(/<img\b[^>]*>/g)].map(match => match[0]);
  for (const number of numbers) {
    const task = plan[number - 1];
    const img = images.find(img => img.includes(task.asset));
    assert.ok(img, `${route} missing ${task.id}`);
    assert.ok(img.includes(task.alt), `${route} incorrect alt: ${task.id}`);
    const source = img.match(/\bsrc="([^"]+)"/)?.[1];
    assert.ok(source, task.id);
    const imageResponse = await fetch(new URL(source.replaceAll("&amp;", "&"), "http://localhost:3001"));
    assert.equal(imageResponse.status, 200, task.id);
    const bytes = Buffer.from(await imageResponse.arrayBuffer());
    const metadata = await sharp(bytes).metadata();
    assert.equal(metadata.format, "webp");
    assert.equal(metadata.width, 1280);
    results.push({ id: task.id, route, source, alt: task.alt, width: metadata.width, height: metadata.height, bytes: bytes.length });
  }
}
assert.equal(new Set(results.map(item => item.id)).size, 42);
for (const item of plan) {
  for (const suffix of ["-640", "-960", ""]) {
    const file = path.join("public/images/editorial", item.asset.replace(".webp", `${suffix}.webp`));
    await sharp(file).metadata();
  }
}
await fs.writeFile(path.join(folder, "live-image-verification.json"), JSON.stringify({ pages: groups.length, images: results.length, responsiveFiles: 126, results }, null, 2));
console.log(`Verified ${results.length} intended image positions across ${groups.length} live pages; all 126 responsive files decode.`);
