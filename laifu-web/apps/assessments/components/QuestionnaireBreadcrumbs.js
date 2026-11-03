"use client";

import { usePathname } from "next/navigation";

export default function QuestionnaireBreadcrumbs({ homeHref }) {
  const pathname = usePathname();
  const currentPage = pathname.includes("/narcissism-risk") ? "婚姻互动风险测评" : "离婚准备测评";
  return (
    <nav className="questionnaire-breadcrumbs" aria-label="页面导航">
      <ol className="questionnaire-container questionnaire-breadcrumbs__list">
        <li><a href={homeHref}>首页</a></li>
        <li>
          <svg aria-hidden="true" viewBox="0 0 8 12"><path d="m2 2 4 4-4 4" /></svg>
          <span aria-current="page">{currentPage}</span>
        </li>
      </ol>
    </nav>
  );
}
