import { createHash, createHmac } from "node:crypto";
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, PayloadRequest } from "payload";
import { actorId, asRecord, documentStatus, shouldSkipSystemEvents, type PublishAction } from "./shared";

function eventPayload(resource: string, documentId: string, action: PublishAction, contentVersion: string) {
  return { resource, documentId, action, contentVersion };
}

function eventKey(resource: string, documentId: string, action: PublishAction, contentVersion: string) {
  return `laifu:${resource}:${documentId}:${action}:${contentVersion}`;
}

async function deliver(req: PayloadRequest, event: { id: number | string; resource: string; documentId: string; action: PublishAction; contentVersion: string; requestHash: string; idempotencyKey: string }) {
  const hookURL = process.env.LAIFU_REVALIDATE_URL;
  const secret = process.env.LAIFU_REVALIDATE_SECRET;
  if (!hookURL || !secret || secret.length < 32) return;
  const timestamp = new Date().toISOString();
  const body = JSON.stringify({ apiVersion: "v1", eventId: String(event.id), resource: event.resource, documentId: event.documentId, action: event.action, contentVersion: event.contentVersion, requestHash: event.requestHash });
  const signature = createHmac("sha256", secret).update(`${timestamp}.${body}`).digest("hex");
  try {
    const response = await fetch(hookURL, { method: "POST", body, headers: { "Content-Type": "application/json", "Idempotency-Key": event.idempotencyKey, "X-Laifu-Event-ID": String(event.id), "X-Laifu-Signature": signature, "X-Laifu-Timestamp": timestamp }, redirect: "error", signal: AbortSignal.timeout(10_000) });
    if (!response.ok) throw new Error(`Revalidation hook returned HTTP ${response.status}`);
    await req.payload.update({ collection: "publish-events", id: event.id, overrideAccess: true, req, context: { skipSystemEvents: true }, data: { deliveryStatus: "succeeded", attemptCount: 1, lastAttemptAt: timestamp, responseStatus: response.status, lastError: null } });
  } catch (error) {
    await req.payload.update({ collection: "publish-events", id: event.id, overrideAccess: true, req, context: { skipSystemEvents: true }, data: { deliveryStatus: "failed", attemptCount: 1, lastAttemptAt: timestamp, lastError: (error instanceof Error ? error.message : String(error)).slice(0, 500) } });
  }
}

async function enqueue(req: PayloadRequest, resource: string, document: Record<string, unknown>, action: PublishAction) {
  const documentId = String(document.id);
  const contentVersion = typeof document.updatedAt === "string" ? document.updatedAt : new Date().toISOString();
  const payload = eventPayload(resource, documentId, action, contentVersion);
  const idempotencyKey = eventKey(resource, documentId, action, contentVersion);
  const existing = await req.payload.find({ collection: "publish-events", depth: 0, limit: 1, overrideAccess: true, pagination: false, req, where: { idempotencyKey: { equals: idempotencyKey } } });
  if (existing.docs.length > 0) return;
  const requestHash = createHash("sha256").update(JSON.stringify(payload)).digest("hex");
  const event = await req.payload.create({ collection: "publish-events", overrideAccess: true, req, data: { ...payload, idempotencyKey, requestHash, triggeredBy: actorId(req), deliveryStatus: "queued", attemptCount: 0 } });
  await deliver(req, { id: event.id, ...payload, requestHash, idempotencyKey });
}

export const enqueuePublishAfterChange: CollectionAfterChangeHook = async ({ collection, doc, previousDoc, req }) => {
  if (shouldSkipSystemEvents(req)) return doc;
  const before = documentStatus(previousDoc);
  const after = documentStatus(doc);
  if (after === "published") await enqueue(req, collection.slug, asRecord(doc), "publish");
  else if (before === "published") await enqueue(req, collection.slug, asRecord(doc), "unpublish");
  return doc;
};

export const enqueuePublishAfterDelete: CollectionAfterDeleteHook = async ({ collection, doc, req }) => {
  if (shouldSkipSystemEvents(req) || documentStatus(doc) !== "published") return doc;
  await enqueue(req, collection.slug, asRecord(doc), "delete");
  return doc;
};
