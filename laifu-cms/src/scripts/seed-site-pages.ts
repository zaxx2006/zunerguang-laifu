import fs from "node:fs";
import config from "@payload-config";
import { getPayload } from "payload";
import { sitePageSchema } from "@/contracts/cms-site-page";
import type { SitePage } from "@/payload-types";

const server = new URL(process.env.PAYLOAD_PUBLIC_SERVER_URL || "http://127.0.0.1:5158");
if (!["127.0.0.1", "localhost"].includes(server.hostname)) throw new Error("本脚本仅用于本地官网内容初始化");
const payload = await getPayload({ config });
const rows = JSON.parse(fs.readFileSync(new URL("../../seed-data/site-pages.json", import.meta.url), "utf8")) as Array<Omit<SitePage, "id" | "createdAt" | "updatedAt">>;
const existing = await payload.find({ collection: "site-pages", pagination: false, overrideAccess: true });
const routes = new Set(existing.docs.map(document => document.route));
let created = 0;
for (const row of rows) {
  sitePageSchema.parse({ ...row, image: row.originalImage });
  if (routes.has(row.route)) continue;
  await payload.create({ collection: "site-pages", overrideAccess: true, context: { skipSystemEvents: true }, data: { ...row, _status: "published" } });
  created++;
}
payload.logger.info({ created, skipped: rows.length - created, total: rows.length, msg: "官网模板页面初始化完成，已有内容未覆盖" });
await payload.destroy();
process.exit(0);
