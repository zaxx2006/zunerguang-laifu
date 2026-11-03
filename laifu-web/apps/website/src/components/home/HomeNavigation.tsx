import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { SiteLink } from "@/components/site/SiteLink";
import type { ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { HomeButton } from "./HomePrimitives";
import { homeFooterColumns, type FooterColumn } from "./home-content";
import type { NavigationPresentation } from "@/contracts/cms-home";

const primaryLinks = [
  ["/about/", "关于焕屿"],
  ["/resources/", "资源中心"],
  ["/blog/", "文章专栏"],
  ["/faq/", "常见问题"],
  ["/media/", "媒体动态"],
  ["/academy/", "焕屿学院"],
] as const;

export function HomeHeader({ homeHref = "#home", assessmentHref = "https://laifu-assessments.pages.dev/", content, breadcrumbSlug, onHero = false, openInNewTab = false }: {
  homeHref?: string; assessmentHref?: string; content?: NavigationPresentation; breadcrumbSlug?: string; onHero?: boolean; openInNewTab?: boolean;
}) {
  const links = [{ href: "/", label: "首页", openInNewTab: false }, ...(content?.primaryLinks ?? primaryLinks.map(([href, label]) => ({ href, label, openInNewTab: false })))];
  const assessment = content?.assessmentAction ?? { href: assessmentHref, label: "开始测评", openInNewTab: true };
  homeHref = content?.homeHref ?? homeHref;
  const pageHref = (href: string) => openInNewTab && href.startsWith("#") ? `/${href}` : href;
  return <header id="header" className={onHero ? "on-hero" : undefined} data-has-breadcrumbs={breadcrumbSlug ? true : undefined}><SiteLink className="logo" href={pageHref(homeHref)} target={openInNewTab ? "_blank" : undefined} rel={openInNewTab ? "noopener noreferrer" : undefined} aria-label="焕屿首页"><img alt="" height="19" src="/generated/logo/original.svg" width="30" /><span>焕屿</span><small>陪你慢慢理清</small></SiteLink>
    <nav aria-label="主导航">{links.map(({ href, label }) => <SiteLink href={pageHref(href)} target={openInNewTab ? "_blank" : undefined} rel={openInNewTab ? "noopener noreferrer" : undefined} key={href}>{label}</SiteLink>)}<HomeButton variant="navigation" href={pageHref(assessment.href)} target={openInNewTab || assessment.openInNewTab ? "_blank" : undefined} rel={openInNewTab || assessment.openInNewTab ? "noopener noreferrer" : undefined}>{assessment.label}</HomeButton></nav>
    <details className="mobile-menu"><summary aria-label="打开导航" title="导航"><Menu aria-hidden="true" className="mobile-menu__open" /><X aria-hidden="true" className="mobile-menu__close" /></summary>
      <nav aria-label="移动端主导航">{links.map(({ href, label }) => <SiteLink href={pageHref(href)} target={openInNewTab ? "_blank" : undefined} rel={openInNewTab ? "noopener noreferrer" : undefined} key={href}>{label}</SiteLink>)}<HomeButton variant="navigation" href={pageHref(assessment.href)} target={openInNewTab || assessment.openInNewTab ? "_blank" : undefined} rel={openInNewTab || assessment.openInNewTab ? "noopener noreferrer" : undefined}>{assessment.label}</HomeButton></nav>
    </details>
    {breadcrumbSlug ? <div className="header-breadcrumbs"><Breadcrumbs slug={breadcrumbSlug} /></div> : null}
  </header>;
}

export function HomeFooter({ columns = homeFooterColumns, statement = "焕屿专注离婚全周期陪伴辅导，协同合作律师及其他领域专家，陪你平稳度过人生转折，重掌生活主动权。", content, openInNewTab = false }: {
  columns?: readonly FooterColumn[]; statement?: ReactNode; content?: NavigationPresentation; openInNewTab?: boolean;
}) {
  const visibleColumns = content?.footerColumns.map(column => ({ title: column.title, links: column.links.map(link => [link.href, link.label] as const) })) ?? columns;
  return <footer className="site-footer" id="site-footer"><div className="container">
    <nav aria-label="页脚导航" className="footer-grid" data-grid="12">{visibleColumns.map(({ title, links }) => <div className="footer-column" key={title}>
      <h2>{title}</h2><div>{links.map(([href, label]) => <SiteLink href={href} target={openInNewTab ? "_blank" : undefined} rel={openInNewTab ? "noopener noreferrer" : undefined} key={href}>{label}</SiteLink>)}</div>
    </div>)}</nav>
    <div className="footer-brand" data-grid="12"><div className="footer-brand__identity">
      <SiteLink aria-label="焕屿首页" className="brand" href="/" target={openInNewTab ? "_blank" : undefined} rel={openInNewTab ? "noopener noreferrer" : undefined}><span className="brand__mark"><img alt="" decoding="async" height="48" loading="lazy" src="/brand/Logo-light.svg" width="48" /></span><span>焕屿<small>困境辅导 · LAIFU</small></span></SiteLink>
      <span className="footer-copyright">{content?.copyright ?? "焕屿 · LAIFU © 2026"}</span>
    </div><div className="footer-brand__statement"><p>{content?.footerStatement ?? statement}</p><span className="footer-disclaimer">{content?.footerDisclaimer ?? "本网站内容不构成法律意见、心理治疗或医疗建议。"}</span></div></div>
  </div></footer>;
}
