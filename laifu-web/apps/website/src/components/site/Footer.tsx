import { SiteLink } from "@/components/site/SiteLink";
import { homeFooterColumns, arrangeFooterColumns } from "@/components/home/home-content";

const columns = arrangeFooterColumns(homeFooterColumns);

export function Footer() {
  return <footer className="site-footer" id="site-footer"><div className="container"><nav aria-label="页脚导航" className="footer-grid" data-grid="12">{columns.map((column) => <div className="footer-column" key={column.title}><h2>{column.title}</h2><div>{column.links.map(([href, label], index) => <SiteLink href={href} key={`${href}-${index}`}>{label}</SiteLink>)}</div></div>)}</nav><div className="footer-brand" data-grid="12"><div className="footer-brand__identity"><SiteLink aria-label="焕屿首页" className="brand" href="/"><span className="brand__mark"><img alt="" decoding="async" height="48" loading="lazy" src="/brand/Logo-light.svg" width="48" /></span><span>焕屿<small>困境辅导 · HUANYU</small></span></SiteLink><span className="footer-copyright">焕屿 · HUANYU © {new Date().getFullYear()}</span></div><div className="footer-brand__statement"><p>焕屿以客户福祉为中心，致力于打造有温度、有边界、可落地的婚姻困境辅导体系。陪你平稳度过人生转折，重掌生活主动权。</p><span className="footer-disclaimer">本网站内容不构成法律意见、心理治疗或医疗建议。</span></div></div></div></footer>;
}
