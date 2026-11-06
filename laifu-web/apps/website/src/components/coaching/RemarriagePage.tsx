import type { ReactNode } from "react";
import { ArrowDown, ArrowUpRight, ChevronRight } from "lucide-react";
import { HomeInvitation } from "@/components/home/HomeSections";
import { HomeHeader, HomeFooter } from "@/components/home/HomeNavigation";
import { HomeDesignSystem, HomeButton } from "@/components/home/HomePrimitives";
import { SiteLink } from "@/components/site/SiteLink";
import { SectionBody } from "@/components/content/StructuredContent";
import { RichText } from "@/components/content/RichText";
import type { Action, Block } from "@/contracts/page-content";
import { getNavigationPresentation, getHomePresentation, getSitePagePresentation } from "@/lib/cms-content-client";
import { photoProps } from "@/lib/photo";
import { siteConfig } from "@/lib/site-config";
import { CoachingInteractions } from "./CoachingInteractions";
import { TemplateTabs } from "./TemplateTabs";
import "./coaching.css";

const route = "/services/remarriage-preparation/";
// 临时隐藏中间板块；改为 true 后恢复板块及页内入口。
const showDetailSections = false;
const cleanTitle = (title: string) => title.replace(/^(?:[（(]\d+[）)]|模块[一二三四五六七八九十]+：(?:主题：)?|服务入口：)/, "");
const concernModules = [0, 2, 2, 0, 1, 3, 4];

function Disclosure({ title, children, id, name, open = false }: { title: string; children: ReactNode; id?: string; name?: string; open?: boolean }) {
  return <details className="coaching-detail remarriage-disclosure" id={id} name={name} open={open}><summary><span>{cleanTitle(title)}</span><span className="remarriage-disclosure-action"><span className="remarriage-open-label">展开</span><span className="remarriage-close-label">收起</span><span className="coaching-plus" aria-hidden="true" /></span></summary><div className="coaching-detail-body">{children}</div></details>;
}

function ActionLinks({ actions, primary = false }: { actions: Action[]; primary?: boolean }) {
  return <div className="remarriage-actions">{actions.map((action, index) => {
    const href = action.href.startsWith(`${route}#`) ? action.href.slice(route.length) : action.href;
    return <HomeButton key={index} variant={primary && index === actions.length - 1 ? "primary" : "text"} className={primary && index === actions.length - 1 ? "coaching-hero-button" : "coaching-text-link"} href={href}>{action.label}{href.endsWith("#resources-availability") ? "（暂未开放）" : ""}{href.startsWith("#") ? <ArrowDown aria-hidden="true" /> : <ArrowUpRight aria-hidden="true" />}</HomeButton>;
  })}</div>;
}

function Body({ blocks }: { blocks: Block[] }) {
  return <>{blocks.map((block, index) => block.kind === "actions" ? <ActionLinks actions={block.actions} key={index} /> : <SectionBody blocks={[block]} columns={1} key={index} />)}</>;
}

export async function RemarriagePage() {
  const [navigation, content, home] = await Promise.all([getNavigationPresentation({ preview: false }), getSitePagePresentation(route), getHomePresentation({ preview: false })]);
  const invitation = home?.invitation;
  const sections = new Map(content.content.sections.map(section => [section.id, section]));
  const fit = sections.get("Q09"), concerns = sections.get("Q11"), benefits = sections.get("Q15"), course = sections.get("Q20"), pathway = sections.get("Q26"), formats = sections.get("Q28"), outcomes = sections.get("Q34"), risks = sections.get("Q36"), boundaries = sections.get("Q38"), faq = sections.get("Q41"), start = sections.get("Q43");
  const introCopy = content.content.intro.find(block => block.kind === "copy");
  const introParts = introCopy?.text.split(/\n{2,}/) ?? [];
  const questions = concerns?.blocks.find(block => block.kind === "selfcheck");
  const modules = course?.blocks.find(block => block.kind === "grid");
  const benefitItems = benefits?.blocks.find(block => block.kind === "grid");
  const formatItems = formats?.blocks.find(block => block.kind === "grid");
  const pathwaySteps = pathway?.blocks.flatMap(block => block.kind === "copy" ? block.text.split("\n").filter(Boolean).map(line => {
    const match = line.match(/^\d+\.([^：]+)：([\s\S]*)$/);
    return match ? { title: match[1], text: match[2] } : { title: "", text: line };
  }) : []) ?? [];
  const anchor = (id: string) => id.includes("-") ? id : `${content.anchorPrefix}-${id.toLowerCase()}`;
  const nav = [[concerns, "准备议题"], [course, "训练模块"], [pathway, "支持路径"], [outcomes, "交付成果"], [boundaries, "服务边界"], [faq, "常见问题"]] as const;
  const known = new Set(["Q07", "Q09", "Q11", "Q15", "Q20", "Q26", "Q28", "Q34", "Q36", "Q38", "Q41", "Q43"]);
  const title = content.title.replace("再婚女性", "再婚");
  const jsonLd = siteConfig.siteUrl ? { "@context": "https://schema.org", "@type": "Service", name: title, description: content.description, url: `${siteConfig.siteUrl}${route}`, provider: { "@type": "Organization", name: siteConfig.nameZh, url: siteConfig.siteUrl } } : null;

  return <div className="coaching-page remarriage-page" id="coaching-top"><HomeDesignSystem><HomeHeader breadcrumbSlug={"services/remarriage-preparation"} content={navigation ?? undefined} homeHref="/" openInNewTab /></HomeDesignSystem><main id="main-content" data-page="remarriage-preparation" data-template="remarriage-preparation">
    <section data-grid-section="12" className="coaching-hero coaching-wrap" aria-labelledby="page-title"><div className="hero-copy"><h1 id="page-title">{title}</h1>{introParts[0] ? <p className="remarriage-hero-lead">{introParts[0]}</p> : null}<p className="hero-description">{content.description}</p><div className="hero-actions"><HomeButton variant="primary" className="coaching-hero-button" href="/book-consultation/">预约咨询</HomeButton>{showDetailSections && concerns ? <SiteLink className="coaching-text-link" href={`#${anchor(concerns.id)}`}>看看要准备什么<ArrowDown aria-hidden="true" /></SiteLink> : null}</div></div><figure className="hero-photo"><img src={content.image.src} alt={content.image.alt} width={content.image.width} height={content.image.height} fetchPriority="high" {...photoProps(content.image.src, "(max-width: 720px) 90vw, 42vw")} /></figure></section>
    {showDetailSections ? <>
    <nav className="coaching-rail" aria-label="本页内容"><div className="coaching-wrap">{nav.map(([section, label]) => section ? <SiteLink href={`#${anchor(section.id)}`} data-section-link={anchor(section.id)} key={section.id}>{label}</SiteLink> : null)}<SiteLink className="remarriage-rail-booking" href="/book-consultation/">预约咨询<ArrowUpRight aria-hidden="true" /></SiteLink></div></nav>

    {concerns ? <section data-grid-section="12" className="coaching-section remarriage-concerns" id={anchor(concerns.id)}><div className="coaching-wrap"><div className="coaching-heading"><h2>{concerns.title}</h2><Body blocks={concerns.blocks.filter(block => block.kind === "copy")} /></div><div className="remarriage-concerns-grid"><div>{questions ? <TemplateTabs labels={questions.items.map(item => item.title)} hint="点击议题，查看婚前需要提前说清的问题">{questions.items.map((item, index) => <article id={item.id} key={index}><h3>{item.title}</h3><Body blocks={item.blocks} /><SiteLink className="coaching-text-link" href={modules?.items[concernModules[index]] ? `#remarriage-module-${concernModules[index]}` : `#${anchor(course?.id ?? "Q20")}`}>查看对应学习内容<ArrowDown aria-hidden="true" /></SiteLink></article>)}</TemplateTabs> : null}<Body blocks={concerns.blocks.filter(block => block.kind !== "selfcheck" && block.kind !== "copy")} /></div><div className="remarriage-concerns-aside"><figure className="remarriage-journal"><img src="/images/editorial/journal.webp" alt="放在木桌上的笔记本与笔" width={1280} height={854} loading="lazy" decoding="async" {...photoProps("/images/editorial/journal.webp", "(max-width: 720px) 90vw, 34vw")} /></figure>{fit ? <Disclosure title={fit.title} id={anchor(fit.id)}><Body blocks={fit.blocks} /></Disclosure> : null}</div></div></div></section> : null}

    {course ? <section data-grid-section="12" className="coaching-section remarriage-course" id={anchor(course.id)}><div className="coaching-wrap"><div className="coaching-heading"><h2>{course.title}</h2><p>点击模块，查看学习重点与对应的准备内容。</p></div>{modules ? <div className="remarriage-course-grid" data-tabs="remarriage-course"><div className="remarriage-module-tabs" role="tablist" aria-label="选择训练模块" aria-orientation="vertical">{modules.items.map((item, index) => <button type="button" role="tab" id={`remarriage-course-tab-${index}`} aria-controls={`remarriage-course-panel-${index}`} aria-selected={index === 0} tabIndex={index === 0 ? 0 : -1} data-tab={index} key={index}><span className="remarriage-module-number">{index + 1}</span><span>{cleanTitle(item.title)}</span><ChevronRight aria-hidden="true" /></button>)}</div><div className="remarriage-module-content"><figure className="remarriage-finance-photo"><img src="/images/editorial/p42-remarriage-planning.webp" alt="两位成年伴侣在家中餐边柜旁分别整理资料" width={1280} height={854} loading="lazy" decoding="async" {...photoProps("/images/editorial/p42-remarriage-planning.webp", "(max-width: 720px) 90vw, 42vw")} /></figure>{modules.items.map((item, index) => <div role="tabpanel" id={`remarriage-course-panel-${index}`} aria-labelledby={`remarriage-course-tab-${index}`} hidden={index !== 0} tabIndex={0} key={index}><article id={`remarriage-module-${index}`}><h3>{cleanTitle(item.title)}</h3><Body blocks={item.blocks} />{item.href ? <SiteLink className="coaching-text-link" href={item.href}>了解这项支持<ArrowUpRight aria-hidden="true" /></SiteLink> : null}<SiteLink className="coaching-text-link" href="/book-consultation/#booking-channel">咨询学习安排<ArrowUpRight aria-hidden="true" /></SiteLink></article></div>)}</div></div> : null}<Body blocks={course.blocks.filter(block => block.kind !== "grid")} />{benefits ? <div className="remarriage-benefits" id={anchor(benefits.id)}><h3>{benefits.title}</h3><div>{benefitItems?.items.map((item, index) => <Disclosure title={item.title} id={item.id} key={index}><Body blocks={item.blocks} /></Disclosure>)}</div><Body blocks={benefits.blocks.filter(block => block.kind !== "grid")} /></div> : null}</div></section> : null}

    {pathway || formats || outcomes ? <section data-grid-section="12" className="coaching-section remarriage-support" id={pathway ? anchor(pathway.id) : undefined}><div className="coaching-wrap">{pathway ? <><h2>{pathway.title}</h2><ol className="remarriage-pathway">{pathwaySteps.map((step, index) => <li key={index}><span aria-hidden="true">{index + 1}</span><div>{step.title ? <h3>{step.title}</h3> : null}<RichText text={step.text} presentation="editorial" /></div></li>)}</ol><Body blocks={pathway.blocks.filter(block => block.kind !== "copy")} /></> : null}<div className="remarriage-support-grid">{formats ? <div id={anchor(formats.id)}><h3>{formats.title}</h3><p className="remarriage-hint">点击支持形式，查看适合人群与交付内容。</p>{formatItems?.items.map((item, index) => <Disclosure title={item.title} id={item.id} name="remarriage-formats" open={index === 0} key={index}><Body blocks={item.blocks} />{item.href ? <SiteLink className="coaching-text-link" href={item.href}>了解这项支持<ArrowUpRight aria-hidden="true" /></SiteLink> : null}</Disclosure>)}<Body blocks={formats.blocks.filter(block => block.kind !== "grid")} /></div> : null}{outcomes ? <div className="remarriage-outcomes" id={anchor(outcomes.id)}><h3>{outcomes.title}</h3><Body blocks={outcomes.blocks} /></div> : null}</div></div></section> : null}

    {risks || boundaries ? <section data-grid-section="12" className="coaching-section remarriage-boundaries"><div className="coaching-wrap remarriage-boundaries-grid">{risks ? <div id={anchor(risks.id)}><h2>{risks.title}</h2><Body blocks={risks.blocks} /></div> : null}{boundaries ? <aside id={anchor(boundaries.id)}><h2>{boundaries.title}</h2><Body blocks={boundaries.blocks} /></aside> : null}</div></section> : null}

    {faq ? <section data-grid-section="12" className="coaching-section remarriage-faq" id={anchor(faq.id)}><div className="coaching-wrap"><h2>{faq.title}</h2><div className="remarriage-faq-grid">{faq.blocks.map((block, index) => block.kind === "disclosure" ? <Disclosure title={block.summary} key={index}><RichText text={block.text} presentation="editorial" /></Disclosure> : <Body blocks={[block]} key={index} />)}</div></div></section> : null}

    {content.content.sections.filter(section => !known.has(section.id)).map(section => <section data-grid-section="12" className="coaching-section" id={anchor(section.id)} key={section.id}><div className="coaching-wrap"><h2>{section.title}</h2><Body blocks={section.blocks} /></div></section>)}
    {start ? <section data-grid-section="12" className="coaching-section remarriage-start" id={anchor(start.id)}><div className="coaching-wrap remarriage-start-grid"><h2>{start.title}</h2><div><Body blocks={start.blocks.filter(block => block.kind !== "actions")} />{start.blocks.flatMap(block => block.kind === "actions" ? [<ActionLinks actions={block.actions} primary key="actions" />] : [])}</div></div></section> : null}
    {content.content.cta ? <section data-grid-section="12" className="coaching-section remarriage-start"><div className="coaching-wrap"><h2>{content.content.cta.title}</h2><RichText text={content.content.cta.body} presentation="editorial" /><ActionLinks actions={content.content.cta.actions} primary /></div></section> : null}
    </> : null}
    <HomeDesignSystem><HomeInvitation content={invitation} openInNewTab /></HomeDesignSystem>
  </main><HomeDesignSystem><HomeFooter content={navigation ?? undefined} openInNewTab /></HomeDesignSystem><CoachingInteractions />{jsonLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} /> : null}</div>;
}
