import type { CollectionConfig } from "payload";
import { navigationFields } from "@/fields/presentation/navigation";
import { withPresentationPolicy } from "./presentation-policy";

export const Navigation: CollectionConfig = withPresentationPolicy({
  slug: "navigation",
  labels: { singular: "导航呈现", plural: "导航呈现" },
  admin: { useAsTitle: "internalTitle", group: "官网内容", defaultColumns: ["internalTitle", "_status", "updatedAt"], description: "控制首页页头导航、测评入口和页脚内容。" },
  fields: navigationFields
});
