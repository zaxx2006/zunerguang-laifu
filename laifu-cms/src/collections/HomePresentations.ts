import { APIError, type CollectionConfig } from "payload";
import { homePresentationFields } from "@/fields/presentation/home";
import { withPresentationPolicy } from "./presentation-policy";
import { publishedReaderResources, validateHomeResources } from "@/services/reader-resources";

export const HomePresentations: CollectionConfig = withPresentationPolicy({
  slug: "home-presentations",
  labels: { singular: "首页呈现", plural: "首页呈现" },
  admin: { useAsTitle: "internalTitle", group: "官网内容", defaultColumns: ["internalTitle", "_status", "updatedAt"], description: "管理首页各固定区块的文案、图片、入口与展示顺序。页面结构和交互由前端代码控制。" },
  fields: homePresentationFields,
  hooks: { beforeChange: [async ({ data, originalDoc, req }) => {
    if (data._status !== "published") return data;
    const items = (data.guides ?? originalDoc?.guides)?.items ?? [];
    const error = validateHomeResources(items, await publishedReaderResources(req.payload));
    if (error) throw new APIError(error, 400);
    return data;
  }] },
});
