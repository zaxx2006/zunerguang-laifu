import assert from "node:assert/strict";
import { test } from "node:test";
import { resourceAttachmentIds, projectResourceFiles, assertResourceFilesApproved, stabilizeResourceIds } from "./resource-files";
import type { PageContent } from "@/contracts/page-content";

const content: PageContent = { sourceSheet: "验收", intro: [], sections: [{ id: "catalog", title: "资源", blocks: [{ kind: "catalog", items: [{ title: "指南", summary: "说明", kind: "guide", stage: "decision", duration: null, href: "/resources/", attachmentId: 12 }] }] }], cta: null };
const approved = { id: 12, url: "/api/media/file/guide.pdf", filename: "guide.pdf", mimeType: "application/pdf", publicApproved: true, rightsConfirmed: true };

test("finds attachments in nested blocks and deduplicates references", () => {
  const nested: PageContent = { ...content, intro: [{ kind: "subsection", title: "更多", blocks: content.sections[0].blocks }] };
  assert.deepEqual(resourceAttachmentIds(nested), [12]);
});

test("projects approved file URLs and ignores manually injected file data", () => {
  const original = structuredClone(content);
  const projected = projectResourceFiles(content, [approved], "http://127.0.0.1:5158");
  const block = projected.sections[0].blocks[0];
  assert.equal(block.kind, "catalog");
  if (block.kind !== "catalog") return;
  assert.equal(block.items[0].file?.url, "http://127.0.0.1:5158/api/media/file/guide.pdf");
  assert.equal(block.items[0].attachmentId, undefined);
  const forged = structuredClone(content);
  const source = forged.sections[0].blocks[0];
  if (source.kind === "catalog") source.items[0].file = { url: "https://example.com/forged.pdf", filename: "forged.pdf", mimeType: "application/pdf" };
  const hidden = projectResourceFiles(forged, [{ ...approved, publicApproved: false }], "http://127.0.0.1:5158").sections[0].blocks[0];
  assert.ok(hidden.kind === "catalog" && !hidden.items[0].file);
  assert.deepEqual(content, original);
});

test("publishing rejects missing, unapproved, unauthorized or trashed files", () => {
  assert.doesNotThrow(() => assertResourceFilesApproved(content, [approved]));
  for (const files of [[], [{ ...approved, publicApproved: false }], [{ ...approved, rightsConfirmed: false }], [{ ...approved, deletedAt: new Date().toISOString() }]]) {
    assert.throws(() => assertResourceFilesApproved(content, files), /指南/);
  }
  assert.doesNotThrow(() => assertResourceFilesApproved({ ...content, sections: [{ ...content.sections[0], blocks: [] }] }, []));
});

test("resource references survive replacing an attachment and editing its title", () => {
  const next = structuredClone(content);
  const block = next.sections[0].blocks[0];
  if (block.kind !== "catalog") throw new Error("missing fixture catalog");
  block.items[0] = { ...block.items[0], title: "更新后的指南", attachmentId: 99 };
  const saved = stabilizeResourceIds(next, content);
  const savedBlock = saved.sections[0].blocks[0];
  assert.ok(savedBlock.kind === "catalog");
  assert.equal(savedBlock.items[0].id, "file-12");
  const projected = projectResourceFiles(saved, [{ ...approved, id: 99 }], "https://cms.example.com");
  const result = projected.sections[0].blocks[0];
  assert.ok(result.kind === "catalog");
  assert.equal(result.items[0].id, "file-12");
  assert.equal(result.items[0].title, "更新后的指南");
  assert.equal(result.items[0].file?.filename, "guide.pdf");
});
