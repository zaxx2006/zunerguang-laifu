import { SiteLink } from "@/components/site/SiteLink";
import { activityLinks } from "@/lib/navigation";

const columns = [
  { title: "探索", links: [["/", "首页"], ["/about/", "关于焕屿"], ["/services/", "服务总览"], ["/book-consultation/", "预约咨询"]] },
  { title: "核心基础服务", links: [["/services/divorce-coaching/", "离婚陪伴辅导"], ["/services/mediation-preparation/", "谈判与调解辅导"], ["/services/co-parenting/", "孩子养育支持辅导"], ["/services/post-divorce-recovery/", "离婚后疗愈与重生"], ["/services/remarriage-preparation/", "再婚女性婚前协议与财务边界培训"]] },
  { title: "专项场景服务", links: [["/services/high-conflict-divorce/", "高冲突婚姻专项辅导"], ["/services/nuptial-agreements/", "高净值婚姻专项辅导"]] },
  { title: "高阶全案服务", links: [["/collaborative-law/", "家事协同支持"]] },
  { title: "线下活动", links: activityLinks },
  { title: "学习与专业成长", links: [["/blog/", "文章专栏"], ["/resources/", "资源中心"], ["/media/", "媒体动态"], ["/faq/", "常见问题"], ["/academy/", "焕屿学院"]] },
] as const;

export function Footer() {
  return <footer className="site-footer" id="site-footer"><div className="container"><nav aria-label="页脚导航" className="footer-grid" data-grid="12">{columns.map((column) => <div className="footer-column" key={column.title}><h2>{column.title}</h2><div>{column.links.map(([href, label], index) => <SiteLink href={href} key={`${href}-${index}`}>{label}</SiteLink>)}</div></div>)}</nav><div className="footer-brand" data-grid="12"><div className="footer-brand__identity"><SiteLink aria-label="焕屿首页" className="brand" href="/"><span className="brand__mark"><img alt="" decoding="async" height="48" loading="lazy" src="/brand/Logo-light.svg" width="48" /></span><span>焕屿<small>困境辅导 · HUANYU</small></span></SiteLink><span className="footer-copyright">焕屿 · HUANYU © {new Date().getFullYear()}</span></div><div className="footer-brand__statement"><p>焕屿专注离婚全周期陪伴辅导，协同合作律师及其他领域专家，陪你平稳度过人生转折，重掌生活主动权。</p><span className="footer-disclaimer">本网站内容不构成法律意见、心理治疗或医疗建议。</span></div></div></div></footer>;
}
