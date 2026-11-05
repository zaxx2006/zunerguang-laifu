import { SiteLink } from "@/components/site/SiteLink";
import { Fragment, type ReactNode } from "react";
import { HomeInvitation } from "@/components/home/HomeSections";
import { HomeHeader, HomeFooter } from "@/components/home/HomeNavigation";
import { HomeDesignSystem, HomeButton } from "@/components/home/HomePrimitives";
import type { CmsAction } from "@/contracts/cms-home";
import type { ServicePresentation } from "@/contracts/cms-service";
import { divorceCoachingFallback } from "@/content/service-presentations";
import { getHomePresentation, getNavigationPresentation, getServicePresentation } from "@/lib/cms-content-client";
import type { PageMeta } from "@/lib/page-schema";
import { photoProps } from "@/lib/photo";
import { siteConfig } from "@/lib/site-config";
import { CoachingInteractions } from "./CoachingInteractions";
import "./coaching.css";

const lifeIcons: Record<string, string> = {
  children: "M8 7a3 3 0 1 0 0 .1M5 20v-4a3 3 0 0 1 6 0v4m5-9a2 2 0 1 0 0 .1m-2 9v-3a2 2 0 0 1 4 0v3",
  "daily-life": "m3 11 9-8 9 8M5 10v11h14V10m-10 11v-7h6v7",
  work: "M4 7h16v13H4zM9 7V4h6v3M4 12h16m-10 0v3h4v-3",
  network: "M9 8a3 3 0 1 0 0 .1m7 1a2 2 0 1 0 0 .1M3 21v-4a6 6 0 0 1 12 0v4m2-7a4 4 0 0 1 4 4v3",
};

function Copy({ text }: { text: string }) {
  const result: ReactNode[] = [];
  let list: string[] = [];
  const flush = () => {
    if (!list.length) return;
    result.push(<ul key={`list-${result.length}`}>{list.map(line => <li key={line}>{line}</li>)}</ul>);
    list = [];
  };
  for (const line of text.split("\n").filter(line => line.trim())) {
    if (line.startsWith("·")) list.push(line.slice(1));
    else {
      flush();
      result.push(<p key={`copy-${result.length}`}>{line}</p>);
    }
  }
  flush();
  return <>{result}</>;
}

function Lines({ values }: { values: string[] }) {
  return <>{values.map((line, index) => <Fragment key={line}>{index ? <br /> : null}{line}</Fragment>)}</>;
}

function Arrow() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>;
}

function Plus() {
  return <span className="coaching-plus" aria-hidden="true" />;
}

function ActionLink({ action, className }: { action: CmsAction; className: string }) {
  return <SiteLink className={className} href={action.href} target={action.openInNewTab ? "_blank" : undefined} rel={action.openInNewTab ? "noopener noreferrer" : undefined}>{action.label}<Arrow /></SiteLink>;
}

function Tabs({ name, labels }: { name: string; labels: string[] }) {
  const label = { stage: "选择当前阶段", support: "选择支持方向", reflection: "选择梳理角度", document: "查看材料整理示意", life: "查看生活安排方向" }[name];
  return <div className={`coaching-tabs ${name}-tabs`} role="tablist" aria-label={label}>{labels.map((text, index) => <button key={text} type="button" role="tab" id={`${name}-tab-${index}`} aria-selected={index === 0} aria-controls={`${name}-panel-${index}`} tabIndex={index === 0 ? 0 : -1} data-tab={index}>{name === "stage" ? <span className="stage-node" aria-hidden="true" /> : null}{text}</button>)}</div>;
}

function Fit({ content }: { content: ServicePresentation }) {
  return <section className="coaching-section coaching-fit" id="fit" data-grid-section="12"><div className="coaching-wrap">
    <span className="coaching-anchor" id="divorceCoaching-q03" />
    <ul className="situation-overview">{content.fit.overview.map(text => <li key={text}>{text}</li>)}</ul>
    <p className="situation-note">{content.fit.note}</p>
    <div data-tabs="stage"><Tabs name="stage" labels={content.fit.stages.map(stage => stage.label)} />
      {content.fit.stages.map((stage, index) => {
        const target = content.support.directions.findIndex(direction => direction.key === stage.supportDirection);
        return <div className="stage-panel" id={`stage-panel-${index}`} role="tabpanel" aria-labelledby={`stage-tab-${index}`} hidden={index !== 0} key={stage.key}><div><h3>{stage.title}</h3><p>{stage.description}</p><ul className="stage-concerns" aria-label="这个阶段可能关心的问题">{stage.concerns.map(text => <li key={text}>{text}</li>)}</ul></div><div className="stage-support"><p>{stage.support}</p><SiteLink className="coaching-text-link" href="#support" data-support-target={target}>看看对应的支持<Arrow /></SiteLink></div></div>;
      })}
    </div>
  </div></section>;
}

function SupportVisual({ content, index }: { content: ServicePresentation; index: number }) {
  const direction = content.support.directions[index];
  return <div className={`support-visual support-visual-${index}`}><figure className="support-photo"><img src={direction.image.src} alt={direction.image.alt} width={direction.image.width} height={direction.image.height} loading="lazy" decoding="async" {...photoProps(direction.image.src, "(max-width: 720px) 90vw, 38vw")} /></figure>
    {index === 0 ? <div className="reflection-workspace" data-tabs="reflection"><Tabs name="reflection" labels={content.support.reflections.map(item => item.label)} />{content.support.reflections.map((item, part) => <div className="reflection-panel" id={`reflection-panel-${part}`} role="tabpanel" aria-labelledby={`reflection-tab-${part}`} hidden={part !== 0} key={item.key}><strong>{item.title}</strong><p>{item.text}</p></div>)}</div> : null}
    {index === 1 ? <div className="document-workspace" data-tabs="document"><Tabs name="document" labels={content.support.documents.map(item => item.title)} />{content.support.documents.map((document, part) => <div className="document-panel" id={`document-panel-${part}`} role="tabpanel" aria-labelledby={`document-tab-${part}`} hidden={part !== 0} key={document.key}><dl>{document.rows.map(row => <div key={row.label}><dt>{row.label}</dt><dd>{row.text}</dd></div>)}</dl><small>示意内容，不含来访者资料</small></div>)}</div> : null}
    {index === 2 ? <div className="life-workspace" data-tabs="life"><div className="life-tabs" role="tablist" aria-label="查看生活安排方向">{content.support.lifeAreas.map((area, part) => <button key={area.key} type="button" role="tab" id={`life-tab-${part}`} aria-selected={part === 0} aria-controls={`life-panel-${part}`} tabIndex={part === 0 ? 0 : -1} data-tab={part}><svg viewBox="0 0 24 24" aria-hidden="true"><path d={lifeIcons[area.key] ?? lifeIcons.network} /></svg>{area.label}</button>)}</div>{content.support.lifeAreas.map((area, part) => <div className="life-panel" id={`life-panel-${part}`} role="tabpanel" aria-labelledby={`life-tab-${part}`} hidden={part !== 0} key={area.key}><p>{area.text}</p></div>)}</div> : null}
  </div>;
}

function Support({ content }: { content: ServicePresentation }) {
  let topicNumber = 0;
  return <section className="coaching-section" id="support" data-grid-section="12"><div className="coaching-wrap">
    <span className="coaching-anchor" id="divorceCoaching-q07" /><div className="coaching-heading"><h2>{content.support.title}</h2><p><Lines values={content.support.introLines} /></p></div>
    <p className="support-introduction">在离婚这场重大的人生变局中，很多人都迫于压力陷入两个极端：因为愤怒仓促行动，或因为恐惧不断退让。<br />离婚陪伴辅导能帮助你做到：</p>
    <div data-tabs="support"><Tabs name="support" labels={content.support.directions.map(direction => direction.label)} />
      {content.support.directions.map((direction, index) => <div className="support-panel" id={`support-panel-${index}`} role="tabpanel" aria-labelledby={`support-tab-${index}`} hidden={index !== 0} key={direction.key}>
        <SupportVisual content={content} index={index} />
        <div className="support-reading"><h3>{direction.title}</h3><p>{direction.description}</p><div className="support-topics">{direction.topics.map((topic, topicIndex) => {
          const anchor = `help-${++topicNumber}`;
          return <details className="coaching-detail" id={anchor} name={`support-${index}`} open={topicIndex === 0} key={topic.key}><summary><span><span className="coaching-anchor" id={`divorceCoaching-${topic.key}`} />{topic.title}</span><Plus /></summary><div className="coaching-detail-body"><Copy text={topic.body} /></div></details>;
        })}</div><SiteLink className="coaching-text-link" href="#process">了解辅导怎样开展<Arrow /></SiteLink></div>
      </div>)}
    </div>
  </div></section>;
}

function Process({ content }: { content: ServicePresentation }) {
  return <section className="coaching-section coaching-process" id="process" data-grid-section="12"><div className="coaching-wrap">
    <span className="coaching-anchor" id="divorceCoaching-q25" /><div className="coaching-heading"><h2>{content.process.title}</h2><p>{content.process.intro}</p></div>
    <div data-tabs="process"><div className="process-tabs" role="tablist" aria-label="查看辅导步骤"><span className="process-track" aria-hidden="true"><span /></span>{content.process.steps.map((step, index) => <button type="button" role="tab" key={step.key} id={`process-tab-${index}`} aria-selected={index === 0} aria-controls={`process-panel-${index}`} tabIndex={index === 0 ? 0 : -1} data-tab={index}><span className="process-dot">0{index + 1}</span><span>{step.label}</span><small>{step.short}</small></button>)}</div>
      {content.process.steps.map((step, index) => <div className="process-panel" id={`process-panel-${index}`} role="tabpanel" aria-labelledby={`process-tab-${index}`} hidden={index !== 0} key={step.key}><div className="process-copy"><h3>{step.label}</h3><p>{step.intro}</p><ul>{step.focus.map(text => <li key={text}>{text}</li>)}</ul><p>{step.goal}</p></div><figure className={`process-map process-map-${index}`}><figcaption>{step.mapTitle}</figcaption><div>{step.mapItems.map(item => <span className="map-item" key={item}>{item}</span>)}</div><p><Arrow />{step.mapEnd}</p><small>辅导过程示意</small></figure></div>)}
    </div>
    <div className="process-modules"><h3>{content.process.modulesTitle}</h3><dl>{content.process.modules.map(module => <div key={module.title}><dt>{module.title}</dt><dd>{module.text}</dd></div>)}</dl><p>{content.process.note}</p></div>
  </div></section>;
}

function SupportOptions({ content }: { content: ServicePresentation }) {
  return <section className="coaching-section coaching-options" id="options" data-grid-section="12"><div className="coaching-wrap"><div className="coaching-heading"><h2>{content.options.title}</h2></div><div className="options-closing"><div>{content.options.closingLines.map(line => <p key={line}>{line.split(/(获得同意|独立性和自主权)/).map((part, index) => index % 2 ? <strong key={index}>{part}</strong> : part)}</p>)}</div></div></div></section>;
}

function Comparison({ content }: { content: ServicePresentation }) {
  return <section className="coaching-section" id="comparison" data-grid-section="12"><div className="coaching-wrap">
    <span className="coaching-anchor" id="divorceCoaching-q30" /><div className="coaching-heading"><h2>{content.comparison.title}</h2><p>{content.comparison.intro}</p></div>
    <div className="comparison-scroll"><table><caption>{content.comparison.caption}</caption><thead><tr>{content.comparison.headers.map(text => <th scope="col" key={text}>{text}</th>)}</tr></thead><tbody>{content.comparison.rows.map(row => <tr key={row.dimension}><th scope="row">{row.dimension}</th><td>{row.therapy}</td><td>{row.coaching}</td><td>{row.legal}</td></tr>)}</tbody></table></div>
  </div></section>;
}

function Outcomes({ content }: { content: ServicePresentation }) {
  return <section className="coaching-section coaching-changes" id="changes" data-grid-section="12"><div className="coaching-wrap"><span className="coaching-anchor" id="divorceCoaching-q33" /><div className="coaching-heading"><h2>{content.outcomes.title}</h2><p>{content.outcomes.intro}</p></div><ul className="outcome-overview">{content.outcomes.items.map(text => <li key={text}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6" /></svg>{text}</li>)}</ul><p className="outcome-closing">{content.outcomes.closing}</p></div></section>;
}

const navigation = [["fit", "适合谁"], ["support", "怎样帮助"], ["process", "辅导流程"], ["options", "支持方式"], ["comparison", "专业分工"], ["changes", "可能的收获"]] as const;

export async function DivorceCoachingPage({ page }: { page: PageMeta }) {
  const [navigationContent, cmsContent, home] = await Promise.all([getNavigationPresentation({ preview: false }), getServicePresentation("divorce-coaching", { preview: true }), getHomePresentation({ preview: false })]);
  const content = cmsContent?.key === "divorce-coaching" ? cmsContent : divorceCoachingFallback;
  const pageUrl = siteConfig.siteUrl ? `${siteConfig.siteUrl}/services/divorce-coaching/` : undefined;
  const jsonLd = pageUrl ? { "@context": "https://schema.org", "@type": "Service", name: page.titleZh, description: page.description, url: pageUrl, provider: { "@type": "Organization", name: siteConfig.nameZh, url: siteConfig.siteUrl } } : null;
  return <div className="coaching-page" id="coaching-top"><HomeDesignSystem><HomeHeader breadcrumbSlug={page.slug} content={navigationContent ?? undefined} homeHref="/" openInNewTab /></HomeDesignSystem>
    <main id="main-content" data-page="divorce-coaching"><section className="coaching-hero coaching-wrap" aria-labelledby="page-title" data-grid-section="12"><div className="hero-copy"><h1 id="page-title">{page.titleZh}</h1><p className="hero-description">{content.hero.audience}</p><p className="hero-statement">{content.hero.statementLines.map(line => <span className="coaching-statement-line" key={line}>{line.match(/[^，]+，?/g)?.map(phrase => <span className="coaching-statement-phrase" key={phrase}>{phrase}</span>)}</span>)}</p><p className="hero-context">{content.hero.context}</p><div className="hero-actions"><HomeButton variant="primary" className="coaching-hero-button" href={content.hero.primaryAction.href} target={content.hero.primaryAction.openInNewTab ? "_blank" : undefined} rel={content.hero.primaryAction.openInNewTab ? "noopener noreferrer" : undefined}>{content.hero.primaryAction.label}</HomeButton><ActionLink action={content.hero.secondaryAction} className="coaching-text-link" /></div></div><figure className="hero-photo"><img src={content.hero.image.src} alt={content.hero.image.alt} width={content.hero.image.width} height={content.hero.image.height} fetchPriority="high" {...photoProps(content.hero.image.src, "(max-width: 720px) 90vw, 45vw")} /></figure></section>
      <nav className="coaching-rail" aria-label="本页内容"><div className="coaching-wrap">{navigation.map(([id, label]) => <SiteLink href={`#${id}`} data-section-link={id} key={id}>{label}</SiteLink>)}<ActionLink action={content.hero.primaryAction} className="rail-booking" /></div></nav>
      <Fit content={content} /><Support content={content} /><Process content={content} /><SupportOptions content={content} /><Comparison content={content} /><Outcomes content={content} /><div id="consultation"><span className="coaching-anchor" id="divorceCoaching-q37" /><HomeDesignSystem><HomeInvitation content={{ ...(home?.invitation ?? content.finalCta), title: content.finalCta.title }} openInNewTab /></HomeDesignSystem></div>
    </main><HomeDesignSystem><HomeFooter content={navigationContent ?? undefined} openInNewTab /></HomeDesignSystem>
    {jsonLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} /> : null}<CoachingInteractions />
  </div>;
}
