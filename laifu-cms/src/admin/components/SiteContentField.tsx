"use client";

import { useField } from "@payloadcms/ui";
import type { JSONFieldClientComponent } from "payload";
import { useRef } from "react";
import type { CatalogBlock } from "@/contracts/page-content";
import { ResourceCatalogEditor } from "./ResourceCatalogEditor";

type Value = string | number | boolean | null | Value[] | { [key: string]: Value };
const labels: Record<string, string> = { intro: "开篇说明", sections: "正文章节", title: "标题", subtitle: "副标题", blocks: "内容", text: "正文", summary: "摘要／问题", actions: "按钮", label: "显示文字", href: "链接地址", items: "条目", headers: "表头", rows: "表格内容", cta: "页尾引导", body: "说明", value: "内容", stage: "阶段", duration: "预计分钟数" };
const fixedKeys = new Set(["sourceSheet", "id", "kind", "mode", "columns", "collapsible"]);
function replace(value: Value, path: (string | number)[], next: Value): Value {
  if (!path.length) return next;
  const [key, ...rest] = path;
  if (Array.isArray(value)) return value.map((item, index) => index === key ? replace(item, rest, next) : item);
  if (value && typeof value === "object") return { ...value, [key]: replace(value[key], rest, next) };
  return value;
}
function Editor({ value, path, label, onChange }: { value: Value; path: (string | number)[]; label: string; onChange: (path: (string | number)[], next: Value) => void }) {
  if (value && typeof value === "object" && !Array.isArray(value) && value.kind === "catalog") return <ResourceCatalogEditor block={value as unknown as CatalogBlock} onChange={next => onChange(path, next)} />;
  if (typeof value === "string") return <label style={{ display: "grid", gap: 6, marginBottom: 16 }}><span>{label}</span><textarea aria-label={label} value={value} rows={label.includes("链接") ? 1 : Math.min(10, Math.max(2, value.split("\n").length))} onChange={event => onChange(path, event.target.value)} style={{ width: "100%", padding: 12, color: "var(--theme-text)", background: "var(--theme-input-bg)", border: "1px solid var(--theme-elevation-200)", borderRadius: 4, font: "inherit", resize: "vertical" }} /></label>;
  if (value === null || typeof value !== "object") return null;
  if (Array.isArray(value)) return <div>{value.map((item, index) => {
    const heading = item && typeof item === "object" && !Array.isArray(item) ? item.kind === "catalog" ? "资源列表（上传与管理）" : String(item.title ?? item.summary ?? item.label ?? `${label} ${index + 1}`).split("\n")[0] : `${label} ${index + 1}`;
    return typeof item === "string" ? <Editor key={index} value={item} path={[...path, index]} label={heading} onChange={onChange} /> : <details key={index} style={{ border: "1px solid var(--theme-elevation-200)", borderRadius: 4, padding: 16, marginBottom: 12 }}><summary style={{ cursor: "pointer", fontWeight: 600 }}>{heading}</summary><div style={{ paddingTop: 18 }}><Editor value={item} path={[...path, index]} label={label} onChange={onChange} /></div></details>;
  })}</div>;
  return <div>{Object.entries(value).filter(([key]) => !fixedKeys.has(key)).map(([key, item]) => <div key={key}>{typeof item === "object" && item !== null ? <h4 style={{ margin: "20px 0 12px" }}>{labels[key] ?? key}</h4> : null}<Editor value={item} path={[...path, key]} label={labels[key] ?? key} onChange={onChange} /></div>)}</div>;
}
export const SiteContentField: JSONFieldClientComponent = ({ path }) => {
  const { value, setValue, errorMessage } = useField<Value>({ path });
  const current = useRef(value);
  current.current = value;
  return <div className="field-type"><h3>页面正文</h3><p>展开章节修改文案、表格和链接。章节结构沿用官网模板；保存草稿后可预览桌面与手机效果。</p>{value ? <Editor value={value} path={[]} label="正文" onChange={(keys, next) => setValue(replace(current.current, keys, next))} /> : <p>请先导入页面初始内容。</p>}{errorMessage ? <p role="alert">{errorMessage}</p> : null}</div>;
};
