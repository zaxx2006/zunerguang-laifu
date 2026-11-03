import type { ReactNode } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { HomeHeader, HomeFooter } from "@/components/home/HomeNavigation";
import { HomeDesignSystem, HomeButton } from "@/components/home/HomePrimitives";
import { HomeInvitation } from "@/components/home/HomeSections";
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

const paragraphs = (blocks: Block[]) => blocks.flatMap(block => block.kind === "copy" ? block.text.split(/\n{2,}/).filter(Boolean) : []);
const entry = (text: string) => { const [title, ...lines] = text.split("\n"); return { title, text: lines.join("\n") }; };
const cleanTitle = (title: string) => title.replace(/^（\d+）/, "");

function Copy({ text }: { text: string }) {
  return <RichText text={text} presentation="editorial" />;
}

function Disclosure({ title, children }: { title: string; children: ReactNode }) {
  return <details className="coaching-detail founder-disclosure"><summary><span>{title}</span><span className="founder-disclosure-action"><span className="founder-open-label">展开阅读</span><span className="founder-close-label">收起</span><span className="coaching-plus" aria-hidden="true" /></span></summary><div className="coaching-detail-body">{children}</div></details>;
}

export async function FounderPage() {
  const [navigation, content, home] = await Promise.all([getNavigationPresentation({ preview: false }), getSitePagePresentation("/about/founder/"), getHomePresentation({ preview: false })]);
  const invitation = home?.invitation;
  const sections = new Map(content.content.sections.map(section => [section.id, section]));
  const background = sections.get("Q04"), practice = sections.get("Q06"), principles = sections.get("Q08"), research = sections.get("Q13"), tools = sections.get("Q15"), expertise = sections.get("Q17"), boundaries = sections.get("Q19");
  const identity = content.description.split("\n").filter(Boolean);
  const introBlocks = content.content.intro.filter(block => !(block.kind === "copy" && block.text === content.description));
  const story = paragraphs(introBlocks);
  const quotation = story.at(-1)?.startsWith("“") ? story.at(-1) : undefined;
  const backgroundCopy = paragraphs(background?.blocks ?? []);
  const practiceCopy = paragraphs(practice?.blocks ?? []);
  const metrics = practice?.blocks.flatMap(block => block.kind === "metrics" ? block.items : []) ?? [];
  const positions = principles?.blocks.filter(block => block.kind === "subsection") ?? [];
  const researchCopy = paragraphs(research?.blocks ?? []);
  const researchHeading = researchCopy[1]?.startsWith("代表性研究成果\n") ? "代表性研究成果" : undefined;
  const papers = researchCopy.slice(1).map(text => entry(text.replace(/^代表性研究成果\n/, "")));
  const toolCopy = paragraphs(tools?.blocks ?? []);
  const toolEntries = toolCopy.slice(1, -1).map(entry);
  const fields = paragraphs(expertise?.blocks ?? []).map(entry);
  const boundaryCopy = paragraphs(boundaries?.blocks ?? []);
  const anchor = (id: string) => id.includes("-") ? id : `${content.anchorPrefix}-${id.toLowerCase()}`;
  const handled = new Set(["Q04", "Q06", "Q08", "Q13", "Q15", "Q17", "Q19"]);
  const jsonLd = siteConfig.siteUrl ? { "@context": "https://schema.org", "@type": "ProfilePage", name: content.title, url: `${siteConfig.siteUrl}/about/founder/`, mainEntity: { "@type": "Person", name: identity[0] } } : null;

  return <div className="coaching-page founder-page" id="coaching-top">
    <HomeDesignSystem><HomeHeader breadcrumbSlug={"about/founder"} content={navigation ?? undefined} homeHref="/" openInNewTab /></HomeDesignSystem>
    <main id="main-content" data-page="founder" data-template="founder-profile">
      <section data-grid-section="12" className="founder-hero coaching-wrap" aria-labelledby="page-title">
        
        <div className="founder-masthead"><div><h1 id="page-title">{content.title.split("，").map((line, index) => <span key={index}>{index ? <br /> : null}{line}{index === 0 ? "，" : ""}</span>)}</h1><div className="hero-actions"><HomeButton variant="primary" className="coaching-hero-button" href="/book-consultation/">预约咨询</HomeButton><SiteLink href="#founder-story" className="coaching-text-link">了解创办焕屿的初心<ArrowDown aria-hidden="true" /></SiteLink></div></div><div className="founder-identity"><p className="founder-name">{identity[0]}</p><p className="founder-role">{identity[1]}</p><ul>{identity.slice(2).map((line, index) => <li key={index}>{line}</li>)}</ul></div></div>
      </section>
      <nav className="coaching-rail" aria-label="本页内容"><div className="coaching-wrap"><SiteLink href="#founder-story" data-section-link="founder-story">创办焕屿</SiteLink>{[[background, "专业背景"], [principles, "专业主张"], [research, "研究与工具"], [expertise, "专业领域"], [boundaries, "专业边界"]].map(([section, label]) => typeof section === "object" && section ? <SiteLink href={`#${anchor(section.id)}`} data-section-link={anchor(section.id)} key={section.id}>{label as string}</SiteLink> : null)}<SiteLink href="/about/" className="rail-booking">认识焕屿<ArrowUpRight aria-hidden="true" /></SiteLink></div></nav>

      <section data-grid-section="12" className="coaching-section founder-story coaching-fit" id="founder-story"><div className="coaching-wrap"><div className="coaching-heading"><h2>为什么创办焕屿</h2></div><div className="founder-story-columns"><div className="founder-story-lead"><Copy text={story[0] ?? ""} /></div><div>{story.slice(1, quotation ? -1 : undefined).map((text, index) => <Copy text={text} key={index} />)}</div></div>{quotation ? <blockquote>{quotation}</blockquote> : null}<SectionBody blocks={introBlocks.filter(block => block.kind !== "copy")} columns={2} /></div></section>

      {background ? <section data-grid-section="12" className="coaching-section" id={anchor(background.id)}><div className="coaching-wrap"><div className="coaching-heading"><h2>{background.title}</h2></div><div className="founder-background-grid"><div>{backgroundCopy.slice(0, 2).map((text, index) => <Copy text={text} key={index} />)}</div><div><figure className="founder-background-photo"><img src="/images/editorial/p41-founder-research.webp" alt="研究桌面上翻开的厚书、眼镜与铅笔" width={1280} height={854} loading="lazy" decoding="async" {...photoProps("/images/editorial/p41-founder-research.webp", "(max-width: 720px) 90vw, 36vw")} /></figure>{backgroundCopy.slice(2).map((text, index) => <Copy text={text} key={index} />)}</div></div><SectionBody blocks={background.blocks.filter(block => block.kind !== "copy")} columns={2} /></div></section> : null}

      {practice ? <section data-grid-section="12" className="coaching-section founder-practice" id={anchor(practice.id)}><div className="coaching-wrap"><div className="coaching-heading"><h2>{practice.title}</h2></div><dl className="founder-practice-data">{metrics.map((metric, index) => <div key={index}><dt>{metric.label}</dt><dd>{metric.value}</dd></div>)}</dl><div className="founder-two-columns">{practiceCopy.map((text, index) => <Copy text={text} key={index} />)}</div><SectionBody blocks={practice.blocks.filter(block => block.kind !== "copy" && block.kind !== "metrics")} columns={2} /></div></section> : null}

      {principles ? <section data-grid-section="12" className="coaching-section coaching-fit founder-principles" id={anchor(principles.id)}><div className="coaching-wrap"><div className="coaching-heading"><h2>{principles.title}</h2></div><SectionBody blocks={principles.blocks.filter(block => block.kind !== "subsection")} columns={2} /><TemplateTabs labels={positions.map(position => cleanTitle(position.title))} hint="点击切换，了解专业理念与焕屿的具体方法">{positions.map((position, index) => {
        const copy = paragraphs(position.blocks);
        return <article key={position.id ?? index} id={position.id}><h3>{cleanTitle(position.title)}</h3>{index === 1 ? <><div className="founder-two-columns"><Copy text={copy.slice(0, 2).join("\n\n")} /><Copy text={copy[2] ?? ""} /></div><div className="founder-methods">{copy.slice(3, -1).map((text, itemIndex) => { const method = entry(text); return <div key={itemIndex}><h4>{method.title}</h4><Copy text={method.text} /></div>; })}</div><p className="founder-method-conclusion">{copy.at(-1)}</p></> : <div className="founder-two-columns"><Copy text={copy.slice(0, 2).join("\n\n")} /><Copy text={copy.slice(2).join("\n\n")} /></div>}<SectionBody blocks={position.blocks.filter(block => block.kind !== "copy")} columns={2} /></article>;
      })}</TemplateTabs></div></section> : null}

      {research || tools ? <section data-grid-section="12" className="coaching-section founder-research" id={research ? anchor(research.id) : undefined}><div className="coaching-wrap founder-research-grid">{research ? <div><h2>{research.title}</h2><Copy text={researchCopy[0] ?? ""} />{researchHeading ? <h3 className="founder-research-label">{researchHeading}</h3> : null}{papers.map((paper, index) => <Disclosure title={paper.title} key={index}><Copy text={paper.text} /></Disclosure>)}<SectionBody blocks={research.blocks.filter(block => block.kind !== "copy")} columns={1} /></div> : null}{tools ? <div id={anchor(tools.id)}><h2>{tools.title}</h2><Copy text={toolCopy[0] ?? ""} />{toolEntries.map((tool, index) => <Disclosure title={tool.title} key={index}><Copy text={tool.text} /></Disclosure>)}{toolCopy.length > 1 ? <div className="founder-tool-note"><Copy text={toolCopy.at(-1) ?? ""} /></div> : null}<SectionBody blocks={tools.blocks.filter(block => block.kind !== "copy")} columns={1} /></div> : null}</div></section> : null}

      {expertise ? <section data-grid-section="12" className="coaching-section coaching-fit founder-expertise" id={anchor(expertise.id)}><div className="coaching-wrap"><div className="coaching-heading"><h2>{expertise.title}</h2></div><TemplateTabs labels={fields.map(field => field.title)} hint="选择专业领域，查看工作重点与具体议题">{fields.map((field, index) => { const [intro, ...lines] = field.text.split("\n"); return <article className="founder-field-content" key={index}><div><h3>{field.title}</h3><Copy text={intro} /></div><Copy text={lines.join("\n")} /></article>; })}</TemplateTabs><SectionBody blocks={expertise.blocks.filter(block => block.kind !== "copy")} columns={2} /></div></section> : null}

      {boundaries ? <section data-grid-section="12" className="coaching-section founder-boundaries" id={anchor(boundaries.id)}><div className="coaching-wrap"><div className="coaching-heading"><h2>{boundaries.title}</h2></div><div className="founder-boundary-grid">{boundaryCopy.map((text, index) => <Copy text={text} key={index} />)}</div><SectionBody blocks={boundaries.blocks.filter(block => block.kind !== "copy")} columns={2} /><SiteLink href="/about/#about-q59" className="coaching-text-link">联系与专业合作<ArrowUpRight aria-hidden="true" /></SiteLink></div></section> : null}
      {content.content.sections.filter(section => !handled.has(section.id)).map(section => <section data-grid-section="12" className="coaching-section" id={anchor(section.id)} key={section.id}><div className="coaching-wrap"><div className="coaching-heading"><h2>{section.title}</h2></div><SectionBody blocks={section.blocks} columns={2} /></div></section>)}
      {content.content.cta ? <section data-grid-section="12" className="coaching-section"><div className="coaching-wrap"><h2>{content.content.cta.title}</h2><Copy text={content.content.cta.body} /><SectionBody blocks={[{ kind: "actions", actions: content.content.cta.actions }]} columns={1} /></div></section> : null}
      <HomeDesignSystem><HomeInvitation content={invitation} openInNewTab /></HomeDesignSystem>
    </main>
    <HomeDesignSystem><HomeFooter content={navigation ?? undefined} openInNewTab /></HomeDesignSystem><CoachingInteractions />
    {jsonLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} /> : null}
  </div>;
}
