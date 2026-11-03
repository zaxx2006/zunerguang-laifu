import { readFile } from "node:fs/promises";
import path from "node:path";
import config from "@payload-config";
import { getPayload } from "payload";
import { highConflictPresentationSchema } from "@/contracts/cms-high-conflict";
import type { ServicePresentation } from "@/payload-types";

const payload = await getPayload({ config });
const source = highConflictPresentationSchema.parse(JSON.parse(await readFile(path.resolve("../laifu-web/apps/website/src/content/service-presentations/high-conflict-divorce.json"), "utf8")));
const existing = await payload.find({ collection: "service-presentations", where: { key: { equals: source.key } }, limit: 1, overrideAccess: true, draft: true });
if (existing.docs.length) {
  payload.logger.info("High-conflict content already exists; preserving editorial changes.");
  process.exit(0);
}
async function media(filename: string, alt: string) {
  const found = await payload.find({ collection: "media", where: { filename: { equals: filename } }, limit: 1, overrideAccess: true });
  if (found.docs[0]) return found.docs[0].id;
  return (await payload.create({ collection: "media", data: { alt, sourceLabel: "Laifu 官网现有视觉资产", rightsConfirmed: true, publicApproved: true }, filePath: path.resolve("seed-assets", filename), overrideAccess: true })).id;
}
function toEditor(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(item => typeof item === "string" ? { value: item } : toEditor(item));
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, item]) => [key === "directions" ? "dirs" : key === "toolRows" ? "tool" : key, toEditor(item)]));
  return value;
}
const [hero, children] = await Promise.all([media("mediation-room.webp", source.hero.image.alt), media("divorce-coaching-conversation.webp", source.children.image.alt)]);
const content = toEditor({ ...source, hero: { ...source.hero, image: hero }, children: { ...source.children, image: children } });
await payload.create({ collection: "service-presentations", draft: false, overrideAccess: true, context: { skipSystemEvents: true }, data: { internalTitle: "高冲突婚姻专项支持", key: source.key, highConflict: content as ServicePresentation["highConflict"], _status: "published" } });
payload.logger.info("High-conflict initial content created in local CMS.");
process.exit(0);
