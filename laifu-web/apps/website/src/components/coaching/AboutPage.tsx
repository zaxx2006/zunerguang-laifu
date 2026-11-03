import { SiteLink } from "@/components/site/SiteLink";
import type { ReactNode } from "react";
import { ArrowDown, ArrowUpRight, ChevronRight } from "lucide-react";
import { HomeInvitation } from "@/components/home/HomeSections";
import { HomeHeader, HomeFooter } from "@/components/home/HomeNavigation";
import { HomeDesignSystem, HomeButton } from "@/components/home/HomePrimitives";
import { SectionBody } from "@/components/content/StructuredContent";
import { RichText } from "@/components/content/RichText";
import type { Action, Block, SubsectionBlock } from "@/contracts/page-content";
import { getNavigationPresentation, getHomePresentation, getSitePagePresentation } from "@/lib/cms-content-client";
import { photoProps } from "@/lib/photo";
import { siteConfig } from "@/lib/site-config";
import { CoachingInteractions } from "./CoachingInteractions";
import "./coaching.css";

const cleanTitle = (title: string) => title.replace(/^0\d\s*/, "");
const subtopics = (blocks: Block[]) => blocks.filter((block): block is SubsectionBlock => block.kind === "subsection");
const copyOf = (blocks: Block[]) => blocks.flatMap(block => block.kind === "copy" ? [block.text] : []).join("\n\n");
const philosophyImages = [{ src: "/images/editorial/p09-about-listening.webp", alt: "两位女性在窗边布椅上交谈与倾听" }, { src: "/images/editorial/p10-about-choice.webp", alt: "一位男性坐在阅读角翻看膝上的资料" }, { src: "/images/editorial/p11-about-boundaries.webp", alt: "半开的木框玻璃门与门内的布椅" }, { src: "/images/editorial/p12-about-network.webp", alt: "两位成年人在侧柜旁交接一份资料" }];

function Actions({ actions, primary = false }: { actions: Action[]; primary?: boolean }) {
  return <div className="about-actions">{actions.map((action, index) => <HomeButton variant={primary && index === 0 ? "primary" : "text"} className={primary && index === 0 ? "coaching-hero-button" : "coaching-text-link"} href={action.href} target="_blank" rel="noopener noreferrer" key={index}>{action.label}{primary && index === 0 ? null : <ArrowUpRight />}</HomeButton>)}</div>;
}

function Disclosure({ title, children, id }: { title: string; children: ReactNode; id?: string }) {
  return <details className="coaching-detail about-disclosure" id={id}><summary><span>{cleanTitle(title)}</span><span className="about-disclosure-action"><span className="about-open-label">展开阅读</span><span className="about-close-label">收起</span><span className="coaching-plus" aria-hidden="true" /></span></summary><div className="coaching-detail-body">{children}</div></details>;
}

function AboutTabs({ name, label, entries, render }: { name: string; label: string; entries: SubsectionBlock[]; render: (entry: SubsectionBlock, index: number) => ReactNode }) {
  return <div data-tabs={name}><div className="about-tabs" role="tablist" aria-label={label}>{entries.map((entry, index) => <button type="button" role="tab" data-tab={index} id={`${name}-tab-${index}`} aria-controls={`${name}-panel-${index}`} aria-selected={index === 0} tabIndex={index === 0 ? 0 : -1} key={entry.id ?? index}><span>{cleanTitle(entry.title).split("，")[0]}</span><ArrowUpRight /></button>)}</div>{entries.map((entry, index) => <div className="about-tab-panel" role="tabpanel" id={`${name}-panel-${index}`} aria-labelledby={`${name}-tab-${index}`} hidden={index !== 0} tabIndex={0} key={entry.id ?? index}><div id={entry.id} className="about-topic-anchor">{render(entry, index)}</div></div>)}</div>;
}

function WorkingMethod({ blocks }: { blocks: Block[] }) {
  const paragraphs = copyOf(blocks).split(/\n\n/);
  return <div className="about-working-method">{paragraphs.map((paragraph, index) => paragraph.includes("→") ? <ol key={index} aria-label="服务工作步骤">{paragraph.split("→").map((step, stepIndex, steps) => <li key={stepIndex}><span>{step.trim()}</span>{stepIndex < steps.length - 1 ? <ChevronRight aria-hidden="true" /> : null}</li>)}</ol> : <RichText text={paragraph} key={index} />)}<SectionBody blocks={blocks.filter(block => block.kind !== "copy")} columns={1} /></div>;
}

export async function AboutPage() {
  const [navigation, content, home] = await Promise.all([
    getNavigationPresentation({ preview: false }),
    getSitePagePresentation("/about/"),
    getHomePresentation({ preview: false }),
  ]);
  const invitation = home?.invitation;
  const sections = content.content.sections;
  const story = sections.find(section => section.id === "Q06");
  const philosophy = sections.find(section => section.id === "Q08");
  const values = sections.find(section => section.id === "Q23");
  const boundaries = sections.find(section => section.id === "Q35");
  const team = sections.find(section => section.id === "Q41");
  const next = sections.find(section => section.id === "Q56");
  const contact = sections.find(section => section.id === "Q59");
  const metricsSection = subtopics(team?.blocks ?? []).find(block => block.id === "about-q45");
  const teamTopics = subtopics(team?.blocks ?? []).filter(block => block !== metricsSection);
  const metrics = metricsSection?.blocks.flatMap(block => block.kind === "metrics" ? block.items : []) ?? [];
  const introCopy = copyOf(content.content.intro);
  const heroStatement = introCopy.split(/\n/).filter(Boolean).at(-1) ?? content.description;
  const contactTopics = subtopics(contact?.blocks ?? []);
  const handled = new Set(["Q06", "Q08", "Q23", "Q35", "Q41", "Q56", "Q59"]);
  const anchor = (id: string) => id.includes("-") ? id : `${content.anchorPrefix}-${id.toLowerCase()}`;
  const jsonLd = siteConfig.siteUrl ? { "@context": "https://schema.org", "@type": "AboutPage", name: content.title, description: content.description, url: `${siteConfig.siteUrl}/about/` } : null;

  return <div className="coaching-page about-page" id="coaching-top">
    <HomeDesignSystem><HomeHeader breadcrumbSlug={"about"} content={navigation ?? undefined} homeHref="/" openInNewTab /></HomeDesignSystem>
    <main id="main-content" data-page="about" data-template="about-detail">
      <section data-grid-section="12" className="coaching-hero coaching-wrap" aria-labelledby="page-title"><div className="hero-copy"><h1 id="page-title">{content.title}</h1><p className="hero-statement">{heroStatement.split("，").map((line, index) => <span key={index}>{index ? <br /> : null}{line}</span>)}</p><p className="hero-description">{content.description}</p><div className="hero-actions"><HomeButton variant="primary" className="coaching-hero-button" href="/book-consultation/#booking-channel" target="_blank" rel="noopener noreferrer">预约初步沟通</HomeButton><SiteLink className="coaching-text-link" href={story ? `#${anchor(story.id)}` : "#about-introduction"}>认识焕屿<ArrowDown /></SiteLink></div></div><figure className="hero-photo"><img src={content.image.src} alt={content.image.alt} width={content.image.width} height={content.image.height} fetchPriority="high" {...photoProps(content.image.src, "(max-width: 720px) 90vw, 45vw")} /></figure></section>
      <nav className="coaching-rail" aria-label="本页内容"><div className="coaching-wrap">{[[story, "品牌初心"], [philosophy, "核心理念"], [values, "服务价值"], [team, "专业团队"], [boundaries, "专业边界"], [contact, "联系与合作"]].map(([section, label]) => typeof section === "object" && section ? <SiteLink href={`#${anchor(section.id)}`} data-section-link={anchor(section.id)} key={section.id}>{label as string}</SiteLink> : null)}<SiteLink className="rail-booking" href="/book-consultation/" target="_blank" rel="noopener noreferrer">预约咨询<ArrowUpRight /></SiteLink></div></nav>

      <section data-grid-section="12" className="coaching-section about-introduction" id="about-introduction"><div className="coaching-wrap about-introduction-layout"><h2>看见情绪，<br />也回应现实</h2><div><SectionBody blocks={content.content.intro.filter(block => block.kind !== "actions")} columns={1} />{content.content.intro.filter(block => block.kind === "actions").map((block, index) => block.kind === "actions" ? <Actions actions={block.actions} key={index} /> : null)}</div></div></section>

      {story ? <section data-grid-section="12" className="coaching-section" id={anchor(story.id)}><div className="coaching-wrap about-story-layout"><figure><img src="/images/editorial/section-about-home.webp" alt="自然光照进日常生活空间" width={1280} height={854} loading="lazy" decoding="async" {...photoProps("/images/editorial/section-about-home.webp", "(max-width: 720px) 90vw, 36vw")} /><blockquote>焕屿希望承接的，<br />正是这段容易被忽略的过程。</blockquote></figure><div><h2>{story.title}</h2><div className="about-story-copy">{copyOf(story.blocks).split(/\n\n/).map((paragraph, index) => /^(有人|也有人)/.test(paragraph) ? <Disclosure title={paragraph.startsWith("也有人") ? "正在处理离婚，却逐渐失去方向" : paragraph.includes("已经委托律师") ? "已经委托律师，却难以推进事务" : "承受关系压力，难以迈出第一步"} key={index}><RichText text={paragraph} /></Disclosure> : <p key={index}>{paragraph}</p>)}</div><SectionBody blocks={story.blocks.filter(block => block.kind !== "copy")} columns={1} /></div></div></section> : null}

      {philosophy ? <section data-grid-section="12" className="coaching-section coaching-fit" id={anchor(philosophy.id)}><div className="coaching-wrap"><div className="coaching-heading"><h2>{philosophy.title}</h2><p>点击理念，了解它如何体现在我们的服务中。</p></div><div className="about-section-intro"><SectionBody blocks={philosophy.blocks.filter(block => block.kind !== "subsection")} columns={1} /></div><AboutTabs name="about-philosophy" label="查看焕屿服务理念" entries={subtopics(philosophy.blocks)} render={(entry, index) => { const photo = philosophyImages[index % philosophyImages.length]; return <div className="about-philosophy-layout"><figure><img src={photo.src} alt={photo.alt} width={1280} height={854} loading="lazy" decoding="async" {...photoProps(photo.src, "(max-width: 720px) 90vw, 36vw")} /></figure><div><h3>{cleanTitle(entry.title)}</h3><SectionBody blocks={entry.blocks} columns={1} /></div></div>; }} /></div></section> : null}

      {values ? <section data-grid-section="12" className="coaching-section about-values" id={anchor(values.id)}><div className="coaching-wrap"><div className="about-introduction-layout"><h2>{values.title}</h2><div><SectionBody blocks={values.blocks.filter(block => block.kind !== "subsection")} columns={1} /></div></div><div className="about-value-principles">{subtopics(values.blocks).map((entry, index) => <article id={entry.id} key={entry.id ?? index}><h3>{entry.title.split("\n").map((line, lineIndex) => <span key={lineIndex}>{lineIndex ? <br /> : null}{line}</span>)}</h3><SectionBody blocks={entry.blocks} columns={1} /></article>)}</div></div></section> : null}

      {team ? <section data-grid-section="12" className="coaching-section about-team" id={anchor(team.id)}><div className="coaching-wrap"><div className="about-team-introduction"><div><h2>{team.title}</h2><SectionBody blocks={team.blocks.filter(block => block.kind !== "subsection")} columns={1} />{metricsSection ? <div className="about-founder-link"><SectionBody blocks={metricsSection.blocks.filter(block => block.kind !== "metrics")} columns={1} /></div> : null}</div><figure><img src="/images/editorial/p13-about-team.webp" alt="三位成年人在桌边分别翻看和整理资料" width={1280} height={854} loading="lazy" decoding="async" {...photoProps("/images/editorial/p13-about-team.webp", "(max-width: 720px) 90vw, 40vw")} /></figure></div><div className="about-service-data" id={metricsSection?.id} aria-label="团队与服务数据">{metrics.map((metric, index) => { const match = metric.value ? null : metric.label.match(/^(.*?)(\d[\d,+]*)(.*)$/); return <p key={index}>{metric.value ? <><strong>{metric.value}</strong><span>{metric.label}</span></> : match ? <><span>{match[1]}</span><strong>{match[2]}</strong><span>{match[3]}</span></> : <span>{metric.label}</span>}</p>; })}</div><p className="about-interaction-hint">点击下方主题，了解团队的服务能力与工作方式。</p><AboutTabs name="about-team" label="了解专业团队" entries={teamTopics} render={entry => <div className="about-team-reading"><h3>{cleanTitle(entry.title)}</h3>{entry.id === "about-q52" ? <WorkingMethod blocks={entry.blocks} /> : <SectionBody blocks={entry.blocks} columns={1} />}</div>} /></div></section> : null}

      {boundaries ? <section data-grid-section="12" className="coaching-section about-boundaries" id={anchor(boundaries.id)}><div className="coaching-wrap about-boundary-layout"><div><h2>{boundaries.title}</h2><p className="about-boundary-statement">有理解，<br />也有清晰的边界。</p><SiteLink className="coaching-text-link" href="/services/" target="_blank" rel="noopener noreferrer">了解服务范围<ArrowUpRight /></SiteLink></div><div><SectionBody blocks={boundaries.blocks.filter(block => block.kind !== "subsection")} columns={1} />{subtopics(boundaries.blocks).map((entry, index) => <Disclosure title={entry.title} id={entry.id} key={entry.id ?? index}><SectionBody blocks={entry.blocks} columns={1} /></Disclosure>)}</div></div></section> : null}

      {contact ? <section data-grid-section="12" className="coaching-section about-contact" id={anchor(contact.id)}><div className="coaching-wrap"><div className="coaching-heading"><h2>{contact.title}</h2><p>根据你的需要，选择个人咨询、机构协作或行业培训。</p></div><SectionBody blocks={contact.blocks.filter(block => block.kind !== "subsection")} columns={1} /><div className="about-contact-options">{contactTopics.filter(entry => entry.id !== "about-q69").map((entry, index) => <article id={entry.id} key={entry.id ?? index}><h3>{entry.title}</h3><SectionBody blocks={entry.blocks.filter(block => block.kind !== "actions")} columns={1} />{entry.blocks.map((block, blockIndex) => block.kind === "actions" ? <Actions actions={entry.id === "about-q63" ? [...block.actions, { label: "给律师与转介伙伴", href: "/for-lawyers/" }] : block.actions} key={blockIndex} /> : null)}</article>)}</div>{contactTopics.filter(entry => entry.id === "about-q69").map(entry => <div className="about-office" id={entry.id} key={entry.id}><h3>{entry.title}</h3><SectionBody blocks={entry.blocks} columns={1} /></div>)}</div></section> : null}
      {next ? <section data-grid-section="12" className="coaching-section about-next" id={anchor(next.id)}><div className="coaching-wrap"><h2>{next.title}</h2><SectionBody blocks={next.blocks.filter(block => block.kind !== "actions")} columns={1} />{next.blocks.map((block, index) => block.kind === "actions" ? <Actions actions={block.actions} primary key={index} /> : null)}</div></section> : null}
      {sections.filter(section => !handled.has(section.id)).map(section => <section data-grid-section="12" className="coaching-section" id={anchor(section.id)} key={section.id}><div className="coaching-wrap"><h2>{section.title}</h2><SectionBody blocks={section.blocks} columns={1} /></div></section>)}
      {content.content.cta ? <section data-grid-section="12" className="coaching-section about-next"><div className="coaching-wrap"><h2>{content.content.cta.title}</h2><RichText text={content.content.cta.body} /><Actions actions={content.content.cta.actions} primary /></div></section> : null}
      <HomeDesignSystem><HomeInvitation content={invitation} openInNewTab /></HomeDesignSystem>
    </main>
    <HomeDesignSystem><HomeFooter content={navigation ?? undefined} openInNewTab /></HomeDesignSystem><CoachingInteractions />
    {jsonLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} /> : null}
  </div>;
}
