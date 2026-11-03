import { SiteLink } from "@/components/site/SiteLink";
import structuredPages from "@/content/structured-pages.json";
import { CardGrid, CTAFrame, SectionFrame, Steps } from "@/components/content/ContentPrimitives";
import { ContentBlock, ActionButtons, splitNumberedTitle } from "@/components/content/ContentBlock";
import { RichText } from "@/components/content/RichText";
import { EditorialSpread } from "@/components/content/EditorialSpread";
import { ResourceCategories } from "@/components/content/ResourceCategories";
import { Testimonials } from "@/components/content/Testimonials";
import { mediaComposition } from "@/lib/editorial-composition";
import { gridItemParts, groupStageEntries } from "@/lib/content-layout";
import { getPageSectionPlan, resolveSectionMedia, sectionLayoutForRole } from "@/lib/section-design";
import type { Block, PageContent, Section } from "@/components/content/content-types";
import type { PageKey, SectionColumns, SectionRole, SectionUnitDesign } from "@/lib/section-design";

export { RichText } from "@/components/content/RichText";
const resourceCategoryIds = ["Q06", "Q14", "Q16", "Q18", "Q20", "Q22"];
const pageMapTitle = (title: string) => splitNumberedTitle(title, true)?.[1] ?? title;

function PageMapLinks({ pageKey, sections, sourceById }: { pageKey: PageKey; sections: SectionUnitDesign[]; sourceById: Map<string, Section> }) {
  return <ol>{sections.map((design, index) => { const first = sourceById.get(design.sourceIds[0])!; return <li key={design.id}><SiteLink href={`#${pageKey}-${design.id.toLowerCase()}`}><span className="page-map-item__number">{String(index + 1).padStart(2, "0")}</span><span className="page-map-item__label">{pageMapTitle(design.title ?? first.title)}</span></SiteLink></li>; })}</ol>;
}

export function SectionBody({ blocks, columns, role }: { blocks: Block[]; columns: SectionColumns; role?: SectionRole }) {
  const groups: Block[][] = [];
  for (const block of blocks) {
    const previous = groups.at(-1);
    const entryKind = (entry: Block) => entry.kind === "disclosure" || entry.kind === "subsection" && entry.collapsible ? "disclosure" : entry.kind === "subsection" ? "subsection" : undefined;
    if (block.kind === "copy" && previous?.every((entry) => entry.kind === "copy")) previous.push(block);
    else if (entryKind(block) && previous?.every((entry) => entryKind(entry) === entryKind(block))) previous.push(block);
    else groups.push([block]);
  }
  return <div className="structured-section-body">{groups.map((group, index) => {
    if (group.every((block) => block.kind === "copy")) return <RichText text={group.map((block) => block.kind === "copy" ? block.text : "").join("\n\n")} presentation="editorial" key={index} />;
    const stages = groupStageEntries(group);
    if (stages) return <div className="stage-directory" key={index}>{stages.map((stage) => <article className="stage-directory__group" data-grid="12" id={stage.id} key={stage.id ?? stage.label}><h3><span className="stage-directory__label">{stage.label}</span><span>{stage.title}</span></h3><CardGrid columns={1} variant="disclosures">{stage.entries.map((entry) => <ContentBlock block={entry} columns={1} presentation="editorial" key={entry.id ?? entry.title} />)}</CardGrid></article>)}</div>;
    if (group.length === 1) {
      const companion = group[0].kind === "subsection" && !group[0].collapsible && groups[index - 1]?.every((block) => block.kind === "disclosure" || block.kind === "subsection" && block.collapsible);
      const content = <ContentBlock block={group[0]} columns={columns} presentation="editorial" key={index} />;
      return companion ? <div className="content-companion" key={index}>{content}</div> : content;
    }
    const items = group.flatMap((block) => {
      if (block.kind !== "subsection" || block.collapsible) return [];
      const [title, ...description] = block.title.split("\n");
      const blocks: Block[] = [...(description.length ? [{ kind: "copy" as const, text: description.join("\n") }] : []), ...block.blocks];
      return [{ id: block.id, title, blocks }];
    });
    if (items.length === group.length && items.some((item) => gridItemParts(item).details.length)) return <ContentBlock block={{ kind: "grid", mode: "cards", items }} columns={columns} presentation="editorial" key={index} />;
    const disclosureOnly = group.every((block) => block.kind === "disclosure");
    const Wrapper = role === "steps" && !disclosureOnly ? Steps : CardGrid;
    const reserveNumbers = Wrapper === CardGrid && group.some((block) => (block.kind === "subsection" || block.kind === "disclosure") && splitNumberedTitle(block.kind === "subsection" ? block.title.split("\n")[0] : block.summary, true));
    return <Wrapper columns={columns} {...(Wrapper === CardGrid ? { variant: disclosureOnly ? "disclosures" as const : "subsections" as const } : {})} rows={items.length === group.length ? reserveNumbers ? 3 : 2 : undefined} key={index}>{group.map((block, childIndex) => <ContentBlock block={block} columns={columns} presentation="editorial" reserveNumber={reserveNumbers} key={childIndex} />)}</Wrapper>;
  })}</div>;
}

function SectionCluster({ pageKey, sections, design }: { pageKey: PageKey; sections: Section[]; design: SectionUnitDesign }) {
  return <div className="section-cluster" data-columns={design.columns} data-grid="12" data-rows="2">{sections.map((section, index) => {
    const numberedTitle = splitNumberedTitle(section.title, true);
    return <article className="section-cluster__item" id={index ? `${pageKey}-${section.id.toLowerCase()}` : undefined} key={section.id}><h3 data-numbered={numberedTitle ? "true" : undefined}>{numberedTitle ? <span aria-hidden="true" className="section-cluster__number">{numberedTitle[0]}</span> : null}<span className="section-cluster__title">{numberedTitle?.[1] ?? section.title}</span></h3><SectionBody blocks={section.blocks} columns={1} role={design.role} /></article>;
  })}</div>;
}

export function StructuredContent({ pageKey, includeIntro = true }: { pageKey: PageKey; includeIntro?: boolean }) {
  const page = structuredPages[pageKey] as PageContent;
  const plan = getPageSectionPlan(pageKey);
  const sourceById = new Map(page.sections.map((section) => [section.id, section]));
  return <>
    {pageKey !== "home" && plan.sections.length > 1 ? <section className="structured-page-map" data-grid-section="12" data-typography="editorial"><nav aria-label="本页章节" className="page-map-rail"><div className="container page-map-rail__inner" data-grid="12"><strong>本页内容</strong><PageMapLinks pageKey={pageKey} sections={plan.sections} sourceById={sourceById} /></div></nav><details className="page-map-disclosure"><summary className="container" data-grid="12"><strong>本页内容</strong><span>{plan.sectionCount} 个主题 · 按需浏览</span></summary><nav aria-label="本页内容"><div className="container structured-page-map__inner" data-grid="12"><PageMapLinks pageKey={pageKey} sections={plan.sections} sourceById={sourceById} /></div></nav></details></section> : null}
    {includeIntro && page.intro.length ? <section className="structured-intro" data-grid-section="12" data-prose-columns={plan.introProseColumns} data-typography="editorial"><div className="container structured-intro__inner" data-grid="12"><SectionBody blocks={page.intro} columns={1} /></div></section> : null}
    {plan.sections.map((design, index) => {
      const sections = design.sourceIds.map((id) => sourceById.get(id)!);
      const first = sections[0];
      const layout = sectionLayoutForRole(design.role);
      const composition = sections.length === 1 && pageKey === "media" ? mediaComposition(first) : undefined;
      const media = resolveSectionMedia(design.media);
      const illustration = media ? undefined : design.illustration;
      const isResourceDirectory = pageKey === "resources" && design.sourceIds.join("|") === resourceCategoryIds.join("|");
      const body = isResourceDirectory ? <ResourceCategories sections={sections} /> : sections.length > 1 ? <SectionCluster pageKey={pageKey} sections={sections} design={design} /> : design.role === "testimonials" ? <Testimonials section={first} sectionId={`${pageKey}-${design.id.toLowerCase()}`} /> : layout === "spread" ? <EditorialSpread section={first} pageKey={pageKey} illustration={composition ? illustration : undefined} /> : <SectionBody blocks={first.blocks} columns={design.columns} role={design.role} />;
      return <SectionFrame id={`${pageKey}-${design.id.toLowerCase()}`} index={index} title={design.title ?? first.title} illustration={composition ? undefined : illustration} media={media} tone={design.tone} role={design.role} columns={design.columns} proseColumns={design.proseColumns} density={design.density} layout={layout} wide={layout === "collection" || layout === "spread"} key={design.id}>{body}</SectionFrame>;
    })}
    {page.cta ? <CTAFrame className="structured-cta"><div><h2>{page.cta.title}</h2><RichText text={page.cta.body} presentation="editorial" /></div><ActionButtons actions={page.cta.actions} /></CTAFrame> : null}
  </>;
}
