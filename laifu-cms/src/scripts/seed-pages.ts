import { readFileSync } from "node:fs";
import config from "@payload-config";
import { getPayload } from "payload";
import type { PagePresentation } from "@/payload-types";

type SeedPage = Omit<PagePresentation, "createdAt" | "id" | "sizes" | "updatedAt">;

function sourcePages(): SeedPage[] { return JSON.parse(readFileSync(new URL("../../seed-data/pages.json", import.meta.url), "utf8")) as SeedPage[]; }

async function seedPages() { const payload = await getPayload({ config }); const pages = sourcePages(); const existing = await payload.find({ collection: "page-presentations", depth: 0, overrideAccess: true, pagination: false, select: { route: true } }); const existingRoutes = new Set(existing.docs.map(document => document.route)); let created = 0; let skipped = 0; for (const page of pages) { if (existingRoutes.has(page.route)) { skipped += 1; continue; } await payload.create({ collection: "page-presentations", overrideAccess: true, context: { skipSystemEvents: true }, data: { ...page, _status: "published" } }); existingRoutes.add(page.route); created += 1; } payload.logger.info({ created, skipped, total: pages.length, msg: "Page presentation seed completed" }); }

await seedPages();
process.exit(0);
