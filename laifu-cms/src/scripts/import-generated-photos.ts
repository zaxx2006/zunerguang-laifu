import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import config from "@payload-config";
import { getPayload } from "payload";

const folder = path.resolve("../artifacts/image-replacement-20261027");
const payload = await getPayload({ config });
const targets = [
  { collection: "home-presentations" as const, key: "home" },
  { collection: "service-presentations" as const, key: "divorce-coaching" },
  { collection: "service-presentations" as const, key: "high-conflict-divorce" },
];
const documents = [];
for (const target of targets) {
  const published = await payload.find({ collection: target.collection, depth: 0, limit: 1, overrideAccess: true, where: { key: { equals: target.key } }, draft: false });
  const latest = await payload.find({ collection: target.collection, depth: 0, limit: 1, overrideAccess: true, where: { key: { equals: target.key } }, draft: true });
  if (!published.docs[0] || !latest.docs[0]) throw new Error(`Missing document: ${target.key}`);
  if (latest.docs[0]._status !== "published") throw new Error(`Unpublished draft must be preserved: ${target.key}`);
  documents.push({ ...target, published: published.docs[0], latest: latest.docs[0] });
}
await mkdir(path.join(folder, "cms-backup"), { recursive: true });
for (const document of documents) {
  const filename = path.join(folder, "cms-backup", `${document.key}.json`);
  await writeFile(filename, JSON.stringify(document, null, 2), { flag: "wx" }).catch((error: NodeJS.ErrnoException) => { if (error.code !== "EEXIST") throw error; });
}
if (process.argv.includes("--verify")) {
  const normalized = (value: unknown): unknown => {
    if (Array.isArray(value)) return value.map(normalized);
    if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).filter(([key]) => !["image", "updatedAt"].includes(key)).map(([key, item]) => [key, normalized(item)]));
    return value;
  };
  for (const document of documents) {
    const before = JSON.parse(await readFile(path.join(folder, "cms-backup", `${document.key}.json`), "utf8"));
    if (JSON.stringify(normalized(before.published)) !== JSON.stringify(normalized(document.published))) throw new Error(`Unexpected non-image content change: ${document.key}`);
  }
  await writeFile(path.join(folder, "cms-content-verification.json"), JSON.stringify({ documents: targets.length, nonImageContentUnchanged: true }, null, 2));
  console.log("Verified: all non-image content in the 3 CMS documents is unchanged.");
  process.exit(0);
}
if (!process.argv.includes("--apply")) {
  console.log(JSON.stringify(documents.map(document => ({ key: document.key, status: document.latest._status, id: document.latest.id }))));
  process.exit(0);
}
const plan: Array<{ id: string; asset: string; alt: string }> = JSON.parse(await readFile(path.join(folder, "replacement-plan.json"), "utf8"));
if (plan.length !== 42 || new Set(plan.map(item => item.id)).size !== 42) throw new Error("Expected all 42 image mappings");
for (const item of plan) await readFile(path.resolve("../laifu-web/apps/website/public/images/editorial", item.asset));
const mediaIDs = new Map<string, number>();
for (const item of plan) {
  const found = await payload.find({ collection: "media", depth: 0, limit: 1, overrideAccess: true, where: { filename: { equals: item.asset } } });
  const media = found.docs[0] ?? await payload.create({ collection: "media", overrideAccess: true, context: { skipSystemEvents: true }, data: { alt: item.alt, caption: "AI 生成场景示意，非焕屿真实人物或活动记录。", sourceLabel: "用户提供的 AI 生成照片 · 焕屿42张图片.zip", rightsConfirmed: true, publicApproved: true }, filePath: path.resolve("../laifu-web/apps/website/public/images/editorial", item.asset) });
  mediaIDs.set(item.id, media.id);
}
const imageID = (id: string) => { const value = mediaIDs.get(id); if (!value) throw new Error(`Missing media: ${id}`); return value; };
for (const document of documents) {
  if (document.collection === "home-presentations") {
    const source = document.published as import("@/payload-types").HomePresentation;
    const ids = new Map([["coaching", "P01"], ["highConflict", "P02"], ["courses", "P03"], ["community", "P04"], ["academy", "P05"]]);
    await payload.update({ collection: "home-presentations", id: source.id, overrideAccess: true, draft: false, context: { skipSystemEvents: true }, data: { services: { ...source.services, items: source.services.items.map(item => ({ ...item, image: imageID(ids.get(item.key) ?? "") })) }, guides: { ...source.guides, items: (source.guides.items ?? []).map((item, index) => ({ ...item, image: imageID(`P0${index + 6}`) })) } } });
  } else {
    const source = document.published as import("@/payload-types").ServicePresentation;
    const data = source.key === "divorce-coaching"
      ? { hero: { ...source.hero!, image: imageID("P15") }, support: { ...source.support!, directions: source.support!.directions.map((item, index) => index ? { ...item, image: imageID(index === 1 ? "P16" : "P17") } : item) } }
      : { highConflict: { ...source.highConflict!, hero: { ...source.highConflict!.hero, image: imageID("P24") }, children: { ...source.highConflict!.children, image: imageID("P25") } } };
    await payload.update({ collection: "service-presentations", id: source.id, overrideAccess: true, draft: false, context: { skipSystemEvents: true }, data });
  }
}
await writeFile(path.join(folder, "cms-import-result.json"), JSON.stringify({ media: Object.fromEntries(mediaIDs), updated: targets }, null, 2));
console.log("Imported 42 generated photos; updated image relationships in 3 local CMS documents.");
process.exit(0);
