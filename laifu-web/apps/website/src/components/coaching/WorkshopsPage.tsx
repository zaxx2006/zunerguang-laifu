import { SiteLink } from "@/components/site/SiteLink";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { HomeInvitation } from "@/components/home/HomeSections";
import { HomeHeader, HomeFooter } from "@/components/home/HomeNavigation";
import { HomeDesignSystem, HomeButton } from "@/components/home/HomePrimitives";
import { SectionBody } from "@/components/content/StructuredContent";
import { RichText } from "@/components/content/RichText";
import type { Block, Section, SubsectionBlock } from "@/contracts/page-content";
import { getNavigationPresentation, getHomePresentation, getSitePagePresentation } from "@/lib/cms-content-client";
import { photoProps } from "@/lib/photo";
import { siteConfig } from "@/lib/site-config";
import { CoachingInteractions } from "./CoachingInteractions";
import "./coaching.css";

const cleanTitle = (title: string) => title.replace(/^(?:0\d|\d+[.．、])\s*/, "");
const activityImages = [{ src: "/images/editorial/p30-workshop-practice.webp", alt: "五位成年人围桌参与工作坊练习" }, { src: "/images/editorial/p32-workshop-outdoors.webp", alt: "三位成年人在溪边草地上停留交流" }, { src: "/images/editorial/p31-workshop-group.webp", alt: "几位成年人坐在小组中交流与倾听" }];

function copyParts(blocks: Block[]) {
  return blocks.flatMap(block => block.kind === "copy" ? block.text.split(/\n\n/).map(text => {
    const match = text.match(/^(\d+)[.．]\s*([^\n：]+)(?:\n|：)([\s\S]*)$/);
    return match ? { number: match[1], title: match[2], text: match[3] } : { number: "", title: "", text };
  }) : []);
}

function Guidelines({ section }: { section: Section }) {
  return <div className="workshop-guidelines"><h2>{cleanTitle(section.title)}</h2>{copyParts(section.blocks).map((part, index) => part.title ? <details className="coaching-detail" key={index}><summary><span>{part.title}</span><span className="workshop-disclosure-action">查看说明<span className="coaching-plus" aria-hidden="true" /></span></summary><div className="coaching-detail-body"><RichText text={part.text} /></div></details> : <RichText key={index} text={part.text} />)}<SectionBody blocks={section.blocks.filter(block => block.kind !== "copy")} columns={1} /></div>;
}

export async function WorkshopsPage() {
  const [navigation, content, home] = await Promise.all([
    getNavigationPresentation({ preview: false }),
    getSitePagePresentation("/retreats-workshops/"),
    getHomePresentation({ preview: false }),
  ]);
  const invitation = home?.invitation;
  const sections = content.content.sections;
  const opening = sections.find(section => section.id === "Q05");
  const belonging = sections.find(section => section.id === "Q08");
  const approach = sections.find(section => section.id === "Q12");
  const activitySection = sections.find(section => section.id === "Q17");
  const activities = activitySection?.blocks.filter((block): block is SubsectionBlock => block.kind === "subsection") ?? [];
  const process = sections.find(section => section.id === "Q28");
  const steps = copyParts(process?.blocks ?? []).filter(part => part.title);
  const safety = sections.find(section => section.id === "Q30");
  const boundaries = sections.find(section => section.id === "Q32");
  const availability = sections.find(section => section.id === "availability");
  const handledIds = new Set(["Q05", "Q08", "Q12", "Q17", "Q28", "Q30", "Q32", "availability"]);
  const anchor = (id: string) => id.includes("-") ? id : `${content.anchorPrefix}-${id.toLowerCase()}`;
  const description = content.description.replace(/^服务定位：\s*/, "").split(/\n\n/);
  const statement = (opening?.title ?? content.title).split("，");
  const jsonLd = siteConfig.siteUrl ? { "@context": "https://schema.org", "@type": "Service", name: content.title, description: content.description, url: `${siteConfig.siteUrl}/retreats-workshops/` } : null;
  return <div className="coaching-page courses-page workshops-page" id="coaching-top">
    <HomeDesignSystem><HomeHeader breadcrumbSlug={"retreats-workshops"} content={navigation ?? undefined} homeHref="/" openInNewTab /></HomeDesignSystem>
    <main id="main-content" data-page="retreats-workshops" data-template="workshop-detail">
      <section data-grid-section="12" className="coaching-hero coaching-wrap" id={opening ? anchor(opening.id) : undefined} aria-labelledby="page-title"><div className="hero-copy"><h1 id="page-title">{content.title}</h1><p className="hero-statement">{statement.map((line, index) => <span key={index}>{index ? <br /> : null}{line}</span>)}</p>{description.map((paragraph, index) => <p className="hero-description" key={index}>{paragraph}</p>)}<div className="hero-actions"><HomeButton variant="primary" className="coaching-hero-button" href="/book-consultation/" target="_blank" rel="noopener noreferrer">预约咨询</HomeButton><SiteLink className="coaching-text-link" href={activitySection ? `#${anchor(activitySection.id)}` : "#workshop-availability"}>浏览活动形式<ArrowDown /></SiteLink></div><div className="course-hero-links">{activities.map(activity => <SiteLink href={`#${activity.id}`} key={activity.id}>{cleanTitle(activity.title)}<ArrowDown /></SiteLink>)}</div></div><figure className="hero-photo"><img src={content.image.src} alt={content.image.alt} width={content.image.width} height={content.image.height} fetchPriority="high" {...photoProps(content.image.src, "(max-width: 720px) 90vw, 45vw")} /></figure></section>
      <nav className="coaching-rail" aria-label="本页内容"><div className="coaching-wrap">{[[belonging, "同伴支持"], [activitySection, "三类活动"], [process, "参与流程"], [safety, "隐私与安全"], [availability, "近期安排"]].map(([section, label]) => typeof section === "object" && section ? <SiteLink href={`#${anchor(section.id)}`} data-section-link={anchor(section.id)} key={section.id}>{label as string}</SiteLink> : null)}<SiteLink className="rail-booking" href="/book-consultation/" target="_blank" rel="noopener noreferrer">预约咨询<ArrowUpRight /></SiteLink></div></nav>
      <section data-grid-section="12" className="coaching-section course-approach" id={belonging ? anchor(belonging.id) : undefined}><div className="coaching-wrap course-approach-layout"><div><h2>{belonging ? cleanTitle(belonging.title) : "学习、连接与重建"}</h2><div className="workshop-intro-actions"><SectionBody blocks={content.content.intro} columns={1} /></div></div><div>{opening ? <SectionBody blocks={opening.blocks} columns={1} /> : null}{belonging ? <details className="course-availability"><summary>了解这里可以提供的支持<span className="coaching-plus" aria-hidden="true" /></summary><SectionBody blocks={belonging.blocks} columns={1} /></details> : null}{description.slice(1).map((text, index) => <p className="workshop-principle" key={index}>{text}</p>)}</div></div></section>
      {activitySection ? <section data-grid-section="12" className="coaching-section coaching-fit" id={anchor(activitySection.id)}><div className="coaching-wrap"><div className="coaching-heading"><h2>{cleanTitle(activitySection.title)}</h2><p>点击活动类型，查看适合人群、主要内容与参与形式。</p></div><div className="course-catalogue" data-tabs="workshop-activity"><div className="course-topic-tabs" role="tablist" aria-label="选择活动类型" aria-orientation="vertical">{activities.map((activity, index) => <button type="button" role="tab" id={`workshop-activity-tab-${index}`} data-tab={index} aria-selected={index === 0} aria-controls={`workshop-activity-panel-${index}`} tabIndex={index === 0 ? 0 : -1} key={activity.id}><span>{cleanTitle(activity.title)}</span><ArrowUpRight /></button>)}</div><div className="course-topic-panels">{activities.map((activity, index) => <div role="tabpanel" id={`workshop-activity-panel-${index}`} aria-labelledby={`workshop-activity-tab-${index}`} hidden={index !== 0} tabIndex={0} key={activity.id}><div className="workshop-activity" id={activity.id}><h3>{cleanTitle(activity.title)}</h3>{activityImages[index] ? <figure><img src={activityImages[index].src} alt={activityImages[index].alt} width={1280} height={854} loading="lazy" decoding="async" {...photoProps(activityImages[index].src, "(max-width: 720px) 90vw, 52vw")} /></figure> : null}<div className="workshop-activity-copy"><SectionBody blocks={activity.blocks} columns={1} /></div><SiteLink className="coaching-text-link" href={process ? `#${anchor(process.id)}` : "/book-consultation/"}>了解参与流程<ArrowUpRight /></SiteLink></div></div>)}</div></div><SectionBody blocks={activitySection.blocks.filter(block => block.kind !== "subsection")} columns={1} />{approach ? <details className="course-availability workshop-design-note" id={anchor(approach.id)}><summary>{cleanTitle(approach.title)}<span className="coaching-plus" aria-hidden="true" /></summary><SectionBody blocks={approach.blocks} columns={1} /></details> : null}</div></section> : null}
      {process ? <section data-grid-section="12" className="coaching-section" id={anchor(process.id)}><div className="coaching-wrap"><div className="coaching-heading"><h2>{cleanTitle(process.title)}</h2><p>点击步骤，了解从初次沟通到活动结束后的具体安排。</p></div><div data-tabs="workshop-process"><div className="workshop-process-tabs" role="tablist" aria-label="查看参与步骤">{steps.map((step, index) => <button type="button" role="tab" id={`workshop-process-tab-${index}`} data-tab={index} aria-selected={index === 0} aria-controls={`workshop-process-panel-${index}`} tabIndex={index === 0 ? 0 : -1} key={index}><span className="process-dot">{step.number.padStart(2, "0")}</span><span>{step.title}</span><ArrowUpRight /></button>)}</div>{steps.map((step, index) => <div className="workshop-process-panel" role="tabpanel" id={`workshop-process-panel-${index}`} aria-labelledby={`workshop-process-tab-${index}`} hidden={index !== 0} tabIndex={0} key={index}><h3>{step.title}</h3><RichText text={step.text} /><SiteLink className="coaching-text-link" href="/book-consultation/#booking-channel" target="_blank" rel="noopener noreferrer">咨询参与安排<ArrowUpRight /></SiteLink></div>)}</div>{copyParts(process.blocks).filter(part => !part.title).map((part, index) => <RichText key={index} text={part.text} />)}<SectionBody blocks={process.blocks.filter(block => block.kind !== "copy")} columns={1} /></div></section> : null}
      <section data-grid-section="12" className="coaching-section workshop-safety" id={safety ? anchor(safety.id) : undefined}><div className="coaching-wrap workshop-safety-layout">{safety ? <Guidelines section={safety} /> : null}{boundaries ? <div id={anchor(boundaries.id)}><Guidelines section={boundaries} /></div> : null}</div></section>
      {sections.filter(section => !handledIds.has(section.id)).map(section => <section data-grid-section="12" className="coaching-section" id={anchor(section.id)} key={section.id}><div className="coaching-wrap"><h2>{section.title}</h2><SectionBody blocks={section.blocks} columns={1} /></div></section>)}
      <section data-grid-section="12" className="coaching-section course-next" id="workshop-consultation"><div className="coaching-wrap course-next-layout">{content.content.cta ? <div><h2>{content.content.cta.title}</h2><RichText text={content.content.cta.body} /><div className="workshop-cta-actions">{content.content.cta.actions.map((action, index) => action.label === "查看近期活动" ? null : <HomeButton variant={index === 1 ? "primary" : "text"} className={index === 1 ? "coaching-hero-button" : "coaching-text-link"} key={index} href={action.href.startsWith("/retreats-workshops/#") ? `#${action.href.split("#")[1]}` : action.href} target={action.href.startsWith("/retreats-workshops/#") ? undefined : "_blank"} rel={action.href.startsWith("/retreats-workshops/#") ? undefined : "noopener noreferrer"}>{action.label}{index !== 1 ? action.href.startsWith("/retreats-workshops/#") ? <ArrowDown /> : <ArrowUpRight /> : null}</HomeButton>)}</div></div> : null}<div className="course-related"><details className="course-availability workshop-availability" id={availability ? anchor(availability.id) : "workshop-availability"}><summary><span>{availability?.title ?? "近期活动安排"}</span><span className="coaching-plus" aria-hidden="true" /></summary>{availability ? <div className="course-release-note"><SectionBody blocks={availability.blocks} columns={1} /></div> : null}</details><SiteLink className="coaching-text-link" href="/courses-workshops/" target="_blank" rel="noopener noreferrer">也可以先浏览课程与学习主题<ArrowUpRight /></SiteLink></div></div></section>
      <HomeDesignSystem><HomeInvitation content={invitation} openInNewTab /></HomeDesignSystem>
    </main>
    <HomeDesignSystem><HomeFooter content={navigation ?? undefined} openInNewTab /></HomeDesignSystem><CoachingInteractions />
    {jsonLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} /> : null}
  </div>;
}
