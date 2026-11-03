"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { readerFormat, type ReaderResource } from "@/contracts/resource-reader";
import { openDocument, type ReaderBook } from "./document-content";
import { mountReader, type ReaderEngine, type ReaderState } from "./reader-engine";
import "../home/home-design-tokens.css";
import "./reader.css";

export function DocumentReader({ resource, embedded }: { resource: ReaderResource; embedded: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const engine = useRef<ReaderEngine | null>(null);
  const progress = useRef(0);
  const currentPage = useRef(1);
  const pageStep = useRef(1);
  const [book, setBook] = useState<ReaderBook | null>(null);
  const [state, setState] = useState<ReaderState>({ page: 1, count: 0, step: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const [jump, setJump] = useState("");
  const fileURL = `/api/resources/${encodeURIComponent(resource.id)}/`;
  useEffect(() => {
    const controller = new AbortController();
    let opened: ReaderBook | null = null;
    setLoading(true);
    setError("");
    setBook(null);
    progress.current = 0;
    (async () => {
      const response = await fetch(fileURL, { signal: controller.signal, cache: "no-store" });
      if (!response.ok) {
        const data = await response.json().catch(() => null) as { error?: string } | null;
        throw new Error(data?.error || "文件读取失败，请稍后重试。");
      }
      const buffer = await response.arrayBuffer();
      if (buffer.byteLength > 25 * 1024 * 1024) throw new Error("文件超过 25MB，请联系运营人员压缩后重新上传。");
      if (controller.signal.aborted) return;
      const format = readerFormat(resource.file);
      if (!format) throw new Error("这份文件尚不支持在线阅读。");
      opened = await openDocument(buffer, format);
      if (controller.signal.aborted) { opened.dispose(); return; }
      setBook(opened);
    })().catch(error => { if (!controller.signal.aborted) { setLoading(false); setError(error instanceof Error ? error.message : "文件解析失败，请检查文件是否完整。"); } });
    return () => { controller.abort(); engine.current?.destroy(); engine.current = null; opened?.dispose(); };
  }, [fileURL, resource.file, retry]);
  useEffect(() => {
    const element = host.current;
    if (!book || !element) return;
    let disposed = false;
    let generation = 0;
    let timeout: ReturnType<typeof setTimeout>;
    let previousSize = "";
    let layoutController: AbortController | null = null;
    async function layout() {
      if (disposed || !element) return;
      const size = `${element.clientWidth}:${element.clientHeight}`;
      if (size === previousSize || !element.clientWidth || !element.clientHeight) return;
      previousSize = size;
      const revision = ++generation;
      layoutController?.abort();
      layoutController = new AbortController();
      engine.current?.destroy();
      engine.current = null;
      try {
        const animated = embedded && !matchMedia("(prefers-reduced-motion: reduce)").matches;
        const next = await mountReader(element, book!, animated, next => {
          if (disposed || revision !== generation) return;
          progress.current = (next.page - 1) / next.count;
          currentPage.current = next.page;
          pageStep.current = next.step;
          setState(next);
          setJump(String(next.page));
        }, message => { if (!disposed) setError(message); }, progress.current, layoutController.signal);
        if (disposed || revision !== generation) { next.destroy(); return; }
        engine.current = next;
        setLoading(false);
      } catch (error) {
        if (!disposed && revision === generation) { setLoading(false); setError(error instanceof Error ? error.message : "阅读器排版失败，请重新加载。"); }
      }
    }
    const observer = new ResizeObserver(() => { clearTimeout(timeout); timeout = setTimeout(() => { void layout(); }, 150); });
    observer.observe(element);
    void layout();
    return () => { disposed = true; generation++; layoutController?.abort(); clearTimeout(timeout); observer.disconnect(); engine.current?.destroy(); engine.current = null; };
  }, [book, embedded]);
  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      if (embedded && event.key === "Escape") { window.parent.postMessage("huanyu-reader-close", location.origin); return; }
      if ((event.target as HTMLElement).closest("input, select, textarea, button, a")) return;
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); engine.current?.goTo(currentPage.current - 1 + (event.key === "ArrowRight" ? pageStep.current : -pageStep.current)); }
    };
    window.addEventListener("keydown", keydown);
    return () => window.removeEventListener("keydown", keydown);
  }, [embedded]);
  return <main id="main-content" className={`home-preview resource-reader${embedded ? " resource-reader--embedded" : ""}`}>
    <header className="resource-reader__header">
      {!embedded ? <a className="resource-reader__back" href="/resources/"><ArrowLeft aria-hidden="true" size={18} />资源中心</a> : null}
      <div className={embedded ? "reader-sr-only" : "resource-reader__title"}><h1>{resource.title}</h1><p>{readerFormat(resource.file)?.toUpperCase()} · 在线阅读</p></div>
      <a className="resource-reader__download" href={fileURL} download={resource.file.filename}><Download aria-hidden="true" size={18} />下载原文件</a>
    </header>
    <div className="resource-reader__stage" aria-busy={loading}>
      <div className="resource-reader__pages" ref={host} aria-label={`${resource.title}正文`} tabIndex={0} />
      {loading && !error ? <p className="resource-reader__message" role="status">正在读取并排版资源…</p> : null}
      {error ? <div className="resource-reader__message" role="alert"><p>{error}</p><button type="button" onClick={() => setRetry(value => value + 1)}>重新加载</button></div> : null}
    </div>
    <nav className="resource-reader__controls" aria-label="阅读翻页">
      <button type="button" aria-label="上一页" disabled={loading || Boolean(error) || state.page <= 1} onClick={() => engine.current?.goTo(state.page - 1 - state.step)}><ChevronLeft aria-hidden="true" size={20} /><span>上一页</span></button>
      <form onSubmit={event => { event.preventDefault(); const page = Number(jump); if (Number.isInteger(page) && page >= 1 && page <= state.count) engine.current?.goTo(page - 1); }}>
        <label><span className="reader-sr-only">跳转到页码</span><input type="number" min={1} max={state.count || 1} value={jump} disabled={loading || Boolean(error)} onChange={event => setJump(event.target.value)} aria-label="跳转到页码" /></label>
        <span role="status" aria-live="polite">{state.step === 2 ? `–${Math.min(state.count, state.page + 1)} ` : ""}/ {state.count || "…"} 页</span><button type="submit" disabled={loading || Boolean(error)}>跳转</button>
      </form>
      <button type="button" aria-label="下一页" disabled={loading || Boolean(error) || state.page + state.step > state.count} onClick={() => engine.current?.goTo(state.page - 1 + state.step)}><span>下一页</span><ChevronRight aria-hidden="true" size={20} /></button>
    </nav>
  </main>;
}
