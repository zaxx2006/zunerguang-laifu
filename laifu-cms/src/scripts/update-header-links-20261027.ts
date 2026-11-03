import config from "@payload-config";
import { getPayload } from "payload";
import { mkdir, writeFile } from "node:fs/promises";
const payload = await getPayload({ config });
const result = await payload.find({ collection: "navigation", where: { key: { equals: "primary" } }, draft: true, depth: 0, limit: 1, overrideAccess: true });
const document = result.docs[0];
if (!document) throw new Error("Primary navigation missing");
const backup = "../artifacts/header-home-faq-20261027";
await mkdir(backup, { recursive: true });
await writeFile(`${backup}/navigation-before.json`, JSON.stringify(document, null, 2), { flag: "wx" }).catch(error => { if (error.code !== "EEXIST") throw error; });
if (document._status !== "published") throw new Error("An unpublished draft must be preserved");
const primaryLinks = document.primaryLinks.map(link => link.label === "常见问题" ? { ...link, href: "/faq/" } : link);
if (!primaryLinks.some(link => link.label === "常见问题")) throw new Error("FAQ entry missing");
if (process.argv.includes("--apply")) {
  await payload.update({ collection: "navigation", id: document.id, overrideAccess: true, context: { skipSystemEvents: true }, data: { primaryLinks } });
}
console.log(JSON.stringify({ id: document.id, status: document._status, applied: process.argv.includes("--apply"), links: primaryLinks.map(({label, href}) => ({label, href})) }));
process.exit(0);
