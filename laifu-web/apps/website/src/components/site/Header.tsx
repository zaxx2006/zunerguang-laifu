import { SiteLink } from "@/components/site/SiteLink";
import { Menu, X } from "lucide-react";
import { activityLinks, primaryLinks, serviceGroups } from "@/lib/navigation";

type NavLink = readonly [string, string];

const mainMenuLinks: ReadonlyArray<NavLink> = [["/", "首页"], ["/about/", "关于焕屿"], ...primaryLinks.filter(([href]) => href !== "/retreats-workshops/")];
const serviceMenuLinks: ReadonlyArray<NavLink> = [["/services/", "服务总览"], ...serviceGroups.filter((group) => group.title !== "学习与成长").flatMap((group) => group.links.map(([href, label]): NavLink => [href, label]))];
const activityMenuLinks: ReadonlyArray<NavLink> = [...activityLinks, ["/academy/", "焕屿学院"]];

function currentPage(currentPath: string | undefined, href: string) {
  return currentPath === href.split("#")[0];
}

function NavigationColumn({ currentPath, label, links, primary, title }: { currentPath?: string; label: string; links: ReadonlyArray<NavLink>; primary?: boolean; title?: string }) {
  return <nav aria-label={label} className={`menu-column${primary ? " menu-column--primary" : ""}`}>
    {title ? <h2>{title}</h2> : null}
    <ul>{links.map(([href, text]) => <li key={href}><SiteLink aria-current={currentPage(currentPath, href) ? "page" : undefined} href={href}>{text}</SiteLink></li>)}</ul>
  </nav>;
}

export function Header({ currentPath }: { currentPath?: string }) {
  return <header className="site-header">
    <div className="primary-nav"><div className="container primary-nav__inner" data-grid="12">
      <SiteLink aria-label="焕屿首页" className="brand" href="/"><span className="brand__mark"><img alt="" decoding="async" height="40" src="/generated/logo/original.svg" width="40" /></span><span>焕屿<small>困境辅导</small></span></SiteLink>
      <div className="header-utilities">
        <SiteLink aria-current={currentPage(currentPath, "/book-consultation/") ? "page" : undefined} className="button button--primary desktop-cta" href="/book-consultation/">预约咨询</SiteLink>
        <details className="site-menu">
          <summary aria-label="打开或关闭全站导航" className="menu-button"><span>菜单</span><Menu aria-hidden="true" className="menu-icon menu-icon--open" /><X aria-hidden="true" className="menu-icon menu-icon--close" /></summary>
          <div className="site-menu__panel"><div className="site-menu__layout" data-grid="12">
            <NavigationColumn currentPath={currentPath} label="主导航" links={mainMenuLinks} primary />
            <NavigationColumn currentPath={currentPath} label="服务导航" links={serviceMenuLinks} title="服务" />
            <NavigationColumn currentPath={currentPath} label="活动与学习导航" links={activityMenuLinks} title="活动与学习" />
          </div></div>
        </details>
      </div>
    </div></div>
  </header>;
}
