import type { CollectionConfig } from "payload";
import { allServicePresentationFields } from "@/fields/presentation/service";
import { withPresentationPolicy } from "./presentation-policy";
import { APIError } from "payload";
import { projectService } from "@/services/cms-service-presentations";

export const ServicePresentations: CollectionConfig = withPresentationPolicy({
  slug: "service-presentations",
  labels: { singular: "服务页面", plural: "服务页面" },
  admin: { useAsTitle: "internalTitle", group: "官网内容", defaultColumns: ["internalTitle", "key", "_status", "updatedAt"], description: "管理官网已批准服务页面的文案、图片和行动入口；页面路径、结构与 SEO 由官网代码控制。" },
  fields: allServicePresentationFields,
  hooks: { beforeChange: [async ({ data, originalDoc, req }) => {
    if (data.key !== "high-conflict-divorce" || data._status !== "published") return data;
    const document = { ...originalDoc, ...data };
    const content = document.highConflict;
    if (!content?.hero || !content?.children) throw new APIError("请补全高冲突页面内容后再发布。", 400);
    const images = await Promise.all([content.hero.image, content.children.image].map(image => req.payload.findByID({ collection: "media", id: typeof image === "object" ? image.id : image, overrideAccess: true, req })));
    if (images.some(image => !image.publicApproved || !image.rightsConfirmed || !image.alt?.trim() || !image.width || !image.height || !image.mimeType?.startsWith("image/"))) throw new APIError("图片需要确认授权、允许公开使用、替代文本和有效尺寸。", 400);
    try { projectService({ ...document, highConflict: { ...content, hero: { ...content.hero, image: images[0] }, children: { ...content.children, image: images[1] } } }); }
    catch { throw new APIError("高冲突页面内容不符合官网合同，请检查列表数量、固定标识、链接和文字。", 400); }
    return data;
  }] },
});
