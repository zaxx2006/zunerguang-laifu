import DOMPurify from "dompurify";
import { strFromU8, unzipSync } from "fflate";
import type { ReaderFormat } from "@/contracts/resource-reader";
import type { PDFDocumentProxy } from "pdfjs-dist";

export type ReaderBook = { kind: "html"; html: string; dispose: () => void } | { kind: "pdf"; document: PDFDocumentProxy; dispose: () => void };

function checkArchive(data: Uint8Array) {
  let total = 0;
  let count = 0;
  unzipSync(data, { filter: file => {
    total += file.originalSize;
    if (++count > 3000 || total > 80 * 1024 * 1024 || file.originalSize > 25 * 1024 * 1024) throw new Error("文档解压后过大，请精简图片或拆分文档后重新上传。");
    return false;
  } });
}

function cleanDocument(html: string): DocumentFragment {
  const fragment = DOMPurify.sanitize(html, { USE_PROFILES: { html: true }, ALLOWED_URI_REGEXP: /^(?:(?:https|mailto|blob):|#|data:image\/(?:png|jpeg|gif|webp);base64,)/i, FORBID_TAGS: ["style", "form", "input", "button", "video", "audio", "source"], FORBID_ATTR: ["style", "class", "srcset", "background"], RETURN_DOM_FRAGMENT: true });
  for (const image of fragment.querySelectorAll("img")) {
    const src = image.getAttribute("src") || "";
    if (!/^data:image\/(png|jpeg|gif|webp);base64,/i.test(src) && !src.startsWith("blob:")) { image.remove(); continue; }
    image.removeAttribute("width");
    image.removeAttribute("height");
  }
  for (const link of fragment.querySelectorAll("a")) {
    const href = link.getAttribute("href") || "";
    if (/^https:\/\/|^mailto:/.test(href)) { link.target = "_blank"; link.rel = "noopener noreferrer"; }
    else if (!href.startsWith("#")) link.removeAttribute("href");
  }
  return fragment;
}

function fragmentHTML(fragment: DocumentFragment): string {
  const container = document.createElement("div");
  container.append(fragment);
  return container.innerHTML;
}

function xml(value: Uint8Array | undefined): Document {
  if (!value) throw new Error("EPUB 缺少必要的目录或章节文件。");
  const parsed = new DOMParser().parseFromString(strFromU8(value), "application/xml");
  if (parsed.querySelector("parsererror")) throw new Error("EPUB 目录格式不正确，请重新导出文件。");
  return parsed;
}

function archivePath(href: string, from: string): string | null {
  const url = new URL(href, `https://epub.invalid/${from}`);
  return url.origin === "https://epub.invalid" ? decodeURIComponent(url.pathname.slice(1)) : null;
}

async function epubHTML(buffer: ArrayBuffer): Promise<{ html: string; dispose: () => void }> {
  const files = unzipSync(new Uint8Array(buffer));
  const packagePath = xml(files["META-INF/container.xml"]).getElementsByTagNameNS("*", "rootfile")[0]?.getAttribute("full-path");
  if (!packagePath) throw new Error("EPUB 未包含有效的电子书目录。");
  const opf = xml(files[packagePath]);
  const manifest = new Map(Array.from(opf.getElementsByTagNameNS("*", "item"), item => [item.getAttribute("id"), { href: item.getAttribute("href") || "", type: item.getAttribute("media-type") || "" }]));
  const chapters = Array.from(opf.getElementsByTagNameNS("*", "itemref")).filter(item => item.getAttribute("linear") !== "no").map(item => manifest.get(item.getAttribute("idref"))).filter(item => item && /application\/xhtml\+xml|text\/html/.test(item.type));
  if (!chapters.length) throw new Error("EPUB 未包含可阅读的章节，或内容已加密。");
  const paths = chapters.map(item => archivePath(item!.href, packagePath));
  const blobs: string[] = [];
  const images = new Map<string, string>();
  try {
    const html = chapters.map((_, index) => {
      const filePath = paths[index];
      if (!filePath || !files[filePath]) throw new Error("EPUB 章节文件缺失或已加密。");
      const raw = DOMPurify.sanitize(strFromU8(files[filePath]), { USE_PROFILES: { html: true }, FORBID_TAGS: ["style", "form", "input", "button"], FORBID_ATTR: ["style", "class", "srcset"], RETURN_DOM_FRAGMENT: true });
      for (const element of raw.querySelectorAll("[id]")) element.id = `epub-${index}-${element.id}`;
      for (const image of raw.querySelectorAll("img")) {
        const imagePath = archivePath(image.getAttribute("src") || "", filePath);
        const media = [...manifest.values()].find(item => archivePath(item.href, packagePath) === imagePath);
        if (!imagePath || !files[imagePath] || !media || !/^image\/(png|jpeg|gif|webp)$/.test(media.type)) { image.removeAttribute("src"); continue; }
        let src = images.get(imagePath);
        if (!src) { src = URL.createObjectURL(new Blob([files[imagePath] as Uint8Array<ArrayBuffer>], { type: media.type })); blobs.push(src); images.set(imagePath, src); }
        image.src = src;
      }
      for (const link of raw.querySelectorAll("a[href]")) {
        const href = link.getAttribute("href")!;
        const target = archivePath(href, filePath);
        const chapter = paths.indexOf(target);
        if (chapter >= 0) {
          const hash = new URL(href, `https://epub.invalid/${filePath}`).hash.slice(1);
          link.setAttribute("href", `#epub-${chapter}${hash ? `-${decodeURIComponent(hash)}` : ""}`);
        }
      }
      return `<section class="reader-chapter" id="epub-${index}">${fragmentHTML(cleanDocument(fragmentHTML(raw)))}</section>`;
    }).join("");
    return { html, dispose: () => blobs.forEach(url => URL.revokeObjectURL(url)) };
  } catch (error) {
    blobs.forEach(url => URL.revokeObjectURL(url));
    throw error;
  }
}

export async function openDocument(buffer: ArrayBuffer, format: ReaderFormat): Promise<ReaderBook> {
  if (format === "pdf") {
    const pdf = await import("pdfjs-dist");
    pdf.GlobalWorkerOptions.workerSrc = "/reader/pdf.worker.min.mjs";
    const task = pdf.getDocument({ data: buffer, cMapUrl: "/reader/cmaps/", cMapPacked: true, standardFontDataUrl: "/reader/standard_fonts/", wasmUrl: "/reader/wasm/" });
    try {
      const document = await task.promise;
      return { kind: "pdf", document, dispose: () => { void task.destroy(); } };
    } catch (error) {
      void task.destroy();
      if (error instanceof Error && error.name === "PasswordException") throw new Error("这份 PDF 已加密，请上传无需密码的公开阅读版本。");
      throw new Error("PDF 无法解析，请检查文件是否完整。");
    }
  }
  checkArchive(new Uint8Array(buffer));
  if (format === "epub") return { kind: "html", ...await epubHTML(buffer) };
  const mammoth = await import("mammoth");
  const result = await mammoth.convertToHtml({ arrayBuffer: buffer }, { externalFileAccess: false }).catch(() => { throw new Error("DOCX 无法解析，请检查文件是否完整，或重新另存为 DOCX 后上传。"); });
  const html = fragmentHTML(cleanDocument(result.value));
  if (!html.trim()) throw new Error("DOCX 中没有可阅读的正文。");
  return { kind: "html", html, dispose: () => {} };
}
