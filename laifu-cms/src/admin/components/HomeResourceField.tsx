"use client";

import { useEffect, useState } from "react";
import { useField } from "@payloadcms/ui";
import { readerHref, type ReaderResource } from "@/contracts/resource-reader";
import styles from "./ResourceCatalogEditor.module.css";

export function HomeResourceField({ path }: { path: string }) {
  const { value, setValue, errorMessage } = useField<string>({ path });
  const [resources, setResources] = useState<ReaderResource[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    fetch("/api/public/v1/laifu/resources", { signal: controller.signal, cache: "no-store" }).then(async response => {
      if (!response.ok) throw new Error("资源列表读取失败，请重试。");
      const data = await response.json() as { resources: ReaderResource[] };
      setResources(data.resources);
    }).catch(error => { if (!controller.signal.aborted) setError(error instanceof Error ? error.message : "资源列表读取失败"); }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [refresh]);
  return <div className={styles.editor}><div className={styles.fields}>
    <label>选择资源中心的资源<select value={value || ""} onChange={event => setValue(event.target.value)} disabled={loading} aria-invalid={Boolean(errorMessage)}>
      <option value="">{loading ? "正在读取资源…" : "请选择已发布的资源"}</option>
      {value && !resources.some(resource => readerHref(resource.id) === value) ? <option value={value}>原资源未关联或已下架，请重新选择</option> : null}
      {resources.map(resource => <option key={resource.id} value={readerHref(resource.id)}>{resource.title} · {resource.file.filename}</option>)}
    </select></label>
    <p>先在资源中心上传并发布 DOCX、PDF 或 EPUB 文件，再在这里选择。标题和正文随资源中心更新；可拖动本区块的资源调整展示顺序，最多三个。</p>
    <button type="button" onClick={() => setRefresh(value => value + 1)} disabled={loading}>刷新资源列表</button>
    {!loading && !error && !resources.length ? <p role="status">暂无可选资源，请先在资源中心上传文件、确认公开授权并发布页面。</p> : null}
    {error ? <p role="alert">{error}</p> : null}
    {errorMessage ? <p role="alert">{errorMessage}</p> : null}
  </div></div>;
}
