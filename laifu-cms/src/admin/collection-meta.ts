import type { CollectionConfig, Field } from "payload";
import { withPreview } from "./preview";

type CollectionMeta = { description: string; group: string; labels?: { singular: string; plural: string } };

const collectionMeta: Record<string, CollectionMeta> = {
  "site-pages": { group: "官网内容", labels: { singular: "官网页面", plural: "官网页面" }, description: "编辑页面正文、标题与适用的首屏图片，并预览当前官网效果。创始人页采用文字首屏；各页公共页尾在首页呈现中统一管理。" },
  "consultation-requests": { group: "官网内容", labels: { singular: "预约申请", plural: "预约申请" }, description: "查看官网预约申请与记录联系进度。" },
  "home-presentations": { group: "官网内容", labels: { singular: "首页呈现", plural: "首页呈现" }, description: "管理首页十个内容区与多设备预览。" },
  "service-presentations": { group: "官网内容", labels: { singular: "服务页面", plural: "服务页面" }, description: "编辑当前官网正在使用的服务文案、图片与入口。旧版未展示字段已隐藏，已有数据保留；公共页尾请前往首页呈现修改。" },
  faqs: { group: "官网内容", labels: { singular: "常见问题", plural: "常见问题" }, description: "管理首页常见问题及追问内容。" },
  navigation: { group: "官网内容", labels: { singular: "导航配置", plural: "导航配置" }, description: "管理公告、菜单、页头和页脚。" },
  media: { group: "官网内容", labels: { singular: "媒体资源", plural: "媒体资源" }, description: "上传图片、文档、表格、音视频和 ZIP 资源包，管理文件来源与使用授权。" },
  users: { group: "用户与权限", labels: { singular: "用户", plural: "用户管理" }, description: "管理后台账号、头像和角色。" },
  avatars: { group: "用户与权限", labels: { singular: "头像", plural: "头像" }, description: "管理后台账号头像。" },
  "publish-events": { group: "CMS 系统管理", labels: { singular: "发布事件", plural: "发布事件" }, description: "查看内容发布、撤回和构建钩子的投递状态。" },
  "audit-logs": { group: "CMS 系统管理", labels: { singular: "审计记录", plural: "审计记录" }, description: "查看内容创建、修改、发布和删除的操作记录。" }
};

const collectionOrder = ["home-presentations", "service-presentations", "site-pages", "consultation-requests", "faqs", "navigation", "media", "users", "avatars", "publish-events", "audit-logs"];
const bulkCollections = new Set(["faqs", "media", "users", "avatars"]);
const folderCollections = new Set(["media"]);
const groupableCollections = new Set(["media", "publish-events", "audit-logs"]);
const singletonCollections = new Set(["home-presentations", "navigation"]);
const trashCollections = new Set(["home-presentations", "faqs", "navigation", "media", "avatars"]);
const shadcnCheckboxField = "@/admin/components/ShadcnFields#ShadcnCheckboxField";
const shadcnSelectField = "@/admin/components/ShadcnFields#ShadcnSelectField";
const shadcnTextField = "@/admin/components/ShadcnFields#ShadcnTextField";
const shadcnTextareaField = "@/admin/components/ShadcnFields#ShadcnTextareaField";
export const shadcnListView = "@/admin/views/CollectionListView#CollectionListView";

function configureField(field: Field): Field {
  if (field.type === "array" || field.type === "collapsible" || field.type === "group" || field.type === "row") return { ...field, fields: field.fields.map(configureField) };
  if (field.type === "tabs") return { ...field, tabs: field.tabs.map((tab) => ({ ...tab, fields: tab.fields.map(configureField) })) };
  if (field.type === "blocks") return { ...field, blocks: field.blocks.map((block) => ({ ...block, fields: block.fields.map(configureField) })) };
  if (field.type === "checkbox") return { ...field, admin: { ...field.admin, components: { ...field.admin?.components, Field: field.admin?.components?.Field || shadcnCheckboxField } } };
  if (field.type === "select") return { ...field, admin: { ...field.admin, components: { ...field.admin?.components, Field: field.admin?.components?.Field || shadcnSelectField } } };
  if (field.type === "text" && !field.hasMany) return { ...field, admin: { ...field.admin, components: { ...field.admin?.components, Field: field.admin?.components?.Field || shadcnTextField } } };
  if (field.type === "textarea") return { ...field, admin: { ...field.admin, components: { ...field.admin?.components, Field: field.admin?.components?.Field || shadcnTextareaField } } };
  return field;
}

function enhanceCollection(collection: CollectionConfig): CollectionConfig {
  const meta = collectionMeta[collection.slug];
  const fields = collection.fields.map(configureField);
  const enableBulkActions = bulkCollections.has(collection.slug);
  const enhanced = {
    ...collection,
    fields,
    disableBulkDelete: !enableBulkActions,
    disableBulkEdit: !enableBulkActions,
    disableDuplicate: singletonCollections.has(collection.slug),
    enableQueryPresets: false,
    folders: folderCollections.has(collection.slug) ? { browseByFolder: true } : collection.folders,
    lockDocuments: { duration: 300000 },
    orderable: false,
    trash: trashCollections.has(collection.slug),
    admin: { ...collection.admin, components: { ...collection.admin?.components, views: { ...collection.admin?.components?.views, list: { ...collection.admin?.components?.views?.list, Component: shadcnListView } } }, enableListViewSelectAPI: enableBulkActions, enableRichTextLink: true, enableRichTextRelationship: true, groupBy: groupableCollections.has(collection.slug), pagination: { defaultLimit: 50, limits: [50, 100, 250] } }
  } satisfies CollectionConfig;
  if (!meta) return withPreview(enhanced);
  return withPreview({
    ...enhanced,
    labels: meta.labels || collection.labels,
    admin: { ...enhanced.admin, group: meta.group, description: meta.description }
  });
}

export function configureCollections(collections: CollectionConfig[]): CollectionConfig[] {
  return collections.map(enhanceCollection).sort((left, right) => collectionOrder.indexOf(left.slug) - collectionOrder.indexOf(right.slug));
}
