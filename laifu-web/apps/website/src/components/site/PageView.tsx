import { SiteLink } from "@/components/site/SiteLink";
import { photoProps } from "@/lib/photo";
import { ArrowDownRight, ChevronRight } from "lucide-react";
import { loadPageContent } from "@/lib/content";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { chineseLabel } from "@/lib/bilingual";
import { getPage, getPublicPath } from "@/lib/page-registry";
import type { PageMeta } from "@/lib/page-schema";
import { siteConfig } from "@/lib/site-config";
import { heroCompositionFor } from "@/lib/page-composition";
import { composePageIntroduction } from "@/lib/page-introduction";
import { ActionButtons, ContentBlock } from "@/components/content/ContentBlock";
import { HighConflictPage } from "@/components/high-conflict/HighConflictPage";
import { DivorceCoachingPage } from "@/components/coaching/DivorceCoachingPage";
import { TemplatePage } from "@/components/coaching/TemplatePage";
import { CoursesWorkshopsPage } from "@/components/coaching/CoursesWorkshopsPage";
import { WorkshopsPage } from "@/components/coaching/WorkshopsPage";
import { AcademyPage } from "@/components/coaching/AcademyPage";
import { AboutPage } from "@/components/coaching/AboutPage";
import { ServicesPage } from "@/components/coaching/ServicesPage";
import { MediationPage } from "@/components/coaching/MediationPage";
import { RecoveryPage } from "@/components/coaching/RecoveryPage";
import { RemarriagePage } from "@/components/coaching/RemarriagePage";
import { ComplexAssetsPage } from "@/components/coaching/ComplexAssetsPage";
import { FamilyCollaborationPage } from "@/components/coaching/FamilyCollaborationPage";
import { MediaPage } from "@/components/coaching/MediaPage";
import { FounderPage } from "@/components/coaching/FounderPage";

const homeSections = [["#home-assessment", "自我梳理"], ["#home-services", "支持方案"], ["#home-approach", "陪伴方式"], ["#home-learn", "资源与活动"]] as const;
const categoryLabels: Record<PageMeta["group"], string> = { company: "焕屿", service: "专业服务", program: "线下活动", learn: "学习资源", professional: "专业成长" };

export async function PageView({ page }: { page: PageMeta }) {
  if (page.slug === "services/divorce-coaching") return <DivorceCoachingPage page={page} />;
  if (page.slug === "services/high-conflict-divorce") return <HighConflictPage />;
  if (page.slug === "services/mediation-preparation") return <MediationPage />;
  if (page.slug === "services/post-divorce-recovery") return <RecoveryPage />;
  if (page.slug === "services/remarriage-preparation") return <RemarriagePage />;
  if (page.slug === "services/nuptial-agreements") return <ComplexAssetsPage />;
  if (page.slug === "collaborative-law") return <FamilyCollaborationPage />;
  if (page.slug === "media") return <MediaPage />;
  if (page.slug === "courses-workshops") return <CoursesWorkshopsPage />;
  if (page.slug === "retreats-workshops") return <WorkshopsPage />;
  if (page.slug === "academy") return <AcademyPage />;
  if (page.slug === "about") return <AboutPage />;
  if (page.slug === "about/founder") return <FounderPage />;
  if (page.slug === "services") return <ServicesPage />;
  if (page.slug) return <TemplatePage page={page} />;
  const { content, intro } = await loadPageContent(page);
  const pageUrl = siteConfig.siteUrl ? `${siteConfig.siteUrl}${getPublicPath(page)}` : undefined;
  const jsonLd = pageUrl ? { "@context": "https://schema.org", "@type": page.layout === "service" ? "Service" : "WebPage", name: page.titleZh, description: page.description, url: pageUrl, provider: page.layout === "service" ? { "@type": "Organization", name: siteConfig.nameZh, url: siteConfig.siteUrl } : undefined } : null;
  const parent = page.parentSlug ? getPage(page.parentSlug) : undefined;
  const titleLength = [...page.titleZh.replace(/[，。！？、·\s]/g, "")].length;
  const isHome = page.slug === "";
  const eyebrow = chineseLabel(page.eyebrow);
  const composition = heroCompositionFor(page);
  const showImage = composition !== "utility" && !(composition === "essay" && page.heroImage.endsWith(".svg"));
  const showAction = composition !== "essay" && (composition !== "utility" || page.slug === "book-consultation");
  const introduction = composePageIntroduction(page.description, intro, showAction ? { label: page.slug === "book-consultation" ? "查看预约方式" : "预约咨询", href: page.slug === "book-consultation" ? "#booking-channel" : "/book-consultation/" } : undefined);
  const breadcrumb = <nav aria-label="面包屑" className="hero-breadcrumb"><SiteLink href="/">首页</SiteLink><ChevronRight aria-hidden="true" size={14} />{parent ? <><SiteLink href={getPublicPath(parent)}>{parent.titleZh}</SiteLink><ChevronRight aria-hidden="true" size={14} /></> : null}<span aria-current="page">{page.titleZh}</span></nav>;
  const action = showAction ? <SiteLink className="button button--primary button--hero" href={page.slug === "book-consultation" ? "#booking-channel" : "/book-consultation/"}>{page.slug === "book-consultation" ? "查看预约方式" : "预约咨询"}<ChevronRight aria-hidden="true" size={18} /></SiteLink> : null;
  const visual = showImage ? <figure className={`page-hero__visual${page.heroImage.endsWith(".webp") ? " page-hero__visual--photo" : ""}`}><img alt={page.heroAlt} decoding="async" fetchPriority="high" width="1600" height="1067" src={page.heroImage} {...photoProps(page.heroImage, isHome ? "(max-width: 960px) 100vw, 50vw" : "100vw")} /></figure> : null;
  return <><Header currentPath={getPublicPath(page)} /><main id="main-content" data-page={isHome ? "home" : page.contentFile.replace(".mdx", "")} data-page-composition={composition}>
    <section className={`page-hero${titleLength >= 12 ? " page-hero--title-long" : ""}${isHome ? " page-hero--home" : ""}`} data-grid-section="12" data-hero-tone={page.group} data-composition={isHome ? composition : "banner"} data-has-image={showImage}>
      <div className="container page-hero__inner" data-grid="12">{isHome ? <><div className="page-hero__copy"><div className="page-hero__content"><div className="page-hero__text">{eyebrow ? <p className="hero-eyebrow">{eyebrow}</p> : null}<h1>{page.titleZh}</h1><p className="hero-description">{page.description}</p></div>{action}</div></div>{visual}</> : <>
        <div className="page-hero__masthead" data-grid="12"><div className="page-hero__category"><p className="hero-eyebrow">{eyebrow || categoryLabels[page.group]}</p></div><h1>{page.titleZh}</h1></div>
        {visual}
        <div className="page-hero__introduction" data-grid="12"><div className="page-hero__context">{breadcrumb}</div><div className="page-hero__content"><div className="page-hero__narrative" data-typography="editorial"><p className="hero-description">{page.description}</p>{introduction.blocks.map((block, index) => <ContentBlock block={block} presentation="editorial" key={index} />)}{introduction.actions.length ? <ActionButtons actions={introduction.actions} /> : null}</div></div></div>
      </>}</div>
      {isHome ? <nav aria-label="首页内容" className="hero-rail">{homeSections.map(([href, label]) => <SiteLink href={href} key={href}><span className="hero-rail__label">{label}</span><ArrowDownRight aria-hidden="true" /></SiteLink>)}</nav> : null}
    </section>{content}</main>{jsonLd ? <script dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} type="application/ld+json" /> : null}<Footer /></>;
}
