import { describe, expect, it } from "vitest";
import { highConflictPresentationSchema } from "@/contracts/cms-high-conflict";
import { servicePresentationSchema } from "@/contracts/cms-service";
import initialContent from "@/content/service-presentations/high-conflict-divorce.json";
import divorceContent from "@/content/service-presentations/divorce-coaching.json";
import { consultationSummary, orderedPriorities } from "./tools";

const content = highConflictPresentationSchema.parse(initialContent);

describe("high-conflict content contract and local planner", () => {
  it("ships all seven documented services with three editable demonstration entries", () => {
    expect(content.support.directions.map(item => item.key)).toEqual(["pattern", "preparation", "records", "expression", "communication", "parenting", "stability"]);
    for (const direction of content.support.directions) {
      expect(direction.toolRows).toHaveLength(3);
      expect(direction.note).toBeTruthy();
    }
  });
  it("keeps existing four-direction CMS records readable and rejects duplicate service keys", () => {
    const copy = structuredClone(initialContent);
    copy.support.directions = copy.support.directions.slice(0, 4);
    expect(highConflictPresentationSchema.safeParse(copy).success).toBe(true);
    copy.support.directions[1].key = copy.support.directions[0].key;
    expect(highConflictPresentationSchema.safeParse(copy).success).toBe(false);
  });
  it("accepts both service shapes without allowing content to cross keys", () => {
    expect(servicePresentationSchema.parse(initialContent).key).toBe("high-conflict-divorce");
    expect(servicePresentationSchema.parse(divorceContent).key).toBe("divorce-coaching");
    expect(servicePresentationSchema.safeParse({ ...initialContent, key: "divorce-coaching" }).success).toBe(false);
  });
  it("rejects duplicate situation identifiers", () => {
    const copy = structuredClone(initialContent);
    copy.situations.items[1].key = copy.situations.items[0].key;
    expect(highConflictPresentationSchema.safeParse(copy).success).toBe(false);
  });
  it("requires all eight unique priority keys", () => {
    const copy = structuredClone(initialContent);
    copy.priorities.items[1].key = copy.priorities.items[0].key;
    expect(highConflictPresentationSchema.safeParse(copy).success).toBe(false);
  });
  it("rejects missing alternative text and invalid image sizes", () => {
    for (const image of [{ ...content.hero.image, alt: " " }, { ...content.hero.image, width: 0 }]) expect(highConflictPresentationSchema.safeParse({ ...content, hero: { ...content.hero, image } }).success).toBe(false);
  });
  it("rejects executable or protocol-relative CTA links", () => {
    for (const href of ["javascript:alert(1)", "//evil.example"]) expect(highConflictPresentationSchema.safeParse({ ...content, hero: { ...content.hero, primaryAction: { ...content.hero.primaryAction, href } } }).success).toBe(false);
  });
  it("does not infer danger from the number of selections", () => {
    const result = orderedPriorities(["contact", "children", "rest", "legal", "materials"], content.priorities.items);
    expect(result.some(item => item.key === "safety")).toBe(false);
  });
  it("orders safety first, removes duplicates, and ignores unknown keys", () => {
    expect(orderedPriorities(["legal", "children", "safety", "legal", "unknown"], content.priorities.items).map(item => item.key)).toEqual(["safety", "children", "legal"]);
  });
  it("creates copyable text from the selected CMS content only", () => {
    const summary = consultationSummary(["legal"], content.priorities);
    expect(summary).toContain(content.priorities.items.find(item => item.key === "legal")?.prompt);
    expect(summary).not.toContain(content.priorities.items[0].prompt);
    expect(consultationSummary([], content.priorities)).toBe("");
  });
});
