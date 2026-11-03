import fs from "node:fs";
import config from "@payload-config";
import { getPayload } from "payload";

if (!["127.0.0.1", "localhost"].includes(new URL(process.env.PAYLOAD_PUBLIC_SERVER_URL || "http://127.0.0.1:5158").hostname)) throw new Error("仅允许更新本地导航");
const payload = await getPayload({ config });
const original = (await payload.find({ collection: "navigation", where: { key: { equals: "primary" } }, draft: false, depth: 0, limit: 1, overrideAccess: true })).docs[0];
if (!original || original._status !== "published") throw new Error("缺少已发布导航，未进行修改");
const document = structuredClone(original);
function rename(value: unknown): void {
  if (!value || typeof value !== "object") return;
  const record = value as Record<string, unknown>;
  if (record.href === "/services/nuptial-agreements/" && typeof record.label === "string") record.label = "复杂资产专项方案";
  Object.values(record).forEach(rename);
}
rename(document);
if (JSON.stringify(document) !== JSON.stringify(original)) {
  fs.writeFileSync(new URL("../../../.service-logs/site-completion-backup-20261023/navigation-before-labels.json", import.meta.url), JSON.stringify(original, null, 2));
  const user = (await payload.find({ collection: "users", where: { roles: { contains: "admin" } }, limit: 1, overrideAccess: true })).docs[0];
  await payload.update({ collection: "navigation", id: original.id, overrideAccess: true, user, data: document });
  console.log("本地导航名称已按需求表更新，更新前快照已保存");
}
await payload.destroy();
process.exit(0);
