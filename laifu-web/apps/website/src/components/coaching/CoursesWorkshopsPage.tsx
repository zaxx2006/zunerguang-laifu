import { SiteLink } from "@/components/site/SiteLink";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { HomeInvitation } from "@/components/home/HomeSections";
import { HomeHeader, HomeFooter } from "@/components/home/HomeNavigation";
import { HomeDesignSystem, HomeButton } from "@/components/home/HomePrimitives";
import { SectionBody } from "@/components/content/StructuredContent";
import { RichText } from "@/components/content/RichText";
import type { Block, Section } from "@/contracts/page-content";
import { getNavigationPresentation, getHomePresentation, getSitePagePresentation } from "@/lib/cms-content-client";
import { photoProps } from "@/lib/photo";
import { siteConfig } from "@/lib/site-config";
import { CoachingInteractions } from "./CoachingInteractions";
import "./coaching.css";

const topicLabels: Record<string, string> = {
  Q05: "高冲突离婚",
  Q14: "共同养育与子女保护",
  Q19: "谈判与程序准备",
  Q24: "情绪疗愈与生活重建",
  Q28: "小组成长与沉浸支持",
};
const cleanTitle = (title: string) => title.replace(/^(?:0\d|\d+[.．、]|[（(]\d+[）)])\s*/, "");

function CourseEntry({ title, blocks, id, first = false, group }: { title: string; blocks: Block[]; id?: string; first?: boolean; group: string }) {
  return <details className="coaching-detail course-entry" id={id} name={group} open={first}>
    <summary><h3>{cleanTitle(title)}</h3><span className="course-entry-action"><span className="course-open-label">展开内容</span><span className="course-close-label">收起内容</span><span className="coaching-plus" aria-hidden="true" /></span></summary>
    <div className="coaching-detail-body course-entry-body"><SectionBody blocks={blocks} columns={1} /></div>
  </details>;
}

function TopicContent({ section, prefix }: { section: Section; prefix: string }) {
  const wrapper = section.blocks.length === 1 && section.blocks[0].kind === "subsection" && !section.blocks[0].collapsible ? section.blocks[0] : null;
  const blocks = wrapper ? wrapper.blocks : section.blocks;
  const title = cleanTitle(wrapper?.title ?? section.title);
  const intro = blocks[0]?.kind === "copy" ? blocks[0].text : "";
  const paragraphs = intro.split(/\n\n/);
  const groupedProgramme = section.id === "Q28" && paragraphs.length > 2;
  const entries = blocks.slice(intro ? 1 : 0);
  return <div className="course-topic" id={`${prefix}-${section.id.toLowerCase()}`}>
    <div className="course-topic-heading" id={wrapper?.id}><h3>{title}</h3>{intro ? <RichText text={groupedProgramme ? paragraphs[0] : intro} /> : null}</div>
    <div className="course-entries">
      {groupedProgramme ? <CourseEntry title={paragraphs[1]} blocks={[{ kind: "copy", text: paragraphs.slice(2).join("\n\n") }]} first group={`course-${section.id}`} /> : null}
      {entries.map((block, index) => block.kind === "subsection" ? <CourseEntry key={index} title={block.title} blocks={block.blocks} id={block.id} first={!groupedProgramme && index === 0} group={`course-${section.id}`} /> : <SectionBody key={index} blocks={[block]} columns={1} />)}
    </div>
  </div>;
}

export async function CoursesWorkshopsPage() {
  const [navigation, content, home] = await Promise.all([
    getNavigationPresentation({ preview: false }),
    getSitePagePresentation("/courses-workshops/"),
    getHomePresentation({ preview: false }),
  ]);
  const invitation = home?.invitation;
  const topics = content.content.sections.filter(section => section.id in topicLabels);
  const otherSections = content.content.sections.filter(section => !(section.id in topicLabels) && section.id !== "availability");
  const availability = content.content.sections.find(section => section.id === "availability");
  const programmeSection = topics.find(section => section.id === "Q28");
  const programmeCopy = programmeSection?.blocks.find(block => block.kind === "copy");
  const programmeParagraphs = programmeCopy?.kind === "copy" ? programmeCopy.text.split(/\n\n/) : [];
  const groupFormat = programmeParagraphs.find(paragraph => paragraph.startsWith("服务形式："))?.replace(/^服务形式：\s*/, "");
  const programmeBlocks = programmeSection?.blocks.flatMap(block => block.kind === "subsection" ? block.blocks : []) ?? [];
  const retreatTitle = programmeBlocks.find(block => block.kind === "copy" && block.text.includes("沉浸式疗愈支持营"));
  const retreatCopy = programmeBlocks.find(block => block.kind === "copy" && block.text.startsWith("为期"));
  const intro = content.content.intro.map(block => block.kind === "copy" ? { ...block, text: block.text.split(/\n\n/).filter(paragraph => paragraph !== content.description).join("\n\n") } : block);
  const description = content.description.split("，");
  const anchor = (id: string) => id.includes("-") ? id : `${content.anchorPrefix}-${id.toLowerCase()}`;
  const jsonLd = siteConfig.siteUrl ? { "@context": "https://schema.org", "@type": "WebPage", name: content.title, description: content.description, url: `${siteConfig.siteUrl}/courses-workshops/` } : null;
  return <div className="coaching-page courses-page" id="coaching-top">
    <HomeDesignSystem><HomeHeader breadcrumbSlug={"courses-workshops"} content={navigation ?? undefined} homeHref="/" openInNewTab /></HomeDesignSystem>
    <main id="main-content" data-page="courses-workshops" data-template="course-detail">
      <section data-grid-section="12" className="coaching-hero coaching-wrap" aria-labelledby="page-title">
        <div className="hero-copy"><h1 id="page-title">{content.title}</h1><p className="hero-statement">{description[0]}{description.length > 1 ? <><br />{description[1]}。</> : null}</p>{description.length > 2 ? <p className="hero-description">{description.slice(2).join("，")}</p> : null}<div className="hero-actions"><HomeButton variant="primary" className="coaching-hero-button" href="/book-consultation/" target="_blank" rel="noopener noreferrer">预约咨询</HomeButton><SiteLink className="coaching-text-link" href="#course-topics">浏览课程主题<ArrowDown /></SiteLink></div><div className="course-hero-links"><SiteLink href={`#${content.anchorPrefix}-q05`}>线上课程<ArrowDown /></SiteLink><SiteLink href={`#${content.anchorPrefix}-q14`}>实战工作坊<ArrowDown /></SiteLink><SiteLink href="#course-programmes">成长小组与疗愈营<ArrowDown /></SiteLink></div></div>
        <figure className="hero-photo"><img src={content.image.src} alt={content.image.alt} width={content.image.width} height={content.image.height} fetchPriority="high" {...photoProps(content.image.src, "(max-width: 720px) 90vw, 45vw")} /></figure>
      </section>
      <nav className="coaching-rail" aria-label="本页内容"><div className="coaching-wrap"><SiteLink href="#course-approach" data-section-link="course-approach">学习与支持</SiteLink><SiteLink href="#course-topics" data-section-link="course-topics">课程主题</SiteLink><SiteLink href="#course-programmes" data-section-link="course-programmes">小组与疗愈营</SiteLink><SiteLink href="#course-consultation" data-section-link="course-consultation">咨询方式</SiteLink><SiteLink className="rail-booking" href="/book-consultation/" target="_blank" rel="noopener noreferrer">预约咨询<ArrowUpRight /></SiteLink></div></nav>
      <section data-grid-section="12" className="coaching-section course-approach" id="course-approach"><div className="coaching-wrap course-approach-layout"><h2>从当下最迫切的<br />问题开始</h2><div><SectionBody blocks={intro} columns={1} /><details className="course-availability" id={availability ? anchor(availability.id) : undefined}><summary>开课与报名说明<span className="coaching-plus" aria-hidden="true" /></summary>{availability ? <SectionBody blocks={availability.blocks} columns={1} /> : null}</details></div></div></section>
      <section data-grid-section="12" className="coaching-section coaching-fit" id="course-topics"><div className="coaching-wrap"><div className="coaching-heading"><h2>找到你需要的学习主题</h2><p>点击主题，再展开具体课程，查看适合人群、学习内容与参与形式。</p></div><div className="course-catalogue" data-tabs="course-topic"><div className="course-topic-tabs" role="tablist" aria-label="选择课程主题" aria-orientation="vertical">{topics.map((section, index) => <button type="button" role="tab" data-tab={index} id={`course-topic-tab-${index}`} aria-controls={`course-topic-panel-${index}`} aria-selected={index === 0} tabIndex={index === 0 ? 0 : -1} key={section.id}><span>{topicLabels[section.id]}</span><ArrowUpRight /></button>)}</div><div className="course-topic-panels">{topics.map((section, index) => <div id={`course-topic-panel-${index}`} role="tabpanel" aria-labelledby={`course-topic-tab-${index}`} hidden={index !== 0} tabIndex={0} key={section.id}><TopicContent section={section} prefix={content.anchorPrefix} /></div>)}</div></div></div></section>
      <section data-grid-section="12" className="coaching-section" id="course-programmes"><div className="coaching-wrap course-programme-layout"><figure><img src="/images/editorial/p33-courses-retreat.webp" alt="一人坐在院落廊下阅读，另一人在庭院散步" width={1280} height={854} loading="lazy" decoding="async" {...photoProps("/images/editorial/p33-courses-retreat.webp", "(max-width: 720px) 90vw, 40vw")} /></figure><div><h2>在同伴与专业陪伴中，<br />给自己一些恢复的空间</h2>{programmeParagraphs[1] ? <div className="course-programme-item"><h3>{programmeParagraphs[1]}</h3><p>{groupFormat}</p><SiteLink className="coaching-text-link" href={`#${content.anchorPrefix}-q28`}>查看六周主题与小组安排<ArrowUpRight /></SiteLink></div> : null}{retreatCopy?.kind === "copy" ? <div className="course-programme-item"><h3>{retreatTitle?.kind === "copy" ? cleanTitle(retreatTitle.text) : "沉浸式疗愈支持营"}</h3><p>{retreatCopy.text.split(/\n\n/)[0]}</p><SiteLink className="coaching-text-link" href={`#${content.anchorPrefix}-q30`}>查看工作坊与支持营内容<ArrowUpRight /></SiteLink></div> : null}<p className="course-programme-note">图片为环境意向，具体开课与活动安排以正式确认为准。</p></div></div></section>
      <section data-grid-section="12" className="coaching-section course-next" id="course-consultation"><div className="coaching-wrap"><div className="course-next-layout">{content.content.cta ? <div><h2>{content.content.cta.title}</h2><p>{content.content.cta.body}</p>{content.content.cta.actions.map(action => <HomeButton variant="primary" className="coaching-hero-button" key={action.href} href={action.href} target="_blank" rel="noopener noreferrer">{action.label}</HomeButton>)}</div> : null}<div className="course-related">{otherSections.map(section => <div id={anchor(section.id)} key={section.id}><h3>{section.title}</h3><SectionBody blocks={section.blocks} columns={1} /></div>)}{availability ? <div className="course-release-note"><SectionBody blocks={availability.blocks} columns={1} /></div> : null}</div></div></div></section>
      <HomeDesignSystem><HomeInvitation content={invitation} openInNewTab /></HomeDesignSystem>
    </main>
    <HomeDesignSystem><HomeFooter content={navigation ?? undefined} openInNewTab /></HomeDesignSystem>
    <CoachingInteractions />
    {jsonLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} /> : null}
  </div>;
}
