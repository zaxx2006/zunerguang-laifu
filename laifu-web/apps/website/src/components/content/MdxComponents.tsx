import { SiteLink } from "@/components/site/SiteLink";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { chineseLabel } from "@/lib/bilingual";
import { siteConfig } from "@/lib/site-config";
import { StructuredContent } from "@/components/content/StructuredContent";
import { CardGrid, Steps, CTAFrame, SectionFrame, StatusNotice } from "@/components/content/ContentPrimitives";
import { sectionLayoutForRole } from "@/lib/section-design";
import type { SectionColumns, SectionDensity, SectionRole, SectionTone } from "@/lib/section-design";

type SectionProps = {
  id: string;
  titleZh: string;
  titleEn: string;
  eyebrow?: string;
  tone: SectionTone;
  role: SectionRole;
  columns: SectionColumns;
  density: SectionDensity;
  children: ReactNode;
};

type CTAProps = {
  titleZh: string;
  titleEn: string;
  body: string;
  href?: string;
  label?: string;
};

function Section({ id, titleZh, eyebrow, tone, role, columns, density, children }: SectionProps) {
  const layout = sectionLayoutForRole(role);
  const label = eyebrow ? chineseLabel(eyebrow) : "";
  return <SectionFrame id={id} title={titleZh} tone={tone} role={role} columns={columns} density={density} layout={layout} wide={layout === "collection" || layout === "spread"}>{label ? <p className="section-eyebrow">{label}</p> : null}<div className="prose">{children}</div></SectionFrame>;
}

function DetailList({ children }: { children: ReactNode }) {
  return <div className="detail-list">{children}</div>;
}

function ActionLinks({ children }: { children: ReactNode }) {
  return <div className="action-links">{children}</div>;
}

function SmallCopy({ children }: { children: ReactNode }) {
  return <div className="small-copy">{children}</div>;
}

function FAQList({ children }: { children: ReactNode }) {
  return <div className="faq-list">{children}</div>;
}

function Callout({ children }: { children: ReactNode }) {
  return <aside className="callout"><span aria-hidden="true" className="corner-square" />{children}</aside>;
}

function CTA({ titleZh, body, href = "/book-consultation/", label = "了解预约方式" }: CTAProps) {
  return <CTAFrame><div><h2>{titleZh}</h2><span>{body}</span></div><SiteLink className="button button--primary" href={href}>{label}<ArrowRight aria-hidden="true" size={18} /></SiteLink></CTAFrame>;
}

function AssessmentLink() {
  return <div className="assessment-link"><SiteLink className="button button--primary" href={siteConfig.assessment.href}>解锁你的状态评估报告</SiteLink></div>;
}


export const mdxComponents = {
  Section,
  CardGrid,
  Steps,
  DetailList,
  ActionLinks,
  SmallCopy,
  FAQList,
  Callout,
  CTA,
  AssessmentLink,
  StatusNotice,
  StructuredContent,
  a: (props: ComponentPropsWithoutRef<"a">) => <SiteLink {...props} />,
};
