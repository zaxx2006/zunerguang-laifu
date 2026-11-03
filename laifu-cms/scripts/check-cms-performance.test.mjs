import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = relativePath => readFile(path.join(root, relativePath), "utf8");

test("presentation collections share one bounded autosave and event policy", async () => {
  const policy = await read("src/collections/presentation-policy.ts");
  assert.match(policy, /autosave: \{ interval: 30000,/);
  assert.match(policy, /maxPerDoc: 50/);
  assert.match(policy, /presentationAutosave = "autosave" in args && args\.autosave === true/);
  assert.match(policy, /recordAuditAfterChange, enqueuePublishAfterChange/);
  const sharedEvents = await read("src/services/system-events/shared.ts");
  const auditEvents = await read("src/services/system-events/audit.ts");
  const publishEvents = await read("src/services/system-events/publish.ts");
  assert.match(sharedEvents, /presentationAutosave === true/);
  assert.match(auditEvents, /shouldSkipSystemEvents\(req\)/);
  assert.match(publishEvents, /shouldSkipSystemEvents\(req\)/);
  for (const name of ["HomePresentations", "Navigation", "PagePresentations"]) {
    const source = await read(`src/collections/${name}.ts`);
    assert.match(source, /withPresentationPolicy\(\{/);
    assert.doesNotMatch(source, /autosave:|recordAuditAfterChange|enqueuePublishAfterChange/);
  }
});

test("dashboard data access stays parallel and bounded", async () => {
  const service = await read("src/services/dashboard.ts");
  const view = await read("src/admin/views/DashboardView.tsx");
  assert.match(service, /await Promise\.all\(\[/);
  assert.match(service, /count\(\{ collection: "media"/);
  assert.doesNotMatch(service, /pagination: false|filesize|sizes:/);
  assert.match(view, /loadDashboardSnapshot\(req\)/);
  assert.doesNotMatch(view, /req\.payload\./);
});

test("public presentation routes use one cache-aware application service", async () => {
  const service = await read("src/services/public-cms-api.ts");
  const projector = await read("src/services/cms-presentations.ts");
  assert.match(service, /new Map<CmsPresentationKind \| `service:\$\{string\}`, CachedRepresentation>/);
  assert.match(service, /cache\.get\(cacheKey\)/);
  assert.match(service, /key: kind === "service" \? serviceKey/);
  assert.match(service, /select: \{ updatedAt: true \}/);
  assert.match(service, /request\.headers\.get\("if-none-match"\)/);
  assert.match(service, /status: 304/);
  assert.match(service, /s-maxage=60, stale-while-revalidate=86400/);
  assert.match(service, /"Cache-Control": "no-store"/);
  assert.doesNotMatch(projector, /Response\.|getPayload|@payload-config/);
  for (const name of ["home-presentation", "navigation"]) {
    const route = await read(`src/app/(payload)/api/public/v1/laifu/${name}/route.ts`);
    assert.match(route, /cmsResponse\(/);
    assert.doesNotMatch(route, /getPayload|payload\.find/);
  }
});

test("live preview treats document rendering as non-urgent work", async () => {
  const shell = await read("src/preview/components/PreviewShell.tsx");
  assert.match(shell, /startTransition\(\(\) =>/);
});

test("live preview filters the popup ready message before loading the saved draft", async () => {
  const shell = await read("src/preview/components/PreviewShell.tsx");
  assert.match(shell, /const initialData: PreviewDocument = id \? \{ id \} : \{\};/);
  assert.match(shell, /hasPreviewFields\(data\)/);
  assert.match(shell, /Object\.assign\(initialData, savedDocument\)/);
  assert.match(shell, /subscribe<PreviewDocument>\(\{ serverURL, initialData, depth: 1,/);
  assert.ok(shell.indexOf("subscribe<PreviewDocument>") < shell.indexOf("ready({ serverURL })"));
  assert.ok(shell.indexOf("ready({ serverURL })") < shell.indexOf("await fetch("));
  assert.match(shell, /active && !hasLiveData/);
});

test("header avatar lookup projects only renderable fields", async () => {
  const avatar = await read("src/admin/components/AdminAvatar.tsx");
  assert.match(avatar, /select: \{ avatar: true, email: true, name: true \}/);
});

test("page seeding resolves existing routes in one projected read", async () => {
  const seed = await read("src/scripts/seed-pages.ts");
  assert.match(seed, /select: \{ route: true \}/);
  assert.match(seed, /new Set\(existing\.docs\.map/);
  assert.doesNotMatch(seed, /where: \{ route:/);
});
