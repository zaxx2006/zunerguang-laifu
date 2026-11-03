import { highConflictPresentationSchema } from "@/contracts/cms-high-conflict";
import { expandHighConflict } from "@/fields/presentation/high-conflict";
import { servicePresentationSchema, type AnyServicePresentation } from "@/contracts/cms-service";
import type { Media, ServicePresentation as ServiceDocument } from "@/payload-types";
import type { CmsAction, CmsMedia } from "@/contracts/cms-home";

type Line = { value: string };

function lines(items: Line[]): string[] { return items.map(item => item.value); }
function action(value: CmsAction): CmsAction { return { href: value.href, label: value.label, openInNewTab: Boolean(value.openInNewTab) }; }
function media(value: number | Media): CmsMedia {
  if (typeof value !== "object") throw new Error("CMS media relationship was not populated");
  if (!value.url || !value.width || !value.height) throw new Error(`CMS media is incomplete: ${value.alt}`);
  const base = process.env.PAYLOAD_PUBLIC_SERVER_URL || "http://127.0.0.1:5158";
  return { src: new URL(value.url, base).toString(), alt: value.alt, width: value.width, height: value.height };
}

export function projectService(source: unknown): AnyServicePresentation {
  const document = source as Required<ServiceDocument>;
  if (document.key === "high-conflict-divorce") {
    const content = expandHighConflict(document.highConflict) as Record<string, unknown>;
    const hero = content.hero as Record<string, unknown>;
    const children = content.children as Record<string, unknown>;
    return highConflictPresentationSchema.parse({ ...content, key: document.key, hero: { ...hero, image: media(hero.image as number | Media) }, children: { ...children, image: media(children.image as number | Media) } });
  }
  return servicePresentationSchema.parse({
    key: document.key,
    hero: { ...document.hero, statementLines: lines(document.hero.statementLines), image: media(document.hero.image), primaryAction: action(document.hero.primaryAction), secondaryAction: action(document.hero.secondaryAction) },
    fit: { ...document.fit, introLines: lines(document.fit.introLines), overview: lines(document.fit.overview), stages: document.fit.stages.map(stage => ({ ...stage, concerns: lines(stage.concerns) })) },
    why: { ...document.why, paragraphs: lines(document.why.paragraphs) },
    support: {
      ...document.support,
      introLines: lines(document.support.introLines),
      directions: document.support.directions.map(direction => ({ ...direction, image: media(direction.image) })),
    },
    process: { ...document.process, steps: document.process.steps.map(step => ({ ...step, focus: lines(step.focus), mapItems: lines(step.mapItems) })) },
    options: { ...document.options, choices: lines(document.options.choices), closingLines: lines(document.options.closingLines), action: action(document.options.action) },
    comparison: { ...document.comparison, headers: lines(document.comparison.headers) },
    outcomes: { ...document.outcomes, items: lines(document.outcomes.items) },
    boundaries: document.boundaries,
    finalCta: { ...document.finalCta, descriptionLines: lines(document.finalCta.descriptionLines), actions: document.finalCta.actions.map(action) },
  });
}
