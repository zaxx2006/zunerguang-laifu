"use client";

import { useEffect } from "react";

export function CoachingInteractions() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".coaching-page");
    if (!root) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animatePanel = (panel: HTMLElement) => {
      panel.getAnimations().forEach(animation => animation.cancel());
      if (!motion.matches) panel.animate([{ opacity: 0.35, transform: "translateY(8px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 280, easing: "cubic-bezier(0.16, 1, 0.3, 1)" });
    };
    const selectTab = (group: HTMLElement, selected: string, focus = false) => {
      const tabs = [...group.querySelectorAll<HTMLButtonElement>('[role="tab"]')].filter(button => button.closest("[data-tabs]") === group);
      const tab = tabs.find(button => button.dataset.tab === selected);
      if (!tab) return;
      tabs.forEach(button => {
        const active = button === tab;
        button.setAttribute("aria-selected", String(active));
        button.tabIndex = active ? 0 : -1;
      });
      group.querySelectorAll<HTMLElement>('[role="tabpanel"]').forEach(panel => {
        if (panel.closest("[data-tabs]") !== group) return;
        const active = panel.id === tab.getAttribute("aria-controls");
        panel.hidden = !active;
        if (active) animatePanel(panel);
      });
      if (group.dataset.tabs === "process") group.style.setProperty("--step-progress", String(Number(selected) / 2));
      if (focus) tab.focus({ preventScroll: true });
    };
    const revealHash = () => {
      const id = window.location.hash.slice(1);
      const target = document.getElementById(id);
      if (!target || !root.contains(target)) return;
      const group = target.closest<HTMLElement>("[data-tabs]");
      const panel = target.closest<HTMLElement>('[role="tabpanel"]');
      if (group && panel) selectTab(group, panel.id.split("-").at(-1) ?? "0");
      const detail = target.closest("details");
      if (detail) detail.open = true;
      if (panel && target.closest(".template-switcher")) return;
      requestAnimationFrame(() => target.scrollIntoView({ behavior: motion.matches ? "instant" : "smooth", block: "start" }));
    };
    const click = (event: Event) => {
      if (!(event.target instanceof Element)) return;
      const tab = event.target.closest<HTMLButtonElement>('[role="tab"]');
      const group = tab?.closest<HTMLElement>("[data-tabs]");
      if (tab && group && tab.getAttribute("aria-selected") !== "true") selectTab(group, tab.dataset.tab ?? "0");
      const supportLink = event.target.closest<HTMLElement>("[data-support-target]");
      const support = root.querySelector<HTMLElement>('[data-tabs="support"]');
      if (supportLink && support) selectTab(support, supportLink.dataset.supportTarget ?? "0");
      const hashLink = event.target.closest<HTMLAnchorElement>('a[href^="#"]');
      if (hashLink?.hash === window.location.hash) revealHash();
    };
    const keydown = (event: KeyboardEvent) => {
      if (!(event.target instanceof Element)) return;
      const tab = event.target.closest<HTMLButtonElement>('[role="tab"]');
      const group = tab?.closest<HTMLElement>("[data-tabs]");
      const vertical = tab?.closest('[role="tablist"]')?.getAttribute("aria-orientation") === "vertical";
      const keys = vertical ? ["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft", "Home", "End"] : ["ArrowRight", "ArrowLeft", "Home", "End"];
      if (!tab || !group || !keys.includes(event.key)) return;
      event.preventDefault();
      const tabs = [...group.querySelectorAll<HTMLButtonElement>('[role="tab"]')].filter(button => button.closest("[data-tabs]") === group);
      const index = tabs.indexOf(tab);
      const next = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : (index + (["ArrowRight", "ArrowDown"].includes(event.key) ? 1 : -1) + tabs.length) % tabs.length;
      selectTab(group, tabs[next].dataset.tab ?? "0", true);
    };
    const toggle = (event: Event) => {
      if (!(event.target instanceof HTMLDetailsElement) || !event.target.open) return;
      const body = event.target.querySelector<HTMLElement>(".coaching-detail-body, .comparison-scroll");
      if (body) animatePanel(body);
    };
    const links = [...root.querySelectorAll<HTMLAnchorElement>("[data-section-link]")];
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (!visible) return;
      links.forEach(link => {
        if (link.dataset.sectionLink === visible.target.id) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    }, { rootMargin: "-10% 0px -55% 0px" });
    links.forEach(link => {
      const target = root.querySelector<HTMLElement>(`#${link.dataset.sectionLink}`);
      if (target) observer.observe(target);
    });
    root.addEventListener("click", click);
    root.addEventListener("keydown", keydown);
    root.addEventListener("toggle", toggle, true);
    window.addEventListener("hashchange", revealHash);
    revealHash();
    return () => {
      root.removeEventListener("click", click);
      root.removeEventListener("keydown", keydown);
      root.removeEventListener("toggle", toggle, true);
      window.removeEventListener("hashchange", revealHash);
      observer.disconnect();
      root.getAnimations({ subtree: true }).forEach(animation => animation.cancel());
    };
  }, []);
  return null;
}
