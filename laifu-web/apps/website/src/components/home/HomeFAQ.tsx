"use client";

import { SiteLink } from "@/components/site/SiteLink";

import { useState, type KeyboardEvent } from "react";
import { HomeIcon } from "./HomePrimitives";
import type { CmsAction, HomePresentation } from "@/contracts/cms-home";

type FAQContext = readonly [label: string, copy: string, linkLabel?: string, href?: string];
type FAQItem = {
  question: string;
  answer: string;
  lead: string;
  contexts: readonly FAQContext[];
  followups: readonly (readonly [question: string, answer: string])[];
};

const faqItems: readonly FAQItem[] = [
  {
    question: "你们和心理咨询师有什么区别？",
    answer: "焕屿更关注婚姻危机与离婚过程中的现实困境和全程支持。在稳定情绪的基础上，陪你梳理局势、厘清诉求、建立边界、拆解步骤与制定行动计划，并按需联动跨领域专家，帮助你恢复判断力、行动力和生活掌控感。",
    lead: "在情绪支持之外，一起梳理眼前的现实问题。",
    contexts: [["情绪支持", "陪你稳定状态，减少情绪消耗，为思考与决定留出空间。"], ["现实问题", "梳理局势、厘清诉求，建立边界，把需要处理的事拆成行动步骤。"], ["专业协同", "按需联动心理、亲子、财税及法律领域专家，各专业角色独立履职。"]],
    followups: [["我还没决定离婚，可以咨询吗？", "可以从梳理当前处境、顾虑和优先目标开始。辅导帮助你恢复判断力，选择与节奏由你自己掌握。"], ["可以替代心理治疗吗？", "焕屿提供婚姻困境辅导与现实问题支持，不替代心理治疗或医疗服务。需要相关专业支持时，可按需衔接。"]],
  },
  {
    question: "你们和律师有什么不一样？",
    answer: "焕屿不提供法律意见、不代理案件、不出具法律文书，相关法律专业工作由持证律师依法独立完成。我们帮助你在见律师前梳理关键事实、核心诉求、材料清单和沟通重点；已经委托律师，也可以获得稳定状态、整理信息和跟进节奏的支持。",
    lead: "焕屿陪你理清全局，持证律师负责法律专业事务。",
    contexts: [["咨询律师前", "先梳理关键事实、核心诉求、材料清单与沟通重点，让专业咨询更有方向。"], ["已委托律师", "在法律工作之外，继续获得稳定状态、整理信息和跟进节奏的支持。"]],
    followups: [["你们能帮我准备哪些材料？", "辅导师可以陪你规整现有资料、梳理关键事件与待确认的问题。具体需要哪些法律材料、证据是否有效，由持证律师判断。"], ["你们会代写协议或代理案件吗？", "焕屿不代理案件、不出具法律文书，也不提供法律意见。法律判断、协议拟定与诉讼等事项由持证律师依法独立完成。"], ["我还没决定离婚，可以先聊吗？", "可以先围绕自己的处境、诉求与顾虑进行梳理，不必在初次咨询前做出最终决定。"]],
  },
  {
    question: "服务是线上还是线下？",
    answer: "焕屿提供线上与线下结合的支持。一对一辅导、咨询、课程、自测工具与资料包等可通过线上获得；主题工作坊、沉浸式疗愈支持、小组辅导等线下活动，具体场次、地点与名额根据活动安排提前公布。",
    lead: "线上与线下结合，按自己的需求和节奏选择。",
    contexts: [["线上支持", "一对一辅导、咨询、课程、自测工具与资料包等可通过线上获得。", "了解线上服务", "/services/"], ["线下活动", "主题工作坊、沉浸式疗愈支持及小组辅导等，具体场次、地点与名额以活动安排为准。", "查看线下活动", "/retreats-workshops/"]],
    followups: [["线下活动在哪里举行？", "具体场次、地点与名额根据活动安排提前公布，可前往线下活动页面查看发布的信息。"], ["可以先从轻量资源开始吗？", "可以先使用自测工具，或了解指南手册和公开课程，再按自己的节奏决定是否预约咨询。"]],
  },
  {
    question: "服务会严格保密吗？",
    answer: "保密是焕屿服务的基本底线。个人信息、婚姻情况、沟通与辅导记录及相关材料，按保密规范管理。需要跨专业协同时，先取得你的明确授权，并按最小必要原则共享完成该项服务所需的信息；各专业角色独立履职，不混同执业、不越界服务。",
    lead: "保密贯穿支持过程，跨专业协同先取得你的授权。",
    contexts: [["初次联系", "个人信息与婚姻情况按保密规范管理。"], ["辅导过程", "沟通、辅导记录及相关材料按保密规范管理。"], ["跨专业协同", "先取得你的明确授权，按最小必要原则共享完成该项服务所需的信息。"]],
    followups: [["需要协同时，会共享我的全部资料吗？", "按最小必要原则共享完成相应服务所需的信息，并先取得你的明确授权。"], ["不同专业人员如何分工？", "各专业角色独立履职，不混同执业、不越界服务。法律等专业事务由相应专业人员负责。"]],
  },
  {
    question: "服务费用大概多少？",
    answer: "焕屿采用分层服务、清晰报价、自愿选择的方式。费用根据服务形式、时长、周期、专业人员配置与交付内容确定，在正式选择前说明。初始评估会先了解你的阶段、需求和优先目标，再提供服务建议与报价；你也可以从指南手册、自测工具和公开课程等轻量资源开始。",
    lead: "先了解需求，再说明服务建议与报价。",
    contexts: [["报价依据", "费用根据服务形式、时长、周期、专业人员配置与交付内容确定。"], ["选择之前", "正式选择前说明费用。初始评估先了解你的阶段、需求和优先目标，再提供服务建议与报价。"]],
    followups: [["哪些因素会影响报价？", "服务形式、单次时长、陪伴周期、专业人员配置和实际交付内容都会影响费用。具体方案需结合你的需求确认。"], ["还没准备好咨询，有其他入口吗？", "你可以从指南手册、自测工具和公开课程等轻量资源开始，再决定下一步。"]],
  },
];

export function HomeFAQ({ items: suppliedItems, headingLines = ["开始之前，", "你可能还想知道"], indexAction = { label: "查看预约常见问题", href: "/book-consultation/#booking-faq", openInNewTab: true }, contactAction = { label: "我还有具体情况想聊", href: "/book-consultation/", openInNewTab: true } }: {
  items?: HomePresentation["faqs"];
  headingLines?: string[];
  indexAction?: CmsAction;
  contactAction?: CmsAction;
}) {
  const items = suppliedItems ?? faqItems.map((item, itemIndex) => ({ id: String(itemIndex), question: item.question, answer: item.answer, lead: item.lead, contexts: item.contexts.map(([label, copy, linkLabel, href]) => ({ label, copy, action: linkLabel && href ? { label: linkLabel, href, openInNewTab: true } : null })), followups: item.followups.map(([question, answer]) => ({ question, answer })) }));
  const [current, setCurrent] = useState(1);
  const [contexts, setContexts] = useState([0, 0, 0, 0, 0]);
  const [openFollowup, setOpenFollowup] = useState<number | null>(null);
  const [visited, setVisited] = useState(() => new Set<number>());
  const item = items[current];
  const contextIndex = contexts[current];
  const context = item.contexts[contextIndex];

  function showFAQ(index: number) {
    setCurrent(index);
    setOpenFollowup(null);
  }

  function handleTopicKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number | undefined;
    if (event.key === "ArrowDown") next = (index + 1) % items.length;
    if (event.key === "ArrowUp") next = (index + items.length - 1) % items.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = items.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    showFAQ(next);
    document.getElementById(`faq-topic-${next}`)?.focus();
  }

  function showNext() {
    const nextVisited = new Set(visited).add(current);
    const next = Array.from({ length: items.length }, (_, offset) => (current + offset + 1) % items.length)
      .find((index) => !nextVisited.has(index)) ?? (current + 1) % items.length;
    setVisited(nextVisited);
    showFAQ(next);
  }

  return <section className="faq-section" data-home-section="faq" aria-labelledby="faq-title"><div className="faq-inner">
    <div className="faq-heading"><h2 id="faq-title">{headingLines[0]}<br />{headingLines[1]}</h2><SiteLink className="band-link" href={indexAction.href} target={indexAction.openInNewTab ? "_blank" : undefined} rel={indexAction.openInNewTab ? "noopener" : undefined}>{indexAction.href === "/faq/" ? "查看预约常见问题" : indexAction.label}<HomeIcon name="arrow-up-right" /></SiteLink></div>
    <div className="faq-dialogue"><div className="faq-topics" role="tablist" aria-label="咨询前的问题" aria-orientation="vertical">
      <div className="faq-topic-highlight" aria-hidden="true" data-index={current} />
      {items.map((faq, index) => <button className="faq-topic" id={`faq-topic-${index}`} role="tab" aria-selected={current === index} aria-controls="faq-answer" tabIndex={current === index ? 0 : -1} type="button" key={faq.question} onClick={() => { setVisited(new Set(visited).add(current)); showFAQ(index); }} onKeyDown={(event) => handleTopicKey(event, index)}><span>{faq.question}</span></button>)}
    </div>
      <div className="faq-answer-panel" id="faq-answer" role="tabpanel" aria-labelledby={`faq-topic-${current}`}><div className="faq-answer-body" key={item.question}>
        <h3>{item.question}</h3><p className="faq-answer-lead">{item.lead}</p><p className="faq-answer-description">{item.answer}</p>
        <div className="faq-context-switch" role="tablist" aria-label="选择关注的情境" data-count={item.contexts.length} data-index={contextIndex}>
          {item.contexts.map(({ label }, index) => <button className="faq-context-button" id={`faq-context-${index}`} type="button" role="tab" aria-controls="faq-context-answer" aria-selected={contextIndex === index} tabIndex={contextIndex === index ? 0 : -1} key={label} onClick={() => setContexts(contexts.map((value, itemIndex) => itemIndex === current ? index : value))}>{label}</button>)}
        </div>
        <div className="faq-context-copy" id="faq-context-answer" role="tabpanel" aria-labelledby={`faq-context-${contextIndex}`}>{context.copy}{context.action ? <> <SiteLink href={context.action.href} target={context.action.openInNewTab ? "_blank" : undefined} rel={context.action.openInNewTab ? "noopener" : undefined}>{context.action.label}</SiteLink></> : null}</div>
        <div className="faq-followups">{item.followups.map(({ question, answer }, index) => { const open = openFollowup === index; return <div className="faq-followup" key={question}>
          <button type="button" aria-expanded={open} aria-controls={`faq-followup-${current}-${index}`} onClick={() => setOpenFollowup(open ? null : index)}><span>{question}</span><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h12M10 4v12" /></svg></button>
          <div className="faq-followup-answer" id={`faq-followup-${current}-${index}`} hidden={!open}>{answer}</div>
        </div>; })}</div>
      </div><div className="faq-actions"><button className="faq-next" type="button" onClick={showNext}><span>明白了，看下一个问题</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" /></svg></button><SiteLink className="band-link" href={contactAction.href} target={contactAction.openInNewTab ? "_blank" : undefined} rel={contactAction.openInNewTab ? "noopener" : undefined}>{contactAction.label}<HomeIcon name="arrow-up-right" /></SiteLink></div></div>
    </div>
  </div></section>;
}
