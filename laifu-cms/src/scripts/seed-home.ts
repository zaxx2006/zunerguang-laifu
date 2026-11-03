import path from "node:path";
import { fileURLToPath } from "node:url";
import config from "@payload-config";
import { getPayload } from "payload";
import type { HomePresentation } from "@/payload-types";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const action = (label: string, href: string, openInNewTab = false) => ({ label, href, openInNewTab });
const lines = (...values: string[]) => values.map(value => ({ value }));
const payload = await getPayload({ config });

async function ensureMedia(filename: string, alt: string) {
  const existing = await payload.find({ collection: "media", limit: 1, overrideAccess: true, pagination: false, where: { filename: { equals: filename } } });
  if (existing.docs[0]) return existing.docs[0].id;
  const document = await payload.create({ collection: "media", overrideAccess: true, data: { alt, sourceLabel: "Laifu 官网现有视觉资产", rightsConfirmed: true, publicApproved: true }, filePath: path.resolve(dirname, "../../seed-assets", filename) });
  return document.id;
}

const [hero, conversation, forest, books, sunset, room] = await Promise.all([
  ensureMedia("hero-walk.webp", "一位女性在阳光洒落的树荫下向前行走"),
  ensureMedia("divorce-coaching-conversation.webp", "两人在自然光下围桌交流，记录并梳理资料"),
  ensureMedia("recovery-forest-path.webp", "一位女性沿着林间步道向前行走"),
  ensureMedia("courses-books-meeting-space.webp", "明亮的学习空间里摆放着课程书籍"),
  ensureMedia("co-parenting-family-sunset.webp", "人们在开阔的海边共同散步"),
  ensureMedia("mediation-room.webp", "自然光照进可供培训与交流的会议空间"),
]);
const faqResult = await payload.find({ collection: "faqs", depth: 0, limit: 5, overrideAccess: true, pagination: false, sort: "createdAt", where: { _status: { equals: "published" } } });
if (faqResult.docs.length !== 5) throw new Error("Run seed:faqs before seed:home");

const data: Omit<HomePresentation, "createdAt" | "deletedAt" | "id" | "updatedAt"> = {
  internalTitle: "焕屿官网首页", key: "home",
  seo: { title: "焕屿困境辅导｜离婚陪伴辅导｜高冲突离婚应对｜律师协同支持", description: "焕屿困境辅导是专注离婚全周期陪伴辅导的专业平台，帮助你走出婚姻困局，重掌生活主动权。", shareImage: hero },
  hero: { titleLines: lines("当你站在婚姻的十字路口", "焕屿帮你找到通往幸福的路"), introLines: lines("焕屿是专注婚姻全周期困境帮扶与辅导的专业平台。", "陪你走出情绪低谷、理清混乱局势，按需联动家事律师及心理、亲子、财税专家。"), image: hero, searchPlaceholder: "我还没决定要不要离婚，可以先聊聊吗？", primaryAction: action("预约咨询", "/book-consultation/", true), secondaryAction: action("了解服务体系", "#services"), journeyLinkLabel: "从稳住自己，到看清下一步", journeySummary: "分居过渡 · 离婚推进 · 离婚后重建" },
  journey: { openingTitle: "婚姻的变局，常像一团乱麻。", openingBodyLines: lines("情绪、孩子、财产、法律流程与未来生活。", "当这些问题同时涌来，你不必独自承担所有压力。"), stages: [
    { key: "stabilize", stepLabel: "01 / 稳状态，破内耗", titleLines: lines("先稳住自己，", "再面对重要的决定。"), descriptionLines: lines("想修复、暂缓决定，还是准备分开？", "我们先陪你平复情绪、缓解内耗，恢复思考与判断的能力。"), documentLabel: "", documentItems: [] },
    { key: "clarify", stepLabel: "02 / 清全局，辨利弊", titleLines: lines("看清局势，", "也看清自己的需要。"), descriptionLines: lines("一起梳理婚姻问题、现实压力与核心诉求，", "分清真实风险和情绪放大的焦虑。"), documentLabel: "", documentItems: [{ marker: "01", text: "关键事实、冲突来源与现实压力", note: "看清局势" }, { marker: "02", text: "想守护的权益、底线与未来期许", note: "明确诉求" }, { marker: "03", text: "真实风险与需要优先处理的问题", note: "分清轻重" }] },
    { key: "decide", stepLabel: "03 / 定决策，稳落地", titleLines: lines("看清可行的路，", "找到适合你的选择。"), descriptionLines: lines("评估不同路径的利弊与风险，明确沟通边界，", "为谈判、共同养育和律师咨询做好准备。"), documentLabel: "", documentItems: [] },
    { key: "action", stepLabel: "04 / 拆解步骤，有序推进", titleLines: lines("支持不止于理解，", "也要落实到生活里。"), descriptionLines: lines("从情绪支持到现实行动，", "陪你整理材料、筹备沟通，按需衔接跨专业资源。"), documentLabel: "阶段行动计划示意", documentItems: [{ marker: "先", text: "梳理事实、核心诉求与材料清单", note: "准备" }, { marker: "再", text: "筹备沟通、养育安排与专业咨询", note: "推进" }, { marker: "然后", text: "复盘进展，调整计划与生活安排", note: "跟进" }] },
    { key: "followup", stepLabel: "05 / 稳妥推进，降低损耗", titleLines: lines("决定由你来做，", "这段路有人陪你走。"), descriptionLines: lines("从分居过渡、离婚推进到离婚后重建，", "尊重你的选择与节奏，陪你找回生活的主动权。"), documentLabel: "", documentItems: [] },
  ], caption: "焕屿 · 陪你慢慢理清" },
  services: { titleLines: lines("从你当下的需要出发，", "找到适合的支持入口"), items: [
    { key: "coaching", titleLines: lines("离婚陪伴辅导"), description: "一对一稳定状态、梳理局势与核心诉求，把复杂困境拆成可以执行的步骤。", actionLabel: "了解陪伴辅导", href: "/services/divorce-coaching/", image: conversation },
    { key: "highConflict", titleLines: lines("高冲突婚姻", "专项支持"), description: "面对反复拉扯、情绪操控、亲子对立或财产阻碍，建立边界并降低风险。", actionLabel: "查看专项支持", href: "/services/high-conflict-divorce/", image: forest },
    { key: "courses", titleLines: lines("课程 工作坊", "与疗愈营"), description: "围绕离婚规划、沟通谈判、共同养育和自我重建，选择适合自己的学习与支持方式。", actionLabel: "查看课程与项目", href: "/courses-workshops/", image: books },
    { key: "community", titleLines: lines("线下活动", "与社群陪伴"), description: "查看近期讲座、主题工作坊、成长小组及沉浸式线下活动。", actionLabel: "查看近期活动", href: "/retreats-workshops/", image: sunset },
    { key: "academy", titleLines: lines("焕屿学院"), description: "面向家事律师、心理咨询师、财富顾问等从业者，提供专业培训与跨领域协作。", actionLabel: "进入焕屿学院", href: "/academy/", image: room },
  ], captionLeft: "稳住状态 · 看清全局 · 有序行动", captionRight: "焕屿 · 陪你慢慢理清" },
  assessment: { titleLines: lines("把交织的顾虑，", "一件一件，慢慢看清。"), descriptionLines: lines("用约 5–8 分钟，梳理此刻的准备状态与仍待确认的问题。", "完成后会生成一份可保存的结果，帮助你看清下一步需要什么支持。"), action: action("开始完整自测", "https://laifu-assessments.pages.dev/", true), note: "问卷体验 · 答案仅保留在本页，不计分、不提交，正式测评需重新作答。" },
  faqs: faqResult.docs.map(faq => faq.id), faqHeadingLines: lines("开始之前，", "你可能还想知道"), faqIndexAction: action("查看全部常见问题", "/faq/", true), faqContactAction: action("我还有具体情况想聊", "/book-consultation/", true),
  guides: { titleLines: lines("从一份免费指南，", "开始了解眼前的问题。"), description: "如果暂时还不想咨询，也可以先看看与你处境相关的指南主题。把复杂的问题分开理解，再决定下一步。", items: [
    { eyebrow: "自助指南 / 分居与准备", titleLines: lines("分手与离婚初期", "生存指南"), subtitleLines: lines("先照顾好当下的自己，", "再慢慢找回生活的节奏。"), image: forest, meta: "情绪稳定 · 生活照料", href: "/resources/#resources-q09" },
    { eyebrow: "自助指南 / 高冲突应对", titleLines: lines("高冲突离婚", "第一反应清单"), subtitleLines: lines("先稳住状态，建立边界，", "为自己争取思考的空间。"), image: conversation, meta: "识别冲突 · 沟通边界", href: "/resources/#resources-q10" },
    { eyebrow: "自助指南 / 法律准备", titleLines: lines("进入律师或调解程序前", "的‘做与不做’"), subtitleLines: lines("梳理事实、材料与问题，", "让专业沟通更有方向。"), image: room, meta: "咨询准备 · 常见误区", href: "/resources/#resources-q11" },
  ], statusNote: "本页内容为试读示意，非正式指南原文。正式内容与获取方式以资源中心发布为准。", indexAction: action("前往资源中心", "/resources/") },
  invitation: { title: "不需要做好万全准备再选择我们", descriptionLines: lines("大多数人来到焕屿时，都未曾做好万全准备。你不必强迫自己先理清所有问题。", "从一次咨询、一份免费资源、一节课程或一次状态自测开始，找到适合自己的下一步。"), actions: [action("预约咨询", "/book-consultation/"), action("开始自测", "#assessment"), action("了解全部服务", "/services/")], assessmentNote: "约 5–8 分钟自我梳理：了解准备状态与支持需要。" },
  _status: "published" as const,
};
const existing = await payload.find({ collection: "home-presentations", limit: 1, overrideAccess: true, pagination: false, where: { key: { equals: "home" } } });
if (!existing.docs.length) await payload.create({ collection: "home-presentations", overrideAccess: true, context: { skipSystemEvents: true }, data });
payload.logger.info("Laifu homepage seed completed");
process.exit(0);
