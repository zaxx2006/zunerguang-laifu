import { APIError } from "payload";
import type { CollectionBeforeChangeHook, CollectionBeforeOperationHook, CollectionConfig } from "payload";
import { adminOnly, authenticated } from "@/access/roles";
import { enqueuePublishAfterChange, enqueuePublishAfterDelete, recordAuditAfterChange, recordAuditAfterDelete } from "@/hooks/system-events";

const presentationVersions: CollectionConfig["versions"] = { drafts: { autosave: { interval: 30000, showSaveDraftButton: true }, schedulePublish: { timeFormat: "HH:mm", timeIntervals: 5 } }, maxPerDoc: 50 };
const markPresentationAutosave: CollectionBeforeOperationHook = ({ args, req }) => {
  req.context.presentationAutosave = "autosave" in args && args.autosave === true;
  return args;
};
const restrictPublishing: CollectionBeforeChangeHook = ({ data, req }) => {
  if (data?._status !== "published" || req.context.skipSystemEvents === true) return data;
  const roles = (req.user as { roles?: string[] } | null)?.roles ?? [];
  if (!roles.some(role => role === "admin" || role === "publisher")) throw new APIError("只有发布人员或管理员可以发布内容。", 403);
  return data;
};

export function withPresentationPolicy(collection: CollectionConfig): CollectionConfig {
  return { ...collection, access: { create: authenticated, read: authenticated, update: authenticated, delete: adminOnly }, versions: presentationVersions, hooks: { ...collection.hooks, beforeOperation: [...(collection.hooks?.beforeOperation ?? []), markPresentationAutosave], beforeChange: [...(collection.hooks?.beforeChange ?? []), restrictPublishing], afterChange: [...(collection.hooks?.afterChange ?? []), recordAuditAfterChange, enqueuePublishAfterChange], afterDelete: [...(collection.hooks?.afterDelete ?? []), recordAuditAfterDelete, enqueuePublishAfterDelete] } };
}
