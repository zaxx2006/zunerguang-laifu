import type { PagePreviewDocument } from "../types";
import { PreviewBrand } from "./PreviewBrand";

export function PagePreview({ document }: { document: PagePreviewDocument }) {
  const sections = document.sections?.filter(section => section.visible !== false) ?? [];
  return <main className="page-preview">
    <header className="preview-site-header"><PreviewBrand /><nav><span>服务</span><span>方法</span><span>洞察</span><span>采购</span></nav><span className="preview-site-header__action">讨论你的问题</span></header>
    <section className="page-preview__hero"><div className="home-preview__grid" /><div><p className="preview-eyebrow"><span>ACEVEC</span>{document.eyebrow || "PAGE PRESENTATION"}</p><h1>{document.title || "页面标题"}</h1><p>{document.description || "在左侧编辑页面内容，这里会实时同步呈现。"}</p><footer><span>{document.route || "/registered-route"}</span><b>CONTROLLED PRESENTATION</b></footer></div></section>
    <section className="page-preview__answer"><p>DIRECT ANSWER</p><h2>{document.directAnswer || "直接答案将在这里显示。"}</h2></section>
    <div className="page-preview__sections">{sections.map((section, index) => <section key={section.id || section.sourceId || index}><aside><span>{section.sourceId || String(index + 1).padStart(2, "0")}</span><p>{section.label || "SECTION"}</p></aside><article><h2>{section.title || "章节标题"}</h2>{section.body?.map((item, bodyIndex) => <p key={item.id || bodyIndex}>{item.value}</p>)}{section.points && section.points.length > 0 && <ul>{section.points.map((item, pointIndex) => <li key={item.id || pointIndex}>{item.value}</li>)}</ul>}{section.tableColumns && section.tableColumns.length > 0 && <div className="page-preview__table"><div>{section.tableColumns.map((item, columnIndex) => <b key={item.id || columnIndex}>{item.value}</b>)}</div>{section.tableRows?.map((row, rowIndex) => <div key={row.id || rowIndex}>{row.cells?.map((item, cellIndex) => <span key={item.id || cellIndex}>{item.value}</span>)}</div>)}</div>}</article></section>)}</div>
    <section className="page-preview__cta"><p>{document.cta?.label || "NEXT STEP"}</p><h2>{document.cta?.title || "页面末尾行动"}</h2><span>{document.cta?.label || "进入下一步"} ↗</span></section>
  </main>;
}
