import type { PayloadRequest } from "payload";

export type PublishAction = "publish" | "unpublish" | "delete";

export function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? value as Record<string, unknown> : {};
}

export function documentStatus(value: unknown): string | undefined {
  const candidate = asRecord(value)._status;
  return typeof candidate === "string" ? candidate : undefined;
}

export function actorId(req: PayloadRequest): number | undefined {
  const user = req.user as { id?: string | number } | null;
  return typeof user?.id === "number" ? user.id : undefined;
}

export function requestId(req: PayloadRequest): string | undefined {
  return req.headers.get("x-request-id")?.slice(0, 120) || undefined;
}

export function shouldSkipSystemEvents(req: PayloadRequest): boolean {
  return req.context.skipSystemEvents === true || req.context.presentationAutosave === true;
}
