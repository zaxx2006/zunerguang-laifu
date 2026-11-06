import { SiteLink } from "@/components/site/SiteLink";
import { assessmentUrl } from "@/lib/site-links";
import { photoProps } from "@/lib/photo";
import { Fragment, type CSSProperties } from "react";
import { X } from "lucide-react";
import { HomeButton, HomeIcon } from "./HomePrimitives";
import { HomeServicesCarousel } from "./HomeServicesCarousel";
import { homeServices } from "./home-content";
import type { HomePresentation, NavigationPresentation } from "@/contracts/cms-home";

const assessmentPapers = [
  {
    key: "emotions",
    label: "情绪与决定",
    question: "面对离婚相关的争执或言语攻击，我能稳定情绪，聚焦问题解决而非情绪消耗。",
    prompt: "请按最近一个月的实际情况，思考这句话与你的符合程度。",
    style: { "--home-paper-x": "12px", "--home-paper-y": "0px", "--home-paper-angle": "-.7deg", zIndex: 1 },
  },
  {
    key: "living",
    label: "经济与生活",
    question: "当家庭遇到收入中断、需要紧急用钱等突发财务危机时，我有信心主导应对方案。",
    prompt: "请按最近一个月的实际情况，思考这句话与你的符合程度。",
    style: { "--home-paper-x": "-8px", "--home-paper-y": "46px", "--home-paper-angle": ".7deg", zIndex: 2 },
  },
  {
    key: "family",
    label: "孩子与关系",
    question: "我清楚自己争取或放弃抚养权的真实意愿，并能理性说明理由。",
    prompt: "请结合实际情况思考。正式问卷中的子女相关题目按个人情况适用。",
    style: { "--home-paper-x": "0px", "--home-paper-y": "92px", "--home-paper-angle": "0deg", zIndex: 3 },
  },
] as const;

const assessmentAnswers = [
  ["1", "完全不符合"], ["2", "不太符合"], ["3", "一般"], ["4", "基本符合"], ["5", "完全符合"], ["na", "与本人情况无关"],
] as const;

type HomeCSSProperties = CSSProperties & Record<`--home-${string}`, string>;

export function HomeHero({ content, assessmentAction }: { content?: HomePresentation["hero"]; assessmentAction?: NavigationPresentation["assessmentAction"] }) {
  const assessment = assessmentAction ?? { href: assessmentUrl, label: "开始测评", openInNewTab: true };
  const titleLines = content?.titleLines ?? ["当你站在婚姻的十字路口", "焕屿帮你找到通往幸福的路"];
  const introLines = content?.introLines ?? ["焕屿是专注婚姻全周期困境帮扶与辅导的专业平台。", "陪你走出情绪低谷、理清混乱局势，按需联动家事律师及心理、亲子、财税专家。"];
  return <section className="hero" data-home-section="hero" id="home" aria-labelledby="hero-title">
    <img className="hero-photo" src={content?.image.src ?? "/home-preview/hero-walk.webp"} alt={content?.image.alt ?? "一位女性在阳光洒落的树荫下向前行走"} fetchPriority="high" width={content?.image.width ?? 1280} height={content?.image.height ?? 854} {...photoProps(content?.image.src ?? "/home-preview/hero-walk.webp", "100vw")} />
    <div className="hero-copy"><h1 id="hero-title">{titleLines.map((line, index) => <Fragment key={line}>{index ? <br /> : null}{line}</Fragment>)}</h1>
      <p className="hero-intro">{introLines.map((line, index) => <Fragment key={line}>{index ? <br /> : null}{line}</Fragment>)}</p>
      <ConcernSearch placeholder={content?.searchPlaceholder} />
      <div className="hero-actions"><HomeButton href={assessment.href} target={assessment.openInNewTab ? "_blank" : undefined} rel={assessment.openInNewTab ? "noopener noreferrer" : undefined}>{assessment.label}</HomeButton><HomeButton href={content?.primaryAction.href ?? "/book-consultation/"} target={content?.primaryAction.openInNewTab ? "_blank" : undefined} rel={content?.primaryAction.openInNewTab ? "noopener" : undefined}>{content?.primaryAction.label ?? "预约咨询"}</HomeButton><HomeButton variant="text" href={content?.secondaryAction.href ?? "#services"}>{content?.secondaryAction.label ?? "了解服务体系"}</HomeButton></div>
    </div>
    <div className="hero-bottom"><SiteLink href="#journey">{content?.journeyLinkLabel ?? "从稳住自己，到看清下一步"}<HomeIcon name="arrow-down" /></SiteLink><span>{content?.journeySummary ?? "分居过渡 · 离婚推进 · 离婚后重建"}</span></div>
  </section>;
}

export function ConcernSearch({ placeholder = "我还没决定要不要离婚，可以先聊聊吗？" }: { placeholder?: string }) {
  return <form className="concern-search" id="concern-search" role="search"><div className="search-field">
    <HomeIcon name="search" className="search-icon" />
    <input id="concern-input" type="search" aria-label="输入你正在担心的问题" aria-controls="search-results" aria-expanded="false" placeholder={placeholder} autoComplete="off" maxLength={120} />
    <button className="search-submit" type="submit" aria-label="查找相关服务" title="查找相关服务"><HomeIcon name="arrow-up-right" /></button>
  </div><div className="search-results" id="search-results" aria-live="polite" hidden /></form>;
}

export function HomeServices({ content }: { content?: HomePresentation["services"] }) {
  const services = homeServices.map(service => {
    const configured = content?.items.find(item => item.href === service.href);
    return configured ? { ...service, description: configured.description, image: configured.image } : service;
  });
  return <HomeServicesCarousel services={services} headingLines={content?.titleLines ?? ["从你当下的需要出发，", "找到适合的支持入口"]} captionLeft={content?.captionLeft ?? "稳住状态 · 看清全局 · 有序行动"} captionRight={content?.captionRight ?? "焕屿 · 陪你慢慢理清"} />;
}

export function HomeAssessment({ content }: { content?: HomePresentation["assessment"] }) {
  return <section className="home-band assessment-section" data-home-section="assessment" id="assessment" aria-labelledby="assessment-title"><div className="band-inner assessment-layout">
    <div className="assessment-intro"><h2 id="assessment-title">{(content?.titleLines ?? ["把交织的顾虑，", "一件一件，慢慢看清。"]).map((line, index) => <Fragment key={line}>{index ? <br /> : null}{line}</Fragment>)}</h2><p>{(content?.descriptionLines ?? ["用约 5–8 分钟，梳理此刻的准备状态与仍待确认的问题。", "完成后会生成一份可保存的结果，帮助你看清下一步需要什么支持。"]).map((line, index) => <Fragment key={line}>{index ? <br /> : null}{line}</Fragment>)}</p><HomeButton variant="primary" href={content?.action.href ?? "https://laifu-assessments.pages.dev/"} target={content?.action.openInNewTab ? "_blank" : undefined} rel={content?.action.openInNewTab ? "noopener" : undefined}>{content?.action.label ?? "开始完整自测"}</HomeButton></div>
    <div className="concern-papers" role="group" aria-label="自测关注的三个主题">{assessmentPapers.map((paper, index) => {
      const active = index === 2;
      return <article className="paper-sheet" data-theme={paper.key} style={paper.style as HomeCSSProperties} key={paper.key}>
        <button className="paper-tab" id={`paper-tab-${paper.key}`} type="button" aria-expanded={active} aria-controls={`paper-${paper.key}`}>{paper.label}</button>
        <div className="paper-content" id={`paper-${paper.key}`} inert={!active}><h3 id={`paper-question-${paper.key}`}>{paper.question}</h3><p>{paper.prompt}</p>
          <fieldset className="paper-answers" aria-labelledby={`paper-question-${paper.key}`}>{assessmentAnswers.map(([value, label]) => <label className="paper-choice" key={value}><input type="radio" name={`answer-${paper.key}`} value={value} /><span>{label}</span></label>)}</fieldset>
          <p className="paper-answer-status" role="status" aria-live="polite" aria-atomic="true">选择更接近你的答案，也可以稍后再答。</p>
          <SiteLink className="band-link" href="https://laifu-assessments.pages.dev/" target="_blank" rel="noopener">开始完整自测<HomeIcon name="arrow-up-right" /></SiteLink>
          <p className="paper-note">{content?.note ?? "问卷体验 · 答案仅保留在本页，不计分、不提交，正式测评需重新作答。"}</p>
        </div>
      </article>;
    })}</div>
  </div></section>;
}

export function HomeGuides({ content }: { content?: HomePresentation["guides"] }) {
  const guideItems = content?.items ?? [];
  return <section className="home-band guides-section" data-home-section="guides" id="free-guides" aria-labelledby="guides-title"><div className="band-inner">
    <div className="band-heading"><h2 id="guides-title">{(content?.titleLines ?? ["从一份免费指南，", "开始了解眼前的问题。"]).map((line, index) => <Fragment key={line}>{index ? <br /> : null}{line}</Fragment>)}</h2><p>{content?.description ?? "如果暂时还不想咨询，也可以先看看与你处境相关的指南主题。把复杂的问题分开理解，再决定下一步。"}</p></div>
    <div className="guide-list">{guideItems.map((guide, index) => <article className="guide-item" key={guide.href}>
      <button className="guide-cover" type="button" data-guide={index} data-reader-href={guide.href} data-reader-title={guide.titleLines.join("")} aria-expanded="false" aria-controls="guide-reader" aria-label={`翻开${guide.titleLines.join("")}`}><div className="guide-cover-top"><b>焕屿</b><span>{guide.eyebrow}</span></div><h3>{guide.titleLines.map((line, i) => <Fragment key={i}>{i ? <br /> : null}{line}</Fragment>)}</h3><p className="cover-subtitle">{guide.subtitleLines.join("")}</p><img src={guide.image.src} alt={guide.image.alt} width={guide.image.width} height={guide.image.height} loading="lazy" /></button>
      <div className="guide-meta"><span>{guide.meta}</span><a className="band-link" href={guide.href} target="_blank" rel="noopener noreferrer">在线阅读<HomeIcon name="arrow-up-right" /></a></div>
    </article>)}
      <div className="guide-reader" id="guide-reader" hidden><div className="guide-reader-bar"><h3 id="guide-reader-title" /><button className="guide-close" type="button" aria-label="合上指南" title="合上指南"><X aria-hidden="true" /></button></div><div className="guide-book-stage" /></div>
      {!guideItems.length ? <p className="small-note">阅读资源正在整理中，你可以先前往资源中心查看。</p> : null}
    </div><div className="guide-status"><p className="small-note">{content?.statusNote ?? "正式资源与获取方式以资源中心发布为准。"}</p><SiteLink className="band-link" href={content?.indexAction.href ?? "/resources/"}>{content?.indexAction.label ?? "前往资源中心"}<HomeIcon name="arrow-up-right" /></SiteLink></div>
  </div></section>;
}

export function HomeInvitation({ content, openInNewTab = false }: { content?: HomePresentation["invitation"]; openInNewTab?: boolean }) {
  return <section className="closing-invitation" data-home-section="invitation" id="closing-invitation" aria-labelledby="invitation-title"><img className="invitation-photo" src="/home-preview/closing-invitation-1280.webp" alt="" aria-hidden="true" width={1280} height={640} loading="lazy" decoding="async" /><div className="shell">
    <h2 id="invitation-title">{content?.title ?? "不需要做好万全准备再选择我们"}</h2><p className="invitation-copy">{(content?.descriptionLines ?? ["大多数人来到焕屿时，都未曾做好万全准备。你不必强迫自己先理清所有问题。", "从一次咨询、一份免费资源、一节课程或一次状态自测开始，找到适合自己的下一步。"]).map((line, index) => <Fragment key={line}>{index ? <br /> : null}{line}</Fragment>)}</p>
    <div className="invitation-actions">{(content?.actions ?? [{ label: "预约咨询", href: "/book-consultation/", openInNewTab: false }, { label: "开始自测", href: assessmentUrl, openInNewTab: true }, { label: "了解全部服务", href: "/services/", openInNewTab: false }]).map(item => <HomeButton variant="invitation" href={openInNewTab && item.href.startsWith("#") ? `/${item.href}` : item.href} target={openInNewTab ? "_blank" : undefined} rel={openInNewTab ? "noopener noreferrer" : undefined} key={item.href}>{item.label}</HomeButton>)}</div>
    <p className="assessment-note">{content?.assessmentNote ?? "约 5–8 分钟自我梳理：了解准备状态与支持需要。"}</p>
  </div></section>;
}
