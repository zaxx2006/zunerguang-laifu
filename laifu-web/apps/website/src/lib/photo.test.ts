import { afterEach, describe, expect, it, vi } from "vitest";
import { photoProps } from "./photo";

afterEach(() => vi.unstubAllEnvs());

describe("responsive photo sources", () => {
  it("keeps the prepared dimensions and sources of local editorial photos", () => {
    const props = photoProps("/images/editorial/hero-walk.webp", "50vw");
    expect(props).toMatchObject({ width: 1280, sizes: "50vw" });
    expect(props.srcSet).toContain("/images/editorial/hero-walk-640.webp 640w");
  });

  it("optimizes published CMS media without changing the image's dimensions", () => {
    const props = photoProps("http://127.0.0.1:5158/api/media/file/hero-walk.webp", "100vw");
    expect(props.src).toContain("/_next/image?url=http%3A%2F%2F127.0.0.1%3A5158%2Fapi%2Fmedia%2Ffile%2Fhero-walk.webp");
    expect(props.srcSet).toContain("640w");
    expect(props).not.toHaveProperty("width");
    expect(props).not.toHaveProperty("height");
  });

  it("uses the configured CMS origin and leaves unrelated URLs untouched", () => {
    vi.stubEnv("LAIFU_CMS_URL", "https://cms.example.com/");
    expect(photoProps("https://cms.example.com/api/media/file/example.webp", "50vw").srcSet).toContain("cms.example.com");
    for (const src of ["https://other.example.com/api/media/file/example.webp", "https://cms.example.com.evil.test/api/media/file/example.webp", "https://cms.example.com/admin", "/unknown.svg"]) {
      expect(photoProps(src, "50vw")).toEqual({});
    }
  });
});
