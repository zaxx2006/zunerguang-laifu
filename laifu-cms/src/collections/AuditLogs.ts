import type { CollectionConfig } from "payload";
import { adminOnly } from "@/access/roles";

export const AuditLogs: CollectionConfig = {
  slug: "audit-logs",
  labels: { singular: "审计日志", plural: "审计日志" },
  admin: { useAsTitle: "documentId", group: "系统", defaultColumns: ["action", "resource", "documentId", "changedBy", "changedAt"], hidden: ({ user }) => !Boolean((user as { roles?: string[] } | null)?.roles?.includes("admin")) },
  access: { create: () => false, read: adminOnly, update: () => false, delete: () => false },
  fields: [
    { name: "changedBy", label: "操作者", type: "relationship", relationTo: "users" },
    { name: "action", type: "select", required: true, options: [{ label: "创建", value: "create" }, { label: "修改", value: "update" }, { label: "删除", value: "delete" }, { label: "发布", value: "publish" }, { label: "撤回发布", value: "unpublish" }] },
    { name: "resource", type: "text", required: true, index: true },
    { name: "documentId", type: "text", required: true, index: true },
    { name: "statusBefore", type: "text" },
    { name: "statusAfter", type: "text" },
    { name: "requestId", type: "text", maxLength: 120 },
    { name: "changedAt", type: "date", required: true, index: true }
  ]
};
