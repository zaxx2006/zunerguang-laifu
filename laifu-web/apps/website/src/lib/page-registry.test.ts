import { describe, expect, it } from "vitest";
import { chineseLabel } from "@/lib/bilingual";
import { getPublicPath, pageRegistry } from "@/lib/page-registry";

describe("page registry", () => {
  it("publishes exactly 30 unique routes", () => {
    const paths = pageRegistry.map(getPublicPath);
    expect(paths).toHaveLength(30);
    expect(new Set(paths).size).toBe(30);
  });
  it("gives every page its own local hero image", () => {
    const images = pageRegistry.map((page) => page.heroImage);
    expect(images.every((image) => image.startsWith("/"))).toBe(true);
    expect(new Set(images).size).toBe(pageRegistry.length);
    expect(images.filter((image) => image.endsWith(".webp")).length / images.length).toBeGreaterThanOrEqual(0.8);
  });
  it("keeps media prelaunch while publishing the supplied resource and course descriptions", () => {
    const prelaunch = pageRegistry.filter((page) => page.status === "prelaunch");
    expect(prelaunch.map((page) => page.slug)).toEqual(["media"]);
  });
  it("removes auxiliary English from visible labels", () => {
    expect(chineseLabel("SERVICES · 服务总览")).toBe("服务总览");
    expect(chineseLabel("服务总览 · SERVICES")).toBe("服务总览");
    expect(chineseLabel("让真实经验进入公共讨论")).toBe("让真实经验进入公共讨论");
  });
});
