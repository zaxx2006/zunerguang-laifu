import { describe, expect, it } from "vitest";
import { heroCompositionFor } from "@/lib/page-composition";
import { pageRegistry } from "@/lib/page-registry";

describe("content-led hero compositions", () => {
  it("gives the homepage, brand story, services, directories and tools distinct openings", () => {
    const expected = { "": "cover", about: "story", services: "index", resources: "utility", faq: "utility", "book-consultation": "utility", "services/divorce-coaching": "service", "about/founder": "essay", "retreats-workshops": "experience" };
    for (const [slug, composition] of Object.entries(expected)) {
      const page = pageRegistry.find((entry) => entry.slug === slug);
      expect(page, slug).toBeDefined();
      expect(heroCompositionFor(page!), slug).toBe(composition);
    }
  });
  it("keeps image and copy metadata unchanged when selecting a layout", () => {
    const before = JSON.stringify(pageRegistry);
    for (const page of pageRegistry) expect(heroCompositionFor(page)).toBeTruthy();
    expect(JSON.stringify(pageRegistry)).toBe(before);
  });
});
