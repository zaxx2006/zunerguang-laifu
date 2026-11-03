import { SiteLink } from "@/components/site/SiteLink";
import type { ReactNode } from "react";
import { ArrowDown, ArrowUpRight, BookOpen, FileText, Network } from "lucide-react";
import { HomeInvitation } from "@/components/home/HomeSections";
import { HomeHeader, HomeFooter } from "@/components/home/HomeNavigation";
import { HomeDesignSystem, HomeButton } from "@/components/home/HomePrimitives";
import { SectionBody } from "@/components/content/StructuredContent";
import { RichText } from "@/components/content/RichText";
import type { Block, SubsectionBlock } from "@/contracts/page-content";
import { getNavigationPresentation, getHomePresentation, getSitePagePresentation } from "@/lib/cms-content-client";
import { photoProps } from "@/lib/photo";
import { siteConfig } from "@/lib/site-config";
import { CoachingInteractions } from "./CoachingInteractions";
import "./coaching.css";

type Entry = { title: string; text: string };
const copyOf = (blocks: Block[]) => blocks.flatMap(block => block.kind === "copy" ? [block.text] : []).join("\n\n");
const cleanTitle = (title: string) => title.replace(/^(?:0\d|\d+[.．、])\s*/, "");
const roleImages = ["p34-academy-lawyers", "self-reflection", "p35-academy-wealth", "p36-academy-parenting"];
const roleAlts = ["一只手在桌上的蓝色文件夹里整理案例资料", "留出思考与整理的时间", "两位学习者在灰色台面上各自查看资料", "一只手在软木垫上摆放木质轨道与积木"];

function numbered(text: string, closingStartsWith?: string) {
  const closingIndex = closingStartsWith ? text.indexOf(`\n\n${closingStartsWith}`) : -1;
  const closing = closingIndex >= 0 ? text.slice(closingIndex).trim() : "";
  const parts = (closingIndex >= 0 ? text.slice(0, closingIndex) : text).split(/\n(?=(?:[（(]\d+[）)]|4\.\d+)\s*)/);
  const entries: Entry[] = [];
  const intro: string[] = [];
  for (const part of parts) {
    const match = part.trim().match(/^(?:[（(]\d+[）)]|4\.\d+)\s*([^\n]+)\n?([\s\S]*)$/);
    if (match) entries.push({ title: match[1], text: match[2].trim() });
    else if (part.trim()) intro.push(part.trim());
  }
  return { intro: intro.join("\n\n"), entries, closing };
}

function Disclosure({ title, children, id }: { title: string; children: ReactNode; id?: string }) {
  return <details className="coaching-detail academy-disclosure" id={id}>
    <summary><span>{title}</span><span className="academy-disclosure-action"><span className="academy-open-label">展开</span><span className="academy-close-label">收起</span><span className="coaching-plus" aria-hidden="true" /></span></summary>
    <div className="coaching-detail-body">{children}</div>
  </details>;
}

function AcademyTabs({ name, label, entries, render, vertical = false }: { name: string; label: string; entries: Entry[]; render: (entry: Entry, index: number) => ReactNode; vertical?: boolean }) {
  return <div className={vertical ? "course-catalogue" : "academy-tab-group"} data-tabs={name}>
    <div className={vertical ? "course-topic-tabs" : "academy-tabs"} role="tablist" aria-label={label} aria-orientation={vertical ? "vertical" : "horizontal"}>
      {entries.map((entry, index) => <button type="button" role="tab" data-tab={index} id={`${name}-tab-${index}`} aria-controls={`${name}-panel-${index}`} aria-selected={index === 0} tabIndex={index === 0 ? 0 : -1} key={index}><span>{name === "academy-journey" ? <span className="academy-step-number">{String(index + 1).padStart(2, "0")}</span> : null}{entry.title}</span><ArrowUpRight /></button>)}
    </div>
    <div className="course-topic-panels">{entries.map((entry, index) => <div role="tabpanel" id={`${name}-panel-${index}`} aria-labelledby={`${name}-tab-${index}`} hidden={index !== 0} tabIndex={0} key={index}>{render(entry, index)}</div>)}</div>
  </div>;
}

export async function AcademyPage() {
  const [navigation, content, home] = await Promise.all([
    getNavigationPresentation({ preview: false }),
    getSitePagePresentation("/academy/"),
    getHomePresentation({ preview: false }),
  ]);
  const invitation = home?.invitation;
  const sections = content.content.sections;
  const opening = sections.find(section => section.id === "Q05");
  const challenges = sections.find(section => section.id === "Q08");
  const practice = sections.find(section => section.id === "Q12");
  const support = sections.find(section => section.id === "Q14");
  const systems = support?.blocks.filter((block): block is SubsectionBlock => block.kind === "subsection") ?? [];
  const paths = numbered(copyOf(systems[0]?.blocks ?? []));
  const situations = numbered(copyOf(challenges?.blocks ?? []), "这些问题的解决");
  const tools = numbered(copyOf(systems[1]?.blocks ?? []), "所有工具");
  const network = numbered(copyOf(systems[2]?.blocks ?? []), "加入协作网络");
  const process = sections.find(section => section.id === "Q21");
  const journey = numbered(copyOf(process?.blocks ?? []));
  const institution = sections.find(section => section.id === "Q23");
  const boundaries = sections.find(section => section.id === "Q25");
  const rules = numbered(copyOf(boundaries?.blocks ?? []));
  const principles = sections.find(section => section.id === "Q27");
  const description = content.description.split(/\n\n/);
  const practiceCopy = copyOf(practice?.blocks ?? []).split(/\n\n/);
  const openingCopy = copyOf(opening?.blocks ?? []).split(/\n\n/);
  const handled = new Set(["Q05", "Q08", "Q12", "Q14", "Q21", "Q23", "Q25", "Q27"]);
  const anchor = (id: string) => id.includes("-") ? id : `${content.anchorPrefix}-${id.toLowerCase()}`;
  const jsonLd = siteConfig.siteUrl ? { "@context": "https://schema.org", "@type": "WebPage", name: content.title, description: content.description, url: `${siteConfig.siteUrl}/academy/` } : null;

  return <div className="coaching-page courses-page academy-page" id="coaching-top">
    <HomeDesignSystem><HomeHeader breadcrumbSlug={"academy"} content={navigation ?? undefined} homeHref="/" openInNewTab /></HomeDesignSystem>
    <main id="main-content" data-page="academy" data-template="academy-detail">
      <section data-grid-section="12" className="coaching-hero coaching-wrap" id={opening ? anchor(opening.id) : undefined} aria-labelledby="page-title">
        <div className="hero-copy"><h1 id="page-title">{content.title}</h1><p className="hero-statement">{(opening?.title ?? content.title).split("，").map((line, index) => <span key={index}>{index ? <br /> : null}{line}</span>)}</p><p className="hero-description">{description[0]}</p><div className="hero-actions"><HomeButton variant="primary" className="coaching-hero-button" href="#academy-paths">选择职业成长路径</HomeButton><SiteLink className="coaching-text-link" href="#academy-institutions">机构培训咨询<ArrowUpRight /></SiteLink></div><div className="academy-hero-supports">{[BookOpen, FileText, Network].map((Icon, index) => <SiteLink href={["#academy-paths", "#academy-tools", "#academy-network"][index]} key={index}><Icon aria-hidden="true" />{["专项课程", "实务工具", "协作网络"][index]}<ArrowDown aria-hidden="true" /></SiteLink>)}</div></div>
        <figure className="hero-photo"><img src={content.image.src} alt={content.image.alt} width={content.image.width} height={content.image.height} fetchPriority="high" {...photoProps(content.image.src, "(max-width: 720px) 90vw, 45vw")} /></figure>
      </section>
      <nav className="coaching-rail" aria-label="本页内容"><div className="coaching-wrap">{[["academy-paths", "职业成长路径"], ["academy-tools", "实务工具"], ["academy-network", "跨专业协作"], ["academy-learning", "学习流程"], ["academy-institutions", "机构服务"]].map(([id, label]) => <SiteLink href={`#${id}`} data-section-link={id} key={id}>{label}</SiteLink>)}<SiteLink className="rail-booking" href="/book-consultation/#booking-channel" target="_blank" rel="noopener noreferrer">咨询学院<ArrowUpRight /></SiteLink></div></nav>

      <section data-grid-section="12" className="coaching-section coaching-fit" id="academy-paths"><div className="coaching-wrap">
        <div className="coaching-heading"><div><h2>从你的职业出发，<br />找到适合的成长路径</h2><p className="academy-instruction">点击下方职业，切换课程内容与学习重点。</p></div><p>{paths.intro}</p></div>
        <div id={systems[0]?.id} className="coaching-anchor" />
        <AcademyTabs name="academy-profession" label="选择职业成长路径" entries={paths.entries} vertical render={(entry, index) => <div className="academy-profession-panel" id={`academy-profession-${index}`}>
          <figure className="academy-role-photo" data-wide={index !== 1 || undefined}><img src={`/images/editorial/${roleImages[index % roleImages.length]}.webp`} alt={roleAlts[index % roleAlts.length]} width={1280} height={854} loading="lazy" decoding="async" {...photoProps(`/images/editorial/${roleImages[index % roleImages.length]}.webp`, "(max-width: 720px) 90vw, 52vw")} /></figure>
          <h3>{entry.title}</h3><RichText text={entry.text} presentation="editorial" />
          {situations.entries[index] ? <Disclosure title={`${situations.entries[index].title}常见实务挑战`}><RichText text={situations.entries[index].text} /></Disclosure> : null}
          <SiteLink className="coaching-text-link" href="/book-consultation/#booking-channel" target="_blank" rel="noopener noreferrer">咨询这一成长路径<ArrowUpRight /></SiteLink>
        </div>} />
        {challenges ? <Disclosure title={cleanTitle(challenges.title)} id={anchor(challenges.id)}><RichText text={situations.intro} /><RichText text={situations.closing} /><SectionBody blocks={challenges.blocks.filter(block => block.kind !== "copy")} columns={1} /></Disclosure> : null}
        {support ? <Disclosure title={cleanTitle(support.title)} id={anchor(support.id)}><div className="academy-support-index">{systems.map((system, index) => <SiteLink href={[`#${systems[0]?.id}`, "#academy-tools", "#academy-network"][index]} key={system.id}>{cleanTitle(system.title)}<ArrowUpRight /></SiteLink>)}</div><SectionBody blocks={support.blocks.filter(block => block.kind !== "subsection")} columns={1} /></Disclosure> : null}
      </div></section>

      <section data-grid-section="12" className="coaching-section" id={practice ? anchor(practice.id) : undefined}><div className="coaching-wrap academy-practice-layout">
        <figure><img src="/images/editorial/p37-academy-tools.webp" alt="蓝色织物上的练习册、纸张与铅笔" width={1280} height={854} loading="lazy" decoding="async" {...photoProps("/images/editorial/p37-academy-tools.webp", "(max-width: 720px) 90vw, 36vw")} /></figure>
        <div><h2>{practice ? cleanTitle(practice.title) : "让专业方法真正落地"}</h2>{practiceCopy[0] ? <RichText text={practiceCopy[0]} presentation="editorial" /> : null}<Disclosure title="查看典型应用场景与实践说明"><RichText text={practiceCopy.slice(1).join("\n\n")} /><SectionBody blocks={practice?.blocks.filter(block => block.kind !== "copy") ?? []} columns={1} /></Disclosure><Disclosure title="了解学院的专业协作理念"><RichText text={openingCopy.join("\n\n")} /><RichText text={description.slice(1).join("\n\n")} /><SectionBody blocks={opening?.blocks.filter(block => block.kind !== "copy") ?? []} columns={1} /><SectionBody blocks={content.content.intro} columns={1} /></Disclosure></div>
      </div></section>

      <section data-grid-section="12" className="coaching-section academy-tools-section" id="academy-tools"><div className="coaching-wrap">
        <div className="coaching-heading"><h2>{systems[1] ? cleanTitle(systems[1].title) : "标准化实务工具支持"}</h2><p>{tools.intro}<br />点击类别，浏览配套工具。</p></div><div id={systems[1]?.id} className="coaching-anchor" />
        <AcademyTabs name="academy-toolkit" label="选择实务工具类别" entries={tools.entries} render={entry => <div className="academy-tool-layout"><div className="academy-document"><div className="academy-document-header"><FileText aria-hidden="true" /><span>工具目录 · 非可下载文件</span></div><h3>{entry.title}</h3><ol>{entry.text.split(/\n/).filter(Boolean).map((line, index) => <li key={index}><span>{String(index + 1).padStart(2, "0")}</span><span>{line}</span><FileText aria-hidden="true" /></li>)}</ol><p>具体工具随课程及授权方案提供。</p></div><div className="academy-tool-note"><h3>把专业方法，<br />带进日常工作</h3><RichText text={tools.closing} /><SiteLink className="coaching-text-link" href="/book-consultation/#booking-channel" target="_blank" rel="noopener noreferrer">咨询工具配套与授权<ArrowUpRight /></SiteLink></div></div>} />
        <SectionBody blocks={systems[1]?.blocks.filter(block => block.kind !== "copy") ?? []} columns={1} />
      </div></section>

      <section data-grid-section="12" className="coaching-section" id="academy-network"><div className="coaching-wrap academy-network-layout"><div><h2>{systems[2] ? cleanTitle(systems[2].title) : "跨专业协作网络"}</h2><RichText text={network.intro} /><figure className="academy-network-photo"><img src="/images/editorial/p38-academy-network.webp" alt="不同专业的学习者在工作空间分组交流" width={1280} height={854} loading="lazy" decoding="async" {...photoProps("/images/editorial/p38-academy-network.webp", "(max-width: 720px) 90vw, 36vw")} /></figure></div><div id={systems[2]?.id}><p className="academy-instruction">展开查看协作方式</p>{network.entries.map((entry, index) => <Disclosure title={entry.title} key={index}><RichText text={entry.text} /></Disclosure>)}<p className="academy-network-boundary">{network.closing}</p><SiteLink className="coaching-text-link" href="/book-consultation/#booking-channel" target="_blank" rel="noopener noreferrer">咨询协作网络申请<ArrowUpRight /></SiteLink><SectionBody blocks={systems[2]?.blocks.filter(block => block.kind !== "copy") ?? []} columns={1} /></div></div></section>

      <section data-grid-section="12" className="coaching-section coaching-fit" id="academy-learning"><div className="coaching-wrap"><div className="coaching-heading"><h2>{process ? cleanTitle(process.title) : "学习与成长流程"}</h2><p>点击步骤，查看从需求诊断到持续学习的具体安排。</p></div><div id={process ? anchor(process.id) : undefined} className="coaching-anchor" /><RichText text={journey.intro} /><AcademyTabs name="academy-journey" label="查看学习步骤" entries={journey.entries} render={(entry, index) => <div className="academy-journey-panel"><span className="academy-journey-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><div><h3>{entry.title}</h3><RichText text={entry.text} /><SiteLink className="coaching-text-link" href="/book-consultation/#booking-channel" target="_blank" rel="noopener noreferrer">咨询学习安排<ArrowUpRight /></SiteLink></div></div>} /><SectionBody blocks={process?.blocks.filter(block => block.kind !== "copy") ?? []} columns={1} /></div></section>

      <section data-grid-section="12" className="coaching-section" id="academy-institutions"><div className="coaching-wrap academy-institution-layout"><div id={institution ? anchor(institution.id) : undefined}><h2>{institution ? cleanTitle(institution.title) : "机构服务"}</h2><SectionBody blocks={institution?.blocks ?? []} columns={1} /><HomeButton variant="primary" className="coaching-hero-button" href="/book-consultation/#booking-channel" target="_blank" rel="noopener noreferrer">咨询机构培训</HomeButton></div><figure><img src="/images/editorial/p39-academy-institution.webp" alt="自然光下摆放桌椅与白板的小型教室" width={1280} height={854} loading="lazy" decoding="async" {...photoProps("/images/editorial/p39-academy-institution.webp", "(max-width: 720px) 90vw, 40vw")} /></figure></div></section>

      <section data-grid-section="12" className="coaching-section academy-boundaries" id={boundaries ? anchor(boundaries.id) : undefined}><div className="coaching-wrap academy-boundary-layout"><div id={principles ? anchor(principles.id) : undefined}><h2>{principles?.title ?? "我们坚持的原则"}</h2><SectionBody blocks={principles?.blocks ?? []} columns={1} /></div><div><h3>{boundaries ? cleanTitle(boundaries.title) : "服务边界与重要说明"}</h3><RichText text={rules.intro} />{rules.entries.map((entry, index) => <Disclosure title={entry.title} key={index}><RichText text={entry.text} /></Disclosure>)}<SectionBody blocks={boundaries?.blocks.filter(block => block.kind !== "copy") ?? []} columns={1} /></div></div></section>
      {sections.filter(section => !handled.has(section.id)).map(section => <section data-grid-section="12" className="coaching-section" id={anchor(section.id)} key={section.id}><div className="coaching-wrap"><h2>{section.title}</h2><SectionBody blocks={section.blocks} columns={1} /></div></section>)}
      {content.content.cta ? <section data-grid-section="12" className="coaching-section academy-next"><div className="coaching-wrap"><h2>{content.content.cta.title}</h2><RichText text={content.content.cta.body} /><div className="academy-next-actions">{content.content.cta.actions.map((action, index) => <HomeButton variant={index === 0 ? "primary" : "text"} className={index === 0 ? "coaching-hero-button" : "coaching-text-link"} href={action.href} key={index} target="_blank" rel="noopener noreferrer">{action.label}{index ? <ArrowUpRight /> : null}</HomeButton>)}</div></div></section> : null}
      <HomeDesignSystem><HomeInvitation content={invitation} openInNewTab /></HomeDesignSystem>
    </main>
    <HomeDesignSystem><HomeFooter content={navigation ?? undefined} openInNewTab /></HomeDesignSystem><CoachingInteractions />
    {jsonLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} /> : null}
  </div>;
}
