import type { ReaderBook } from "./document-content";
import type { RenderTask } from "pdfjs-dist";

type FlipBook = {
  loadFromHTML: (pages: NodeListOf<HTMLElement>) => void;
  on: (name: string, callback: (event: { data: number }) => void) => void;
  flip: (index: number) => void;
  turnToPage: (index: number) => void;
  getCurrentPageIndex: () => number;
  destroy: () => void;
};
type FlipConstructor = new (host: HTMLElement, options: Record<string, string | number | boolean>) => FlipBook;
export type ReaderEngine = { goTo: (index: number) => void; destroy: () => void };
export type ReaderState = { page: number; count: number; step: number };

async function pageFlip(): Promise<FlipConstructor> {
  const browser = window as unknown as { St?: { PageFlip: FlipConstructor } };
  if (browser.St) return browser.St.PageFlip;
  await new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "/home-preview/page-flip.browser.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("翻页组件加载失败，请重新打开阅读器。"));
    document.head.append(script);
  });
  const loaded = (window as unknown as { St?: { PageFlip: FlipConstructor } }).St;
  if (!loaded) throw new Error("翻页组件未能启动。");
  return loaded.PageFlip;
}

export async function mountReader(host: HTMLElement, book: ReaderBook, animated: boolean, onState: (state: ReaderState) => void, onError: (message: string) => void, initialProgress = 0, signal?: AbortSignal): Promise<ReaderEngine> {
  const spread = animated && host.clientWidth >= 760;
  const width = Math.floor(Math.min(animated ? 620 : 760, (host.clientWidth - 16) / (spread ? 2 : 1)));
  const height = Math.max(160, Math.floor(host.clientHeight - 12));
  const gap = 40;
  let count = book.kind === "pdf" ? book.document.numPages : 1;
  let current = 0;
  let disposed = false;
  let flip: FlipBook | null = null;
  let columns: HTMLDivElement | null = null;
  const rendered = new Map<number, HTMLElement>();
  const rendering = new Map<number, RenderTask>();
  const master = document.createElement("div");
  host.replaceChildren();
  if (book.kind === "html") {
    master.className = "reader-columns";
    Object.assign(master.style, { width: `${width}px`, height: `${height}px`, columnWidth: `${width}px`, columnGap: `${gap}px` });
    master.innerHTML = book.html;
    master.style.visibility = "hidden";
    host.append(master);
    await Promise.all(Array.from(master.querySelectorAll("img"), image => image.decode().catch(() => {})));
    await document.fonts.ready;
    if (signal?.aborted) { master.remove(); signal.throwIfAborted(); }
    count = Math.max(1, Math.ceil((master.scrollWidth + gap) / (width + gap)));
    master.remove();
    master.style.visibility = "";
  }
  if (count > 600) throw new Error("资源分页超过 600 页，请将内容拆分成多个资源。");
  animated = animated && count > 1;
  const container = document.createElement("div");
  const accessible = document.createElement("article");
  if (animated && book.kind === "html") {
    accessible.className = "reader-sr-only";
    accessible.setAttribute("aria-label", "资源完整正文");
    accessible.textContent = master.textContent;
    host.append(accessible);
  }
  container.className = animated ? "reader-flipbook" : "reader-window";
  if (!animated) Object.assign(container.style, { width: `${width}px`, height: `${height}px` });
  host.append(container);
  function notify() { onState({ page: current + 1, count, step: animated && spread ? 2 : 1 }); }
  async function renderPDF(index: number, leaf: HTMLElement) {
    if (book.kind !== "pdf") return;
    const page = await book.document.getPage(index + 1);
    if (disposed || rendered.get(index) !== leaf) return;
    const original = page.getViewport({ scale: 1 });
    const scale = Math.min(width / original.width, height / original.height);
    const density = Math.min(devicePixelRatio || 1, 2);
    const viewport = page.getViewport({ scale: scale * density });
    const canvas = document.createElement("canvas");
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    canvas.style.width = `${viewport.width / density}px`;
    canvas.style.height = `${viewport.height / density}px`;
    canvas.setAttribute("aria-hidden", "true");
    const context = canvas.getContext("2d");
    if (!context) throw new Error("浏览器暂不支持 PDF 绘制。");
    leaf.replaceChildren(canvas);
    const task = page.render({ canvasContext: context, canvas, viewport });
    rendering.set(index, task);
    try { await task.promise; } catch (error) { if (!(error instanceof Error && error.name === "RenderingCancelledException")) throw error; }
    if (rendering.get(index) === task) rendering.delete(index);
    if (disposed || rendered.get(index) !== leaf) return;
    const text = await page.getTextContent();
    if (disposed || rendered.get(index) !== leaf) return;
    const accessible = document.createElement("div");
    accessible.className = "reader-sr-only";
    accessible.textContent = text.items.flatMap(item => "str" in item ? [item.str] : []).join(" ");
    leaf.append(accessible);
  }
  function fill(index: number, leaf: HTMLElement) {
    if (rendered.has(index)) return;
    rendered.set(index, leaf);
    leaf.setAttribute("aria-label", `第 ${index + 1} 页`);
    if (book.kind === "html") {
      const window = document.createElement("div");
      window.className = "reader-window";
      const copy = master.cloneNode(true) as HTMLElement;
      copy.setAttribute("aria-hidden", "true");
      copy.style.transform = `translateX(${-index * (width + gap)}px)`;
      window.append(copy);
      leaf.append(window);
    } else void renderPDF(index, leaf).catch(error => { if (!disposed) onError(error instanceof Error ? error.message : "PDF 页面加载失败。"); });
  }
  function visible(index: number) {
    if (!animated) return;
    const leaves = Array.from(container.querySelectorAll<HTMLElement>(".reader-leaf"));
    for (let i = Math.max(0, index - 2); i <= Math.min(count - 1, index + 3); i++) fill(i, leaves[i]);
    for (const [i, leaf] of rendered) if (i < index - 2 || i > index + 3) {
      rendering.get(i)?.cancel();
      rendering.delete(i);
      leaf.replaceChildren();
      rendered.delete(i);
    }
  }
  function show(index: number) {
    current = Math.max(0, Math.min(count - 1, index));
    if (columns) columns.style.transform = `translateX(${-current * (width + gap)}px)`;
    else if (!animated) {
      for (const task of rendering.values()) task.cancel();
      rendering.clear();
      rendered.clear();
      container.replaceChildren();
      const leaf = document.createElement("article");
      leaf.className = "reader-leaf";
      container.append(leaf);
      fill(current, leaf);
    }
    notify();
  }
  if (animated) {
    const PageFlip = await pageFlip();
    if (signal?.aborted) { container.remove(); signal.throwIfAborted(); }
    for (let index = 0; index < count; index++) {
      const leaf = document.createElement("article");
      leaf.className = "reader-leaf";
      container.append(leaf);
    }
    flip = new PageFlip(container, { width, height, size: "fixed", showCover: false, usePortrait: !spread, drawShadow: true, maxShadowOpacity: .25, flippingTime: 650, showPageCorners: true, autoSize: true, mobileScrollSupport: true });
    flip.on("flip", event => { current = Math.min(count - 1, event.data); visible(current); notify(); });
    visible(0);
    flip.loadFromHTML(container.querySelectorAll(".reader-leaf"));
    current = Math.min(count - 1, Math.floor(initialProgress * count));
    visible(current);
    flip.turnToPage(current);
  } else if (book.kind === "html") {
    columns = master;
    container.append(columns);
    show(Math.floor(initialProgress * count));
  } else show(Math.floor(initialProgress * count));
  notify();
  function goTo(index: number) {
    if (disposed) return;
    const target = Math.max(0, Math.min(count - 1, index));
    if (flip) { visible(target); flip.flip(target); }
    else show(target);
  }
  const anchorClick = (event: MouseEvent) => {
    const link = (event.target as HTMLElement).closest("a[href^='#']");
    if (!link || book.kind !== "html") return;
    event.preventDefault();
    const id = decodeURIComponent(link.getAttribute("href")!.slice(1));
    const target = master.querySelector<HTMLElement>(`[id="${CSS.escape(id)}"]`);
    if (!target) return;
    if (animated) { master.style.visibility = "hidden"; host.append(master); }
    const page = Math.floor((target.getBoundingClientRect().left - master.getBoundingClientRect().left) / (width + gap));
    if (animated) master.remove();
    master.style.visibility = "";
    goTo(page);
  };
  host.addEventListener("click", anchorClick);
  return { goTo, destroy: () => {
    disposed = true;
    for (const task of rendering.values()) task.cancel();
    host.removeEventListener("click", anchorClick);
    flip?.destroy();
    container.remove();
    master.remove();
    accessible.remove();
  } };
}
