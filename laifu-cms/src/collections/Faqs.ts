import type { CollectionConfig } from "payload";
import { actionFields } from "@/fields/presentation/shared";
import { withPresentationPolicy } from "./presentation-policy";

export const Faqs: CollectionConfig = withPresentationPolicy({
  slug: "faqs",
  labels: { singular: "常见问题", plural: "常见问题" },
  admin: { useAsTitle: "question", group: "官网内容", defaultColumns: ["question", "_status", "updatedAt"], description: "首页会按首页呈现中选择的顺序展示五条问题。" },
  fields: [
    { name: "question", label: "问题", type: "text", required: true },
    { name: "lead", label: "简短回答", type: "text", required: true },
    { name: "answer", label: "完整回答", type: "textarea", required: true },
    { name: "contexts", label: "不同情境", type: "array", required: true, minRows: 1, maxRows: 3, fields: [
      { name: "label", label: "情境名称", type: "text", required: true }, { name: "copy", label: "说明", type: "textarea", required: true },
      { name: "hasAction", label: "显示链接", type: "checkbox", defaultValue: false },
      { name: "action", label: "链接", type: "group", admin: { condition: (_data, siblingData) => Boolean(siblingData?.hasAction) }, fields: actionFields() },
    ] },
    { name: "followups", label: "追问", type: "array", required: true, minRows: 1, maxRows: 3, fields: [
      { name: "question", label: "追问", type: "text", required: true }, { name: "answer", label: "回答", type: "textarea", required: true },
    ] },
  ],
});
