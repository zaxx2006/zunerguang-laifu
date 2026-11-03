import type { CollectionConfig } from "payload";
import { pagePresentationFields } from "@/fields/presentation/page";
import { withPresentationPolicy } from "./presentation-policy";

export const PagePresentations: CollectionConfig = withPresentationPolicy({
  slug: "page-presentations",
  labels: { singular: "页面呈现", plural: "全部页面" },
  admin: { hidden: true, useAsTitle: "internalTitle", group: "官网呈现", defaultColumns: ["internalTitle", "route", "_status", "updatedAt"], listSearchableFields: ["internalTitle", "route"], description: "保留的交接兼容集合，不用于 Laifu 首页。" },
  fields: pagePresentationFields
});
