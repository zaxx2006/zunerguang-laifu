"use client";

import { Fragment, useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { photoProps } from "@/lib/photo";
import { SiteLink } from "@/components/site/SiteLink";
import "./home-services-carousel.css";

type Service = {
  href: string;
  title: string;
  description: string;
  image: { src: string; alt: string; width: number; height: number };
};

export function HomeServicesCarousel({ services, headingLines, captionLeft, captionRight }: {
  services: Service[]; headingLines: readonly string[]; captionLeft: string; captionRight: string;
}) {
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const lines = useRef<SVGSVGElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const layout = useCallback(() => {
    const element = viewport.current;
    const content = track.current;
    const svg = lines.current;
    if (!element || !content || !svg) return;
    const cards = [...content.querySelectorAll<HTMLElement>(".home-services__card")];
    if (!cards.length) return;
    const height = parseFloat(getComputedStyle(content).paddingTop);
    const center = element.clientWidth / 2 + element.scrollLeft;
    const junction = parseFloat(getComputedStyle(content).getPropertyValue("--services-junction-y"));
    const width = cards.at(-1)!.offsetLeft + cards.at(-1)!.offsetWidth;
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.setAttribute("width", String(width));
    svg.querySelector(".home-services__trunk")!.setAttribute("d", `M${center} 0 L${center} ${junction}`);
    svg.querySelectorAll(".home-services__branch").forEach((path, index) => {
      const end = cards[index].offsetLeft + cards[index].offsetWidth / 2;
      path.setAttribute("d", `M${center} ${junction} C${center} ${height * .6875} ${end} ${height * .625} ${end} ${height}`);
    });
    element.parentElement!.style.setProperty("--services-card-width", `${cards[0].offsetWidth}px`);
    const start = element.scrollLeft <= 2;
    const end = element.scrollLeft >= element.scrollWidth - element.clientWidth - 2;
    setEdges(previous => previous.start === start && previous.end === end ? previous : { start, end });
  }, []);
  useEffect(() => {
    const cards = track.current?.querySelectorAll<HTMLElement>(".home-services__card");
    if (cards && cards.length > 1) viewport.current?.scrollTo({ left: cards[1].offsetLeft, behavior: "instant" });
    const observer = new ResizeObserver(layout);
    if (viewport.current) observer.observe(viewport.current);
    layout();
    return () => observer.disconnect();
  }, [layout]);
  const move = (direction: number, edge?: "start" | "end") => {
    const element = viewport.current;
    const cards = track.current?.querySelectorAll<HTMLElement>(".home-services__card");
    if (!element || !cards?.length) return;
    const step = cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : cards[0].offsetWidth;
    const left = edge === "start" ? 0 : edge === "end" ? element.scrollWidth - element.clientWidth : element.scrollLeft + direction * step;
    element.scrollTo({ left, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };
  const keydown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    move(event.key === "ArrowRight" ? 1 : -1, event.key === "Home" ? "start" : event.key === "End" ? "end" : undefined);
  };
  return <section className="home-services" data-home-section="services" id="services" aria-labelledby="home-services-title">
    <div className="home-services__inner">
      <h2 className="home-services__heading" id="home-services-title">{headingLines.map((line, index) => <Fragment key={line}>{index ? <br /> : null}{line}</Fragment>)}</h2>
      <div className="home-services__stage">
        <button type="button" className="home-services__arrow home-services__arrow--previous" aria-label="上一项服务" aria-controls="home-services-slides" disabled={edges.start} onClick={() => move(-1)}><ArrowLeft aria-hidden="true" /></button>
        <div className="home-services__viewport" id="home-services-slides" ref={viewport} tabIndex={0} role="group" aria-label="七项服务，可左右滑动或使用方向键浏览" onKeyDown={keydown} onScroll={layout}>
          <div className="home-services__track" ref={track}>
            <svg className="home-services__lines" ref={lines} aria-hidden="true"><path className="home-services__trunk" />{services.map(service => <path className="home-services__branch" key={service.href} />)}</svg>
            {services.map(service => <SiteLink className="home-services__card" href={service.href} key={service.href}>
              <div className="home-services__image"><img src={service.image.src} alt={service.image.alt} width={service.image.width} height={service.image.height} loading="lazy" decoding="async" draggable={false} {...photoProps(service.image.src, "(max-width: 560px) 70vw, (max-width: 900px) 36vw, 16vw")} /></div>
              <h3>{service.title}</h3><p><span>{service.description}</span></p>
              <span className="home-services__action">了解这项服务<ArrowUpRight aria-hidden="true" /></span>
            </SiteLink>)}
          </div>
        </div>
        <button type="button" className="home-services__arrow home-services__arrow--next" aria-label="下一项服务" aria-controls="home-services-slides" disabled={edges.end} onClick={() => move(1)}><ArrowRight aria-hidden="true" /></button>
      </div>
      <div className="home-services__caption"><span>{captionLeft}</span><span>{captionRight}</span></div>
    </div>
  </section>;
}
