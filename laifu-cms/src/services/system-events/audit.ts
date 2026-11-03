import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from "payload";
import { actorId, documentStatus, requestId, shouldSkipSystemEvents } from "./shared";

function resolveAuditAction(operation: "create" | "update", before: string | undefined, after: string | undefined) {
  if (before !== "published" && after === "published") return "publish";
  if (before === "published" && after !== "published") return "unpublish";
  return operation;
}

export const recordAuditAfterChange: CollectionAfterChangeHook = async ({ collection, doc, operation, previousDoc, req }) => {
  if (shouldSkipSystemEvents(req)) return doc;
  const before = documentStatus(previousDoc);
  const after = documentStatus(doc);
  await req.payload.create({ collection: "audit-logs", overrideAccess: true, req, data: { changedBy: actorId(req), action: resolveAuditAction(operation, before, after), resource: collection.slug, documentId: String(doc.id), statusBefore: before, statusAfter: after, requestId: requestId(req), changedAt: new Date().toISOString() } });
  return doc;
};

export const recordAuditAfterDelete: CollectionAfterDeleteHook = async ({ collection, doc, req }) => {
  if (shouldSkipSystemEvents(req)) return doc;
  await req.payload.create({ collection: "audit-logs", overrideAccess: true, req, data: { changedBy: actorId(req), action: "delete", resource: collection.slug, documentId: String(doc.id), statusBefore: documentStatus(doc), requestId: requestId(req), changedAt: new Date().toISOString() } });
  return doc;
};
