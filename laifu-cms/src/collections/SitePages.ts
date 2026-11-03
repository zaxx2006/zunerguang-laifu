import { APIError, type CollectionConfig } from "payload";
import { pageContentSchema } from "@/contracts/cms-site-page";
import { withPresentationPolicy } from "./presentation-policy";
import { assertResourceFilesApproved, resourceAttachmentIds, stabilizeResourceIds } from "@/services/resource-files";

export const SitePages: CollectionConfig = withPresentationPolicy({
  slug: "site-pages",
  labels: { singular: "官网页面", plural: "官网页面" },
  admin: { useAsTitle: "internalTitle", group: "官网内容", defaultColumns: ["internalTitle", "route", "_status", "updatedAt"], description: "管理套用离婚陪伴模板的页面。首页与两项专用服务仍使用各自编辑入口。" },
  fields: [
    { name: "internalTitle", label: "页面名称", type: "text", required: true },
    { name: "route", label: "页面路径", type: "text", required: true, unique: true, index: true, access: { update: () => false }, admin: { position: "sidebar", description: "路径来自官网页面清单，不在后台新建路由。" } },
    { name: "anchorPrefix", label: "章节前缀", type: "text", required: true, access: { update: () => false }, admin: { readOnly: true, position: "sidebar" } },
    { name: "title", label: "首屏标题", type: "textarea", required: true },
    { name: "description", label: "首屏介绍", type: "textarea", required: true },
    { name: "image", label: "更换首屏图片", type: "relationship", relationTo: "media", filterOptions: { and: [{ publicApproved: { equals: true } }, { mimeType: { contains: "image/" } }] } },
    { name: "originalImage", label: "现有首屏图片", type: "json", required: true, admin: { hidden: true } },
    { name: "content", label: "页面正文", type: "json", required: true, admin: { components: { Field: "@/admin/components/SiteContentField#SiteContentField" } }, validate: value => pageContentSchema.safeParse(value).success || "章节内容不完整，或链接／表格格式不正确。" },
    { name: "booking", label: "预约联系方式", type: "group", admin: { condition: data => data.route === "/book-consultation/" }, fields: [
      { name: "phone", label: "联系电话", type: "text" }, { name: "wechat", label: "微信说明", type: "text" }, { name: "questionnaire", label: "外部预约问卷链接（可选）", type: "text" },
    ] },
  ],
  hooks: { beforeValidate: [({ data, originalDoc }) => {
    const content = pageContentSchema.safeParse(data?.content);
    if (data && content.success) data.content = stabilizeResourceIds(content.data, pageContentSchema.safeParse(originalDoc?.content).data);
    return data;
  }], beforeChange: [async ({ data, originalDoc, req }) => {
    if (data._status !== "published") return data;
    const document = { ...originalDoc, ...data };
    const content = pageContentSchema.safeParse(document.content);
    if (!content.success) throw new APIError("正文格式不正确，请检查章节内容。", 400);
    const ids = resourceAttachmentIds(content.data);
    if (ids.length) {
      const files = await req.payload.find({ collection: "media", where: { id: { in: ids } }, pagination: false, depth: 0, req, overrideAccess: true });
      assertResourceFilesApproved(content.data, files.docs);
    }
    if (document.image) {
      const image = await req.payload.findByID({ collection: "media", id: typeof document.image === "object" ? document.image.id : document.image, req, overrideAccess: true });
      if (!image.publicApproved || !image.rightsConfirmed || !image.alt || !image.width || !image.height) throw new APIError("首屏图片需要完成授权、公开使用与替代文本确认。", 400);
    }
    return data;
  }] },
});
