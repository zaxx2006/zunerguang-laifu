import { SiteLink } from "@/components/site/SiteLink";
import { photoProps } from "@/lib/photo";
import { cookies, draftMode } from "next/headers";
import { HomeHeader, HomeFooter } from "@/components/home/HomeNavigation";
import { HomeDesignSystem, HomeButton } from "@/components/home/HomePrimitives";
import { HomeInvitation } from "@/components/home/HomeSections";
import { highConflictFallback } from "@/content/service-presentations";
import type { CmsAction } from "@/contracts/cms-home";
import { getHomePresentation, getNavigationPresentation, getServicePresentation } from "@/lib/cms-content-client";
import { siteConfig } from "@/lib/site-config";
import { ChildArrangements, EventComparison, PhaseCollaboration, ResilientImage, ServiceExplorer } from "./ConflictInteractions";
import "./high-conflict.css";

function Action({ action, primary = false }: { action: CmsAction; primary?: boolean }) {
  const externalPage = !action.href.startsWith("#");
  return <HomeButton variant={primary ? "primary" : "text"} href={action.href} target={externalPage ? "_blank" : undefined} rel={externalPage ? "noopener noreferrer" : undefined} className={primary ? "hc-button" : "hc-text-link"}>{action.label}</HomeButton>;
}

export async function HighConflictPage() {
  const [navigation, cms, home, draft] = await Promise.all([getNavigationPresentation({ preview: false }), getServicePresentation("high-conflict-divorce"), getHomePresentation({ preview: false }), draftMode()]);
  const previewForPage = draft.isEnabled && (await cookies()).has("laifu_preview_service_high-conflict-divorce_id");
  if (previewForPage && !cms) throw new Error("无法读取此页草稿，请检查 CMS 内容后重试。");
  const c = cms?.key === "high-conflict-divorce" ? cms : highConflictFallback;
  const invitation = home?.invitation;
  const navigationLinks = [{ section: "cycle", label: "理解高冲突" }, { section: "support", label: "七项专项支持" }, { section: "children", label: "孩子保护" }, { section: "process", label: "支持与协作" }];
  const jsonLd = { "@context": "https://schema.org", "@type": "Service", name: "高冲突婚姻专项支持", serviceType: "婚姻困境陪伴辅导", ...(siteConfig.siteUrl ? { url: `${siteConfig.siteUrl}/services/high-conflict-divorce/`, provider: { "@type": "Organization", name: siteConfig.nameZh, url: siteConfig.siteUrl } } : {}) };
  return <HomeDesignSystem><div className="hc-page"><HomeHeader breadcrumbSlug="services/high-conflict-divorce" content={navigation ?? undefined} homeHref="/" openInNewTab /><main id="main-content" data-page="high-conflict-divorce" data-content-source={cms ? "cms" : "reviewed-fallback"}>
    {previewForPage ? <aside className="hc-preview">{c.ui.previewLabel}<form action="/api/cms/preview/exit" method="post"><button type="submit">{c.ui.exitPreview}</button></form></aside> : null}
    <section data-grid-section="12" className="hc-hero hc-wrap"><div className="hc-hero-copy"><h1>{c.hero.title}</h1><p className="hc-statement">{c.hero.statement}</p><p>{c.hero.audience}</p><p>{c.hero.value}</p><div className="hc-actions"><Action action={c.hero.primaryAction} primary /><Action action={{ ...c.hero.secondaryAction, label: "高冲突婚姻风险自测量表", href: "https://laifu-assessments.pages.dev/narcissism-risk/" }} /></div></div><div className="hc-hero-visual"><figure><ResilientImage {...c.hero.image} {...photoProps(c.hero.image.src, "(max-width: 720px) 90vw, 45vw")} eager /></figure><SiteLink className="hc-hero-document" href="#service-records"><span className="hc-document-label">事实整理 · 工作示意</span><div><span>零散记录</span><span aria-hidden="true">→</span><span>事件时间线</span><span aria-hidden="true">→</span><span>事实摘要</span></div><p>让专业沟通，有清晰的事实脉络。<span aria-hidden="true">↗</span></p></SiteLink></div></section>
    <nav className="hc-rail" aria-label={c.ui.navLabel}><div className="hc-wrap">{navigationLinks.map(link => <SiteLink href={`#${link.section}`} key={link.section}>{link.label}</SiteLink>)}</div></nav>
    <section data-grid-section="12" id="cycle" className="hc-section hc-wrap"><div className="hc-heading"><h2>同样一次分歧，为什么会走向不同的过程？</h2><p>高冲突需要放在事件的前后联系中理解。通过一次接送安排的示意，看看具体分歧与反复变更、否认、施压之间的差异。</p></div><EventComparison /></section>
    <section data-grid-section="12" id="support" className="hc-section hc-support hc-tint"><div className="hc-wrap"><div className="hc-heading"><h2>{c.support.title}</h2><p>{c.support.intro}</p></div><ServiceExplorer content={c.support} /></div></section>
    <section data-grid-section="12" id="children" className="hc-section hc-wrap"><div className="hc-heading"><h2>{c.children.title}</h2><p>{c.children.intro}</p></div><div className="hc-children-layout"><figure><ResilientImage {...c.children.image} {...photoProps(c.children.image.src, "(max-width: 720px) 90vw, 40vw")} /><p className="hc-note">{c.children.note}</p></figure><div className="hc-child-interaction"><ChildArrangements /></div></div></section>
    <section data-grid-section="12" id="process" className="hc-section hc-tint"><div className="hc-wrap"><div className="hc-heading"><h2>{c.process.title}</h2><p>{c.process.intro}</p></div><PhaseCollaboration process={c.process} comparison={c.comparison} /></div></section>
    <HomeInvitation content={invitation} openInNewTab />
  </main><HomeFooter content={navigation ?? undefined} openInNewTab /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} /></div></HomeDesignSystem>;
}
