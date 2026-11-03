import assert from "node:assert/strict";
import { getPayload, createLocalReq } from "payload";
import config from "@payload-config";
import { projectService } from "@/services/cms-service-presentations";

const payload = await getPayload({ config });
const cmsURL = process.env.PAYLOAD_PUBLIC_SERVER_URL || "http://127.0.0.1:5158";
const webURL = process.env.LAIFU_TEST_WEB_URL || "http://127.0.0.1:3001";
const publicURL = `${cmsURL}/api/public/v1/laifu/service-presentations/high-conflict-divorce`;
const result = await payload.find({ collection: "service-presentations", where: { key: { equals: "high-conflict-divorce" } }, limit: 1, depth: 0, overrideAccess: true });
const doc = result.docs[0];
assert.ok(doc?.highConflict?.hero);
const baseline = structuredClone(doc.highConflict);
const admins = await payload.find({ collection: "users", where: { roles: { contains: "admin" } }, limit: 1, overrideAccess: true });
assert.ok(admins.docs[0], "A local admin is required to verify the publish hook");
const adminUser = { ...admins.docs[0], collection: "users" as const };
const freshRequest = () => createLocalReq({ user: adminUser }, payload);
async function publicContent() {
  const response = await fetch(publicURL);
  assert.equal(response.status, 200);
  return { response, body: await response.json() };
}
async function checkFrontend(marker: string, cookie?: string) {
  for (let attempt = 0; attempt < 10; attempt++) {
    const response = await fetch(`${webURL}/services/high-conflict-divorce/`, { headers: cookie ? { Cookie: cookie } : undefined });
    const html = await response.text();
    if (response.ok && html.includes(marker)) return html;
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  throw new Error("Frontend did not render expected CMS content");
}
try {
  const first = await publicContent();
  assert.equal(first.body.data.presentation.key, "high-conflict-divorce");
  assert.equal((await fetch(publicURL, { headers: { "If-None-Match": first.response.headers.get("etag")! } })).status, 304);
  const other = await fetch(`${cmsURL}/api/public/v1/laifu/service-presentations/divorce-coaching`);
  assert.equal((await other.json()).data.presentation.key, "divorce-coaching");
  assert.equal((await fetch(`${cmsURL}/api/preview/v1/laifu/service?id=${doc.id}`)).status, 401);
  console.log("PASS published CMS content, distinct service keys, ETag and preview authorization");
  const draftMarker = "草稿验收：只在授权预览中显示。";
  await payload.update({ collection: "service-presentations", id: doc.id, draft: true, overrideAccess: true, req: await freshRequest(), data: { _status: "draft", highConflict: { ...baseline, hero: { ...baseline.hero!, audience: draftMarker } } } });
  assert.notEqual((await publicContent()).body.data.presentation.hero.audience, draftMarker);
  const previewURL = new URL("/api/cms/preview/", webURL);
  for (const [key, value] of Object.entries({ secret: process.env.LAIFU_PREVIEW_SECRET || "", collection: "service-presentations", key: "high-conflict-divorce", id: String(doc.id) })) previewURL.searchParams.set(key, value);
  const entry = await fetch(previewURL, { redirect: "manual" });
  assert.equal(entry.status, 307);
  assert.equal(new URL(entry.headers.get("location")!).pathname, "/services/high-conflict-divorce/");
  const cookie = entry.headers.getSetCookie().map(value => value.split(";")[0]).join("; ");
  await checkFrontend(draftMarker, cookie);
  const ordinary = await fetch(`${webURL}/services/high-conflict-divorce/`);
  assert.ok(!(await ordinary.text()).includes(draftMarker));
  const otherPage = await fetch(`${webURL}/services/divorce-coaching/`, { headers: { Cookie: cookie } });
  assert.ok(!(await otherPage.text()).includes(draftMarker));
  console.log("PASS draft preview renders in frontend and is isolated from public visitors and other services");
  const publishMarker = "发布验收：先厘清眼前最重要的一件事。";
  await payload.update({ collection: "service-presentations", id: doc.id, draft: false, overrideAccess: true, req: await freshRequest(), data: { _status: "published", highConflict: { ...baseline, hero: { ...baseline.hero!, audience: publishMarker } } } });
  assert.equal((await publicContent()).body.data.presentation.hero.audience, publishMarker);
  await checkFrontend(publishMarker);
  const events = await payload.find({ collection: "publish-events", where: { and: [{ resource: { equals: "service-presentations" } }, { documentId: { equals: String(doc.id) } }, { deliveryStatus: { equals: "succeeded" } }] }, limit: 1, sort: "-createdAt", overrideAccess: true });
  assert.ok(events.docs[0], "Publish webhook must have succeeded");
  console.log("PASS publication delivers revalidation webhook and frontend updates automatically");
  const populated = await payload.findByID({ collection: "service-presentations", id: doc.id, depth: 2, overrideAccess: true });
  assert.equal(projectService(populated).key, "high-conflict-divorce");
} finally {
  await payload.update({ collection: "service-presentations", id: doc.id, draft: false, overrideAccess: true, req: await freshRequest(), data: { _status: "published", highConflict: baseline } });
  await checkFrontend(baseline.hero!.audience!);
  console.log("PASS original initial content restored after lifecycle verification");
}
process.exit(0);
