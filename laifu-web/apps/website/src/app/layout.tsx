import type { Metadata } from "next";
import { SkipLink } from "@/components/site/SkipLink";
import { BackToTop } from "@/components/site/BackToTop";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: siteConfig.siteUrl ? new URL(siteConfig.siteUrl) : undefined,
  title: {
    default: "焕屿困境辅导 | LAIFU",
    template: "%s | 焕屿困境辅导",
  },
  description: "以离婚辅导为核心，为婚姻危机、分居、离婚与离婚后重建提供清晰、有边界的支持。",
  icons: {
    icon: [{ url: "/favicon-32x32.png?v=3", sizes: "32x32", type: "image/png" }],
    shortcut: "/favicon-32x32.png?v=3",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body><SkipLink />{children}<BackToTop /></body></html>;
}
