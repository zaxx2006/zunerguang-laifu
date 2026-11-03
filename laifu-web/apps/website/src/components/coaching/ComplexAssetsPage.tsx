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

const route = "/services/nuptial-agreements/";
const cleanTitle = (title: string) => title.replace(/^\d+\s+/, "");
const asBullets = (text: string) => text.replace(/^[（(]\d+[）)]/gm, "·");
const modulePhotos = [{ src: "/images/editorial/p27-assets-workspace.webp", alt: "一位成年人把资料整理进侧柜上的文件盒" }, { src: "/images/editorial/p26-assets-finance.webp", alt: "旧木桌上展开的平面草图、资料与文件套" }, { src: "/images/editorial/p28-assets-collaboration.webp", alt: "三位成年人围桌审慎讨论资料" }];

function copyText(blocks: Block[]) { return blocks.flatMap(block => block.kind === "copy" ? [block.text] : []).join("\n\n"); }

function numberedParts(text: string) {
  return text.split(/\n(?=[（(]\d+[）)]|0\d\s)/).map(part => {
    const match = part.trim().match(/^(?:[（(]\d+[）)]|0\d\s+)\s*([^\n]+)\n([\s\S]*)$/);
    return match ? { title: match[1], text: match[2].trim() } : { title: "", text: part.trim() };
  }).filter(part => part.text);
}

function Disclosure({ title, children, id }: { title: string; children: ReactNode; id?: string }) {
  return <details className="coaching-detail assets-disclosure" id={id}><summary><span>{title}</span><span className="assets-disclosure-action"><span className="assets-open-label">展开</span><span className="assets-close-label">收起</span><span className="coaching-plus" aria-hidden="true" /></span></summary><div className="coaching-detail-body">{children}</div></details>;
}

function ModuleBody({ blocks, index }: { blocks: Block[]; index: number }) {
  const parts = copyText(blocks).split(/\n\n(?=服务内容：|服务交付：|服务形式：)/);
  const photo = modulePhotos[index % modulePhotos.length];
  return <><div className="assets-module-grid"><div className="assets-module-overview"><figure><img src={photo.src} alt={photo.alt} width={1280} height={854} loading="lazy" decoding="async" {...photoProps(photo.src, "(max-width: 720px) 90vw, 35vw")} /></figure><RichText text={parts[0] ?? ""} presentation="editorial" /></div><div className="assets-module-reading">{parts.slice(1).map((part, partIndex) => {
    const [title, ...lines] = part.split("\n");
    const text = lines.join("\n");
    return title === "服务内容：" ? <div className="assets-service-notes" key={partIndex}><h4>{title}</h4>{numberedParts(text).map((note, noteIndex) => <article key={noteIndex}>{note.title ? <h5>{note.title}</h5> : null}<RichText text={note.text} presentation="editorial" /></article>)}</div> : <Disclosure title={title.replace(/：$/, "")} key={partIndex}><RichText text={asBullets(text)} presentation="editorial" /></Disclosure>;
  })}<SiteLink className="coaching-text-link" href="/book-consultation/#booking-channel">咨询这项服务<ArrowUpRight aria-hidden="true" /></SiteLink></div></div><SectionBody blocks={blocks.filter(block => block.kind !== "copy")} columns={1} /></>;
}

export async function ComplexAssetsPage() {
  const [navigation, content, home] = await Promise.all([getNavigationPresentation({ preview: false }), getSitePagePresentation(route), getHomePresentation({ preview: false })]);
  const invitation = home?.invitation;
  const sections = new Map(content.content.sections.map(section => [section.id, section]));
  const overview = sections.get("Q05"), fit = sections.get("Q09"), coordination = sections.get("Q19"), support = sections.get("Q24"), scenarios = sections.get("Q32"), process = sections.get("Q34"), privacy = sections.get("Q36"), boundaries = sections.get("Q38"), start = sections.get("Q40");
  const modules = support?.blocks.filter(block => block.kind === "subsection") ?? [];
  const sceneParts = numberedParts(copyText(scenarios?.blocks ?? []));
  const scenes = sceneParts.filter(part => part.title);
  const steps = numberedParts(copyText(process?.blocks ?? [])).filter(part => part.title);
  const fitParts = copyText(fit?.blocks ?? []).split(/\n{2,}/);
  const coordinationParts = copyText(coordination?.blocks ?? []).split(/\n{2,}/);
  const boundaryParts = copyText(boundaries?.blocks ?? []).split(/\n(?=\d+\.)/);
  const description = content.description.split(/\n+/).filter(Boolean);
  const anchor = (id: string) => id.includes("-") ? id : `${content.anchorPrefix}-${id.toLowerCase()}`;
  const nav = [[support, "服务模块"], [scenarios, "典型场景"], [coordination, "协作方式"], [process, "服务流程"], [privacy, "保密机制"], [boundaries, "服务边界"]] as const;
  const known = new Set(["Q05", "Q09", "Q19", "Q24", "Q32", "Q34", "Q36", "Q38", "Q40"]);
  const jsonLd = siteConfig.siteUrl ? { "@context": "https://schema.org", "@type": "Service", name: content.title, description: content.description, url: `${siteConfig.siteUrl}${route}`, provider: { "@type": "Organization", name: siteConfig.nameZh, url: siteConfig.siteUrl } } : null;

  return <div className="coaching-page assets-page" id="coaching-top"><HomeDesignSystem><HomeHeader breadcrumbSlug={"services/nuptial-agreements"} content={navigation ?? undefined} homeHref="/" openInNewTab /></HomeDesignSystem><main id="main-content" data-page="nuptial-agreements" data-template="complex-assets">
    <section data-grid-section="12" className="coaching-hero coaching-wrap" aria-labelledby="page-title"><div className="hero-copy"><h1 id="page-title">{content.title}</h1>{description.map((line, index) => <p className={index === 0 ? "assets-hero-statement" : index === 1 ? "assets-hero-promise" : index === description.length - 1 && line.includes("｜") ? "assets-hero-features" : "hero-description"} key={index}>{line}</p>)}<div className="hero-actions"><HomeButton variant="primary" className="coaching-hero-button" href="/book-consultation/">预约一对一保密评估</HomeButton>{support ? <SiteLink className="coaching-text-link" href={`#${anchor(support.id)}`}>了解服务模块<ArrowDown aria-hidden="true" /></SiteLink> : null}</div>{overview ? <Disclosure title={overview.title} id={anchor(overview.id)}><SectionBody blocks={overview.blocks} columns={1} /></Disclosure> : null}</div><figure className="hero-photo"><img src={content.image.src} alt={content.image.alt} width={content.image.width} height={content.image.height} fetchPriority="high" {...photoProps(content.image.src, "(max-width: 720px) 90vw, 42vw")} /></figure></section>
    <nav className="coaching-rail" aria-label="本页内容"><div className="coaching-wrap">{nav.map(([section, label]) => section ? <SiteLink href={`#${anchor(section.id)}`} data-section-link={anchor(section.id)} key={section.id}>{label}</SiteLink> : null)}<SiteLink className="assets-rail-booking" href="/book-consultation/">预约咨询<ArrowUpRight aria-hidden="true" /></SiteLink></div></nav>
    {content.content.intro.length ? <section data-grid-section="12" className="coaching-section"><div className="coaching-wrap"><SectionBody blocks={content.content.intro} columns={2} /></div></section> : null}

    {support ? <section data-grid-section="12" className="coaching-section assets-support" id={anchor(support.id)}><div className="coaching-wrap"><div className="coaching-heading"><h2>{support.title}</h2><SectionBody blocks={support.blocks.filter(block => block.kind !== "subsection")} columns={1} /></div><TemplateTabs labels={modules.map(module => cleanTitle(module.title))} hint="点击服务模块，查看具体内容、交付成果与服务形式">{modules.map((module, index) => <article id={module.id} key={module.id ?? index}><h3>{cleanTitle(module.title)}</h3><ModuleBody blocks={module.blocks} index={index} /></article>)}</TemplateTabs></div></section> : null}

    {scenarios ? <section data-grid-section="12" className="coaching-section assets-scenarios" id={anchor(scenarios.id)}><div className="coaching-wrap"><div className="coaching-heading"><h2>{scenarios.title}</h2>{sceneParts.filter(part => !part.title).map((part, index) => <p key={index}>{part.text}</p>)}</div><div className="assets-scenarios-grid"><div><TemplateTabs labels={scenes.map(scene => scene.title.split("：")[0])} hint="点击场景，了解不同处境下怎样提供支持">{scenes.map((scene, index) => <article key={index}><h3>{scene.title}</h3><RichText text={scene.text} presentation="editorial" /></article>)}</TemplateTabs></div><figure><img src="/images/editorial/p29-assets-documents.webp" alt="长凳上的蓝色资料收纳包、纸张和钥匙" width={1280} height={854} loading="lazy" decoding="async" {...photoProps("/images/editorial/p29-assets-documents.webp", "(max-width: 720px) 90vw, 35vw")} /></figure></div><SectionBody blocks={scenarios.blocks.filter(block => block.kind !== "copy")} columns={1} /></div></section> : null}

    {fit || coordination ? <section data-grid-section="12" className="coaching-section assets-coordination"><div className="coaching-wrap assets-coordination-grid">{fit ? <div id={anchor(fit.id)}><h2>{fit.title}</h2>{fitParts[0] ? <RichText text={fitParts[0]} presentation="editorial" /> : null}{fitParts[1] ? <Disclosure title="看看是否有你正在面对的情况"><RichText text={fitParts[1]} presentation="editorial" /></Disclosure> : null}{fitParts.slice(2).map((text, index) => <RichText text={text} presentation="editorial" key={index} />)}<SectionBody blocks={fit.blocks.filter(block => block.kind !== "copy")} columns={1} /></div> : null}{coordination ? <div id={anchor(coordination.id)}><h2>{coordination.title}</h2>{coordinationParts[0] ? <RichText text={coordinationParts[0]} presentation="editorial" /> : null}{coordinationParts[1] ? <Disclosure title="查看统筹时关注的事项"><RichText text={coordinationParts[1]} presentation="editorial" /></Disclosure> : null}{coordinationParts.slice(2).map((text, index) => <RichText text={text} presentation="editorial" key={index} />)}<SectionBody blocks={coordination.blocks.filter(block => block.kind !== "copy")} columns={1} /></div> : null}</div></section> : null}

    {process ? <section data-grid-section="12" className="coaching-section assets-process" id={anchor(process.id)}><div className="coaching-wrap"><h2>{process.title}</h2><p className="assets-mobile-hint">点击步骤或左右滑动，查看从初访到跟进的安排</p><TemplateTabs labels={steps.map(step => step.title)} steps hint="点击步骤，了解每个阶段怎样推进">{steps.map((step, index) => <article key={index}><h3>{step.title}</h3><RichText text={step.text} presentation="editorial" /></article>)}</TemplateTabs>{numberedParts(copyText(process.blocks)).filter(part => !part.title).map((part, index) => <RichText text={part.text} presentation="editorial" key={index} />)}<SectionBody blocks={process.blocks.filter(block => block.kind !== "copy")} columns={1} /></div></section> : null}

    {privacy || boundaries ? <section data-grid-section="12" className="coaching-section assets-boundaries"><div className="coaching-wrap assets-boundaries-grid">
      {privacy ? <div className="assets-privacy" id={anchor(privacy.id)}><h2>{privacy.title}</h2><SectionBody blocks={privacy.blocks.map(block => block.kind === "copy" ? { ...block, text: asBullets(block.text) } : block)} columns={1} /></div> : null}
      {boundaries ? <div id={anchor(boundaries.id)}><h2>{boundaries.title}</h2>{boundaryParts.slice(0, 2).map((text, index) => <RichText text={text.replace(/^\d+\./, "")} presentation="editorial" key={index} />)}{boundaryParts.slice(2).map((text, index) => { const body = text.replace(/^\d+\./, ""); return <Disclosure title={body.split(/[，。]/)[0]} key={index}><RichText text={body} presentation="editorial" /></Disclosure>; })}<SectionBody blocks={boundaries.blocks.filter(block => block.kind !== "copy")} columns={1} /></div> : null}
    </div></section> : null}

    {content.content.sections.filter(section => !known.has(section.id)).map(section => <section data-grid-section="12" className="coaching-section" id={anchor(section.id)} key={section.id}><div className="coaching-wrap"><h2>{section.title}</h2><SectionBody blocks={section.blocks} columns={2} /></div></section>)}
    {start ? <section data-grid-section="12" className="coaching-section assets-start" id={anchor(start.id)}><div className="coaching-wrap assets-start-grid"><h2>{start.title}</h2><div><SectionBody blocks={start.blocks} columns={1} /><div className="assets-start-actions"><HomeButton variant="primary" className="coaching-hero-button" href="/book-consultation/#booking-channel">预约一对一保密评估</HomeButton>{support ? <SiteLink className="coaching-text-link" href={`#${anchor(support.id)}`}>再看看服务内容<ArrowDown aria-hidden="true" /></SiteLink> : null}</div></div></div></section> : null}
    {content.content.cta ? <section data-grid-section="12" className="coaching-section assets-start"><div className="coaching-wrap"><h2>{content.content.cta.title}</h2><RichText text={content.content.cta.body} presentation="editorial" /><SectionBody blocks={[{ kind: "actions", actions: content.content.cta.actions }]} columns={1} /></div></section> : null}
    <HomeDesignSystem><HomeInvitation content={invitation} openInNewTab /></HomeDesignSystem>
  </main><HomeDesignSystem><HomeFooter content={navigation ?? undefined} openInNewTab /></HomeDesignSystem><CoachingInteractions />{jsonLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} /> : null}</div>;
}
