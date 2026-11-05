import { highConflictFields } from "./high-conflict";
import type { Field } from "payload";
import { actionFields, lineFields } from "./shared";

const directionOptions = [
  { label: "情绪与决策", value: "emotional" },
  { label: "沟通与准备", value: "preparation" },
  { label: "生活与重建", value: "rebuilding" },
];

function mediaField(name: string, label: string): Field {
  return { name, label, type: "relationship", relationTo: "media", required: true, filterOptions: { and: [{ publicApproved: { equals: true } }, { mimeType: { contains: "image/" } }] } };
}

function textList(name: string, label: string, minRows: number, maxRows: number, itemLabel = "内容"): Field {
  return { name, label, type: "array", required: true, minRows, maxRows, fields: lineFields(itemLabel) };
}

export const servicePresentationFields: Field[] = [
  { name: "internalTitle", label: "内部名称", type: "text", required: true },
  { name: "key", label: "服务页面", type: "select", required: true, unique: true, index: true, options: [{ label: "离婚陪伴辅导", value: "divorce-coaching" }, { label: "高冲突婚姻专项支持", value: "high-conflict-divorce" }], admin: { position: "sidebar", description: "页面路径由官网 Route Registry 决定。" }, access: { update: () => false } },
  { name: "hero", label: "首屏", type: "group", fields: [
    textList("statementLines", "主张", 1, 3, "主张行"),
    { name: "audience", label: "引导语", type: "textarea", required: true },
    { name: "context", label: "陪伴说明", type: "textarea", required: true },
    mediaField("image", "首屏图片"),
    { name: "caption", label: "图片说明", type: "text", required: true, admin: { hidden: true } },
    { name: "primaryAction", label: "主要行动", type: "group", fields: actionFields() },
    { name: "secondaryAction", label: "次要行动", type: "group", fields: actionFields() },
  ] },
  { name: "fit", label: "适合谁", type: "group", fields: [
    { name: "title", label: "标题", type: "text", required: true, admin: { hidden: true } },
    { ...textList("introLines", "说明", 1, 2, "说明行"), admin: { hidden: true } },
    textList("overview", "典型困境", 1, 10),
    { name: "note", label: "阶段选择提示", type: "textarea", required: true },
    { name: "stages", label: "四个阶段", type: "array", required: true, minRows: 4, maxRows: 4, admin: { initCollapsed: true }, fields: [
      { name: "key", label: "阶段标识", type: "text", required: true },
      { name: "label", label: "阶段标签", type: "text", required: true },
      { name: "title", label: "标题", type: "text", required: true },
      { name: "description", label: "处境说明", type: "textarea", required: true },
      textList("concerns", "关注问题", 1, 4),
      { name: "support", label: "支持说明", type: "textarea", required: true },
      { name: "supportDirection", label: "对应支持方向", type: "select", enumName: "service_fit_direction", required: true, options: directionOptions },
    ] },
  ] },
  { name: "why", label: "为什么需要陪伴", type: "group", fields: [
    { name: "title", label: "标题", type: "text", required: true },
    { name: "statement", label: "核心主张", type: "textarea", required: true },
    textList("paragraphs", "说明段落", 1, 5, "段落"),
  ] },
  { name: "support", label: "怎样帮助", type: "group", fields: [
    { name: "title", label: "标题", type: "text", required: true },
    textList("introLines", "说明", 1, 2, "说明行"),
    { name: "directions", label: "三类支持", type: "array", required: true, minRows: 3, maxRows: 3, admin: { initCollapsed: true }, fields: [
      { name: "key", label: "方向标识", type: "select", required: true, options: directionOptions },
      { name: "label", label: "标签", type: "text", required: true },
      { name: "title", label: "标题", type: "text", required: true },
      { name: "description", label: "说明", type: "textarea", required: true },
      mediaField("image", "图片"),
      { name: "caption", label: "图片说明", type: "text", required: true, admin: { hidden: true } },
      { name: "topics", label: "支持主题", type: "array", required: true, minRows: 1, maxRows: 3, fields: [
        { name: "key", label: "主题标识", type: "text", required: true },
        { name: "title", label: "标题", type: "text", required: true },
        { name: "body", label: "正文", type: "textarea", required: true },
      ] },
    ] },
    { name: "reflections", label: "情绪梳理示意", type: "array", required: true, minRows: 4, maxRows: 4, admin: { initCollapsed: true }, fields: [
      { name: "key", label: "标识", type: "text", required: true }, { name: "label", label: "标签", type: "text", required: true }, { name: "title", label: "问题", type: "text", required: true }, { name: "text", label: "说明", type: "textarea", required: true },
    ] },
    { name: "documents", label: "材料整理示意", type: "array", required: true, minRows: 3, maxRows: 3, admin: { initCollapsed: true }, fields: [
      { name: "key", label: "标识", type: "text", required: true }, { name: "title", label: "标题", type: "text", required: true },
      { name: "rows", label: "三行内容", type: "array", required: true, minRows: 3, maxRows: 3, fields: [{ name: "label", label: "标签", type: "text", required: true }, { name: "text", label: "说明", type: "text", required: true }] },
    ] },
    { name: "lifeAreas", label: "生活安排示意", type: "array", required: true, minRows: 4, maxRows: 4, admin: { initCollapsed: true }, fields: [
      { name: "key", label: "标识", type: "text", required: true }, { name: "label", label: "标签", type: "text", required: true }, { name: "text", label: "说明", type: "textarea", required: true },
    ] },
  ] },
  { name: "process", label: "辅导流程", type: "group", fields: [
    { name: "title", label: "标题", type: "text", required: true },
    { name: "intro", label: "说明", type: "textarea", required: true },
    { name: "steps", label: "三个步骤", type: "array", required: true, minRows: 3, maxRows: 3, admin: { initCollapsed: true }, fields: [
      { name: "key", label: "标识", type: "text", required: true }, { name: "label", label: "步骤名称", type: "text", required: true }, { name: "short", label: "步骤摘要", type: "textarea", required: true },
      { name: "intro", label: "详细说明", type: "textarea", required: true }, textList("focus", "工作重点", 1, 4), { name: "goal", label: "阶段目标", type: "textarea", required: true },
      { name: "mapTitle", label: "示意标题", type: "text", required: true }, textList("mapItems", "示意节点", 3, 3), { name: "mapEnd", label: "示意结果", type: "text", required: true },
    ] },
    { name: "modulesTitle", label: "模块标题", type: "text", required: true },
    { name: "modules", label: "辅导模块", type: "array", required: true, minRows: 1, maxRows: 6, fields: [{ name: "title", label: "标题", type: "text", required: true }, { name: "text", label: "说明", type: "textarea", required: true }] },
    { name: "note", label: "流程说明", type: "textarea", required: true },
  ] },
  { name: "options", label: "支持方式", type: "group", fields: [
    { name: "title", label: "标题", type: "text", required: true }, { name: "intro", label: "说明", type: "textarea", required: true, admin: { hidden: true } }, { ...textList("choices", "可选方式", 1, 8), admin: { hidden: true } }, textList("closingLines", "正文", 1, 3, "段落"), { name: "action", label: "行动", type: "group", admin: { hidden: true }, fields: actionFields() },
  ] },
  { name: "comparison", label: "专业分工", type: "group", fields: [
    { name: "title", label: "标题", type: "text", required: true }, { name: "intro", label: "说明", type: "textarea", required: true }, { name: "caption", label: "表格说明", type: "text", required: true }, textList("headers", "表头", 4, 4),
    { name: "rows", label: "对比内容", type: "array", required: true, minRows: 1, maxRows: 8, fields: [{ name: "dimension", label: "对比维度", type: "text", required: true }, { name: "therapy", label: "心理咨询", type: "textarea", required: true }, { name: "coaching", label: "离婚陪伴辅导", type: "textarea", required: true }, { name: "legal", label: "律师服务", type: "textarea", required: true }] },
  ] },
  { name: "outcomes", label: "可能获得的改变", type: "group", fields: [
    { name: "title", label: "标题", type: "text", required: true }, { name: "intro", label: "说明", type: "textarea", required: true }, textList("items", "改变列表", 1, 10), { name: "closing", label: "结尾说明", type: "textarea", required: true },
  ] },
  { name: "boundaries", label: "服务边界", type: "group", admin: { hidden: true }, fields: [
    { name: "title", label: "标题", type: "text", required: true }, { name: "intro", label: "说明", type: "textarea", required: true },
    { name: "items", label: "三项边界", type: "array", required: true, minRows: 3, maxRows: 3, fields: [{ name: "title", label: "标题", type: "text", required: true }, { name: "body", label: "说明", type: "textarea", required: true }] },
    { name: "closing", label: "结尾说明", type: "textarea", required: true },
  ] },
  { name: "finalCta", label: "页尾邀请", type: "group", admin: { description: "此页面单独设置邀请标题；正文、按钮和测评说明沿用首页的统一页尾。" }, fields: [
    { name: "title", label: "标题", type: "text", required: true }, { ...textList("descriptionLines", "说明", 1, 2, "说明行"), admin: { hidden: true } }, { name: "actions", label: "行动入口", type: "array", required: true, minRows: 3, maxRows: 3, admin: { hidden: true }, fields: actionFields() }, { name: "assessmentNote", label: "测评说明", type: "text", required: true, admin: { hidden: true } },
  ] },
];

export const allServicePresentationFields: Field[] = [...servicePresentationFields.map(field => {
  if ("name" in field && !["key", "internalTitle"].includes(field.name)) field.admin = { ...field.admin, condition: data => data.key === "divorce-coaching" };
  return field;
}), highConflictFields(), { name: "sharedInvitation", type: "ui", admin: { components: { Field: "@/admin/components/SharedInvitation#SharedInvitation" } } }];
