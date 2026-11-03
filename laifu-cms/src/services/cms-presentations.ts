import { homePresentationSchema, navigationPresentationSchema, type CmsAction, type CmsMedia, type HomePresentation, type NavigationPresentation } from "@/contracts/cms-home";
import { readerFormat, readerHref, readerIdFromHref, type ReaderResource } from "@/contracts/resource-reader";
import { resourceFormats, resourceStages } from "@/contracts/page-content";

type Line = { value: string };
type MediaDocument = { alt: string; height?: number | null; url?: string | null; width?: number | null };

const lines = (items: Line[]) => items.map(item => item.value);
const action = (value: CmsAction): CmsAction => ({ href: value.href, label: value.label, openInNewTab: Boolean(value.openInNewTab) });
const media = (value: number | string | MediaDocument): CmsMedia => {
  if (typeof value !== "object") throw new Error("CMS media relationship was not populated");
  if (!value.url || !value.width || !value.height) throw new Error(`CMS media is incomplete: ${value.alt}`);
  const base = process.env.PAYLOAD_PUBLIC_SERVER_URL || "http://127.0.0.1:5158";
  return { src: new URL(value.url, base).toString(), alt: value.alt, width: value.width, height: value.height };
};

type FAQDocument = {
  id: number | string; question: string; lead: string; answer: string;
  contexts: Array<{ label: string; copy: string; hasAction?: boolean | null; action?: CmsAction | null }>;
  followups: Array<{ question: string; answer: string }>;
};

type HomeDocument = Omit<HomePresentation, "assessment" | "faqContactAction" | "faqHeadingLines" | "faqIndexAction" | "faqs" | "guides" | "hero" | "invitation" | "journey" | "seo" | "services"> & {
  seo: { title: string; description: string; shareImage: number | string | MediaDocument };
  hero: Omit<HomePresentation["hero"], "image" | "introLines" | "titleLines"> & { image: number | string | MediaDocument; introLines: Line[]; titleLines: Line[] };
  journey: Omit<HomePresentation["journey"], "openingBodyLines" | "stages"> & { openingBodyLines: Line[]; stages: Array<Omit<HomePresentation["journey"]["stages"][number], "descriptionLines" | "titleLines"> & { descriptionLines: Line[]; titleLines: Line[] }> };
  services: Omit<HomePresentation["services"], "items" | "titleLines"> & { titleLines: Line[]; items: Array<Omit<HomePresentation["services"]["items"][number], "image" | "titleLines"> & { image: number | string | MediaDocument; titleLines: Line[] }> };
  assessment: Omit<HomePresentation["assessment"], "descriptionLines" | "titleLines"> & { descriptionLines: Line[]; titleLines: Line[] };
  faqs: Array<number | string | FAQDocument>;
  faqHeadingLines: Line[]; faqIndexAction: CmsAction; faqContactAction: CmsAction;
  guides: Omit<HomePresentation["guides"], "items" | "titleLines"> & { titleLines: Line[]; items: Array<Omit<HomePresentation["guides"]["items"][number], "image" | "subtitleLines" | "titleLines"> & { image: number | string | MediaDocument; subtitleLines: Line[]; titleLines: Line[] }> };
  invitation: Omit<HomePresentation["invitation"], "descriptionLines"> & { descriptionLines: Line[] };
};

export function projectHome(source: unknown, resources: ReaderResource[] = []): HomePresentation {
  const document = source as HomeDocument;
  return homePresentationSchema.parse({
    seo: { title: document.seo.title, description: document.seo.description, shareImage: media(document.seo.shareImage) },
    hero: { ...document.hero, titleLines: lines(document.hero.titleLines), introLines: lines(document.hero.introLines), image: media(document.hero.image), primaryAction: action(document.hero.primaryAction), secondaryAction: action(document.hero.secondaryAction) },
    journey: { ...document.journey, openingBodyLines: lines(document.journey.openingBodyLines), stages: document.journey.stages.map(stage => ({ ...stage, titleLines: lines(stage.titleLines), descriptionLines: lines(stage.descriptionLines), documentItems: stage.documentItems ?? [] })) },
    services: { ...document.services, titleLines: lines(document.services.titleLines), items: document.services.items.map(item => ({ ...item, titleLines: lines(item.titleLines), image: media(item.image) })) },
    assessment: { ...document.assessment, titleLines: lines(document.assessment.titleLines), descriptionLines: lines(document.assessment.descriptionLines), action: action(document.assessment.action) },
    faqs: document.faqs.map(value => { if (typeof value !== "object") throw new Error("CMS FAQ relationship was not populated"); return { id: String(value.id), question: value.question, lead: value.lead, answer: value.answer, contexts: value.contexts.map(context => ({ label: context.label, copy: context.copy, action: context.hasAction && context.action?.href && context.action.label ? action(context.action) : null })), followups: value.followups.map(item => ({ question: item.question, answer: item.answer })) }; }),
    faqHeadingLines: lines(document.faqHeadingLines), faqIndexAction: action(document.faqIndexAction), faqContactAction: action(document.faqContactAction),
    guides: { ...document.guides, titleLines: lines(document.guides.titleLines), items: (document.guides.items ?? []).flatMap(item => {
      const resource = resources.find(resource => resource.id === readerIdFromHref(item.href));
      if (!resource) return [];
      const format = readerFormat(resource.file)?.toUpperCase();
      const kind = resourceFormats.find(([key]) => key === resource.kind)?.[1] ?? "资源中心";
      const stage = resourceStages.find(([key]) => key === resource.stage)?.[1] ?? "自助阅读";
      return [{ eyebrow: kind, titleLines: [resource.title], subtitleLines: [resource.summary || "点击封面开始阅读"], meta: `${stage} · ${format}`, href: readerHref(resource.id), image: item.image ? media(item.image) : { src: "/images/editorial/p06-guide-daily-life.webp", alt: "焕屿资源指南封面", width: 1280, height: 960 } }];
    }), statusNote: document.guides.statusNote?.includes("试读示意") ? "点击封面在线阅读完整资源，也可以前往资源中心查看更多内容。" : document.guides.statusNote, indexAction: action(document.guides.indexAction) },
    invitation: { ...document.invitation, descriptionLines: lines(document.invitation.descriptionLines), actions: document.invitation.actions.map(action) },
  });
}

type NavigationDocument = Omit<NavigationPresentation, "footerColumns" | "primaryLinks"> & {
  primaryLinks: CmsAction[];
  footerColumns: Array<{ title: string; links: CmsAction[] }>;
};

export function projectNavigation(source: unknown): NavigationPresentation {
  const document = source as NavigationDocument;
  return navigationPresentationSchema.parse({ ...document, primaryLinks: document.primaryLinks.map(action), assessmentAction: action(document.assessmentAction), footerColumns: document.footerColumns.map(column => ({ title: column.title, links: column.links.map(action) })) });
}
