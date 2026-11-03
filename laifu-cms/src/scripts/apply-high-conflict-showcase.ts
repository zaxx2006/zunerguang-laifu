import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
import config from "@payload-config";
import { createLocalReq, getPayload } from "payload";
import { highConflictPresentationSchema } from "@/contracts/cms-high-conflict";
import type { ServicePresentation } from "@/payload-types";

const cmsURL = new URL(process.env.PAYLOAD_PUBLIC_SERVER_URL || "http://127.0.0.1:5158");
assert.ok(["127.0.0.1", "localhost"].includes(cmsURL.hostname), "This content update is local-only");
const payload = await getPayload({ config });
const source = highConflictPresentationSchema.parse(JSON.parse(await readFile(path.resolve("../laifu-web/apps/website/src/content/service-presentations/high-conflict-divorce.json"), "utf8")));
const query = { collection: "service-presentations" as const, where: { key: { equals: source.key } }, limit: 1, depth: 0, overrideAccess: true };
const published = (await payload.find({ ...query, draft: false })).docs[0];
const latest = (await payload.find({ ...query, draft: true })).docs[0];
assert.ok(published?.highConflict && latest, "Existing local high-conflict content is required");
assert.notEqual(latest._status, "draft", "Preserve the existing unpublished draft before updating");
function toEditor(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(item => typeof item === "string" ? { value: item } : toEditor(item));
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, item]) => [key === "directions" ? "dirs" : key === "toolRows" ? "tool" : key, toEditor(item)]));
  return value;
}
const backupDir = path.resolve("../.service-logs/high-conflict-redesign-backup-20261023");
await mkdir(backupDir, { recursive: true });
const snapshot = path.join(backupDir, `cms-content-${new Date().toISOString().replace(/[:.]/g, "-")}.json`);
await writeFile(snapshot, JSON.stringify({ id: published.id, highConflict: published.highConflict, _status: published._status }, null, 2), { flag: "wx" });
const current = published.highConflict;
const next = {
  ...current,
  support: toEditor(source.support),
  process: toEditor(source.process),
  hero: { ...current.hero, secondaryAction: source.hero.secondaryAction },
  ui: { ...current.ui, navigation: source.ui.navigation },
} as ServicePresentation["highConflict"];
const admins = await payload.find({ collection: "users", where: { roles: { contains: "admin" } }, limit: 1, overrideAccess: true });
assert.ok(admins.docs[0], "A local admin is required for the existing publish hook");
const req = await createLocalReq({ user: { ...admins.docs[0], collection: "users" as const } }, payload);
await payload.update({ collection: "service-presentations", id: published.id, draft: false, overrideAccess: true, req, data: { highConflict: next, _status: "published" } });
console.log(`Updated seven service directions and four phases in local CMS. Snapshot: ${snapshot}`);
process.exit(0);
