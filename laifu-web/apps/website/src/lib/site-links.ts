export const assessmentUrl = process.env.NODE_ENV === "development"
  ? "http://localhost:3002/"
  : "https://laifu-assessments.pages.dev/";

export function normalizeSiteHref(href: string | undefined) {
  if (href && /^\/faq\/?(?:[?#].*)?$/.test(href)) return "/book-consultation/#booking-faq";
  if (href === "/blog" || href === "/blog/") return "/resources/#resources-articles";
  if (href?.startsWith("/blog/#")) return `/resources/${href.slice("/blog/".length)}`;
  if (href && /^(?:\/?#(?:assessment|home-assessment)|\/assessments?\/?(?:[?#].*)?)$/.test(href)) return assessmentUrl;
  const assessmentLink = href?.match(/^https?:\/\/laifu-assessments\.pages\.dev(?:\/(.*)|([?#].*))?$/i);
  if (assessmentLink) return `${assessmentUrl}${assessmentLink[1] ?? assessmentLink[2] ?? ""}`;
  return href;
}

export function siteLinkAttributes({ href, target, rel, download }: {
  href?: string; target?: string; rel?: string; download?: unknown;
}) {
  const normalizedHref = normalizeSiteHref(href);
  const pageLink = normalizedHref && !normalizedHref.startsWith("#") && (!/^[a-z][a-z\d+.-]*:/i.test(normalizedHref) || /^https?:/i.test(normalizedHref));
  const nextTarget = pageLink && (download === undefined || download === false) ? "_self" : normalizedHref?.startsWith("#") ? undefined : target;
  const nextRel = nextTarget === "_blank" ? [...new Set([...(rel?.split(/\s+/).filter(Boolean) ?? []), "noopener", "noreferrer"])].join(" ") : rel;
  return { href: normalizedHref, target: nextTarget, rel: nextRel };
}
