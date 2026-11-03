"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";

export function TemplateTabs({ labels, children, steps = false, hint }: { labels: string[]; children: ReactNode[]; steps?: boolean; hint?: string }) {
  const id = useId();
  const [selected, setSelected] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const reveal = () => {
      const target = document.getElementById(window.location.hash.slice(1));
      if (!target || !root.current?.contains(target)) return;
      const panel = target.closest<HTMLElement>('[role="tabpanel"]');
      if (panel) { setSelected(Number(panel.id.split("-").at(-1))); requestAnimationFrame(() => target.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" })); }
    };
    const followSameHash = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || !(event.target instanceof Element)) return;
      const link = event.target.closest<HTMLAnchorElement>('a[href^="#"]');
      if (link?.hash === window.location.hash && link.target !== "_blank") reveal();
    };
    reveal();
    window.addEventListener("hashchange", reveal);
    window.addEventListener("click", followSameHash);
    return () => { window.removeEventListener("hashchange", reveal); window.removeEventListener("click", followSameHash); };
  }, []);
  return <div className="template-switcher" ref={root}><p className="template-switcher-hint">{hint ?? (steps ? "选择步骤，查看具体安排" : "点击下方主题，展开了解具体支持")}</p><div className={`coaching-tabs template-tabs${steps ? " template-tabs--steps" : ""}`} role="tablist" aria-label={steps ? "查看服务步骤" : "查看支持主题"}>{labels.map((label, index) => <button type="button" role="tab" id={`${id}-tab-${index}`} key={index} aria-controls={`${id}-panel-${index}`} aria-selected={selected === index} tabIndex={selected === index ? 0 : -1} onClick={() => setSelected(index)} onKeyDown={event => {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? 0 : event.key === "End" ? labels.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + labels.length) % labels.length;
    setSelected(next);
    document.getElementById(`${id}-tab-${next}`)?.focus();
  }}>{steps ? <span className="template-step">{String(index + 1).padStart(2, "0")}</span> : null}<span>{label.split("\n")[0]}</span><span aria-hidden="true">↗</span></button>)}</div>{children.map((child, index) => <div className="template-tab-panel" key={index} id={`${id}-panel-${index}`} role="tabpanel" aria-labelledby={`${id}-tab-${index}`} hidden={selected !== index} tabIndex={0}>{child}</div>)}</div>;
}
