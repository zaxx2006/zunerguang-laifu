import path from "node:path";
import { fileURLToPath } from "node:url";
import { APIError } from "payload";
import type { Access, CollectionConfig, Validate } from "payload";
import { adminOnly, authenticated } from "@/access/roles";
import { recordAuditAfterChange, recordAuditAfterDelete } from "@/hooks/system-events";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const optionalHttpsUrl: Validate<string> = value => !value || /^https:\/\//.test(value) ? true : "来源链接必须使用完整 HTTPS URL";
const approvedMediaOrAuthenticated: Access = ({ req }) => req.user ? true : { publicApproved: { equals: true } };

export const Media: CollectionConfig = {
  slug: "media",
  labels: { singular: "媒体", plural: "媒体" },
  admin: { useAsTitle: "alt", group: "官网呈现", defaultColumns: ["alt", "filename", "publicApproved", "updatedAt"], description: "保存官网图片及资源中心的文档、表格、音视频和 ZIP 资源包。" },
  upload: { staticDir: process.env.PAYLOAD_MEDIA_DIR || path.resolve(dirname, "../../media"), mimeTypes: ["image/*", "application/pdf", "application/epub+zip", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "text/plain", "text/csv", "audio/mpeg", "audio/mp4", "audio/wav", "audio/x-wav", "audio/ogg", "video/mp4", "video/webm", "application/zip", "application/x-zip-compressed"], adminThumbnail: "thumbnail", focalPoint: true, crop: true, imageSizes: [{ name: "thumbnail", width: 480, height: 320, position: "centre" }, { name: "card", width: 1200, height: 800, position: "centre" }] },
  access: { create: authenticated, read: approvedMediaOrAuthenticated, update: authenticated, delete: adminOnly },
  versions: { maxPerDoc: 10 },
  hooks: { beforeValidate: [({ data, originalDoc }) => { const approved = data?.publicApproved ?? originalDoc?.publicApproved; const rightsConfirmed = data?.rightsConfirmed ?? originalDoc?.rightsConfirmed; if (approved && !rightsConfirmed) throw new APIError("公开使用前必须确认媒体使用权", 400); return data; }], afterChange: [recordAuditAfterChange], afterDelete: [recordAuditAfterDelete] },
  fields: [
    { name: "alt", label: "替代文本", type: "text", required: true },
    { name: "caption", label: "说明", type: "textarea" },
    { name: "sourceLabel", label: "来源名称（选填）", type: "text" },
    { name: "sourceUrl", label: "来源链接", type: "text", validate: optionalHttpsUrl },
    { name: "rightsConfirmed", label: "已确认使用权", type: "checkbox", required: true, defaultValue: false },
    { name: "publicApproved", label: "允许公开使用", type: "checkbox", required: true, defaultValue: false, admin: { position: "sidebar", description: "只有完成授权和替代文本复核后才能开启。" } }
  ]
};
