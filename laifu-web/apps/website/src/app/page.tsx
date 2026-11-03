import type { Metadata } from "next";
import Script from "next/script";
import { HomeDesignSystem } from "@/components/home/HomePrimitives";
import { HomeHeader, HomeFooter } from "@/components/home/HomeNavigation";
import { HomeAssessment, HomeGuides, HomeHero, HomeServices, HomeInvitation } from "@/components/home/HomeSections";
import { HomeJourney } from "@/components/home/HomeJourney";
import { HomeFAQ } from "@/components/home/HomeFAQ";
import { getPage } from "@/lib/page-registry";
import { getHomePresentation, getNavigationPresentation } from "@/lib/cms-content-client";

const page = getPage("");

export async function generateMetadata(): Promise<Metadata> {
  const content = await getHomePresentation();
  return { title: { absolute: content?.seo.title ?? "焕屿困境辅导｜离婚陪伴辅导｜高冲突离婚应对｜律师协同支持" }, description: content?.seo.description ?? "焕屿困境辅导是专注离婚全周期陪伴辅导的专业平台，帮助你走出婚姻困局，重掌生活主动权。", openGraph: content ? { images: [{ url: content.seo.shareImage.src, width: content.seo.shareImage.width, height: content.seo.shareImage.height, alt: content.seo.shareImage.alt }] } : undefined };
}

export default async function HomePage() {
  if (!page) throw new Error("首页未注册");
  const [content, navigation] = await Promise.all([getHomePresentation(), getNavigationPresentation()]);
  return <><HomeDesignSystem><div id="main-content" data-page="home">
    <HomeHeader onHero content={navigation ?? undefined} /><HomeHero content={content?.hero} /><HomeJourney content={content?.journey} /><HomeServices content={content?.services} />
    <HomeAssessment content={content?.assessment} />
    <HomeFAQ items={content?.faqs} headingLines={content?.faqHeadingLines} indexAction={content?.faqIndexAction} contactAction={content?.faqContactAction} />
    <HomeGuides content={content?.guides} /><HomeInvitation content={content?.invitation} /><HomeFooter content={navigation ?? undefined} />
  </div></HomeDesignSystem><Script data-home-preview="true" src="/home-preview/home.js" strategy="afterInteractive" /></>;
}
