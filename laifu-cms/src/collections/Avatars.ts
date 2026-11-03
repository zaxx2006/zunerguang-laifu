import path from "node:path";
import { fileURLToPath } from "node:url";
import type { CollectionConfig } from "payload";
import { adminOrOwner, authenticated } from "@/access/roles";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export const Avatars: CollectionConfig = {
  slug: "avatars",
  labels: { singular: "头像", plural: "头像" },
  admin: { hidden: true, useAsTitle: "filename", defaultColumns: ["filename", "owner", "updatedAt"], description: "后台账号头像，仅供已登录用户使用。" },
  upload: { staticDir: process.env.PAYLOAD_AVATAR_DIR || path.resolve(dirname, "../../avatars"), mimeTypes: ["image/*"], adminThumbnail: "avatar", focalPoint: true, crop: true, displayPreview: true, imageSizes: [{ name: "avatar", width: 256, height: 256, position: "centre", withoutEnlargement: false }] },
  access: { create: authenticated, read: authenticated, update: adminOrOwner, delete: adminOrOwner },
  hooks: { beforeValidate: [({ data, operation, req }) => operation === "create" && req.user ? { ...data, owner: req.user.id } : data] },
  fields: [
    { name: "owner", label: "所属用户", type: "relationship", relationTo: "users", index: true, admin: { hidden: true }, access: { update: () => false } },
    { name: "alt", label: "替代文本", type: "text", required: true, defaultValue: "用户头像", admin: { hidden: true } }
  ]
};
