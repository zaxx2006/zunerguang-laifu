import type { CollectionConfig } from "payload";
import { adminOnly, authenticated } from "@/access/roles";
import { recordAuditAfterChange } from "@/hooks/system-events";

export const ConsultationRequests: CollectionConfig = {
  slug: "consultation-requests",
  labels: { singular: "预约申请", plural: "预约申请" },
  admin: { useAsTitle: "name", group: "官网内容", defaultColumns: ["name", "phone", "consultationType", "status", "createdAt"] },
  access: { create: () => false, read: authenticated, update: authenticated, delete: adminOnly },
  hooks: { afterChange: [recordAuditAfterChange] },
  fields: [
    { name: "name", label: "姓名／称呼", type: "text", required: true },
    { name: "phone", label: "电话", type: "text", required: true, index: true },
    { name: "wechat", label: "微信", type: "text" },
    { name: "consultationType", label: "咨询类型", type: "text", required: true },
    { name: "concern", label: "主要困扰", type: "textarea", required: true },
    { name: "consent", label: "已同意联系与安排咨询", type: "checkbox", required: true },
    { name: "status", label: "跟进状态", type: "select", defaultValue: "new", required: true, options: [{ label: "待联系", value: "new" }, { label: "已联系", value: "contacted" }, { label: "已安排", value: "scheduled" }, { label: "已结束", value: "closed" }] },
    { name: "notes", label: "内部跟进备注", type: "textarea" },
  ],
};
