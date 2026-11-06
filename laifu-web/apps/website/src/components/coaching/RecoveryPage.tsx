import type { ReactNode } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { HomeInvitation } from "@/components/home/HomeSections";
import { HomeHeader, HomeFooter } from "@/components/home/HomeNavigation";
import { HomeDesignSystem, HomeButton } from "@/components/home/HomePrimitives";
import { SiteLink } from "@/components/site/SiteLink";
import { SectionBody } from "@/components/content/StructuredContent";
import { RichText } from "@/components/content/RichText";
import type { Block } from "@/contracts/page-content";
import { getNavigationPresentation, getHomePresentation, getSitePagePresentation } from "@/lib/cms-content-client";
import { photoProps } from "@/lib/photo";
import { siteConfig } from "@/lib/site-config";
import { CoachingInteractions } from "./CoachingInteractions";
import { TemplateTabs } from "./TemplateTabs";
import "./coaching.css";

const route = "/services/post-divorce-recovery/";
const cleanTitle = (title: string) => title.replace(/^\d+(?:\.\d+)?[｜\s]+/, "");

function copyParts(blocks: Block[]) {
  return blocks.flatMap(block => block.kind === "copy" ? block.text.split(/\n{2,}|\n(?=[（(]\d+[）)])/).map(text => {
    const match = text.match(/^(?:[（(]\d+[）)]|\d+\.\s*)\s*([^\n]+)\n([\s\S]*)$/);
    return match ? { title: match[1], text: match[2] } : { title: "", text };
  }) : []);
}

function Disclosure({ title, children, id }: { title: string; children: ReactNode; id?: string }) {
  return <details className="coaching-detail recovery-disclosure" id={id}><summary><span>{title}</span><span className="recovery-disclosure-action"><span className="recovery-open-label">展开</span><span className="recovery-close-label">收起</span><span className="coaching-plus" aria-hidden="true" /></span></summary><div className="coaching-detail-body">{children}</div></details>;
}

function SupportContent({ blocks }: { blocks: Block[] }) {
  const parts = copyParts(blocks);
  return <>{parts.filter(part => !part.title).map((part, index) => <RichText text={part.text} presentation="editorial" key={index} />)}<div className="recovery-support-notes">{parts.filter(part => part.title).map((part, index) => <article key={index}><h4>{part.title}</h4><RichText text={part.text} presentation="editorial" /></article>)}</div><SectionBody blocks={blocks.filter(block => block.kind !== "copy")} columns={1} /></>;
}

export async function RecoveryPage() {
  const [navigation, content, home] = await Promise.all([getNavigationPresentation({ preview: false }), getSitePagePresentation(route), getHomePresentation({ preview: false })]);
  const invitation = home?.invitation;
  const sections = new Map(content.content.sections.map(section => [section.id, section]));
  const overview = sections.get("Q05"), difficulties = sections.get("Q06"), approach = sections.get("Q16"), support = sections.get("Q21"), process = sections.get("Q32"), principles = sections.get("Q34");
  const overviewParts = copyParts(overview?.blocks ?? []);
  const difficultiesParts = copyParts(difficulties?.blocks ?? []);
  const approachParts = copyParts(approach?.blocks ?? []);
  const topics = approachParts.filter(part => part.title);
  const modules = support?.blocks.filter(block => block.kind === "subsection") ?? [];
  const steps = copyParts(process?.blocks ?? []).filter(part => part.title);
  const principlesParts = copyParts(principles?.blocks ?? []);
  const anchor = (id: string) => id.includes("-") ? id : `${content.anchorPrefix}-${id.toLowerCase()}`;
  const known = new Set(["Q05", "Q06", "Q16", "Q21", "Q32", "Q34"]);
  const nav = [[support, "支持方式"], [difficulties, "当前困扰"], [approach, "具体支持"], [process, "服务流程"], [principles, "原则与边界"]] as const;
  const jsonLd = siteConfig.siteUrl ? { "@context": "https://schema.org", "@type": "Service", name: content.title, description: content.description, url: `${siteConfig.siteUrl}${route}`, provider: { "@type": "Organization", name: siteConfig.nameZh, url: siteConfig.siteUrl } } : null;

  return <div className="coaching-page recovery-page" id="coaching-top"><HomeDesignSystem><HomeHeader breadcrumbSlug={"services/post-divorce-recovery"} content={navigation ?? undefined} homeHref="/" openInNewTab /></HomeDesignSystem><main id="main-content" data-page="post-divorce-recovery" data-template="post-divorce-recovery">
    <section data-grid-section="12" className="coaching-hero coaching-wrap" aria-labelledby="page-title"><div className="hero-copy"><h1 id="page-title">{content.title}</h1>{overviewParts[0] ? <p className="hero-description">{overviewParts[0].text}</p> : null}<p className="recovery-hero-description">离婚之后，不只是告别一段关系，更是重新安放情绪、恢复生活秩序、重建自我与规划未来的过程。我们提供离婚后心理调适与生活重建支持，涵盖情绪支持、生活秩序恢复、自我认同重塑与未来规划；若仍有财产、抚养等未决事务，或创伤反应较深，也可获得法律事务协同与心理支持并行的定制服务。</p><div className="hero-actions"><HomeButton variant="primary" className="coaching-hero-button" href="/book-consultation/">预约咨询</HomeButton>{support ? <SiteLink className="coaching-text-link" href={`#${anchor(support.id)}`}>查看支持方式<ArrowDown aria-hidden="true" /></SiteLink> : null}</div>{overview ? <Disclosure title="了解离婚后的重建支持" id={anchor(overview.id)}><h2>{overview.title}</h2>{overviewParts.slice(1).map((part, index) => <RichText text={part.text} presentation="editorial" key={index} />)}<SectionBody blocks={overview.blocks.filter(block => block.kind !== "copy")} columns={1} /></Disclosure> : null}</div><figure className="hero-photo"><img src={content.image.src} alt={content.image.alt} width={content.image.width} height={content.image.height} fetchPriority="high" {...photoProps(content.image.src, "(max-width: 720px) 90vw, 42vw")} /></figure></section>
    <nav className="coaching-rail" aria-label="本页内容"><div className="coaching-wrap">{nav.map(([section, label]) => section ? <SiteLink href={`#${anchor(section.id)}`} data-section-link={anchor(section.id)} key={section.id}>{label}</SiteLink> : null)}<SiteLink href="/book-consultation/" className="recovery-rail-booking">预约咨询<ArrowUpRight aria-hidden="true" /></SiteLink></div></nav>
    {content.content.intro.length ? <section data-grid-section="12" className="coaching-section"><div className="coaching-wrap"><SectionBody blocks={content.content.intro} columns={2} /></div></section> : null}

    {support ? <section data-grid-section="12" className="coaching-section recovery-support" id={anchor(support.id)}><div className="coaching-wrap"><div className="coaching-heading"><SectionBody blocks={support.blocks.filter(block => block.kind !== "subsection")} columns={1} /></div><div className="recovery-support-grid"><figure className="recovery-path-photo"><img src="/images/editorial/forest-path.webp" alt="一位女性沿着林间步道向前走" width={1280} height={854} loading="lazy" decoding="async" {...photoProps("/images/editorial/forest-path.webp", "(max-width: 720px) 90vw, 34vw")} /></figure><TemplateTabs labels={modules.map(module => cleanTitle(module.title))} hint="点击支持层级，查看适合情况与具体内容">{modules.map((module, index) => <article id={module.id} key={module.id ?? index}><h3>{cleanTitle(module.title)}</h3><SupportContent blocks={module.blocks} /><SiteLink className="coaching-text-link" href="/book-consultation/#booking-channel">咨询这项支持<ArrowUpRight aria-hidden="true" /></SiteLink></article>)}</TemplateTabs></div></div></section> : null}

    {difficulties || approach ? <section data-grid-section="12" className="coaching-section recovery-context"><div className="coaching-wrap recovery-context-grid">{difficulties ? <div id={anchor(difficulties.id)}><h2>{cleanTitle(difficulties.title)}</h2>{difficultiesParts.filter(part => !part.title).slice(0, 2).map((part, index) => <RichText text={part.text} presentation="editorial" key={index} />)}<p className="recovery-interaction-hint">点击困扰，展开了解</p>{difficultiesParts.filter(part => part.title).map((part, index) => <Disclosure title={part.title} key={index}><RichText text={part.text} presentation="editorial" /></Disclosure>)}{difficultiesParts.filter(part => !part.title).slice(2).length ? <Disclosure title="这时可以先关注什么">{difficultiesParts.filter(part => !part.title).slice(2).map((part, index) => <RichText text={part.text} presentation="editorial" key={index} />)}</Disclosure> : null}<SectionBody blocks={difficulties.blocks.filter(block => block.kind !== "copy")} columns={1} /></div> : null}{approach ? <div id={anchor(approach.id)}><h2>{cleanTitle(approach.title)}</h2>{approachParts.filter(part => !part.title).map((part, index) => <RichText text={part.text} presentation="editorial" key={index} />)}<div className="recovery-topics"><TemplateTabs labels={topics.map(topic => topic.title.split(/[，时]/)[0])} hint="点击主题，查看可以获得的帮助">{topics.map((topic, index) => <article key={index}><h3>{topic.title}</h3><RichText text={topic.text} presentation="editorial" /></article>)}</TemplateTabs></div></div> : null}</div></section> : null}

    {approach ? <section data-grid-section="12" className="coaching-section recovery-related"><div className="coaching-wrap">{approach.blocks.filter(block => block.kind !== "copy").map((block, index) => block.kind === "actions" ? <div className="recovery-related-links" key={index}>{block.actions.map((action, actionIndex) => <SiteLink className="coaching-text-link" href={action.href} key={actionIndex}>{action.label}<ArrowUpRight aria-hidden="true" /></SiteLink>)}</div> : <SectionBody blocks={[block]} columns={1} key={index} />)}<figure className="recovery-room-photo"><img src="/images/editorial/sunlit-room.webp" alt="阳光照进窗边的木桌与座椅" width={1280} height={849} loading="lazy" decoding="async" {...photoProps("/images/editorial/sunlit-room.webp", "90vw")} /></figure></div></section> : null}

    {process ? <section data-grid-section="12" className="coaching-section recovery-process" id={anchor(process.id)}><div className="coaching-wrap"><h2>{cleanTitle(process.title)}</h2><p className="recovery-mobile-hint">点击步骤或左右滑动，查看全部服务安排</p><TemplateTabs labels={steps.map(step => step.title)} steps hint="点击步骤，了解从初次沟通到后续支持的安排">{steps.map((step, index) => <article key={index}><h3>{step.title}</h3><RichText text={step.text} presentation="editorial" /></article>)}</TemplateTabs>{copyParts(process.blocks).filter(part => !part.title).map((part, index) => <RichText text={part.text} presentation="editorial" key={index} />)}<SectionBody blocks={process.blocks.filter(block => block.kind !== "copy")} columns={1} /></div></section> : null}

    {principles ? <section data-grid-section="12" className="coaching-section recovery-principles" id={anchor(principles.id)}><div className="coaching-wrap recovery-principles-grid"><div><h2>{cleanTitle(principles.title)}</h2>{principlesParts.filter(part => part.title).map((part, index, all) => index === all.length - 1 ? <div className="recovery-boundary" key={index}><h3>{part.title}</h3><RichText text={part.text} presentation="editorial" /></div> : <Disclosure title={part.title} key={index}><RichText text={part.text} presentation="editorial" /></Disclosure>)}</div><aside className="recovery-important">{principlesParts.filter(part => !part.title).map((part, index) => index === 0 ? <h3 key={index}>{part.text}</h3> : <RichText text={part.text} presentation="editorial" key={index} />)}<SectionBody blocks={principles.blocks.filter(block => block.kind !== "copy")} columns={1} /></aside></div></section> : null}

    {content.content.sections.filter(section => !known.has(section.id)).map(section => <section data-grid-section="12" className="coaching-section" id={anchor(section.id)} key={section.id}><div className="coaching-wrap"><h2>{section.title}</h2><SectionBody blocks={section.blocks} columns={2} /></div></section>)}
    {content.content.cta ? <section data-grid-section="12" className="coaching-section recovery-start"><div className="coaching-wrap recovery-start-grid"><h2>{content.content.cta.title}</h2><div><RichText text={content.content.cta.body} presentation="editorial" /><div className="recovery-start-actions">{content.content.cta.actions.map((action, index) => <HomeButton variant={action.href.startsWith("/book-consultation/") ? "primary" : "text"} className={action.href.startsWith("/book-consultation/") ? "coaching-hero-button" : "coaching-text-link"} href={action.href === route ? `#${anchor(support?.id ?? "Q21")}` : action.href} key={index}>{action.label}{action.href.endsWith("#resources-availability") ? "（暂未开放）" : ""}<ArrowUpRight aria-hidden="true" /></HomeButton>)}</div></div></div></section> : null}
    <HomeDesignSystem><HomeInvitation content={invitation} openInNewTab /></HomeDesignSystem>
  </main><HomeDesignSystem><HomeFooter content={navigation ?? undefined} openInNewTab /></HomeDesignSystem><CoachingInteractions />{jsonLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} /> : null}</div>;
}
