import { MAIN_SITE_URL, QuestionnaireFooter, QuestionnaireHeader } from "../components/QuestionnaireChrome.js";
import QuestionnaireBreadcrumbs from "../components/QuestionnaireBreadcrumbs.js";
import "./globals.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const metadata = {
  title: {
    default: "焕屿专业自测工具",
    template: "%s｜焕屿专业自测工具",
  },
  description: "面向婚姻冲突与离婚决策场景的专业自测与支持分流工具。",
  icons: {
    icon: [{ url: `${basePath}/huanyu-favicon-32x32.png`, sizes: "32x32", type: "image/png" }],
    shortcut: `${basePath}/huanyu-favicon-32x32.png`,
    apple: [{ url: `${basePath}/apple-touch-icon.png`, sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body style={{ "--pattern-hatch": `url("${basePath}/generated/patterns/diagonal-hatch.svg")` }}>
        <QuestionnaireHeader />
        <QuestionnaireBreadcrumbs homeHref={`${MAIN_SITE_URL}/`} />
        {children}
        <QuestionnaireFooter />
      </body>
    </html>
  );
}
