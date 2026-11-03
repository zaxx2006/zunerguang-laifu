import { SiteLink } from "@/components/site/SiteLink";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";

export default function NotFound() {
  return <><Header /><main className="not-found" id="main-content"><div className="container"><p className="section-eyebrow">页面未找到 · PAGE NOT FOUND · 404</p><h1>这一页暂时不在这里</h1><p>你可以返回首页，或从服务总览重新找到需要的内容。</p><div className="not-found__actions"><SiteLink className="button button--outline" href="/">返回首页</SiteLink><SiteLink className="button button--outline" href="/services/">查看服务</SiteLink></div></div></main><Footer /></>;
}
