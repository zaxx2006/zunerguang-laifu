import type { ReactNode } from "react";
import { ArrowUpRight, House, School, ShieldCheck, UsersRound } from "lucide-react";
import { SectionBody } from "@/components/content/StructuredContent";
import { RichText } from "@/components/content/RichText";
import { SiteLink } from "@/components/site/SiteLink";
import type { Block, Section } from "@/contracts/page-content";
import { photoProps } from "@/lib/photo";
import { TemplateTabs } from "./TemplateTabs";

export const coParentingSectionIds = new Set(["Q57", "Q59", "Q63", "Q67", "Q69", "Q71", "Q73", "Q75"]);

function paragraphs(blocks: Block[]) {
  return blocks.flatMap(block => block.kind === "copy" ? block.text.split(/\n{2,}/).filter(part => part.trim()) : []);
}

function entry(text: string) {
  const [title, ...body] = text.split("\n");
  return { title: title.replace(/^(?:\d+[｜]|[（(]\d+[）)]|第[一二三四五六七八九十]+步[｜])\s*/, ""), body: body.join("\n") };
}

function Reading({ text }: { text: string }) {
  return <RichText text={text} presentation="editorial" />;
}

function Disclosure({ title, children, id }: { title: string; children: ReactNode; id?: string }) {
  return <details className="coaching-detail parenting-disclosure" id={id}><summary><span>{title}</span><span className="parenting-disclosure-action"><span className="parenting-open-label">展开</span><span className="parenting-close-label">收起</span><span className="coaching-plus" aria-hidden="true" /></span></summary><div className="coaching-detail-body">{children}</div></details>;
}

function Photo({ src, alt }: { src: string; alt: string }) {
  return <figure className="parenting-photo"><img src={src} alt={alt} width={1280} height={854} loading="lazy" decoding="async" {...photoProps(src, "(max-width: 720px) 90vw, 32vw")} /></figure>;
}

export function CoParentingSection({ section, anchorPrefix }: { section: Section; anchorPrefix: string }) {
  const parts = paragraphs(section.blocks);
  const extra = <SectionBody blocks={section.blocks.filter(block => block.kind !== "copy")} columns={1} />;
  let body: ReactNode;
  switch (section.id) {
    case "Q57": {
      const tools = parts.slice(1).map(entry);
      body = <><p className="parenting-section-lead">{parts[0]}</p><div className="parenting-tool-library"><TemplateTabs labels={tools.map(tool => tool.title)} hint="点击工具名称，查看用途与覆盖内容">{tools.map(tool => <div className="parenting-tool-preview" key={tool.title}><h3>{tool.title}</h3><Reading text={tool.body} /></div>)}</TemplateTabs></div><div className="parenting-resource-link">{extra}</div></>;
      break;
    }
    case "Q59": {
      const observations = parts.map(entry);
      const related = section.blocks.filter(block => block.kind === "subsection");
      body = <><div className="parenting-observation-grid"><Photo src="/images/editorial/p18-parenting-routine.webp" alt="孩子坐在玄关穿鞋，照料者在旁等候" /><div className="parenting-observations"><TemplateTabs labels={observations.map(item => item.title)} hint="切换查看孩子的表现与父母可做的事">{observations.map(item => <div key={item.title}><h3>{item.title}</h3><Reading text={item.body} /></div>)}</TemplateTabs></div></div><div className="parenting-related">{related.map((block, index) => <Disclosure title={block.title} id={block.id} key={block.id ?? index}><SectionBody blocks={block.blocks} columns={2} /></Disclosure>)}<SectionBody blocks={section.blocks.filter(block => block.kind !== "copy" && block.kind !== "subsection")} columns={1} /></div></>;
      break;
    }
    case "Q63": {
      const steps = parts.slice(1).map(entry);
      const sift = section.blocks.find(block => block.kind === "subsection");
      const siftParts = sift ? paragraphs(sift.blocks) : [];
      const letters = siftParts.slice(0, 4).map(entry);
      body = <div className="parenting-communication-grid"><div className="parenting-listening"><h3>{parts[0]}</h3><TemplateTabs labels={steps.map(step => step.title)} steps hint="点击步骤，练习听清、说清与引领方向">{steps.map(step => <div key={step.title}><h4>{step.title}</h4><Reading text={step.body} /></div>)}</TemplateTabs><Photo src="/images/editorial/p19-parenting-handover.webp" alt="父母在庭院交接孩子的布袋，孩子站在一旁" /></div>{sift ? <div className="parenting-sift" id={sift.id}><h3>{sift.title}</h3><TemplateTabs labels={letters.map(letter => `${letter.title.split("｜")[0]} · ${letter.title.split("｜").at(-1)}`)} hint="点击 S / I / F / T，逐项检查回复">{letters.map(letter => <div key={letter.title}><h4>{letter.title}</h4><Reading text={letter.body} /></div>)}</TemplateTabs>{siftParts.length > 4 ? <div className="parenting-sift-summary">{siftParts.slice(4).map((part, index) => <Reading text={part} key={index} />)}</div> : null}<SectionBody blocks={sift.blocks.filter(block => block.kind !== "copy")} columns={1} /></div> : null}<SectionBody blocks={section.blocks.filter(block => block.kind !== "copy" && block !== sift)} columns={1} /></div>;
      break;
    }
    case "Q67": {
      const roles = parts.slice(1).map(entry);
      const icons = [House, School, UsersRound];
      body = <><p className="parenting-section-lead">{parts[0]}</p><div className="parenting-family-roles">{roles.map((role, index) => { const Icon = icons[index % icons.length]; return <article key={role.title}><Icon aria-hidden="true" /><h3>{role.title}</h3><Reading text={role.body} /></article>; })}</div>{extra}</>;
      break;
    }
    case "Q69": {
      const situations = parts[0] ? entry(parts[0]) : null;
      body = <><div className="parenting-family-needs">{situations ? <div className="parenting-households"><h3>{situations.title}</h3><Reading text={situations.body} /></div> : null}<aside className="parenting-special-needs">{parts.slice(1).map((part, index) => { const item = entry(part); return <div key={index}><h3>{item.title}</h3><Reading text={item.body} /></div>; })}</aside></div>{extra}</>;
      break;
    }
    case "Q71": {
      const topics = parts.slice(1, -1).map(entry);
      body = <><Reading text={parts[0] ?? ""} /><div className="parenting-safety-grid">{topics.map(topic => <div key={topic.title}><h3>{topic.title}</h3><Reading text={topic.body} /></div>)}</div>{parts.length > 1 ? <aside className="parenting-safety-note"><ShieldCheck aria-hidden="true" /><Reading text={parts.at(-1) ?? ""} /></aside> : null}{extra}</>;
      break;
    }
    case "Q73": {
      const courses = parts.slice(1).map(entry);
      body = <div className="parenting-learning-grid"><div><Photo src="/images/editorial/p20-parenting-together.webp" alt="父亲与孩子坐在地毯上一起搭建木质轨道" /><p className="parenting-section-lead">{parts[0]}</p>{extra}</div><div className="parenting-course-list">{courses.map(course => <Disclosure title={course.title} key={course.title}><Reading text={course.body} /></Disclosure>)}</div></div>;
      break;
    }
    case "Q75": {
      const boundaries = parts.slice(0, 2).map(entry);
      body = <><div className="parenting-boundary-grid">{boundaries.map(boundary => <article key={boundary.title}><h3>{boundary.title}</h3><Reading text={boundary.body} /></article>)}</div>{parts.length > 2 ? <Disclosure title={parts[2]}>{parts.slice(3).map((part, index) => <Reading text={part} key={index} />)}</Disclosure> : null}{extra}</>;
      break;
    }
    default:
      body = <SectionBody blocks={section.blocks} columns={2} />;
  }
  return <section data-grid-section="12" className={`coaching-section parenting-section parenting-${section.id.toLowerCase()}`} id={section.id.includes("-") ? section.id : `${anchorPrefix}-${section.id.toLowerCase()}`}><div className="coaching-wrap"><div className="coaching-heading"><h2>{section.title}</h2>{section.subtitle ? <p>{section.subtitle}</p> : null}</div><div className="parenting-reading">{body}</div>{section.id === "Q63" ? <SiteLink className="coaching-text-link parenting-consult-link" href="/book-consultation/#booking-channel">咨询亲职沟通支持<ArrowUpRight aria-hidden="true" /></SiteLink> : null}</div></section>;
}
