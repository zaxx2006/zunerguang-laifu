type Action = { href?: string; label?: string };
export type HomePreviewDocument = {
  hero?: {
    eyebrowIndex?: string;
    eyebrowLabel?: string;
    titleLead?: string;
    titleEmphasis?: string;
    titleTail?: string;
    description?: string;
    primaryAction?: Action;
    secondaryAction?: Action;
    proofPoints?: Array<{ id?: string; value?: string }>;
    rail?: Array<{ id?: string; label?: string; value?: string }>;
  };
  opening?: {
    eyebrowIndex?: string;
    eyebrowLabel?: string;
    titleLines?: Array<{ id?: string; value?: string }>;
    description?: string;
    action?: Action;
  };
  sections?: Array<{
    id?: string;
    key?: string;
    eyebrowIndex?: string;
    eyebrowLabel?: string;
    titleLines?: Array<{ id?: string; value?: string }>;
    description?: string;
    items?: Array<{ id?: string; sourceId?: string; kicker?: string; title?: string; description?: string; detail?: string; points?: Array<{ id?: string; value?: string }> }>;
  }>;
};

export type NavigationPreviewDocument = {
  announcement?: { label?: string; actionLabel?: string; href?: string };
  groups?: Array<{
    id?: string;
    label?: string;
    columns?: Array<{ id?: string; title?: string; links?: Array<{ id?: string; href?: string; label?: string; note?: string }> }>;
    callout?: { action?: string; eyebrow?: string; href?: string; title?: string };
  }>;
  topLinks?: Action[];
  secondaryAction?: Action;
  primaryAction?: Action;
  footer?: { brandLabel?: string; leadTitle?: string; columns?: Array<{ id?: string; title?: string; links?: Action[] }>; copyright?: string; tagline?: string; backToTopLabel?: string };
};

export type PagePreviewDocument = {
  route?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  directAnswer?: string;
  sections?: Array<{
    id?: string;
    sourceId?: string;
    visible?: boolean;
    label?: string;
    title?: string;
    body?: Array<{ id?: string; value?: string }>;
    points?: Array<{ id?: string; value?: string }>;
    tableColumns?: Array<{ id?: string; value?: string }>;
    tableRows?: Array<{ id?: string; cells?: Array<{ id?: string; value?: string }> }>;
  }>;
  cta?: { href?: string; label?: string; title?: string };
};
