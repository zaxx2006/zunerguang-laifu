import type { Field } from "payload";
import { actionFields } from "./shared";

export const navigationFields: Field[] = [
  { name: "internalTitle", label: "内部名称", type: "text", required: true, defaultValue: "焕屿主导航与页脚" },
  { name: "key", type: "text", required: true, unique: true, index: true, defaultValue: "primary", admin: { hidden: true }, access: { update: () => false } },
  { name: "homeHref", label: "Logo 首页链接", type: "text", required: true, defaultValue: "#home" },
  { name: "primaryLinks", label: "页头导航", type: "array", required: true, minRows: 1, maxRows: 6, fields: actionFields() },
  { name: "assessmentAction", label: "页头测评入口", type: "group", fields: actionFields() },
  { name: "footerColumns", label: "页脚栏目", type: "array", required: true, minRows: 4, maxRows: 6, fields: [
    { name: "title", label: "栏目标题", type: "text", required: true },
    { name: "links", label: "链接", type: "array", required: true, minRows: 1, maxRows: 6, fields: actionFields() },
  ] },
  { name: "footerStatement", label: "页脚品牌说明", type: "textarea", required: true },
  { name: "footerDisclaimer", label: "页脚免责声明", type: "textarea", required: true },
  { name: "copyright", label: "版权文字", type: "text", required: true },
];
