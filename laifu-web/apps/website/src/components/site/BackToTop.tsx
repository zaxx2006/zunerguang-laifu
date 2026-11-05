"use client";

export function BackToTop() {
  function scrollToTop() {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, left: 0, behavior: reduceMotion ? "instant" : "smooth" });
  }
  return <button aria-label="返回顶部" className="back-to-top" onClick={scrollToTop} title="返回顶部" type="button">
    <svg aria-hidden="true" fill="currentColor" focusable="false" viewBox="0 0 19.62 24.09">
      <path d="M1866.5,982h16.63a1.561,1.561,0,0,1,0,3.118H1866.5a1.56,1.56,0,0,1,0-3.118h0Zm16.14,15.321a1.408,1.408,0,0,1-2,0l-4.68-4.73v12.34a1.145,1.145,0,1,1-2.29,0V992.585l-4.69,4.729a1.408,1.408,0,0,1-2,0,1.439,1.439,0,0,1,0-2.017l6.83-6.885v-0.006a1.412,1.412,0,0,1,2,0s0,0.006.01,0.006l6.82,6.892a1.438,1.438,0,0,1,0,2.016h0Zm0,0" transform="translate(-1865 -982)" />
    </svg>
  </button>;
}
