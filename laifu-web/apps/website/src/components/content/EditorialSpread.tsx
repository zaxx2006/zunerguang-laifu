import { ContentBlock } from "@/components/content/ContentBlock";
import { RichText } from "@/components/content/RichText";
import { hasNumberedFlow, mediaComposition } from "@/lib/editorial-composition";
import type { Section } from "@/components/content/content-types";

export function EditorialSpread({ section, pageKey, illustration }: { section: Section; pageKey: string; illustration?: string }) {
  const composition = pageKey === "media" ? mediaComposition(section) : undefined;
  if (composition) return <div className="editorial-spread"><div className="editorial-spread__opening" data-grid="12" data-illustrated={illustration ? "true" : undefined}><div className="editorial-spread__lead"><RichText text={composition.lead} presentation="editorial" /></div>{illustration ? <figure className="editorial-spread__art" aria-hidden="true"><img src={`/generated/illustrations/${illustration}`} alt="" width="800" height="600" loading="lazy" decoding="async" /></figure> : null}</div><ContentBlock block={{ kind: "grid", mode: "cards", columns: composition.columns, items: composition.items }} presentation="editorial" />{composition.supplements.length ? <div className="editorial-spread__directory"><ContentBlock block={{ kind: "grid", mode: "cards", items: composition.supplements }} presentation="editorial" /></div> : null}</div>;
  return <div className="editorial-spread editorial-spread--prose" data-grid="12">{section.blocks.map((block, index) => <div className="editorial-spread__text" data-flow={hasNumberedFlow(block) || undefined} key={index}><ContentBlock block={block} presentation="editorial" /></div>)}</div>;
}
