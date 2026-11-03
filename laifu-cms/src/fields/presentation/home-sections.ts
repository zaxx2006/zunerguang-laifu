import type { Field } from "payload";

const sectionOptions = [
  { label: "03 / 断裂链", value: "failure" },
  { label: "04 / 三项服务", value: "services" },
  { label: "05 / 经营方法", value: "method" },
  { label: "06 / 证据系统", value: "evidence" },
  { label: "07 / 资格判断", value: "fit" },
  { label: "08 / 成效阶梯", value: "outcomes" },
  { label: "09 / 洞察", value: "insights" },
  { label: "10 / 末尾行动", value: "closing" }
];

function valueFields(): Field[] { return [{ name: "value", label: "内容", type: "textarea", required: true }]; }

export const homeSectionsField: Field = {
  name: "sections",
  label: "首页完整内容",
  type: "array",
  required: true,
  minRows: 8,
  maxRows: 8,
  admin: { description: "覆盖首页第 03–10 屏；每屏可编辑标题、说明、卡片、要点、引用与行动入口。" },
  fields: [
    { name: "key", label: "固定版块", type: "select", required: true, options: sectionOptions, admin: { position: "sidebar" } },
    { name: "eyebrowIndex", label: "序号", type: "text", required: true },
    { name: "eyebrowLabel", label: "栏目标识", type: "text", required: true },
    { name: "titleLines", label: "标题行", type: "array", required: true, minRows: 1, fields: valueFields() },
    { name: "description", label: "版块说明", type: "textarea", required: true },
    { name: "markers", label: "流程标记", type: "array", fields: valueFields() },
    {
      name: "items",
      label: "内容卡片",
      type: "array",
      fields: [
        { name: "sourceId", label: "固定 ID", type: "text", required: true },
        { name: "kicker", label: "卡片标识", type: "text" },
        { name: "title", label: "卡片标题", type: "textarea" },
        { name: "description", label: "卡片说明", type: "textarea" },
        { name: "detail", label: "补充信息", type: "textarea" },
        { name: "href", label: "站内路径", type: "text", validate: (value: unknown) => !value || /^\/(?!\/)/.test(String(value)) ? true : "必须使用以 / 开头的站内路径" },
        { name: "points", label: "要点", type: "array", fields: valueFields() }
      ]
    },
    { name: "quote", label: "引用", type: "group", fields: [{ name: "text", label: "引用正文", type: "textarea" }, { name: "attribution", label: "引用来源", type: "text" }] },
    { name: "action", label: "版块行动", type: "group", fields: [{ name: "label", label: "行动文字", type: "text" }, { name: "title", label: "行动标题", type: "textarea" }, { name: "href", label: "站内路径", type: "text", validate: (value: unknown) => !value || /^\/(?!\/)/.test(String(value)) ? true : "必须使用以 / 开头的站内路径" }] }
  ]
};
