"use client";

import { useEffect, useState } from "react";
import type { NavigationPreviewDocument } from "../types";
import { PreviewBrand } from "./PreviewBrand";

export function NavigationPreview({ document }: { document: NavigationPreviewDocument }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const groups = document.groups || [];
  const activeGroup = groups[activeIndex] || groups[0];
  useEffect(() => { if (activeIndex >= groups.length) setActiveIndex(0); }, [activeIndex, groups.length]);
  return (
    <main className="navigation-preview">
      <div className="navigation-preview__announcement"><strong>{document.announcement?.label || "顶部公告"}</strong><span>{document.announcement?.actionLabel || "查看详情"} ↗</span></div>
      <header className="navigation-preview__header">
        <PreviewBrand />
        <nav>
          {groups.map((group, index) => <button className={index === activeIndex ? "is-active" : ""} key={group.id || index} onClick={() => setActiveIndex(index)}>{group.label || `菜单 ${index + 1}`}⌄</button>)}
          {document.topLinks?.map((link, index) => <span key={`${link.href}-${index}`}>{link.label}</span>)}
        </nav>
        <div><span>{document.secondaryAction?.label}</span><b>{document.primaryAction?.label || "主行动"}</b></div>
      </header>
      <section className="navigation-preview__menu">
        <div className="navigation-preview__columns">
          {activeGroup?.columns?.map((column, index) => <section key={column.id || index}><p>{column.title || "栏目"}</p>{column.links?.map((link, linkIndex) => <a key={link.id || linkIndex}><span><strong>{link.label || "链接"}</strong><small>{link.note}</small></span><i>↗</i></a>)}</section>)}
        </div>
        <aside><small>{activeGroup?.callout?.eyebrow || "FEATURED"}</small><strong>{activeGroup?.callout?.title || "在左侧编辑导航，右侧会实时同步。"}</strong><span>{activeGroup?.callout?.action || "查看入口"} ↗</span></aside>
      </section>
      <section className="navigation-preview__canvas">
        <p>LIVE NAVIGATION PREVIEW</p>
        <h1>点击上方菜单，<br /><em>检查信息层级与入口。</em></h1>
        <div><span>ANNOUNCEMENT</span><span>MEGA MENU</span><span>CALL TO ACTION</span></div>
      </section>
      <footer className="navigation-preview__footer"><section><small>{document.footer?.brandLabel || "AceVec"}</small><h2>{document.footer?.leadTitle || "Footer brand statement"}</h2></section><nav>{document.footer?.columns?.map((column, index) => <div key={column.id || index}><strong>{column.title}</strong>{column.links?.map((link, linkIndex) => <span key={`${link.href}-${linkIndex}`}>{link.label}</span>)}</div>)}</nav><p>{document.footer?.tagline}</p></footer>
    </main>
  );
}
