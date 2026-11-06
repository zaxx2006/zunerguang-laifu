import { SiteLink } from "@/components/site/SiteLink";
import { ArrowUpRight } from "lucide-react";
import { HomeInvitation } from "@/components/home/HomeSections";
import { HomeHeader, HomeFooter } from "@/components/home/HomeNavigation";
import { HomeDesignSystem, HomeButton } from "@/components/home/HomePrimitives";
import { SectionBody } from "@/components/content/StructuredContent";
import { getNavigationPresentation, getHomePresentation, getSitePagePresentation } from "@/lib/cms-content-client";
import type { PageMeta } from "@/lib/page-schema";
import type { Block } from "@/components/content/content-types";
import { photoProps } from "@/lib/photo";
import { siteConfig } from "@/lib/site-config";
import { includeResourceArticles } from "@/lib/resource-articles";
import { CoachingInteractions } from "./CoachingInteractions";
import { TemplateTabs } from "./TemplateTabs";
import { BookingForm } from "./BookingForm";
import { CoParentingSection, coParentingSectionIds } from "./CoParentingSections";
import "./coaching.css";

function Body({ blocks, topicLinks = false }: { blocks: Block[]; topicLinks?: boolean }) {
  const gridIndex = blocks.findIndex(block => block.kind === "grid" && block.items.length >= 2 && block.items.length <= 7);
  const grid = blocks[gridIndex];
  if (!grid || grid.kind !== "grid") return <SectionBody blocks={blocks} columns={2} />;
  if (topicLinks) return <>
    <SectionBody blocks={blocks.slice(0, gridIndex)} columns={1} />
    <div className="blog-topic-entries">{grid.items.map((item, index) => {
      const introduction = item.blocks.find(block => block.kind === "copy");
      const action = item.blocks.find(block => block.kind === "actions")?.actions[0];
      const description = introduction?.text.split("\n")[0];
      const details = item.blocks.filter(block => block.kind !== "actions").map(block => block === introduction && block.kind === "copy" ? { ...block, text: block.text.split("\n").slice(1).join("\n").trim() } : block);
      return <article className="blog-topic-entry" id={item.id} key={index}>
        <h3>{item.title}</h3>
        {description ? <p className="blog-topic-description">{description}</p> : null}
        {action ? <SiteLink href={action.href} className="coaching-text-link">{action.label}<ArrowUpRight aria-hidden="true" /></SiteLink> : null}
        <details className="coaching-detail blog-topic-details"><summary><span>适合人群与阅读方向</span><span className="coaching-plus" aria-hidden="true" /></summary><div className="coaching-detail-body"><SectionBody blocks={details} columns={1} /></div></details>
      </article>;
    })}</div>
    <SectionBody blocks={blocks.slice(gridIndex + 1)} columns={2} />
  </>;
  return <><SectionBody blocks={blocks.slice(0, gridIndex)} columns={1} /><TemplateTabs labels={grid.items.map(item => item.title)} steps={grid.mode === "steps"}>{grid.items.map((item, index) => <div key={index} id={item.id}><h3>{item.title}</h3><SectionBody blocks={item.blocks} columns={1} />{item.href ? <SiteLink href={item.href} className="coaching-text-link">了解这项支持 ↗</SiteLink> : null}</div>)}</TemplateTabs><SectionBody blocks={blocks.slice(gridIndex + 1)} columns={2} /></>;
}

export async function TemplatePage({ page }: { page: PageMeta }) {
  const route = `/${page.slug}/`;
  const [navigation, presentation, home, articles] = await Promise.all([getNavigationPresentation({ preview: false }), getSitePagePresentation(route), getHomePresentation({ preview: false }), page.slug === "resources" ? getSitePagePresentation("/blog/") : null]);
  const pageContent = articles ? includeResourceArticles(presentation.content, articles.content) : presentation.content;
  const content = {
    ...presentation,
    content: {
      ...pageContent,
      sections: pageContent.sections.map(section => ({
        ...section,
        blocks: section.blocks.map(block => block.kind === "actions" ? {
          ...block,
          actions: block.actions.map(action => action.href.startsWith(`${route}#`) ? { ...action, href: action.href.slice(route.length) } : action),
        } : block),
      })),
    },
  };
  const invitation = home?.invitation;
  const jsonLd = siteConfig.siteUrl ? { "@context": "https://schema.org", "@type": page.layout === "service" ? "Service" : "WebPage", name: page.titleZh, description: page.description, url: `${siteConfig.siteUrl}${route}`, ...(page.layout === "service" ? { provider: { "@type": "Organization", name: siteConfig.nameZh, url: siteConfig.siteUrl } } : {}) } : null;
  const resourceNavigation = [
    { id: "availability", label: "资源总览" },
    { id: "catalog", label: "查找资源" },
    { id: "Q06", label: "资源分类" },
    { id: "articles", label: "文章专栏" },
    { id: "Q27", label: "进一步支持" },
    { id: "Q31", label: "使用说明" },
  ];
  const sectionNavigation = page.slug === "resources"
    ? resourceNavigation.filter(item => content.content.sections.some(section => section.id === item.id))
    : content.content.sections.map(section => ({ id: section.id, label: section.title.replace(/^\d+[｜\s]*/, "").split("：")[0] }));
  const first = content.content.sections[0];
  const anchor = (id: string) => id.includes("-") ? id : `${content.anchorPrefix}-${id.toLowerCase()}`;
  return <div className={`coaching-page template-page${page.slug === "services/co-parenting" ? " co-parenting-page" : ""}${page.slug === "resources" ? " resources-page" : ""}${page.slug === "book-consultation" ? " booking-page" : ""}`} id="coaching-top"><HomeDesignSystem><HomeHeader breadcrumbSlug={page.slug} content={navigation ?? undefined} homeHref="/" openInNewTab /></HomeDesignSystem><main id="main-content" data-page={page.contentFile.replace(".mdx", "")} data-template="divorce-coaching"><section data-grid-section="12" className="coaching-hero coaching-wrap" aria-labelledby="page-title"><div className="hero-copy"><h1 id="page-title">{content.title}</h1><p className="hero-statement">{content.description.split("\n").filter(Boolean)[0]}</p>{content.description.split("\n").filter(Boolean).slice(1).map((line, index) => <p className="hero-description" key={index}>{line}</p>)}<div className="hero-actions"><HomeButton variant="primary" className="coaching-hero-button" href={page.layout === "booking" ? "#booking-channel" : "/book-consultation/"} target={page.layout === "booking" ? undefined : "_blank"} rel={page.layout === "booking" ? undefined : "noopener noreferrer"}>{page.layout === "booking" ? "填写预约申请" : "预约咨询"}</HomeButton><SiteLink className="coaching-text-link" href={`#${anchor(first.id)}`}>浏览本页内容 ↓</SiteLink></div></div><figure className="hero-photo"><img src={content.image.src} alt={content.image.alt} width={content.image.width} height={content.image.height} fetchPriority="high" {...photoProps(content.image.src, "(max-width: 720px) 90vw, 45vw")} /></figure></section><nav className="coaching-rail" aria-label="本页内容"><div className="coaching-wrap">{sectionNavigation.map(item => <SiteLink href={`#${anchor(item.id)}`} data-section-link={anchor(item.id)} key={item.id}>{item.label}</SiteLink>)}</div></nav>{content.content.intro.length ? <section data-grid-section="12" className="coaching-section"><div className="coaching-wrap"><Body blocks={content.content.intro} /></div></section> : null}{content.content.sections.map((section, index) => page.slug === "services/co-parenting" && coParentingSectionIds.has(section.id) ? <CoParentingSection section={section} anchorPrefix={content.anchorPrefix} key={section.id} /> : <section data-grid-section="12" className={`coaching-section template-section${index % 3 === 0 ? " coaching-fit" : ""}`} id={anchor(section.id)} key={section.id}><div className="coaching-wrap"><div className="coaching-heading"><h2>{section.title}</h2>{section.subtitle ? <p>{section.subtitle}</p> : null}</div>{section.blocks.some(block => block.kind === "booking") ? <><BookingForm wechat={content.booking?.wechat ?? ""} phone={content.booking?.phone ?? "15000973537"} questionnaire={content.booking?.questionnaire ?? ""} /><Body blocks={section.blocks.filter(block => block.kind !== "booking")} /></> : page.slug === "book-consultation" && section.id === "faq" ? <SectionBody blocks={section.blocks} columns={1} /> : <Body blocks={section.blocks} topicLinks={page.slug === "resources" && section.id === "articles-q09"} />}</div></section>)}{content.content.cta ? <section data-grid-section="12" className="coaching-section template-page-cta"><div className="coaching-wrap"><h2>{content.content.cta.title}</h2><p>{content.content.cta.body}</p><SectionBody blocks={[{ kind: "actions", actions: content.content.cta.actions }]} columns={1} /></div></section> : null}{page.slug !== "book-consultation" ? <HomeDesignSystem><HomeInvitation content={invitation} openInNewTab /></HomeDesignSystem> : null}</main><HomeDesignSystem><HomeFooter content={navigation ?? undefined} openInNewTab /></HomeDesignSystem><CoachingInteractions />{jsonLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} /> : null}</div>;
}
