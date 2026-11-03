"use client";

export function BackToTop() {
  function scrollToTop() {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, left: 0, behavior: reduceMotion ? "instant" : "smooth" });
  }
  return <button aria-label="返回顶部" className="back-to-top" onClick={scrollToTop} title="返回顶部" type="button">
    <svg aria-hidden="true" fill="none" focusable="false" viewBox="0 0 56 56">
      <circle className="back-to-top__shadow" cx="28" cy="28" r="27.5" transform="translate(-3 4)" />
      <circle className="back-to-top__face" cx="28" cy="28" r="27.5" strokeWidth="1" />
      <path d="M14.8 27.3 28 14.1l13.2 13.2M28 14.1v27.2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
    </svg>
  </button>;
}
