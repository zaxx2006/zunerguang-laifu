export const activityLinks = [["/retreats-workshops/", "线下活动总览"], ["/courses-workshops/", "课程与工作坊"], ["/retreats-workshops/#community-q22", "主题工作坊与公开讲座"], ["/retreats-workshops/#community-q24", "沉浸式疗愈支持营"], ["/retreats-workshops/#community-q26", "封闭式成长小组"]] as const;

export type FooterColumn = { title: string; links: readonly (readonly [string, string])[] };

export const homeFooterColumns: readonly FooterColumn[] = [
  { title: "探索", links: [["/", "首页"], ["/about/", "关于焕屿"], ["/services/", "服务总览"], ["/book-consultation/", "预约咨询"]] },
  { title: "核心基础服务", links: [["/services/divorce-coaching/", "离婚陪伴辅导"], ["/services/mediation-preparation/", "谈判与调解辅导"], ["/services/co-parenting/", "孩子养育支持辅导"], ["/services/post-divorce-recovery/", "离婚后疗愈与重生"], ["/services/remarriage-preparation/", "再婚女性婚前协议与财务边界培训"]] },
  { title: "专项场景服务", links: [["/services/high-conflict-divorce/", "高冲突婚姻专项辅导"], ["/services/nuptial-agreements/", "复杂资产专项方案"]] },
  { title: "高阶全案服务", links: [["/collaborative-law/", "家事协同支持"]] },
  { title: "线下活动", links: activityLinks },
  { title: "学习与专业成长", links: [["/blog/", "文章专栏"], ["/resources/", "资源中心"], ["/media/", "媒体动态"], ["/faq/", "常见问题"], ["/academy/", "焕屿学院"]] },
];
