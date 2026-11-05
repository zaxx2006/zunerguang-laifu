import assert from "node:assert/strict";
import { test } from "node:test";
import type { Payload } from "payload";
import { publishedReaderResources, selectedReaderResources, validateHomeResources } from "./reader-resources";
import { readerHref, type ReaderResource } from "@/contracts/resource-reader";

const resource: ReaderResource = { id: "resource-one", title: "指南", summary: "说明", kind: "guide", stage: "decision", duration: null, href: "/resources/", file: { url: "https://cms.example.com/api/media/file/guide.pdf", filename: "guide.pdf", mimeType: "application/pdf" } };
const resources = Array.from({ length: 4 }, (_, index) => ({ ...resource, id: `resource-${index}` }));

test("homepage selection accepts zero to three published resources and preserves order", () => {
  assert.equal(validateHomeResources([], resources), null);
  const items = [2, 0, 1].map(index => ({ href: readerHref(resources[index].id) }));
  assert.equal(validateHomeResources(items, resources), null);
  assert.deepEqual(selectedReaderResources(items, resources).map(item => item.id), ["resource-2", "resource-0", "resource-1"]);
});

test("homepage publication rejects duplicates, a fourth resource and removed resources", () => {
  assert.match(validateHomeResources(resources.map(item => ({ href: readerHref(item.id) })), resources)!, /最多/);
  assert.match(validateHomeResources([{ href: readerHref(resource.id) }, { href: readerHref(resource.id) }], [resource])!, /重复/);
  assert.match(validateHomeResources([{ href: readerHref("unpublished") }], resources)!, /已发布/);
  assert.match(validateHomeResources([{ href: "/resources/#old-sample" }], resources)!, /选择/);
  assert.deepEqual(selectedReaderResources([{ href: readerHref(resource.id) }], []), []);
});

test("published resources remain readable after replacing the page hero with a media relationship", async () => {
  const content = { sourceSheet: "资源中心", intro: [], sections: [{ id: "catalog", title: "资源", blocks: [{ kind: "catalog", items: [{ id: "guide", title: "指南", summary: "说明", kind: "guide", stage: "decision", duration: null, href: "/resources/", attachmentId: 12 }] }] }], cta: null };
  const image = { id: 67, url: "/api/media/file/hero.webp", alt: "阅读指南", width: 1536, height: 1024 };
  const file = { id: 12, url: "/api/media/file/guide.pdf", filename: "guide.pdf", mimeType: "application/pdf", publicApproved: true, rightsConfirmed: true };
  const payload = { find: async ({ collection, depth }: { collection: string; depth: number }) => ({ docs: collection === "media" ? [file] : [{ route: "/resources/", anchorPrefix: "resources", title: "资源中心", description: "说明", image: depth ? image : image.id, content }] }) } as unknown as Payload;
  const resources = await publishedReaderResources(payload);
  assert.equal(resources.length, 1);
  assert.equal(resources[0].title, "指南");
  assert.equal(resources[0].file.filename, "guide.pdf");
});
