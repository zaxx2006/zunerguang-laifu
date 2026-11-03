import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import config from "@payload-config";
import { getPayload } from "payload";
import { divorceCoachingPresentationSchema } from "@/contracts/cms-service";
import type { ServicePresentation } from "@/payload-types";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const payload = await getPayload({ config });
const source = divorceCoachingPresentationSchema.parse(JSON.parse(await readFile(path.resolve(dirname, "../../seed-data/divorce-coaching.json"), "utf8")));
const lines = (values: string[]) => values.map(value => ({ value }));

async function ensureMedia(filename: string, alt: string) {
  const existing = await payload.find({ collection: "media", limit: 1, overrideAccess: true, pagination: false, where: { filename: { equals: filename } } });
  if (existing.docs[0]) return existing.docs[0].id;
  const document = await payload.create({ collection: "media", overrideAccess: true, data: { alt, sourceLabel: "Laifu 官网现有视觉资产", rightsConfirmed: true, publicApproved: true }, filePath: path.resolve(dirname, "../../seed-assets", filename) });
  return document.id;
}

const [hero, conversation, financeDesk, forestPath] = await Promise.all([
  ensureMedia("hero-walk.webp", source.hero.image.alt),
  ensureMedia("divorce-coaching-conversation.webp", source.support.directions[0].image.alt),
  ensureMedia("nuptial-finance-desk.webp", source.support.directions[1].image.alt),
  ensureMedia("forest-path.webp", source.support.directions[2].image.alt),
]);
const directionMedia = [conversation, financeDesk, forestPath];
const data: Omit<ServicePresentation, "createdAt" | "id" | "updatedAt"> = {
  internalTitle: "离婚陪伴辅导",
  key: source.key,
  hero: { ...source.hero, statementLines: lines(source.hero.statementLines), image: hero },
  fit: { ...source.fit, introLines: lines(source.fit.introLines), overview: lines(source.fit.overview), stages: source.fit.stages.map(stage => ({ ...stage, concerns: lines(stage.concerns) })) },
  why: { ...source.why, paragraphs: lines(source.why.paragraphs) },
  support: {
    ...source.support,
    introLines: lines(source.support.introLines),
    directions: source.support.directions.map((direction, index) => ({ ...direction, image: directionMedia[index] })),
  },
  process: { ...source.process, steps: source.process.steps.map(step => ({ ...step, focus: lines(step.focus), mapItems: lines(step.mapItems) })) },
  options: { ...source.options, choices: lines(source.options.choices), closingLines: lines(source.options.closingLines) },
  comparison: { ...source.comparison, headers: lines(source.comparison.headers) },
  outcomes: { ...source.outcomes, items: lines(source.outcomes.items) },
  boundaries: source.boundaries,
  finalCta: { ...source.finalCta, descriptionLines: lines(source.finalCta.descriptionLines) },
  _status: "published" as const,
};
const existing = await payload.find({ collection: "service-presentations", limit: 1, overrideAccess: true, pagination: false, where: { key: { equals: source.key } } });
if (!existing.docs.length) await payload.create({ collection: "service-presentations", overrideAccess: true, context: { skipSystemEvents: true }, draft: false, data });
payload.logger.info("Laifu divorce coaching service seed completed");
process.exit(0);
