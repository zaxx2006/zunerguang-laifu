import type { Field, RelationshipField } from "payload";
import { actionFields, lineFields } from "./shared";

const mediaField = (name: string, label: string): RelationshipField => ({
  name, label, type: "relationship", relationTo: "media", required: true,
  filterOptions: { and: [{ publicApproved: { equals: true } }, { mimeType: { contains: "image/" } }] },
});

export const homePresentationFields: Field[] = [
  { name: "internalTitle", label: "内部名称", type: "text", required: true, defaultValue: "焕屿官网首页" },
  { name: "key", type: "text", required: true, unique: true, index: true, defaultValue: "home", admin: { hidden: true }, access: { update: () => false } },
  { name: "seo", label: "搜索与分享", type: "group", fields: [
    { name: "title", label: "页面标题", type: "text", required: true }, { name: "description", label: "页面描述", type: "textarea", required: true }, mediaField("shareImage", "分享图片"),
  ] },
  { name: "hero", label: "首屏", type: "group", fields: [
    { name: "titleLines", label: "标题", type: "array", required: true, minRows: 2, maxRows: 2, fields: lineFields("标题行") },
    { name: "introLines", label: "介绍", type: "array", required: true, minRows: 1, maxRows: 2, fields: lineFields("介绍行") },
    mediaField("image", "首屏图片"), { name: "searchPlaceholder", label: "问题搜索框提示", type: "text", required: true },
    { name: "primaryAction", label: "主要行动", type: "group", fields: actionFields() }, { name: "secondaryAction", label: "次要行动", type: "group", fields: actionFields() },
    { name: "journeyLinkLabel", label: "旅程入口文字", type: "text", required: true }, { name: "journeySummary", label: "旅程摘要", type: "text", required: true },
  ] },
  { name: "journey", label: "支持旅程", type: "group", fields: [
    { name: "openingTitle", label: "开场标题", type: "text", required: true },
    { name: "openingBodyLines", label: "开场说明", type: "array", required: true, minRows: 1, maxRows: 2, fields: lineFields("说明行") },
    { name: "stages", label: "五个阶段", type: "array", required: true, minRows: 5, maxRows: 5, fields: [
      { name: "key", label: "阶段标识", type: "select", required: true, options: ["stabilize", "clarify", "decide", "action", "followup"] },
      { name: "stepLabel", label: "阶段标签", type: "text", required: true },
      { name: "titleLines", label: "标题", type: "array", required: true, minRows: 1, maxRows: 2, fields: lineFields("标题行") },
      { name: "descriptionLines", label: "说明", type: "array", required: true, minRows: 1, maxRows: 2, fields: lineFields("说明行") },
      { name: "documentLabel", label: "清单标题", type: "text" },
      { name: "documentItems", label: "清单", type: "array", maxRows: 3, fields: [
        { name: "marker", label: "标记", type: "text", required: true }, { name: "text", label: "内容", type: "text", required: true }, { name: "note", label: "提示", type: "text", required: true },
      ] },
    ] }, { name: "caption", label: "品牌短句", type: "text", required: true },
  ] },
  { name: "services", label: "服务入口", type: "group", fields: [
    { name: "titleLines", label: "标题", type: "array", required: true, minRows: 2, maxRows: 2, fields: lineFields("标题行") },
    { name: "items", label: "五类服务", type: "array", required: true, minRows: 5, maxRows: 5, fields: [
      { name: "key", label: "服务标识", type: "select", required: true, options: ["coaching", "highConflict", "courses", "community", "academy"] },
      { name: "titleLines", label: "标题", type: "array", required: true, minRows: 1, maxRows: 2, fields: lineFields("标题行") },
      { name: "description", label: "说明", type: "textarea", required: true }, { name: "actionLabel", label: "链接文字", type: "text", required: true },
      { name: "href", label: "链接", type: "text", required: true }, mediaField("image", "图片"),
    ] }, { name: "captionLeft", label: "左侧短句", type: "text", required: true }, { name: "captionRight", label: "右侧短句", type: "text", required: true },
  ] },
  { name: "assessment", label: "状态自测", type: "group", fields: [
    { name: "titleLines", label: "标题", type: "array", required: true, minRows: 2, maxRows: 2, fields: lineFields("标题行") },
    { name: "descriptionLines", label: "说明", type: "array", required: true, minRows: 1, maxRows: 2, fields: lineFields("说明行") },
    { name: "action", label: "行动", type: "group", fields: actionFields() }, { name: "note", label: "体验说明", type: "textarea", required: true },
  ] },
  { name: "faqs", label: "首页常见问题", type: "relationship", relationTo: "faqs", hasMany: true, required: true, minRows: 5, maxRows: 5 },
  { name: "faqHeadingLines", label: "常见问题标题", type: "array", required: true, minRows: 2, maxRows: 2, fields: lineFields("标题行") },
  { name: "faqIndexAction", label: "全部问题入口", type: "group", fields: actionFields() }, { name: "faqContactAction", label: "咨询入口", type: "group", fields: actionFields() },
  { name: "guides", label: "免费指南", type: "group", fields: [
    { name: "titleLines", label: "标题", type: "array", required: true, minRows: 2, maxRows: 2, fields: lineFields("标题行") },
    { name: "description", label: "说明", type: "textarea", required: true },
    { name: "items", label: "首页展示资源（最多三个）", type: "array", maxRows: 3, fields: [
      { name: "href", label: "资源中心资源", type: "text", required: true, admin: { components: { Field: "@/admin/components/HomeResourceField#HomeResourceField" } } },
      { ...mediaField("image", "封面图片（选填）"), required: false },
      { name: "eyebrow", type: "text", admin: { hidden: true } },
      { name: "titleLines", type: "array", fields: lineFields("标题行"), admin: { hidden: true } },
      { name: "subtitleLines", type: "array", fields: lineFields("副标题行"), admin: { hidden: true } },
      { name: "meta", type: "text", admin: { hidden: true } },
    ] }, { name: "statusNote", label: "资源状态说明", type: "textarea", required: true }, { name: "indexAction", label: "资源中心入口", type: "group", fields: actionFields() },
  ] },
  { name: "invitation", label: "页尾邀请", type: "group", fields: [
    { name: "title", label: "标题", type: "text", required: true },
    { name: "descriptionLines", label: "说明", type: "array", required: true, minRows: 1, maxRows: 2, fields: lineFields("说明行") },
    { name: "actions", label: "行动入口", type: "array", required: true, minRows: 3, maxRows: 3, fields: actionFields() },
    { name: "assessmentNote", label: "测评说明", type: "text", required: true },
  ] },
];
