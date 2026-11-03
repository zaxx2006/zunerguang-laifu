import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { composePageIntroduction } from "@/lib/page-introduction";
import { StructuredContent } from "@/components/content/StructuredContent";
import { ContentBlock } from "@/components/content/ContentBlock";
import type { Action, Block } from "@/components/content/content-types";
import pages from "@/content/structured-pages.json";

const fallback: Action = { label: "预约咨询", href: "/book-consultation/" };
const normalize = (text: string) => text.replace(/\s+/gu, "");

describe("composed page introductions", () => {
  it("removes only an exact opening duplicate and leaves source data untouched", () => {
    const intro: Block[] = [{ kind: "copy", text: " 共同养育\n\n保留这段说明。 " }, { kind: "copy", text: "共同养育" }];
    const snapshot = JSON.stringify(intro);
    expect(composePageIntroduction("共同养育", intro).blocks).toEqual([{ kind: "copy", text: "保留这段说明。" }, intro[1]]);
    expect(JSON.stringify(intro)).toBe(snapshot);
    expect(composePageIntroduction("共同养育", [{ kind: "copy", text: "  共同养育  " }]).blocks).toEqual([]);
    expect(composePageIntroduction("共同养育", [{ kind: "copy", text: "共同养育不是同一段导语" }]).blocks).toHaveLength(1);
  });
  it("keeps source actions in order and prefers the specific consultation destination", () => {
    const actions: Action[] = [{ label: "查看课程", href: "/courses-workshops/" }, { label: "预约初步沟通", href: "/book-consultation/#booking-channel" }];
    expect(composePageIntroduction("导语", [{ kind: "actions", actions }], fallback).actions).toEqual(actions);
    expect(composePageIntroduction("导语", [{ kind: "actions", actions: actions.slice(0, 1) }], fallback).actions).toEqual([actions[0], fallback]);
    expect(composePageIntroduction("导语", [], fallback)).toEqual({ blocks: [], actions: [fallback] });
  });
  it("retains every source introduction paragraph and action after composition", () => {
    for (const [key, page] of Object.entries(pages)) {
      const intro = page.intro as Block[];
      const description = intro[0]?.kind === "copy" ? intro[0].text.split("\n")[0] : "页面导语";
      const result = composePageIntroduction(description, intro, fallback);
      const composed = normalize(description + result.blocks.map((block) => block.kind === "copy" ? block.text : "").join(""));
      for (const block of intro) {
        if (block.kind === "copy") expect(composed, key).toContain(normalize(block.text));
        if (block.kind === "actions") for (const action of block.actions) expect(result.actions, key).toContainEqual(action);
      }
    }
  });
  it("can move the introduction out without removing body sections or anchors", () => {
    for (const pageKey of Object.keys(pages) as (keyof typeof pages)[]) {
      const standalone = renderToStaticMarkup(createElement(StructuredContent, { pageKey }));
      const body = renderToStaticMarkup(createElement(StructuredContent, { pageKey, includeIntro: false }));
      expect(body, pageKey).not.toContain('class="structured-intro"');
      const sections = /<section class="content-section[\s\S]*/u;
      expect(body.match(sections), pageKey).not.toBeNull();
      expect(body.match(sections)?.[0], pageKey).toBe(standalone.match(sections)?.[0]);
    }
  });
  it("uses explicit complete modules for content grids", () => {
    const block: Block = { kind: "grid", mode: "cards", items: [{ title: "一个专题", blocks: [{ kind: "copy", text: "相关情境\n·保留一个完整的句子，不把它拆进狭小的栏位。" }, { kind: "actions", actions: [{ label: "进入专题", href: "/blog/" }] }] }] };
    const html = renderToStaticMarkup(createElement(ContentBlock, { block, presentation: "editorial" }));
    expect(html).toContain('data-collection="modules"');
    expect(html).toContain('class="content-card__footer"');
    expect(html).toContain('href="/blog/"');
  });
});
