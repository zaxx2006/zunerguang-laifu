import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
import config from "@payload-config";
import { getPayload } from "payload";

const folder = path.resolve("../artifacts/faq-hero-replacement-20261027");
const filename = "faq-consultation-preparation-20261027.webp";
const payload = await getPayload({ config });
const query = { collection: "site-pages" as const, where: { route: { equals: "/faq/" } }, depth: 0, limit: 1, overrideAccess: true };
const published = (await payload.find({ ...query, draft: false })).docs[0];
const latest = (await payload.find({ ...query, draft: true })).docs[0];
if (!published || !latest || published._status !== "published") throw new Error("Published FAQ page missing");
if (latest._status !== "published") throw new Error("An unpublished FAQ draft must be preserved");
await mkdir(folder, { recursive: true });
await writeFile(path.join(folder, "cms-before.json"), JSON.stringify({ published, latest }, null, 2), { flag: "wx" }).catch((error: NodeJS.ErrnoException) => { if (error.code !== "EEXIST") throw error; });
if (!process.argv.includes("--apply")) {
  console.log(JSON.stringify({ id: published.id, route: published.route, status: published._status, image: published.image, originalImage: published.originalImage }));
  process.exit(0);
}
const existing = (await payload.find({ collection: "media", depth: 0, limit: 1, overrideAccess: true, where: { filename: { equals: filename } } })).docs[0];
const media = existing ?? await payload.create({
  collection: "media", overrideAccess: true, context: { skipSystemEvents: true },
  data: { alt: "窗边浅木桌上的摊开笔记本、绿色铅笔与陶瓷茶杯，背景为米白色扶手椅和绿植", caption: "用户提供的 AI 生成咨询准备场景示意，非真实服务场所记录。", sourceLabel: "用户提供的 AI 生成图片 · 常见问题页", rightsConfirmed: true, publicApproved: true },
  filePath: path.join(folder, filename),
});
await payload.update({ collection: "site-pages", id: published.id, overrideAccess: true, draft: false, context: { skipSystemEvents: true }, data: { image: media.id } });
const after = await payload.findByID({ collection: "site-pages", id: published.id, overrideAccess: true, draft: false, depth: 0 });
const before = JSON.parse(await readFile(path.join(folder, "cms-before.json"), "utf8")).published;
const withoutImage = (document: Record<string, unknown>) => Object.fromEntries(Object.entries(document).filter(([key]) => !["image", "updatedAt"].includes(key)));
assert.deepEqual(withoutImage(after), withoutImage(before));
assert.equal(after._status, "published");
assert.equal(after.image, media.id);
await writeFile(path.join(folder, "cms-after.json"), JSON.stringify({ page: after, media, nonImageContentUnchanged: true }, null, 2));
console.log(JSON.stringify({ id: after.id, image: media.id, url: media.url, width: media.width, height: media.height, nonImageContentUnchanged: true }));
process.exit(0);
