import { APIError } from "payload";
import type { CollectionConfig } from "payload";
import { adminOnly, adminOrSelf, firstUserOrAdmin } from "@/access/roles";

export const Users: CollectionConfig = {
  slug: "users",
  auth: { maxLoginAttempts: 5, lockTime: 600000, tokenExpiration: 7200, loginWithUsername: { allowEmailLogin: true, requireEmail: true, requireUsername: false }, useAPIKey: true, useSessions: true },
  admin: { useAsTitle: "email", group: "系统" },
  access: { create: firstUserOrAdmin, read: adminOrSelf, update: adminOrSelf, delete: adminOnly },
  hooks: { beforeOperation: [({ operation }) => { if (operation === "forgotPassword" || operation === "resetPassword") throw new APIError("邮件密码找回已关闭，请联系管理员重置密码。", 404); }], beforeValidate: [async ({ data, operation, req }) => { if (operation !== "create") return data; const result = await req.payload.count({ collection: "users", overrideAccess: true }); return result.totalDocs === 0 ? { ...data, roles: ["admin"] } : data; }] },
  fields: [
    { name: "name", label: "姓名", type: "text", required: true },
    { name: "avatar", label: "账号头像", type: "upload", relationTo: "avatars", admin: { position: "sidebar", description: "上传或更换后台账号头像，建议使用正方形图片。" } },
    { name: "roles", label: "角色", type: "select", hasMany: true, required: true, defaultValue: ["editor"], saveToJWT: true, admin: { description: "系统中的第一个账号会自动成为管理员。" }, options: [{ label: "管理员", value: "admin" }, { label: "发布人员", value: "publisher" }, { label: "编辑", value: "editor" }], access: { update: ({ req }) => Boolean((req.user as { roles?: string[] } | null)?.roles?.includes("admin")) } }
  ]
};
