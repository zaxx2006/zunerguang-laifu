"use client";

import { useEffect, useRef, useState } from "react";
import { resourceFormats, resourceStages, type CatalogBlock } from "@/contracts/page-content";
import { resourceId } from "@/contracts/resource-reader";
import styles from "./ResourceCatalogEditor.module.css";

type Item = CatalogBlock["items"][number];
type MediaOption = { id: number; filename: string; alt: string; publicApproved: boolean; rightsConfirmed: boolean };
const accept = ".pdf,.epub,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip,.mp3,.m4a,.wav,.ogg,.mp4,.webm,.jpg,.jpeg,.png,.webp";

function AttachmentEditor({ item, onChange }: { item: Item; onChange: (patch: Partial<Item>) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [source, setSource] = useState("");
  const [rights, setRights] = useState(false);
  const [publicApproved, setPublicApproved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [selected, setSelected] = useState<MediaOption | null>(null);
  const [options, setOptions] = useState<MediaOption[]>([]);
  const [query, setQuery] = useState("");
  useEffect(() => {
    if (!item.attachmentId) { setSelected(null); return; }
    const controller = new AbortController();
    fetch(`/api/media/${item.attachmentId}?depth=0`, { signal: controller.signal }).then(async response => {
      if (!response.ok) throw new Error("关联文件无法读取，请重新选择文件。");
      setSelected(await response.json() as MediaOption);
    }).catch(error => { if (!controller.signal.aborted) setError(error instanceof Error ? error.message : "文件读取失败"); });
    return () => controller.abort();
  }, [item.attachmentId]);
  async function findFiles() {
    setBusy(true);
    setError("");
    try {
      const params = new URLSearchParams({ limit: "50", sort: "-updatedAt", depth: "0" });
      if (query.trim()) params.set("where[filename][contains]", query.trim());
      const response = await fetch(`/api/media?${params}`);
      if (!response.ok) throw new Error("媒体库读取失败，请重试。");
      const data = await response.json() as { docs: MediaOption[] };
      setOptions(data.docs);
      setMessage(data.docs.length ? "请选择文件；列表最多显示最近的 50 项。" : "没有找到文件，可修改文件名搜索或上传新文件。");
    } catch (error) { setError(error instanceof Error ? error.message : "媒体库读取失败"); }
    finally { setBusy(false); }
  }
  async function upload() {
    if (!file || !item.title.trim()) { setError("请选择文件，并填写资源标题。"); return; }
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("_payload", JSON.stringify({ alt: item.title, sourceLabel: source.trim(), rightsConfirmed: rights, publicApproved }));
      const response = await fetch("/api/media", { method: "POST", body: form });
      const data = await response.json() as { doc?: MediaOption; errors?: { message?: string }[] };
      if (!response.ok || !data.doc) throw new Error(data.errors?.[0]?.message || "上传失败，请检查文件格式并重试。");
      setSelected(data.doc);
      onChange({ attachmentId: data.doc.id });
      setFile(null);
      setMessage("文件已上传并关联。请保存草稿，预览确认后再发布页面。");
    } catch (error) { setError(error instanceof Error ? error.message : "上传失败，请重试。"); }
    finally { setBusy(false); }
  }
  return <fieldset className={styles.attachment} disabled={busy}>
    <legend>资源文件</legend>
    {item.attachmentId ? <div><p>已关联：{selected?.filename ?? `文件 #${item.attachmentId}`}</p>{selected && !(selected.publicApproved && selected.rightsConfirmed) ? <p>该文件尚未完成公开授权，请在媒体资源中复核后再发布。</p> : null}<div className={styles.actions}><a href={`/admin/collections/media/${item.attachmentId}`} target="_blank" rel="noopener noreferrer">查看文件与授权</a><button type="button" onClick={() => { onChange({ attachmentId: undefined }); setMessage("已解除关联，媒体库中的原文件仍保留。"); }}>解除关联</button></div></div> : <p>尚未关联文件，前台将使用下方的链接地址。</p>}
    <details><summary>从媒体库选择</summary><div className={styles.fields}><label>文件名搜索<input value={query} onChange={event => setQuery(event.target.value)} /></label><button type="button" onClick={findFiles}>查找文件</button>{options.length ? <label>选择已有文件<select value={item.attachmentId ?? ""} onChange={event => { const id = Number(event.target.value); if (id) { onChange({ attachmentId: id }); setError(""); } }}><option value="">请选择文件</option>{options.map(option => <option value={option.id} key={option.id}>{option.filename} · {option.publicApproved && option.rightsConfirmed ? "已授权" : "待授权"}</option>)}</select></label> : null}</div></details>
    <details><summary>上传新文件</summary><div className={styles.fields}>
      <label>选择资源文件<input type="file" accept={accept} onChange={event => setFile(event.target.files?.[0] ?? null)} /></label>
      <p>支持 PDF、DOCX、EPUB、Word、Excel、PPT、TXT、CSV、ZIP、常用图片及音视频。</p>
      <label>来源名称（选填）<input value={source} onChange={event => setSource(event.target.value)} placeholder="例如：焕屿原创、已获授权的机构名称" /></label>
      <label className={styles.checkbox}><input type="checkbox" checked={rights} onChange={event => { setRights(event.target.checked); if (!event.target.checked) setPublicApproved(false); }} />已确认此文件的使用权</label>
      <label className={styles.checkbox}><input type="checkbox" checked={publicApproved} disabled={!rights} onChange={event => setPublicApproved(event.target.checked)} />允许公开使用此文件</label>
      <p>允许公开使用后，文件可通过链接访问；资源条目仍需发布页面才会展示。</p>
      <button type="button" disabled={!file || !item.title.trim()} onClick={upload}>上传并关联文件</button>
    </div></details>
    {busy ? <p role="status">正在处理文件，请稍候…</p> : null}
    {message ? <p role="status">{message}</p> : null}
    {error ? <p role="alert">{error}</p> : null}
  </fieldset>;
}

function ResourceItemEditor({ item, onChange }: { item: Item; onChange: (patch: Partial<Item>) => void }) {
  return <div className={styles.fields}>
    <label>资源标题<input value={item.title} onChange={event => onChange({ title: event.target.value })} /></label>
    <label>资源简介<textarea rows={3} value={item.summary} onChange={event => onChange({ summary: event.target.value })} /></label>
    <div className={styles.columns}><label>资源形式<select value={item.kind} onChange={event => onChange({ kind: event.target.value })}>{resourceFormats.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label><label>适用阶段<select value={item.stage} onChange={event => onChange({ stage: event.target.value })}>{resourceStages.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label></div>
    <label>预计用时（分钟，可选）<input type="number" min="1" value={item.duration ?? ""} onChange={event => onChange({ duration: event.target.value || null })} /></label>
    <AttachmentEditor item={item} onChange={onChange} />
    <label>链接地址（无附件时使用，可填写课程或自测链接）<input value={item.href} onChange={event => onChange({ href: event.target.value })} /></label>
  </div>;
}

export function ResourceCatalogEditor({ block, onChange }: { block: CatalogBlock; onChange: (block: CatalogBlock) => void }) {
  const current = useRef(block);
  current.current = block;
  return <div className={styles.editor}>
    <p>为资源填写介绍、选择分类，并上传或关联具体文件。未关联文件的条目仍使用原链接。</p>
    {block.items.map((item, index) => <details className={styles.item} key={index}><summary>{item.title || `新资源 ${index + 1}`}{item.attachmentId ? " · 已关联文件" : ""}</summary><ResourceItemEditor item={item} onChange={patch => onChange({ ...current.current, items: current.current.items.map((entry, position) => position === index ? { ...entry, id: resourceId(entry) ?? crypto.randomUUID(), ...patch } : entry) })} /></details>)}
    <button type="button" onClick={() => onChange({ ...block, items: [...block.items, { id: crypto.randomUUID(), title: "新资源", summary: "", kind: "guide", stage: "decision", duration: null, href: "/resources/" }] })}>新增资源</button>
  </div>;
}
