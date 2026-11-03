import assert from "node:assert/strict";
import fs from "node:fs";
import { randomBytes } from "node:crypto";
import { execFileSync } from "node:child_process";
import config from "@payload-config";
import { getPayload } from "payload";
import { sitePageEnvelopeSchema } from "@/contracts/cms-site-page";
import type { PageContent } from "@/contracts/page-content";

const cms = "http://127.0.0.1:5158";
assert.ok(["localhost", "127.0.0.1"].includes(new URL(process.env.PAYLOAD_PUBLIC_SERVER_URL || cms).hostname), "只允许本地验收");
const stateURL = new URL("../../../artifacts/resource-upload-20261027/qa-state.json", import.meta.url);
const binary = `${process.env.APPDATA}/npm/node_modules/agent-browser/bin/agent-browser-win32-x64.exe`;
const browser = (...args: string[]) => execFileSync(binary, ["--session", "laifu-resources", ...args], { encoding: "utf8", timeout: 60000, maxBuffer: 4 * 1024 * 1024 });
const payload = await getPayload({ config });
type State = { userId: number; pageId: number; originalContent: PageContent; mediaIds?: number[] };
try {
  if (process.argv[2] === "setup") {
    assert.ok(!fs.existsSync(stateURL), "先恢复上次验收现场，避免覆盖备份");
    const page = (await payload.find({ collection: "site-pages", where: { route: { equals: "/resources/" } }, draft: true, depth: 0, limit: 1, overrideAccess: true })).docs[0];
    assert.ok(page);
    const email = `resource-qa-${Date.now()}@laifu.local`;
    const password = randomBytes(24).toString("base64url");
    const user = await payload.create({ collection: "users", overrideAccess: true, data: { email, password, name: "资源上传临时验收", roles: ["admin"] } });
    fs.writeFileSync(stateURL, JSON.stringify({ userId: user.id, pageId: page.id, originalContent: page.content }));
    const result = browser("eval", `fetch('/api/users/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(${JSON.stringify({ email, password })})}).then(r=>({status:r.status}))`);
    assert.ok(result.includes("200"), "浏览器登录失败");
    console.log(JSON.stringify({ pageId: page.id, qaUserId: user.id, login: "ok" }));
  } else if (process.argv[2] === "login") {
    const state = JSON.parse(fs.readFileSync(stateURL, "utf8")) as State;
    const password = randomBytes(24).toString("base64url");
    const user = await payload.update({ collection: "users", id: state.userId, overrideAccess: true, data: { password } });
    const result = browser("eval", `fetch('/api/users/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(${JSON.stringify({ email: user.email, password })})}).then(r=>({status:r.status}))`);
    assert.ok(result.includes("200"), "浏览器登录失败");
    console.log("临时验收账号已重新登录");
  } else if (process.argv[2] === "verify") {
    const state = JSON.parse(fs.readFileSync(stateURL, "utf8")) as State;
    const admin = await payload.findByID({ collection: "users", id: state.userId, overrideAccess: true });
    const page = await payload.findByID({ collection: "site-pages", id: state.pageId, draft: true, depth: 0, overrideAccess: true });
    const content = page.content as PageContent;
    const block = content.sections.flatMap(section => section.blocks).find(block => block.kind === "catalog");
    assert.ok(block?.kind === "catalog");
    const entry = block.items.find(item => item.title === "本地上传验收资源（临时）");
    assert.ok(entry?.attachmentId, "界面上传的附件未保存到草稿");
    state.mediaIds = [entry.attachmentId];
    fs.writeFileSync(stateURL, JSON.stringify(state));
    const file = await payload.findByID({ collection: "media", id: entry.attachmentId, overrideAccess: true });
    assert.equal(file.rightsConfirmed, true);
    assert.equal(file.publicApproved, true);
    const fileResponse = await fetch(new URL(file.url!, cms));
    assert.equal(fileResponse.status, 200);
    assert.match(await fileResponse.text(), /资源上传功能本地验收/);
    const draft = await fetch(`${cms}/api/preview/v1/laifu/page?id=${state.pageId}`, { headers: { Authorization: `Bearer ${process.env.LAIFU_PREVIEW_SECRET}` } });
    assert.equal(draft.status, 200);
    const projected = sitePageEnvelopeSchema.parse(await draft.json()).data.presentation.content;
    const catalog = projected.sections.flatMap(section => section.blocks).find(block => block.kind === "catalog");
    assert.ok(catalog?.kind === "catalog" && catalog.items.some(item => item.title === entry.title && item.file?.filename === file.filename));
    const published = await (await fetch(`${cms}/api/public/v1/laifu/site-pages?route=%2Fresources%2F`)).json();
    assert.ok(!JSON.stringify(published).includes(entry.title), "草稿泄露到公开页面");
    await payload.update({ collection: "media", id: file.id, overrideAccess: true, data: { publicApproved: false } });
    await assert.rejects(payload.update({ collection: "site-pages", id: state.pageId, overrideAccess: true, user: admin, data: { content: page.content, _status: "published" } }), /未完成|授权/);
    assert.equal((await fetch(new URL(file.url!, cms))).status, 403);
    await payload.update({ collection: "media", id: file.id, overrideAccess: true, data: { publicApproved: true } });
    const previewURL = new URL("/api/cms/preview/", "http://127.0.0.1:3001");
    for (const [key, value] of Object.entries({ collection: "site-pages", id: String(state.pageId), route: "/resources/", secret: process.env.LAIFU_PREVIEW_SECRET! })) previewURL.searchParams.set(key, value);
    const response = await fetch(previewURL, { redirect: "manual" });
    assert.equal(response.status, 307);
    const cookie = response.headers.getSetCookie().map(value => value.split(";")[0]).join("; ");
    const rendered = await fetch("http://127.0.0.1:3001/resources/", { headers: { Cookie: cookie } });
    assert.equal(rendered.status, 200);
    const html = await rendered.text();
    assert.ok(html.includes(entry.title) && html.includes(file.filename!) && html.includes("查看／下载文件"));
    console.log("真实上传、草稿落库、附件公开读取、授权阻断发布、草稿隔离和前台预览通过");
  } else if (process.argv[2] === "cleanup") {
    const state = JSON.parse(fs.readFileSync(stateURL, "utf8")) as State;
    await payload.update({ collection: "site-pages", id: state.pageId, draft: true, overrideAccess: true, data: { content: state.originalContent } });
    for (const id of state.mediaIds ?? []) await payload.delete({ collection: "media", id, overrideAccess: true });
    await payload.delete({ collection: "users", id: state.userId, overrideAccess: true });
    fs.renameSync(stateURL, new URL("qa-state-restored.json", stateURL));
    console.log("原资源中心草稿已恢复，临时账号和临时上传记录已清理");
  } else throw new Error("使用 setup、verify 或 cleanup");
} finally {
  await payload.destroy();
}
process.exit(0);
