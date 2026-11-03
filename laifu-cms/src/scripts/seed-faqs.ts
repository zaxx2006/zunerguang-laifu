import config from "@payload-config";
import { getPayload } from "payload";

const faqs = [
  { question: "你们和心理咨询师有什么区别？", lead: "在情绪支持之外，一起梳理眼前的现实问题。", answer: "焕屿更关注婚姻危机与离婚过程中的现实困境和全程支持。在稳定情绪的基础上，陪你梳理局势、厘清诉求、建立边界、拆解步骤与制定行动计划，并按需联动跨领域专家，帮助你恢复判断力、行动力和生活掌控感。", contexts: [{ label: "情绪支持", copy: "陪你稳定状态，减少情绪消耗，为思考与决定留出空间。" }, { label: "现实问题", copy: "梳理局势、厘清诉求，建立边界，把需要处理的事拆成行动步骤。" }, { label: "专业协同", copy: "按需联动心理、亲子、财税及法律领域专家，各专业角色独立履职。" }], followups: [{ question: "我还没决定离婚，可以咨询吗？", answer: "可以从梳理当前处境、顾虑和优先目标开始。选择与节奏由你自己掌握。" }, { question: "可以替代心理治疗吗？", answer: "焕屿提供婚姻困境辅导与现实问题支持，不替代心理治疗或医疗服务。" }] },
  { question: "你们和律师有什么不一样？", lead: "焕屿陪你理清全局，持证律师负责法律专业事务。", answer: "焕屿不提供法律意见、不代理案件、不出具法律文书。我们帮助你在见律师前梳理关键事实、核心诉求、材料清单和沟通重点；已经委托律师，也可以获得稳定状态、整理信息和跟进节奏的支持。", contexts: [{ label: "咨询律师前", copy: "先梳理关键事实、核心诉求、材料清单与沟通重点，让专业咨询更有方向。" }, { label: "已委托律师", copy: "在法律工作之外，继续获得稳定状态、整理信息和跟进节奏的支持。" }], followups: [{ question: "你们能帮我准备哪些材料？", answer: "辅导师可以陪你规整现有资料、梳理关键事件与待确认的问题。具体法律判断由持证律师完成。" }, { question: "你们会代写协议或代理案件吗？", answer: "不会。法律判断、协议拟定与诉讼等事项由持证律师依法独立完成。" }] },
  { question: "服务是线上还是线下？", lead: "线上与线下结合，按自己的需求和节奏选择。", answer: "焕屿提供线上与线下结合的支持。一对一辅导、课程、自测工具与资料包可通过线上获得；主题工作坊、小组辅导等线下活动会提前公布场次、地点与名额。", contexts: [{ label: "线上支持", copy: "一对一辅导、课程、自测工具与资料包等可通过线上获得。", hasAction: true, action: { label: "了解线上服务", href: "/services/", openInNewTab: true } }, { label: "线下活动", copy: "主题工作坊、沉浸式疗愈支持及小组辅导等，以活动安排为准。", hasAction: true, action: { label: "查看线下活动", href: "/retreats-workshops/", openInNewTab: true } }], followups: [{ question: "线下活动在哪里举行？", answer: "具体场次、地点与名额根据活动安排提前公布。" }, { question: "可以先从轻量资源开始吗？", answer: "可以先使用自测工具，或了解指南手册和公开课程。" }] },
  { question: "服务会严格保密吗？", lead: "保密贯穿支持过程，跨专业协同先取得你的授权。", answer: "个人信息、婚姻情况、沟通与辅导记录及相关材料按保密规范管理。需要跨专业协同时，先取得你的明确授权，并按最小必要原则共享完成该项服务所需的信息。", contexts: [{ label: "初次联系", copy: "个人信息与婚姻情况按保密规范管理。" }, { label: "辅导过程", copy: "沟通、辅导记录及相关材料按保密规范管理。" }, { label: "跨专业协同", copy: "先取得你的明确授权，按最小必要原则共享信息。" }], followups: [{ question: "需要协同时，会共享我的全部资料吗？", answer: "不会。只按最小必要原则共享，并先取得你的明确授权。" }, { question: "不同专业人员如何分工？", answer: "各专业角色独立履职，不混同执业、不越界服务。" }] },
  { question: "服务费用大概多少？", lead: "先了解需求，再说明服务建议与报价。", answer: "焕屿采用分层服务、清晰报价、自愿选择的方式。费用根据服务形式、时长、周期、专业人员配置与交付内容确定，在正式选择前说明。", contexts: [{ label: "报价依据", copy: "费用根据服务形式、时长、周期、专业人员配置与交付内容确定。" }, { label: "选择之前", copy: "初始评估先了解你的阶段、需求和优先目标，再提供服务建议与报价。" }], followups: [{ question: "哪些因素会影响报价？", answer: "服务形式、单次时长、陪伴周期、专业人员配置和交付内容都会影响费用。" }, { question: "还没准备好咨询，有其他入口吗？", answer: "可以从指南手册、自测工具和公开课程等轻量资源开始。" }] },
];

const payload = await getPayload({ config });
for (const faq of faqs) {
  const existing = await payload.find({ collection: "faqs", limit: 1, overrideAccess: true, pagination: false, where: { question: { equals: faq.question } } });
  if (!existing.docs.length) await payload.create({ collection: "faqs", overrideAccess: true, context: { skipSystemEvents: true }, data: { ...faq, _status: "published" } });
}
payload.logger.info("Laifu FAQ seed completed");
process.exit(0);
