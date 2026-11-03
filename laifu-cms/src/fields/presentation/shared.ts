import type { Field, Validate } from "payload";

export const internalPath: Validate<string> = value => typeof value === "string" && /^(?:\/(?!\/)|#)/.test(value) ? true : "必须使用以 / 或 # 开头的站内路径";
const actionHref: Validate<string> = value => typeof value === "string" && (/^\/(?!\/)/.test(value) || /^#[A-Za-z][\w:-]*$/.test(value) || /^https:\/\//.test(value)) ? true : "必须使用站内路径、首页锚点或 HTTPS 地址";

export function actionFields(): Field[] {
  return [
    { name: "label", label: "按钮文字", type: "text", required: true },
    { name: "href", label: "链接", type: "text", required: true, validate: actionHref },
    { name: "openInNewTab", label: "在新窗口打开", type: "checkbox", required: true, defaultValue: false }
  ];
}

export function lineFields(label = "文字"): Field[] {
  return [{ name: "value", label, type: "text", required: true }];
}

export function navigationLinkFields(): Field[] {
  return [
    { name: "label", label: "链接文字", type: "text", required: true },
    { name: "note", label: "简短说明", type: "text", required: true },
    { name: "href", label: "站内路径", type: "text", required: true, validate: internalPath }
  ];
}
