import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { SiteLink } from "@/components/site/SiteLink";
import type { ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { ServicesMenu } from "./ServicesMenu";
import { serviceLinks } from "@/lib/navigation";
import { HomeButton } from "./HomePrimitives";
import { homeFooterColumns, arrangeFooterColumns, type FooterColumn } from "./home-content";
import type { NavigationPresentation } from "@/contracts/cms-home";

const primaryLinks = [
  ["/", "首页"],
  ["/services/", "服务"],
  ["/academy/", "焕屿学院"],
  ["/resources/", "资源中心"],
  ["/retreats-workshops/", "线下活动"],
  ["/about/", "关于焕屿"],
] as const;

export function HomeHeader({ homeHref = "#home", content, breadcrumbSlug, onHero = false, openInNewTab = false }: {
  homeHref?: string; content?: NavigationPresentation; breadcrumbSlug?: string; onHero?: boolean; openInNewTab?: boolean;
}) {
  homeHref = content?.homeHref ?? homeHref;
  const pageHref = (href: string) => openInNewTab && href.startsWith("#") ? `/${href}` : href;
  const linkProps = { target: openInNewTab ? "_blank" : undefined, rel: openInNewTab ? "noopener noreferrer" : undefined };
  const navigationLinks = primaryLinks.map(([href, label]) => href === "/services/" ? <ServicesMenu label={label} key={href}>
    <div className="services-menu__links">{serviceLinks.map(([serviceHref, serviceLabel]) => <SiteLink href={serviceHref} {...linkProps} key={serviceHref}>{serviceLabel}</SiteLink>)}</div>
  </ServicesMenu> : <SiteLink href={href} {...linkProps} key={href}>{label}</SiteLink>);
  return <header id="header" className={onHero ? "on-hero" : undefined} data-has-breadcrumbs={breadcrumbSlug ? true : undefined}><SiteLink className="logo" href={pageHref(homeHref)} target={openInNewTab ? "_blank" : undefined} rel={openInNewTab ? "noopener noreferrer" : undefined} aria-label="焕屿首页"><img alt="" height="19" src="/generated/logo/original.svg" width="30" /><span>焕屿</span><small>陪你慢慢理清</small></SiteLink>
    <nav aria-label="主导航">{navigationLinks}<HomeButton variant="navigation" href="/book-consultation/" {...linkProps}>预约咨询</HomeButton></nav>
    <details className="mobile-menu"><summary aria-label="打开导航" title="导航"><Menu aria-hidden="true" className="mobile-menu__open" /><X aria-hidden="true" className="mobile-menu__close" /></summary>
      <nav aria-label="移动端主导航">{navigationLinks}<HomeButton variant="navigation" href="/book-consultation/" {...linkProps}>预约咨询</HomeButton></nav>
    </details>
    {breadcrumbSlug ? <div className="header-breadcrumbs"><Breadcrumbs slug={breadcrumbSlug} /></div> : null}
  </header>;
}

export function HomeFooter({ columns = homeFooterColumns, statement = "焕屿以客户福祉为中心，致力于打造有温度、有边界、可落地的婚姻困境辅导体系。陪你平稳度过人生转折，重掌生活主动权。", content, openInNewTab = false }: {
  columns?: readonly FooterColumn[]; statement?: ReactNode; content?: NavigationPresentation; openInNewTab?: boolean;
}) {
  const visibleColumns = arrangeFooterColumns((content?.footerColumns.map(column => ({ title: column.title, links: column.links.filter(link => !["/blog/", "/faq/"].includes(link.href)).map(link => [link.href, link.href === "/retreats-workshops/" && link.label === "线下活动" ? "其他活动" : link.label] as const) })) ?? columns).map(column => ({ ...column, links: column.links.filter(([href]) => !/^\/media(?:\/|[?#]|$)/.test(href)) })));
  return <footer className="site-footer" id="site-footer"><div className="container">
    <nav aria-label="页脚导航" className="footer-grid" data-grid="12">{visibleColumns.map(({ title, links }) => <div className="footer-column" key={title}>
      <h2>{title}</h2><div>{links.map(([href, label]) => <SiteLink href={href} target={openInNewTab ? "_blank" : undefined} rel={openInNewTab ? "noopener noreferrer" : undefined} key={href}>{label}</SiteLink>)}</div>
    </div>)}</nav>
    <div className="footer-brand" data-grid="12"><div className="footer-brand__identity">
      <SiteLink aria-label="焕屿首页" className="brand" href="/" target={openInNewTab ? "_blank" : undefined} rel={openInNewTab ? "noopener noreferrer" : undefined}><span className="brand__mark"><img alt="" decoding="async" height="48" loading="lazy" src="/brand/Logo-light.svg" width="48" /></span><span>焕屿<small>困境辅导 · HUANYU</small></span></SiteLink>
      <span className="footer-copyright">{(content?.copyright ?? "焕屿 · HUANYU © 2026").replace(/\blaifu\b/gi, "HUANYU")}</span>
    </div><div className="footer-brand__statement"><p>{content?.footerStatement ?? statement}</p><span className="footer-disclaimer">{content?.footerDisclaimer ?? "本网站内容不构成法律意见、心理治疗或医疗建议。"}</span></div></div>
  </div></footer>;
}
