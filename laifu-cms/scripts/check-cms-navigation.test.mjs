import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const nav = readFileSync(new URL("../src/admin/components/AdminNav.tsx", import.meta.url), "utf8");
const css = readFileSync(new URL("../src/app/(payload)/admin.css", import.meta.url), "utf8");

test("CMS navigation reuses Payload state and only disables closed mobile drawers", () => {
  assert.match(nav, /\{ hydrated, navOpen, navRef, shouldAnimate \} = useNav\(\)/);
  assert.match(nav, /\{ breakpoints: \{ m: isMobileNav \} \} = useWindowInfo\(\)/);
  assert.match(nav, /inert=\{!navOpen && isMobileNav !== false\}/);
  assert.match(nav, /className="nav__scroll" ref=\{navRef\}/);
  assert.doesNotMatch(nav, /NavWrapper|removeAttribute\(["']inert/);
  assert.match(css, /@media \(min-width: 1025px\)/);
});

test("Collapsed CMS rail retains its logo and labels for icon-only links", () => {
  const brandRule = css.match(/\.template-default \.acevec-nav__brand\s*\{([^}]+)\}/)?.[1];
  assert.ok(brandRule);
  assert.doesNotMatch(brandRule, /visibility:\s*hidden|display:\s*none|opacity:\s*0/);
  assert.match(nav, /aria-label="AceVec 内容工作台"/);
  assert.match(nav, /aria-label=\{item.label\}/);
});

test("CMS brand and document controls share one height baseline", () => {
  assert.match(css, /--acevec-shell-bar-height:\s*56px/);
  assert.match(css, /--app-header-height:\s*var\(--acevec-shell-bar-height\)/);
  assert.match(css, /--doc-controls-height:\s*var\(--acevec-shell-bar-height\)/);
  assert.match(css, /\.acevec-nav__brand-mark img\s*\{[^}]*width:\s*36px;[^}]*height:\s*36px/);
  assert.match(nav, /height="36" width="36"/);
});

test("CMS selected navigation uses surface state without a vertical stripe", () => {
  assert.match(css, /\.acevec-nav__link--active\s*\{[^}]*background:\s*var\(--accent\)/);
  assert.doesNotMatch(css, /\.acevec-nav__link--active::before/);
});
