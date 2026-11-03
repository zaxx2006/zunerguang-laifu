import type { CollectionConfig } from "payload";
import { adminOnly } from "@/access/roles";

export const PublishEvents: CollectionConfig = {
  slug: "publish-events",
  labels: { singular: "发布事件", plural: "发布事件" },
  admin: { useAsTitle: "idempotencyKey", group: "系统", defaultColumns: ["resource", "action", "deliveryStatus", "attemptCount", "createdAt"], hidden: ({ user }) => !Boolean((user as { roles?: string[] } | null)?.roles?.includes("admin")) },
  access: { create: () => false, read: adminOnly, update: () => false, delete: () => false },
  fields: [
    { name: "resource", type: "text", required: true, index: true },
    { name: "documentId", type: "text", required: true, index: true },
    { name: "action", type: "select", required: true, options: [{ label: "发布", value: "publish" }, { label: "撤回发布", value: "unpublish" }, { label: "删除", value: "delete" }] },
    { name: "contentVersion", type: "text", required: true },
    { name: "requestHash", type: "text", required: true },
    { name: "idempotencyKey", type: "text", required: true, unique: true, index: true },
    { name: "triggeredBy", type: "relationship", relationTo: "users" },
    { name: "deliveryStatus", type: "select", required: true, defaultValue: "queued", index: true, options: [{ label: "待发送", value: "queued" }, { label: "已成功", value: "succeeded" }, { label: "失败", value: "failed" }] },
    { name: "attemptCount", type: "number", required: true, defaultValue: 0, min: 0, max: 5 },
    { name: "lastAttemptAt", type: "date" },
    { name: "responseStatus", type: "number" },
    { name: "lastError", type: "text", maxLength: 500 }
  ]
};
