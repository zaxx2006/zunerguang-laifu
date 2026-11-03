import { photoProps } from "@/lib/photo";
import { ChevronDown } from "lucide-react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { CollectionColumns, ContentPresentation, SectionLayout } from "@/components/content/content-types";
import { splitNumberedTitle } from "@/lib/content-layout";
import type { SectionColumns, SectionDensity, SectionMedia, SectionRole, SectionTone } from "@/lib/section-design";

export function CardGrid({ children, columns = 3, variant, rows }: { children: ReactNode; columns?: CollectionColumns; variant?: "subsections" | "disclosures" | "modules"; rows?: 2 | 3 | 4 | 5 | 6 }) {
  return <div className="card-grid" data-columns={columns} data-collection={variant} data-grid="12" data-rows={rows}>{children}</div>;
}

export function Steps({ children, columns = 3, rows }: { children: ReactNode; columns?: CollectionColumns; rows?: 2 | 3 | 4 | 5 | 6 }) {
  return <div className="steps" data-columns={columns} data-grid="12" data-rows={rows}>{children}</div>;
}

export function StatusNotice({ title = "筹备状态", children }: { title?: string; children: ReactNode }) {
  return <aside className="status-notice"><strong className="status-notice__title">{title}</strong><div className="status-notice__body">{children}</div></aside>;
}

export function SelectControl({ children, ...props }: ComponentPropsWithoutRef<"select">) {
  return <span className="select-control"><select {...props}>{children}</select><ChevronDown aria-hidden="true" size={18} /></span>;
}

export function SectionFrame({ id, index, title, illustration, media, tone = "canvas", role, columns = 1, proseColumns, density = "regular", wide = false, presentation = "editorial", layout, children }: { id?: string; index?: number; title: string; illustration?: string; media?: SectionMedia; tone?: SectionTone; role?: SectionRole; columns?: SectionColumns; proseColumns?: 3; density?: SectionDensity; wide?: boolean; presentation?: ContentPresentation; layout?: SectionLayout; children: ReactNode }) {
  const numberedTitle = presentation === "editorial" ? splitNumberedTitle(title, true) : null;
  const heading = numberedTitle?.[1] ?? title;
  const headingParts = [heading];
  const sectionNumber = layout === "notice" ? null : numberedTitle?.[0] ?? (index === undefined ? null : String(index + 1).padStart(2, "0"));
  return <section className={`content-section content-section--${tone}`} data-typography={presentation === "editorial" ? presentation : undefined} data-layout={presentation === "editorial" ? layout ?? (wide ? "collection" : "reading") : undefined} data-role={role} data-columns={columns} data-prose-columns={proseColumns} data-density={density} data-media={media?.placement} data-illustrated={illustration || media ? "true" : undefined} data-grid-section="12" id={id}><div className="container section-grid" data-grid="12"><span aria-hidden="true" className="section-junction section-junction--left" /><span aria-hidden="true" className="section-junction section-junction--right" /><div className="section-heading"><div><h2>{sectionNumber ? <span aria-hidden="true" className="section-heading__number">{sectionNumber}</span> : null}<span>{headingParts.map((part, partIndex) => <span className="section-heading__phrase" key={partIndex}>{part}</span>)}</span></h2></div></div>{media ? <figure className="section-illustration section-illustration--photo" data-focal={media.focal}><img src={media.src} alt={media.alt} width={media.width} height={media.height} {...photoProps(media.src, media.placement === "banner" ? "100vw" : "(max-width: 960px) 100vw, 50vw")} loading="lazy" decoding="async" /></figure> : illustration ? <figure className="section-illustration" aria-hidden="true"><img src={`/generated/illustrations/${illustration}`} alt="" width="800" height="600" loading="lazy" decoding="async" /></figure> : null}<div className={`section-body${wide ? " section-body--wide" : ""}`}>{children}</div></div></section>;
}

export function CTAFrame({ children, className = "", presentation = "editorial" }: { children: ReactNode; className?: string; presentation?: ContentPresentation }) {
  return <section className="cta-strip" data-grid-section="12" data-typography={presentation === "editorial" ? presentation : undefined}><div className={`container cta-strip__inner ${className}`} data-grid="12"><span aria-hidden="true" className="section-junction section-junction--left" /><span aria-hidden="true" className="section-junction section-junction--right" />{children}</div></section>;
}
