import { SiteLink } from "@/components/site/SiteLink";
import { ArrowRight } from "lucide-react";
import { CardGrid, SelectControl, Steps, StatusNotice } from "@/components/content/ContentPrimitives";
import { RichText } from "@/components/content/RichText";
import { ResourceCatalog } from "@/components/content/ResourceCatalog";
import { gridItemParts, splitNumberedTitle } from "@/lib/content-layout";
import type { Action, TableBlock, GridBlock, SelfcheckBlock, Block, CollectionColumns, ContentPresentation } from "@/components/content/content-types";

export { splitNumberedTitle } from "@/lib/content-layout";
const labeledTitlePattern = /^([^｜|]{1,8})[｜|]\s*(.+)$/u;

function splitMarkedTitle(title: string) {
  const numbered = splitNumberedTitle(title, true);
  if (numbered) return numbered;
  const labeled = title.match(labeledTitlePattern);
  return labeled ? [labeled[1].trim(), labeled[2].trim()] as const : null;
}

function DisclosureSummary({ title, reserveNumber = false }: { title: string; reserveNumber?: boolean }) {
  const markedTitle = splitMarkedTitle(title);
  return <summary data-numbered={markedTitle ? "true" : undefined} data-reserve-number={reserveNumber ? "true" : undefined}>{markedTitle || reserveNumber ? <span className="structured-disclosure__number" aria-hidden={markedTitle ? undefined : true}>{markedTitle?.[0] ?? ""}</span> : null}<span className="structured-disclosure__title">{markedTitle?.[1] ?? title}</span><ArrowRight aria-hidden="true" size={18} /></summary>;
}

export function ActionButtons({ actions }: { actions: Action[] }) {
  const visibleActions = actions.filter(action => !/^\/media(?:\/|[?#]|$)/.test(action.href));
  if (!visibleActions.length) return null;
  return <div className="structured-actions">{visibleActions.map((action, index) => <SiteLink className={index ? "button button--outline" : "button button--primary"} href={action.href} data-consultation-type={action.label.includes("预约轻量") ? "轻量咨询" : action.label.includes("预约深度") ? "深度咨询" : undefined} key={`${action.label}-${index}`}>{action.label.replace(/\s*→$/, "")}{/领取|下载|获取/.test(action.label) && action.href.endsWith("resources-availability") ? "（暂未开放）" : ""}<ArrowRight aria-hidden="true" size={17} /></SiteLink>)}</div>;
}

function ComparisonTable({ block }: { block: TableBlock }) {
  return <div aria-label={`${block.headers[0]}对比表，窄屏可横向滚动`} className="comparison-table-wrap" role="region" tabIndex={0}><table className="comparison-table"><thead><tr>{block.headers.map((header) => <th key={header} scope="col">{header}</th>)}</tr></thead><tbody>{block.rows.map((row, rowIndex) => <tr key={`row-${rowIndex}`}>{row.map((cell, cellIndex) => cellIndex ? <td key={`${rowIndex}-${cellIndex}`}>{cell}</td> : <th key={`${rowIndex}-${cellIndex}`} scope="row">{cell}</th>)}</tr>)}</tbody></table></div>;
}

function ContentGrid({ block, presentation, columns }: { block: GridBlock; presentation: ContentPresentation; columns?: CollectionColumns }) {
  const Wrapper = block.mode === "steps" ? Steps : CardGrid;
  const gridColumns = block.columns ?? columns ?? (block.mode === "steps" ? 3 : 2);
  const parts = block.items.map(gridItemParts);
  const numberedTitles = block.items.map((item) => splitNumberedTitle(item.title, true));
  const hasCategories = parts.some((part) => part.category);
  const hasNumbers = numberedTitles.some(Boolean);
  const hasFooters = parts.some((part) => part.footer.length);
  const hasDetails = parts.some((part) => part.details.length);
  const rows = (2 + Number(hasCategories) + Number(hasNumbers) + Number(hasDetails) + Number(hasFooters)) as 2 | 3 | 4 | 5 | 6;
  let category: string | undefined;
  return <Wrapper columns={gridColumns} {...(Wrapper === CardGrid && presentation === "editorial" ? { variant: "modules" as const } : {})} rows={presentation === "editorial" ? rows : undefined}>{block.items.map((item, index) => {
    const numberedTitle = numberedTitles[index];
    if (presentation !== "editorial") return <article className="content-card" data-numbered={numberedTitle ? "true" : undefined} id={item.id} key={index}>{numberedTitle ? <span aria-hidden="true" className="content-card__number">{numberedTitle[0]}</span> : null}<h3>{numberedTitle?.[1] ?? item.title}</h3>{item.blocks.map((child, childIndex) => <ContentBlock block={child} columns={columns} presentation={presentation} key={childIndex} />)}</article>;
    const part = parts[index];
    category = part.category?.text ?? category;
    return <article className="content-card" data-numbered={numberedTitle ? "true" : undefined} id={item.id} key={`${item.title}-${index}`}>{hasCategories ? <div className="content-card__category">{category ? <RichText text={category} presentation={presentation} /> : null}</div> : null}{hasNumbers ? <span aria-hidden={numberedTitle ? undefined : true} className="content-card__number">{numberedTitle?.[0] ?? ""}</span> : null}<h3>{numberedTitle?.[1] ?? item.title}</h3><div className="content-card__body">{part.body.map((child, childIndex) => <ContentBlock block={child} columns={columns} presentation={presentation} key={childIndex} />)}</div>{hasDetails ? <div className="content-card__details">{part.details.map((child, childIndex) => <ContentBlock block={child} columns={columns} presentation={presentation} key={childIndex} />)}</div> : null}{hasFooters ? <div className="content-card__footer">{part.footer.map((child, childIndex) => <ContentBlock block={child} columns={columns} presentation={presentation} key={childIndex} />)}</div> : null}</article>;
  })}</Wrapper>;
}

function Selfcheck({ block, presentation }: { block: SelfcheckBlock; presentation: ContentPresentation }) {
  return <details className="selfcheck"><summary className="selfcheck__start">开始自测 <span>勾选相关情况，查看对应支持</span></summary><p className="selfcheck__note">勾选与你有关的情况，再查看对应支持。仅在当前页面自我梳理，不计分、不作诊断，不保存或提交选择。</p><fieldset><legend>哪些情况与你有关？（可多选）</legend><div className="selfcheck__fields" data-grid="12">{block.items.map((item, index) => <div className="selfcheck__item" key={index}><label htmlFor={`${block.id}-${index}`}><input id={`${block.id}-${index}`} type="checkbox" /><span>{splitMarkedTitle(item.title)?.join(" ") ?? item.title}</span></label><div className="selfcheck__body">{item.blocks.map((child, childIndex) => <ContentBlock block={child} presentation={presentation} key={childIndex} />)}<SiteLink className="selfcheck__result" href={item.href}>了解这项支持 <ArrowRight aria-hidden="true" size={16} /></SiteLink></div></div>)}</div></fieldset></details>;
}

function BookingSelect({ options, placeholder }: { options: string[]; placeholder: string }) {
  return <SelectControl defaultValue=""><option value="">{placeholder}</option>{options.map((text) => <option key={text}>{text}</option>)}</SelectControl>;
}

function BookingPreparation() {
  return <div className="booking-preparation"><StatusNotice title="预约尚未开放"><p>真实预约二维码及接收申请的渠道尚未提供。以下仅供你整理咨询方向，当前不收集姓名、电话、邮箱或任何个人情况，也不会提交或保存选择。</p></StatusNotice><fieldset disabled><legend>预约信息预览</legend><div className="booking-preparation__fields" data-grid="12"><label>当前阶段<BookingSelect options={["还在犹豫", "正在准备", "已经进入流程", "离婚后重建"]} placeholder="请选择当前阶段" /></label><label>主要困扰<BookingSelect options={["决策与方向", "孩子养育", "高冲突沟通", "财产信息", "律师咨询准备", "生活重建"]} placeholder="请选择主要困扰" /></label><label>希望预约的服务<BookingSelect options={["90分钟初始深度咨询", "30分钟轻量咨询", "专项支持", "律师协同支持"]} placeholder="请选择服务" /></label><button className="button button--primary" disabled type="button">提交预约申请（暂未开放）</button></div></fieldset></div>;
}

export function ContentBlock({ block, columns, presentation = "default", reserveNumber = false }: { block: Block; columns?: CollectionColumns; presentation?: ContentPresentation; reserveNumber?: boolean }) {
  if (block.kind === "copy") return <RichText text={block.text} presentation={presentation} />;
  if (block.kind === "actions") return <ActionButtons actions={block.actions} />;
  if (block.kind === "table") return <ComparisonTable block={block} />;
  if (block.kind === "grid") return <ContentGrid block={block} columns={columns} presentation={presentation} />;
  if (block.kind === "selfcheck") return <Selfcheck block={block} presentation={presentation} />;
  if (block.kind === "booking") return <BookingPreparation />;
  if (block.kind === "catalog") return <ResourceCatalog block={block} />;
  if (block.kind === "notice") return <StatusNotice title="发布说明"><RichText text={block.text} presentation={presentation} /></StatusNotice>;
  if (block.kind === "metrics") return <dl className="content-metrics" data-columns={columns ?? 3} data-grid="12">{block.items.map((item, index) => <div key={index}>{item.value ? <dd>{item.value}</dd> : null}<dt>{item.label}</dt></div>)}</dl>;
  if (block.kind === "disclosure") return <details className="structured-disclosure"><DisclosureSummary title={block.summary} reserveNumber={reserveNumber} /><div className="structured-disclosure__body"><RichText text={block.text} presentation={presentation} /></div></details>;
  const [title, ...description] = block.title.split("\n");
  const numberedTitle = splitNumberedTitle(title, true);
  const body = <>{description.length ? <RichText text={description.join("\n")} presentation={presentation} /> : null}{block.blocks.map((child, index) => <ContentBlock block={child} columns={columns} presentation={presentation} key={`${child.kind}-${index}`} />)}</>;
  if (block.collapsible) return <details className="structured-disclosure structured-disclosure--subsection" id={block.id}><DisclosureSummary title={title} reserveNumber={reserveNumber} /><div className="structured-disclosure__body structured-subsection__body">{body}</div></details>;
  return <article className="structured-subsection" data-numbered={numberedTitle ? "true" : undefined} id={block.id}>{numberedTitle || reserveNumber ? <span aria-hidden={numberedTitle ? undefined : true} className="structured-subsection__number">{numberedTitle?.[0] ?? ""}</span> : null}<h3>{numberedTitle?.[1] ?? title}</h3><div className="structured-subsection__body">{body}</div></article>;
}
