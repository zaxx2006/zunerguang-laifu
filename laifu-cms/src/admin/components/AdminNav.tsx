"use client";

import { BriefcaseBusiness, ChevronRight, FileText, Folder, History, House, Image, LayoutDashboard, ListTodo, LogOut, PanelTop, Send, UserRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useConfig, useNav, useWindowInfo } from "@payloadcms/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { formatAdminURL } from "payload/shared";
import type { CollectionSlug, VisibleEntities } from "payload";
import type { ReactElement } from "react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type NavItem = { href: string; icon: LucideIcon; label: string; slug?: CollectionSlug };
type NavSection = { items: NavItem[]; label: string };

const sections: NavSection[] = [
  { label: "内容概览", items: [
    { href: "/admin", icon: LayoutDashboard, label: "内容工作台" }
  ] },
  { label: "官网内容", items: [
    { href: "/admin/collections/home-presentations", icon: House, label: "首页呈现", slug: "home-presentations" },
    { href: "/admin/collections/service-presentations", icon: BriefcaseBusiness, label: "服务页面", slug: "service-presentations" },
    { href: "/admin/collections/site-pages", icon: FileText, label: "官网页面", slug: "site-pages" },
    { href: "/admin/collections/consultation-requests", icon: ListTodo, label: "预约申请", slug: "consultation-requests" },
    { href: "/admin/collections/navigation", icon: PanelTop, label: "导航配置", slug: "navigation" },
    { href: "/admin/collections/media", icon: Image, label: "媒体资源", slug: "media" },
    { href: "/admin/browse-by-folder", icon: Folder, label: "文件夹浏览" }
  ] },
  { label: "用户与权限", items: [
    { href: "/admin/collections/users", icon: UserRound, label: "用户管理", slug: "users" }
  ] },
  { label: "CMS 系统管理", items: [
    { href: "/admin/collections/publish-events", icon: Send, label: "发布事件", slug: "publish-events" },
    { href: "/admin/collections/audit-logs", icon: History, label: "审计记录", slug: "audit-logs" },
    { href: "/admin/collections/payload-jobs", icon: ListTodo, label: "后台任务", slug: "payload-jobs" }
  ] }
];

export function AdminNav({ visibleEntities }: { visibleEntities: VisibleEntities }): ReactElement {
  const pathname = usePathname();
  const { config } = useConfig();
  const { hydrated, navOpen, navRef, shouldAnimate } = useNav();
  const { breakpoints: { m: isMobileNav } } = useWindowInfo();
  const logoutHref = formatAdminURL({ adminRoute: config.routes.admin, path: config.admin.routes.logout });
  return <aside className={cn("nav", { "nav--nav-open": navOpen, "nav--nav-animate": shouldAnimate, "nav--nav-hydrated": hydrated })} inert={!navOpen && isMobileNav !== false}><div className="nav__scroll" ref={navRef}>
    <nav className="nav__wrap acevec-nav" aria-label="后台主导航"><Link aria-label="AceVec 内容工作台" className="acevec-nav__brand" href="/admin" title="内容工作台"><span className="acevec-nav__brand-mark" aria-hidden="true"><img className="acevec-nav__brand-mark--light" src="/brand/mark-ink.svg" alt="" height="36" width="36" /><img className="acevec-nav__brand-mark--dark" src="/brand/mark-paper.svg" alt="" height="36" width="36" /></span><span className="acevec-nav__brand-copy"><strong>AceVec</strong><small>内容管理平台</small></span></Link>
      <Separator className="acevec-nav__top-separator" />
      <div className="acevec-nav__scroll-area"><div className="acevec-nav__groups">
        {sections.map((section, sectionIndex) => {
          const items = section.items.filter(item => !item.slug || visibleEntities.collections.includes(item.slug));
          if (items.length === 0) return null;
          const sectionLabelId = `acevec-nav-section-${sectionIndex}`;
          return <section className="acevec-nav__section" key={section.label} aria-labelledby={sectionLabelId}>
            <h2 className="acevec-nav__section-label" id={sectionLabelId}>{section.label}</h2>
            <div className="acevec-nav__section-items">{items.map(item => {
              const active = item.href === "/admin" ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return <Link key={item.href} aria-label={item.label} className={cn("nav__link acevec-nav__link", active && "acevec-nav__link--active")} href={item.href} title={item.label} aria-current={active ? "page" : undefined}><span className="acevec-nav__icon" aria-hidden="true"><item.icon /></span><span className="nav__link-label">{item.label}</span>{active ? <ChevronRight className="acevec-nav__state" aria-hidden="true" /> : null}</Link>;
            })}</div>
          </section>;
        })}
      </div></div>
      <Separator className="acevec-nav__bottom-separator" />
      <div className="nav__controls acevec-nav__controls"><Link aria-label="登出 / Log out" className="nav__link acevec-nav__link acevec-nav__logout" href={logoutHref} prefetch={false} title="登出 / Log out"><span className="acevec-nav__icon" aria-hidden="true"><LogOut className="acevec-nav__logout-icon" /></span><span className="nav__link-label">登出 / Log out</span></Link></div>
    </nav>
  </div></aside>;
}
