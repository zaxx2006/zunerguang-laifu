import type { Field } from "payload";
import { actionFields, internalPath } from "./shared";

function valueFields(): Field[] { return [{ name: "value", label: "内容", type: "textarea", required: true }]; }

export const pagePresentationFields: Field[] = [
  { name: "internalTitle", label: "内部名称", type: "text", required: true },
  { name: "route", label: "官网 Route", type: "text", required: true, unique: true, index: true, validate: internalPath, admin: { position: "sidebar", description: "来自官网 Route Registry，创建后不可修改。" }, access: { update: () => false } },
  { name: "eyebrow", label: "页头栏目", type: "text", required: true },
  { name: "title", label: "页面标题", type: "textarea", required: true },
  { name: "description", label: "页面摘要", type: "textarea", required: true },
  { name: "directAnswer", label: "直接答案", type: "textarea", required: true, admin: { description: "只允许使用已经批准的事实与证据边界。" } },
  {
    name: "sections",
    label: "正文章节",
    type: "array",
    required: true,
    minRows: 1,
    admin: { description: "章节 ID 与官网 Registry 对齐；可调整可见文案、表格、图注与显示状态。", initCollapsed: true },
    fields: [
      { name: "sourceId", label: "章节 ID", type: "text", required: true, admin: { position: "sidebar" } },
      { name: "visible", label: "公开显示", type: "checkbox", required: true, defaultValue: true, admin: { position: "sidebar" } },
      { name: "label", label: "章节标签", type: "text", required: true },
      { name: "title", label: "章节标题", type: "textarea", required: true },
      { name: "body", label: "正文段落", type: "array", required: true, minRows: 1, fields: valueFields() },
      { name: "points", label: "要点", type: "array", fields: valueFields() },
      { name: "tableColumns", label: "表格列名", type: "array", fields: valueFields() },
      { name: "tableRows", label: "表格行", type: "array", fields: [{ name: "cells", label: "单元格", type: "array", required: true, minRows: 1, fields: valueFields() }] },
      { name: "visualAlt", label: "图片替代文本", type: "textarea" },
      { name: "visualCaption", label: "图片说明", type: "textarea" },
      { name: "visualDetails", label: "图片长描述", type: "array", fields: valueFields() },
      { name: "visualDataLabel", label: "数据下载文字", type: "text" }
    ]
  },
  { name: "related", label: "相关页面呈现", type: "array", admin: { initCollapsed: true }, fields: [{ name: "href", label: "官网 Route", type: "text", required: true, validate: internalPath }, { name: "label", label: "链接标题", type: "text", required: true }, { name: "note", label: "链接说明", type: "textarea", required: true }] },
  { name: "cta", label: "页面末尾行动", type: "group", fields: [{ name: "title", label: "行动标题", type: "textarea", required: true }, ...actionFields()] }
];
