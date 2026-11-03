import assert from "node:assert/strict";
import { test } from "node:test";
import { selectedReaderResources, validateHomeResources } from "./reader-resources";
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
