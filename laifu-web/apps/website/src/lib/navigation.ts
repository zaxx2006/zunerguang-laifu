export const serviceLinks = [
  ["/services/divorce-coaching/", "离婚陪伴辅导"],
  ["/services/co-parenting/", "孩子养育支持辅导"],
  ["/services/mediation-preparation/", "谈判与调解辅导"],
  ["/services/post-divorce-recovery/", "离婚后疗愈重生"],
  ["/collaborative-law/", "跨专业协同综合辅导"],
  ["/services/high-conflict-divorce/", "高冲突婚姻专项辅导"],
  ["/services/nuptial-agreements/", "复杂资产专项方案"],
] as const;

export const serviceGroups = [
  { title: "个人与家庭支持", links: [["/services/divorce-coaching/", "离婚陪伴辅导"], ["/services/co-parenting/", "孩子养育支持辅导"], ["/services/mediation-preparation/", "谈判与调解辅导"], ["/services/post-divorce-recovery/", "离婚后疗愈与重生"], ["/collaborative-law/", "跨专业协同综合辅导"]] },
  { title: "专项场景服务", links: [["/services/high-conflict-divorce/", "高冲突婚姻专项辅导"], ["/services/nuptial-agreements/", "复杂资产专项方案"], ["/services/remarriage-preparation/", "再婚婚前协议与财务边界培训"]] },
  { title: "学习与成长", links: [["/academy/", "焕屿学院"]] },
] as const;

export { activityLinks } from "../../../../shared/site-navigation";

export const primaryLinks = [["/resources/", "资源中心"], ["/retreats-workshops/", "线下活动"]] as const;
