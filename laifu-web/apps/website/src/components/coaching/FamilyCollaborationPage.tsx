import type { ReactNode } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
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

const route = "/collaborative-law/";
const cleanTitle = (title: string) => title.replace(/^\d+\.\s*/, "");
const phases = ["初始评估与梳理", "选择方式与会前准备", "专业处理与阶段检查"];
const copyText = (blocks: Block[]) => blocks.flatMap(block => block.kind === "copy" ? [block.text] : []).join("\n\n");

function Disclosure({ title, children, id }: { title: string; children: ReactNode; id?: string }) {
  return <details className="coaching-detail family-disclosure" id={id}>
    <summary><span>{title}</span><span className="family-disclosure-action"><span className="family-open-label">展开</span><span className="family-close-label">收起</span><span className="coaching-plus" aria-hidden="true" /></span></summary>
    <div className="coaching-detail-body">{children}</div>
  </details>;
}

function ActionLinks({ actions, primary = false }: { actions: Action[]; primary?: boolean }) {
  return <div className="family-actions">{actions.filter(action => action.href !== `${route}#collaboration-q26` && action.href !== "#collaboration-q26").map((action, index) => {
    const local = action.href.startsWith(`${route}#`);
    const href = local ? action.href.slice(route.length) : action.href;
    const booking = primary && href.startsWith("/book-consultation/");
    return <HomeButton variant={booking ? "primary" : "text"} className={booking ? "coaching-hero-button" : "coaching-text-link"} href={href} key={index}>{action.label}{!booking && (href.startsWith("#") ? <ArrowDown aria-hidden="true" /> : <ArrowUpRight aria-hidden="true" />)}</HomeButton>;
  })}</div>;
}

function Body({ blocks }: { blocks: Block[] }) {
  return <>{blocks.map((block, index) => block.kind === "actions" ? <ActionLinks actions={block.actions} key={index} /> : <SectionBody blocks={[block]} columns={1} key={index} />)}</>;
}

export async function FamilyCollaborationPage() {
  const [navigation, content, home] = await Promise.all([getNavigationPresentation({ preview: false }), getSitePagePresentation(route), getHomePresentation({ preview: false })]);
  const invitation = home?.invitation;
  const sections = new Map(content.content.sections.map(section => [section.id, section]));
  const overview = sections.get("Q05"), models = sections.get("Q17"), support = sections.get("Q30"), roles = sections.get("Q35"), privacy = sections.get("Q41"), process = sections.get("Q43"), meeting = sections.get("Q45"), related = sections.get("Q47");
  const overviewCopy = overview?.blocks.find(block => block.kind === "copy");
  const heroActions = (overview?.blocks ?? content.content.intro).flatMap(block => block.kind === "actions" ? block.actions : []);
  const uses = support?.blocks.find(block => block.kind === "grid");
  const roleTable = roles?.blocks.find(block => block.kind === "table");
  const modelTable = models?.blocks.find(block => block.kind === "table");
  const processLines = copyText(process?.blocks ?? []).split("\n").filter(Boolean);
  const steps = processLines.flatMap(line => { const match = line.match(/^(\d+)\.([^：]+)：(.+)$/); return match ? [{ number: Number(match[1]), title: match[2], text: match[3] }] : []; });
  const meetingParts = copyText(meeting?.blocks ?? []).split(/\n{2,}/);
  const privacyParts = copyText(privacy?.blocks ?? []).split(/\n{2,}/);
  const privacyLines = privacyParts.slice(1).join("\n").split("\n").filter(Boolean);
  const relatedItems = related?.blocks.find(block => block.kind === "grid");
  const anchor = (id: string) => id.includes("-") ? id : `${content.anchorPrefix}-${id.toLowerCase()}`;
  const nav = [[support, "支持方式"], [roles, "角色分工"], [process, "服务流程"], [meeting, "会前会后"], [privacy, "书面授权"]] as const;
  const known = new Set(["Q05", "Q11", "Q17", "Q24", "Q26", "Q28", "Q30", "Q35", "Q41", "Q43", "Q45", "Q47", "58"]);
  const jsonLd = siteConfig.siteUrl ? { "@context": "https://schema.org", "@type": "Service", name: content.title, description: content.description, url: `${siteConfig.siteUrl}${route}`, provider: { "@type": "Organization", name: siteConfig.nameZh, url: siteConfig.siteUrl } } : null;

  return <div className="coaching-page family-page" id="coaching-top">
    <HomeDesignSystem><HomeHeader breadcrumbSlug={"collaborative-law"} content={navigation ?? undefined} homeHref="/" openInNewTab /></HomeDesignSystem>
    <main id="main-content" data-page="collaborative-law" data-template="family-collaboration">
      <section data-grid-section="12" className="coaching-hero coaching-wrap" aria-labelledby="page-title">
        <div className="hero-copy">
          <h1 id="page-title">{content.title}</h1>
          {overviewCopy ? <p className="family-hero-lead">{overviewCopy.text}</p> : null}
          <p className="hero-description">{content.description}</p>
          <ActionLinks actions={heroActions} primary />
          {overview ? <Disclosure title={overview.title} id={anchor(overview.id)}><Body blocks={overview.blocks.filter(block => block !== overviewCopy && block.kind !== "actions")} /></Disclosure> : null}
        </div>
        <figure className="hero-photo"><img src={content.image.src} alt={content.image.alt} width={content.image.width} height={content.image.height} fetchPriority="high" {...photoProps(content.image.src, "(max-width: 720px) 90vw, 42vw")} /></figure>
      </section>
      <nav className="coaching-rail" aria-label="本页内容"><div className="coaching-wrap">{nav.map(([section, label]) => section ? <SiteLink href={`#${anchor(section.id)}`} data-section-link={anchor(section.id)} key={section.id}>{label}</SiteLink> : null)}<SiteLink className="family-rail-booking" href="/book-consultation/">预约咨询<ArrowUpRight aria-hidden="true" /></SiteLink></div></nav>
      {content.content.intro.length ? <section data-grid-section="12" className="coaching-section"><div className="coaching-wrap"><Body blocks={content.content.intro.filter(block => block.kind !== "actions")} /></div></section> : null}

      {support ? <section data-grid-section="12" className="coaching-section family-support" id={anchor(support.id)}><div className="coaching-wrap">
        <div className="coaching-heading"><h2>{support.title.replace("三种方式", "")}</h2><p>点击支持方式，了解谁会参与、怎样准备和推进。</p></div>
        <div className="family-support-grid">
          <div className="family-support-overview">
            <figure><img src="/images/editorial/p22-family-teamwork.webp" alt="三位成年人在同一工作空间各自整理资料" width={1280} height={854} loading="lazy" decoding="async" {...photoProps("/images/editorial/p22-family-teamwork.webp", "(max-width: 720px) 90vw, 34vw")} /></figure>
          </div>
          <div>
            {uses ? <TemplateTabs labels={uses.items.map(item => cleanTitle(item.title))} hint="点击下方入口，查看具体支持内容">{uses.items.map((item, index) => <article id={item.id ?? `collaboration-use-${index}`} key={index}><h3>{cleanTitle(item.title)}</h3><Body blocks={item.blocks} />{item.href ? <SiteLink className="coaching-text-link" href={item.href}>了解这项支持<ArrowUpRight aria-hidden="true" /></SiteLink> : null}</article>)}</TemplateTabs> : null}
            <Body blocks={support.blocks.filter(block => block.kind !== "grid")} />
          </div>
        </div>
      </div></section> : null}

      {models ? <section data-grid-section="12" className="coaching-section" id={anchor(models.id)}><div className="coaching-wrap">
        <h2>{models.title}</h2>
        {modelTable ? <div className="family-models">{modelTable.rows.map((row, index) => <article key={index}><h3>{row[0]}</h3><dl>{modelTable.headers.slice(1).map((header, cellIndex) => <div key={header}><dt>{header}</dt><dd>{row[cellIndex + 1]}</dd></div>)}</dl></article>)}</div> : null}
        <Body blocks={models.blocks.filter(block => block.kind !== "table")} />
      </div></section> : null}

      {roles ? <section data-grid-section="12" className="coaching-section family-roles" id={anchor(roles.id)}><div className="coaching-wrap">
        <h2>{roles.title}</h2>
        {roleTable ? <TemplateTabs labels={roleTable.rows.map(row => row[0])} hint="点击角色，查看职责和专业边界">{roleTable.rows.map((row, index) => <article key={index}><h3>{row[0]}</h3><div className="family-role-columns">{roleTable.headers.slice(1).map((header, cellIndex) => <div key={header}><h4>{header}</h4><RichText text={row[cellIndex + 1]} presentation="editorial" /></div>)}</div></article>)}</TemplateTabs> : null}
        <Body blocks={roles.blocks.filter(block => block.kind !== "table")} />
      </div></section> : null}

      {process ? <section data-grid-section="12" className="coaching-section family-process" id={anchor(process.id)}><div className="coaching-wrap">
        <h2>{process.title}</h2>
        <TemplateTabs labels={phases} hint="点击阶段，查看九步流程中对应的安排">{phases.map((phase, phaseIndex) => <div key={phase}><ol className="family-process-list" start={phaseIndex * 3 + 1}>{steps.slice(phaseIndex * 3, phaseIndex * 3 + 3).map(step => <li key={step.number}><span aria-hidden="true">{step.number}</span><div><h3>{step.title}</h3><RichText text={step.text} presentation="editorial" /></div></li>)}</ol></div>)}</TemplateTabs>
        {processLines.filter(line => !/^\d+\./.test(line)).map((text, index) => <p className="family-process-note" key={index}>{text}</p>)}
        <Body blocks={process.blocks.filter(block => block.kind !== "copy")} />
      </div></section> : null}

      {meeting || privacy ? <section data-grid-section="12" className="coaching-section family-meetings"><div className="coaching-wrap family-meetings-grid">
        <div>
          <figure className="family-meeting-photo"><img src="/images/editorial/p23-family-information.webp" alt="一只手把文件夹放入资料架" width={1280} height={854} loading="lazy" decoding="async" {...photoProps("/images/editorial/p23-family-information.webp", "(max-width: 720px) 90vw, 35vw")} /></figure>
          {privacy ? <div className="family-privacy" id={anchor(privacy.id)}><h2>{privacy.title}</h2>{privacyParts[0] ? <RichText text={privacyParts[0]} presentation="editorial" /> : null}<Disclosure title="查看授权前需要确认的信息范围"><RichText text={privacyLines.slice(0, -1).join("\n")} presentation="editorial" /></Disclosure>{privacyLines.at(-1) ? <RichText text={privacyLines.at(-1)!.replace(/^[·•]/, "")} presentation="editorial" /> : null}<Body blocks={privacy.blocks.filter(block => block.kind !== "copy")} /></div> : null}
        </div>
        {meeting ? <div id={anchor(meeting.id)}><h2>{meeting.title}</h2><TemplateTabs labels={["会前准备", "会后确认", "谈不动时如何调整"]} hint="点击主题，查看会议前后的准备与确认事项">{[0, 1, 2].map(index => <article key={index}>{index < 2 ? <><h3>{meetingParts[index]?.split("\n")[0]}</h3><RichText text={meetingParts[index]?.split("\n").slice(1).join("\n") ?? ""} presentation="editorial" /></> : <>{meetingParts.slice(2).map((text, textIndex) => <RichText text={text} presentation="editorial" key={textIndex} />)}</>}</article>)}</TemplateTabs><Body blocks={meeting.blocks.filter(block => block.kind !== "copy")} /></div> : null}
      </div></section> : null}

      {related ? <section data-grid-section="12" className="coaching-section family-related" id={anchor(related.id)}><div className="coaching-wrap"><h2>{related.title}</h2><div className="family-related-list">{relatedItems?.items.map((item, index) => <article key={index} id={item.id}><h3>{item.title}</h3><Body blocks={item.blocks.map(block => block.kind === "actions" ? { ...block, actions: block.actions.map(action => action.href === `${route}#collaboration-q30` ? { ...action, href: "#collaboration-use-3" } : action) } : block)} /></article>)}</div><Body blocks={related.blocks.filter(block => block.kind !== "grid")} /></div></section> : null}

      {content.content.sections.filter(section => !known.has(section.id)).map(section => <section data-grid-section="12" className="coaching-section" id={anchor(section.id)} key={section.id}><div className="coaching-wrap"><h2>{section.title}</h2><Body blocks={section.blocks} /></div></section>)}
      {content.content.cta ? <section data-grid-section="12" className="coaching-section family-handoff"><div className="coaching-wrap"><h2>{content.content.cta.title}</h2><RichText text={content.content.cta.body} presentation="editorial" /><ActionLinks actions={content.content.cta.actions} primary /></div></section> : null}
      <HomeDesignSystem><HomeInvitation content={invitation} openInNewTab /></HomeDesignSystem>
    </main>
    <HomeDesignSystem><HomeFooter content={navigation ?? undefined} openInNewTab /></HomeDesignSystem>
    <CoachingInteractions />
    {jsonLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} /> : null}
  </div>;
}
