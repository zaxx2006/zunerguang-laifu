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

const route = "/media/";
const cleanTitle = (title: string) => title.replace(/^\d+[.．]?\s*/, "");
const copies = (blocks: Block[]) => blocks.flatMap(block => block.kind === "copy" ? [block.text] : []);
const feedbackLabels = ["理清问题", "稳住自己", "咨询准备", "沟通边界", "看清选择"];

function Disclosure({ title, children, id }: { title: string; children: ReactNode; id?: string }) {
  return <details className="coaching-detail media-disclosure" id={id}>
    <summary><span>{title}</span><span className="media-disclosure-action"><span className="media-open-label">展开</span><span className="media-close-label">收起</span><span className="coaching-plus" aria-hidden="true" /></span></summary>
    <div className="coaching-detail-body">{children}</div>
  </details>;
}

function Actions({ actions }: { actions: Action[] }) {
  return <div className="media-actions">{actions.map((action, index) => {
    const href = action.href.startsWith(`${route}#`) ? action.href.slice(route.length) : action.href;
    const booking = href.startsWith("/book-consultation/");
    return <HomeButton href={href} variant={booking ? "primary" : "text"} className={booking ? "coaching-hero-button" : "coaching-text-link"} key={index}>{action.label}{href.endsWith("#resources-availability") ? "（暂未开放）" : ""}{!booking && (href.startsWith("#") ? <ArrowDown aria-hidden="true" /> : <ArrowUpRight aria-hidden="true" />)}</HomeButton>;
  })}</div>;
}

function Body({ blocks }: { blocks: Block[] }) {
  return <>{blocks.map((block, index) => block.kind === "actions" ? <Actions actions={block.actions} key={index} /> : <SectionBody blocks={[block]} columns={1} key={index} />)}</>;
}

function Story({ text }: { text: string }) {
  const [reference, title, ...lines] = text.split("\n");
  const parts = lines.join("\n").trim().split(/(?:^|\n)(最初状态|焕屿支持|发生的变化)\n/);
  const quote = parts.at(-1)?.match(/(?:^|\n)(“[^”]+”)\s*$/)?.[1];
  return <article className="media-story">
    <h3><span>{reference} · </span>{title}</h3>
    <div className="media-story-stages">{[1, 3, 5].map(index => parts[index] ? <div key={index}><h4>{parts[index]}</h4><RichText text={quote ? parts[index + 1].replace(quote, "").trim() : parts[index + 1]} presentation="editorial" /></div> : null)}</div>
    {quote ? <blockquote>{quote}</blockquote> : null}
  </article>;
}

export async function MediaPage() {
  const [navigation, content, home] = await Promise.all([getNavigationPresentation({ preview: false }), getSitePagePresentation(route), getHomePresentation({ preview: false })]);
  const invitation = home?.invitation;
  const sections = new Map(content.content.sections.map(section => [section.id, section]));
  const availability = sections.get("availability"), podcast = sections.get("Q05"), events = sections.get("Q09"), accompaniment = sections.get("Q13"), stories = sections.get("Q16"), feedback = sections.get("Q22"), privacy = sections.get("Q24"), extension = sections.get("Q26"), updates = sections.get("Q28");
  const intro = copies(content.content.intro).join("\n\n").split(/\n{2,}/);
  const podcastCopies = copies(podcast?.blocks ?? []);
  const podcastOpening = podcastCopies[0]?.split(/\n{2,}/) ?? [];
  const lastTopic = podcastCopies[2]?.split(/\n{2,}(?=内容形式：|选题示例：)/) ?? [];
  const topics = [podcastOpening.slice(2).join("\n\n"), podcastCopies[1], lastTopic[0]].filter((text): text is string => Boolean(text)).map(text => ({ title: text.split("\n")[0], text: text.split("\n").slice(1).join("\n").trim() }));
  const eventCopies = copies(events?.blocks ?? []);
  const accompanimentCopies = copies(accompaniment?.blocks ?? []);
  const issues = accompanimentCopies[1]?.split(/\n{2,}(?=\d+\.\s)/) ?? [];
  const storyCopies = copies(stories?.blocks ?? []);
  const feedbackParts = copies(feedback?.blocks ?? []).join("\n\n").split(/\n{2,}/);
  const quotes = feedbackParts.filter(text => /^“[\s\S]*”$/.test(text));
  const privacyParts = copies(privacy?.blocks ?? []).join("\n\n").split(/\n{2,}/);
  const anchor = (id: string) => id.includes("-") ? id : `${content.anchorPrefix}-${id.toLowerCase()}`;
  const known = new Set(["availability", "Q05", "Q09", "Q13", "Q16", "Q22", "Q24", "Q26", "Q28"]);
  const nav = [[podcast, "播客与对谈"], [events, "活动与分享"], [stories, "陪伴纪实"], [feedback, "来访者反馈"], [privacy, "隐私承诺"]] as const;
  const jsonLd = siteConfig.siteUrl ? { "@context": "https://schema.org", "@type": "CollectionPage", name: content.title, description: content.description, url: `${siteConfig.siteUrl}${route}` } : null;

  return <div className="coaching-page media-page" id="coaching-top">
    <HomeDesignSystem><HomeHeader breadcrumbSlug={"media"} content={navigation ?? undefined} homeHref="/" openInNewTab /></HomeDesignSystem>
    <main id="main-content" data-page="media" data-template="media-editorial">
      <section data-grid-section="12" className="coaching-hero coaching-wrap" aria-labelledby="page-title">
        <div className="hero-copy">
          <h1 id="page-title">{content.title}</h1>
          <p className="media-hero-lead">{content.description}</p>
          <div className="hero-actions"><HomeButton href={`#${anchor(podcast?.id ?? "Q05")}`} variant="primary" className="coaching-hero-button">浏览内容栏目</HomeButton><SiteLink href={`#${anchor(stories?.id ?? "Q16")}`} className="coaching-text-link">查看陪伴纪实<ArrowDown aria-hidden="true" /></SiteLink></div>
          {availability ? <div className="media-availability" id={anchor(availability.id)}><h2>{availability.title}</h2>{availability.blocks.map((block, index) => block.kind === "notice" ? <p key={index}>{block.text}</p> : <Body blocks={[block]} key={index} />)}</div> : null}
          {intro.length > 1 ? <Disclosure title="从理解处境开始">{intro.filter(text => text !== content.description).map((text, index) => <RichText text={text} presentation="editorial" key={index} />)}<Body blocks={content.content.intro.filter(block => block.kind !== "copy")} /></Disclosure> : null}
        </div>
        <figure className="hero-photo"><img src={content.image.src} alt={content.image.alt} width={content.image.width} height={content.image.height} fetchPriority="high" {...photoProps(content.image.src, "(max-width: 720px) 90vw, 40vw")} /></figure>
      </section>
      <nav className="coaching-rail" aria-label="本页内容"><div className="coaching-wrap">{nav.map(([section, title]) => section ? <SiteLink href={`#${anchor(section.id)}`} data-section-link={anchor(section.id)} key={section.id}>{title}</SiteLink> : null)}</div></nav>

      {podcast ? <section data-grid-section="12" className="coaching-section media-podcast" id={anchor(podcast.id)}><div className="coaching-wrap">
        <div className="coaching-heading"><h2>{cleanTitle(podcast.title)}</h2><p>选择一个主题，了解栏目关注的问题。</p></div>
        <div className="media-podcast-grid">
          <div><figure className="media-content-photo"><img src="/images/editorial/section-media-recording.webp" alt="录音设备与交流空间的场景意向" width={1280} height={854} loading="lazy" decoding="async" {...photoProps("/images/editorial/section-media-recording.webp", "(max-width: 720px) 90vw, 35vw")} /></figure><div className="media-podcast-intro">{podcastOpening.slice(0, 2).map((text, index) => <RichText text={text} presentation="editorial" key={index} />)}</div>{lastTopic.slice(1).map((text, index) => <Disclosure title={text.split("\n")[0]} key={index}><RichText text={text.split("\n").slice(1).join("\n")} presentation="editorial" /></Disclosure>)}</div>
          <div><TemplateTabs labels={topics.map(topic => topic.title)} hint="点击主题，切换查看对谈方向">{topics.map((topic, index) => <article key={index}><h3>{topic.title}</h3><RichText text={topic.text} presentation="editorial" /></article>)}</TemplateTabs><Body blocks={podcast.blocks.filter(block => block.kind !== "copy")} /></div>
        </div>
      </div></section> : null}

      {events ? <section data-grid-section="12" className="coaching-section media-events" id={anchor(events.id)}><div className="coaching-wrap media-event-grid">
        <figure className="media-content-photo"><img src="/images/editorial/p40-media-conversation.webp" alt="听众从座椅上观看一场小型对谈的示意场景" width={1280} height={854} loading="lazy" decoding="async" {...photoProps("/images/editorial/p40-media-conversation.webp", "(max-width: 720px) 90vw, 36vw")} /></figure>
        <div><h2>{cleanTitle(events.title)}</h2>{eventCopies[0] ? <RichText text={eventCopies[0]} presentation="editorial" /> : null}<TemplateTabs labels={eventCopies.slice(1).map(text => text.split("\n")[0])} hint="点击查看重点议题或活动内容">{eventCopies.slice(1).map((text, index) => <article key={index}><h3>{text.split("\n")[0]}</h3><RichText text={text.split("\n").slice(1).join("\n")} presentation="editorial" /></article>)}</TemplateTabs><Body blocks={events.blocks.filter(block => block.kind !== "copy")} />{updates ? <Disclosure title={updates.title} id={anchor(updates.id)}><Body blocks={updates.blocks} /></Disclosure> : null}</div>
      </div></section> : null}

      {stories || accompaniment ? <section data-grid-section="12" className="coaching-section media-stories" id={stories ? anchor(stories.id) : undefined}><div className="coaching-wrap">
        {stories ? <><div className="coaching-heading"><h2>{cleanTitle(stories.title)}</h2><p>内容示例 · 点击主题，查看支持过程。</p></div>{storyCopies[0] ? <p className="media-story-notice">{storyCopies[0]}</p> : null}<TemplateTabs labels={storyCopies.slice(1).map(text => text.split("\n")[1])} hint="选择一篇纪实，查看最初状态、焕屿支持与发生的变化">{storyCopies.slice(1).map((text, index) => <Story text={text} key={index} />)}</TemplateTabs><Body blocks={stories.blocks.filter(block => block.kind !== "copy")} /></> : null}
        {accompaniment ? <Disclosure title={cleanTitle(accompaniment.title)} id={anchor(accompaniment.id)}>{accompanimentCopies[0] ? <RichText text={accompanimentCopies[0]} presentation="editorial" /> : null}{issues[0] ? <h3>{issues[0]}</h3> : null}<TemplateTabs labels={issues.slice(1).map(text => cleanTitle(text.split("\n")[0]))} hint="点击困境，了解相应的陪伴支持方式">{issues.slice(1).map((text, index) => <article key={index}><h4>{cleanTitle(text.split("\n")[0])}</h4><RichText text={text.split("\n").slice(1).join("\n")} presentation="editorial" /></article>)}</TemplateTabs><Body blocks={accompaniment.blocks.filter(block => block.kind !== "copy")} /></Disclosure> : null}
      </div></section> : null}

      {feedback || privacy ? <section data-grid-section="12" className="coaching-section media-trust"><div className="coaching-wrap media-trust-grid">
        {feedback ? <div className="media-feedback" id={anchor(feedback.id)}><h2>{cleanTitle(feedback.title)}</h2>{feedbackParts.filter(text => !quotes.includes(text)).slice(0, 1).map((text, index) => <p className="media-feedback-note" key={index}>{text}</p>)}<TemplateTabs labels={quotes.map((_, index) => feedbackLabels[index] ?? `反馈 ${index + 1}`)} hint="点击主题，阅读不同的反馈摘录">{quotes.map((quote, index) => <blockquote key={index}>{quote}</blockquote>)}</TemplateTabs>{feedbackParts.filter(text => !quotes.includes(text)).slice(1).map((text, index) => <p className="media-feedback-note" key={index}>{text}</p>)}<Body blocks={feedback.blocks.filter(block => block.kind !== "copy")} /></div> : null}
        {privacy ? <div className="media-privacy" id={anchor(privacy.id)}><h2>{cleanTitle(privacy.title)}</h2>{privacyParts[0] ? <h3>{privacyParts[0]}</h3> : null}{privacyParts.slice(1, 3).map((text, index) => <RichText text={text} presentation="editorial" key={index} />)}{privacyParts.length > 4 ? <Disclosure title="公开纪实如何保护隐私">{privacyParts.slice(3, -1).map((text, index) => <RichText text={text} presentation="editorial" key={index} />)}</Disclosure> : null}{privacyParts.at(-1) ? <p className="media-feedback-note">{privacyParts.at(-1)}</p> : null}<Body blocks={privacy.blocks.filter(block => block.kind !== "copy")} /></div> : null}
      </div></section> : null}

      {content.content.sections.filter(section => !known.has(section.id)).map(section => <section data-grid-section="12" className="coaching-section" id={anchor(section.id)} key={section.id}><div className="coaching-wrap"><h2>{cleanTitle(section.title)}</h2><Body blocks={section.blocks} /></div></section>)}
      {extension || content.content.cta ? <section data-grid-section="12" className="coaching-section media-next" id={extension ? anchor(extension.id) : undefined}><div className="coaching-wrap media-next-grid">
        {extension ? <div><h2>{cleanTitle(extension.title)}</h2><Body blocks={extension.blocks} /></div> : null}
        {content.content.cta ? <div><h3>{content.content.cta.title}</h3><p>{content.content.cta.body}</p><Actions actions={content.content.cta.actions} /></div> : null}
      </div></section> : null}
      <HomeDesignSystem><HomeInvitation content={invitation} openInNewTab /></HomeDesignSystem>
    </main>
    <HomeDesignSystem><HomeFooter content={navigation ?? undefined} openInNewTab /></HomeDesignSystem>
    <CoachingInteractions />
    {jsonLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} /> : null}
  </div>;
}
