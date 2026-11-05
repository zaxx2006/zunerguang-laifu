import config from "@payload-config";
import { getPayload } from "payload";

const action = (label: string, href: string, openInNewTab = false) => ({ label, href, openInNewTab });
const data = {
  internalTitle: "焕屿主导航与页脚", key: "primary", homeHref: "#home",
  primaryLinks: [action("关于焕屿", "/about/"), action("资源中心", "/resources/"), action("文章专栏", "/blog/"), action("常见问题", "/faq/"), action("媒体动态", "/media/"), action("焕屿学院", "/academy/")],
  assessmentAction: action("开始测评", "https://laifu-assessments.pages.dev/", true),
  footerColumns: [
    { title: "探索", links: [action("首页", "/"), action("关于焕屿", "/about/"), action("服务总览", "/services/"), action("预约咨询", "/book-consultation/")] },
    { title: "核心基础服务", links: [action("离婚陪伴辅导", "/services/divorce-coaching/"), action("谈判与调解辅导", "/services/mediation-preparation/"), action("孩子养育支持辅导", "/services/co-parenting/"), action("离婚后疗愈与重生", "/services/post-divorce-recovery/"), action("再婚准备", "/services/remarriage-preparation/")] },
    { title: "专项场景服务", links: [action("高冲突婚姻专项辅导", "/services/high-conflict-divorce/"), action("复杂资产专项方案", "/services/nuptial-agreements/")] },
    { title: "高阶全案服务", links: [action("家事协同支持", "/collaborative-law/")] },
    { title: "线下活动", links: [action("课程与工作坊", "/courses-workshops/"), action("线下活动", "/retreats-workshops/")] },
    { title: "学习与专业成长", links: [action("文章专栏", "/blog/"), action("资源中心", "/resources/"), action("媒体动态", "/media/"), action("常见问题", "/faq/"), action("焕屿学院", "/academy/")] },
  ],
  footerStatement: "焕屿专注离婚全周期陪伴辅导，协同合作律师及其他领域专家，陪你平稳度过人生转折，重掌生活主动权。",
  footerDisclaimer: "本网站内容不构成法律意见、心理治疗或医疗建议。", copyright: "焕屿 · HUANYU © 2026", _status: "published" as const,
};
const payload = await getPayload({ config });
const existing = await payload.find({ collection: "navigation", limit: 1, overrideAccess: true, pagination: false, where: { key: { equals: "primary" } } });
if (!existing.docs.length) await payload.create({ collection: "navigation", overrideAccess: true, context: { skipSystemEvents: true }, data });
payload.logger.info("Laifu navigation seed completed");
process.exit(0);
