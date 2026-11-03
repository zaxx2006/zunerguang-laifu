export const cmsApiVersion = "v1";
export const cmsProjectionVersion = "2026-09-01";
export const cmsPresentationEndpoints = {
  home: { path: "/api/public/v1/acevec/home-presentation", pathEnvironment: "ACEVEC_CMS_HOME_PATH", missingCode: "HOME_PRESENTATION_NOT_PUBLISHED" },
  navigation: { path: "/api/public/v1/acevec/navigation", pathEnvironment: "ACEVEC_CMS_NAVIGATION_PATH", missingCode: "NAVIGATION_NOT_PUBLISHED" },
  pages: { path: "/api/public/v1/acevec/page-presentations", pathEnvironment: "ACEVEC_CMS_PAGES_PATH", missingCode: "PAGE_PRESENTATIONS_NOT_PUBLISHED" }
} as const;

export type CmsPresentationKind = keyof typeof cmsPresentationEndpoints;
export type PageTable = { columns: string[]; rows: string[][] };
export type NavGroup = {
  label: string;
  columns: { title: string; links: { href: string; label: string; note: string }[] }[];
  callout: { eyebrow: string; title: string; href: string; action: string };
};

export type HomeSectionItem = { id: string; kicker: string; title: string; description: string; detail: string; href: string; points: string[] };
export type HomeSectionPresentation = { key: "failure" | "services" | "method" | "evidence" | "fit" | "outcomes" | "insights" | "closing"; eyebrowIndex: string; eyebrowLabel: string; titleLines: string[]; description: string; markers: string[]; items: HomeSectionItem[]; quote: { text: string; attribution: string } | null; action: { href: string; label: string; title: string } | null };

export type HomePresentation = {
  hero: {
    eyebrowIndex: string;
    eyebrowLabel: string;
    titleLead: string;
    titleEmphasis: string;
    titleTail: string;
    description: string;
    primaryAction: { href: string; label: string };
    secondaryAction: { href: string; label: string };
    proofPoints: string[];
    rail: { label: string; value: string }[];
  };
  opening: {
    eyebrowIndex: string;
    eyebrowLabel: string;
    titleLines: string[];
    description: string;
    action: { href: string; label: string };
  };
  sections: HomeSectionPresentation[];
};

export type NavigationPresentation = {
  announcement: { actionLabel: string; href: string; label: string };
  groups: NavGroup[];
  topLinks: { href: string; label: string }[];
  secondaryAction: { href: string; label: string };
  primaryAction: { href: string; label: string };
  footer: {
    brandLabel: string;
    leadTitle: string;
    columns: { title: string; links: { href: string; label: string }[] }[];
    copyright: string;
    tagline: string;
    backToTopLabel: string;
  };
};

export type PagePresentationSection = { sourceId: string; visible: boolean; label: string; title: string; body: string[]; points: string[]; table: PageTable | null; visual: { alt: string; caption: string; longDescription: string[]; dataLabel: string } | null };
export type PagePresentation = { route: string; contentVersion: string; eyebrow: string; title: string; description: string; directAnswer: string; sections: PagePresentationSection[]; related: Array<{ href: string; label: string; note: string }>; cta: { href: string; label: string; title: string } };

export type CmsPresentationData = {
  home: { presentation: HomePresentation };
  navigation: { presentation: NavigationPresentation };
  pages: { presentations: PagePresentation[] };
};
export type CmsEnvelope<T> = {
  apiVersion: typeof cmsApiVersion;
  contentVersion: string;
  data: T & { projectionVersion: typeof cmsProjectionVersion };
};

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function createCmsEnvelope<T extends object>(contentVersion: string, data: T): CmsEnvelope<T> {
  if (typeof contentVersion !== "string" || contentVersion.trim() === "") throw new Error("CMS contentVersion is required");
  return { apiVersion: cmsApiVersion, contentVersion, data: { ...data, projectionVersion: cmsProjectionVersion } };
}

export function parseCmsEnvelope(value: unknown): CmsEnvelope<Record<string, unknown>> {
  if (!isRecord(value) || value.apiVersion !== cmsApiVersion || typeof value.contentVersion !== "string" || value.contentVersion.trim() === "" || !isRecord(value.data) || value.data.projectionVersion !== cmsProjectionVersion) throw new Error("CMS presentation envelope is invalid");
  return createCmsEnvelope(value.contentVersion, value.data);
}
