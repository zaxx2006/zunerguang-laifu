"use client";

import { useState } from "react";
import { ArrowRight, ChevronDown, RotateCcw } from "lucide-react";
import { SelectControl } from "@/components/content/ContentPrimitives";
import type { CatalogBlock } from "@/components/content/content-types";
import { readerFormat, readerHref } from "@/contracts/resource-reader";
import { resourceFormats, resourceStages } from "@/contracts/page-content";

const formatOptions = [["all", "全部形式"], ...resourceFormats] as const;
const pageSize = 8;
const stageOptions = [["all", "全部阶段"], ...resourceStages] as const;

function optionLabel(options: readonly (readonly [string, string])[], value: string) {
  return options.find(([key]) => key === value)?.[1] ?? value;
}

export function ResourceCatalog({ block }: { block: CatalogBlock }) {
  const [format, setFormat] = useState("all");
  const [stage, setStage] = useState("all");
  const [page, setPage] = useState(1);
  const items = block.items.filter(item => (format === "all" || item.kind === format) && (stage === "all" || item.stage === stage));
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibleItems = items.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  return <div className="resource-catalog"><form className="resource-catalog__toolbar" onSubmit={event => event.preventDefault()} onReset={() => { setFormat("all"); setStage("all"); setPage(1); }}><div className="resource-catalog__toolbar-copy"><h3>筛选资源</h3><p>选择资源形式和你目前所处的阶段。</p></div><div className="resource-catalog__controls"><label><span>资源形式</span><SelectControl aria-label="按资源形式筛选" className="resource-catalog__format" value={format} onChange={event => { setFormat(event.target.value); setPage(1); }} name="resource-kind">{formatOptions.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</SelectControl></label><label><span>所处阶段</span><SelectControl aria-label="按所处阶段筛选" className="resource-catalog__stage-filter" value={stage} onChange={event => { setStage(event.target.value); setPage(1); }} name="resource-stage">{stageOptions.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</SelectControl></label><p className="resource-catalog__count" role="status"><strong>{items.length}</strong><span>项资源</span></p><button className="resource-catalog__reset" type="reset"><RotateCcw aria-hidden="true" size={16} />清除筛选</button></div></form><div className="resource-catalog__results-heading"><h3>资源列表</h3><p>选择一项展开查看详情</p></div>{!items.length ? <p role="status">没有符合条件的资源，请调整条件或清除筛选。</p> : null}<div className="resource-catalog__grid" data-grid="12">{visibleItems.map((item) => <details className="resource-card" data-kind={item.kind} data-stage={item.stage} name="resource-catalog-item" key={`${item.kind}-${item.stage}-${item.title}`}><summary><span className="resource-card__kind">{optionLabel(formatOptions, item.kind)}</span><span className="resource-card__title" role="heading" aria-level={3}>{item.title}</span><span className="resource-card__stage">{optionLabel(stageOptions, item.stage)}</span><span className="resource-card__toggle"><span>查看详情</span><ChevronDown aria-hidden="true" size={20} /></span></summary><div className="resource-card__body"><p>{item.summary}</p><dl><div><dt>适用阶段</dt><dd>{optionLabel(stageOptions, item.stage)}</dd></div><div><dt>{item.kind === "media" ? "计划时长" : "预计用时"}</dt><dd>{item.duration ? `${item.duration} 分钟` : "待确认"}</dd></div><div><dt>获取方式</dt><dd>{item.file ? "文件已开放" : item.kind === "assessment" ? "直接使用" : "查看目录"}</dd></div></dl><a href={item.file && item.id && readerFormat(item.file) ? readerHref(item.id) : item.file?.url ?? item.href} target={item.file && item.id && readerFormat(item.file) ? "_blank" : undefined} rel={item.file && item.id && readerFormat(item.file) ? "noopener noreferrer" : undefined}>{item.file ? (item.id && readerFormat(item.file) ? "在线阅读" : /^(audio|video)\//.test(item.file.mimeType) ? "播放音视频" : "查看／下载文件") : item.kind === "assessment" ? "开始自我梳理" : "查看分类介绍"}<ArrowRight aria-hidden="true" size={17} /></a></div></details>)}</div>{items.length ? <nav className="resource-catalog__pagination" aria-label="资源列表分页"><button type="button" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>上一页</button><p role="status" aria-live="polite">{`第 ${currentPage} / ${totalPages} 页`}</p><button type="button" disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)}>下一页</button></nav> : null}<p className="catalog-help">没有找到合适的内容时，可以清除筛选重新选择。DOCX、PDF 和 EPUB 资源将在新标签页中打开阅读器；其他已开放资源可打开具体文件；其他条目为目录介绍。法律类内容请核对适用地区与更新时间。</p></div>;
}
