import { Fragment } from "react";
import type { HomePresentation } from "@/contracts/cms-home";

const defaults: HomePresentation["journey"] = {
  openingTitle: "婚姻的变局，常像一团乱麻。",
  openingBodyLines: ["情绪、孩子、财产、法律流程与未来生活。", "当这些问题同时涌来，你不必独自承担所有压力。"],
  stages: [
    { key: "stabilize", stepLabel: "01 / 稳状态，破内耗", titleLines: ["先稳住自己，", "再面对重要的决定。"], descriptionLines: ["想修复、暂缓决定，还是准备分开？", "我们先陪你平复情绪、缓解内耗，恢复思考与判断的能力。"], documentLabel: "", documentItems: [] },
    { key: "clarify", stepLabel: "02 / 清全局，辨利弊", titleLines: ["看清局势，", "也看清自己的需要。"], descriptionLines: ["一起梳理婚姻问题、现实压力与核心诉求，", "分清真实风险和情绪放大的焦虑。"], documentLabel: "", documentItems: [{ marker: "01", text: "关键事实、冲突来源与现实压力", note: "看清局势" }, { marker: "02", text: "想守护的权益、底线与未来期许", note: "明确诉求" }, { marker: "03", text: "真实风险与需要优先处理的问题", note: "分清轻重" }] },
    { key: "decide", stepLabel: "03 / 定决策，稳落地", titleLines: ["看清可行的路，", "找到适合你的选择。"], descriptionLines: ["评估不同路径的利弊与风险，明确沟通边界，", "为谈判、共同养育和律师咨询做好准备。"], documentLabel: "", documentItems: [] },
    { key: "action", stepLabel: "04 / 拆解步骤，有序推进", titleLines: ["支持不止于理解，", "也要落实到生活里。"], descriptionLines: ["从情绪支持到现实行动，", "陪你整理材料、筹备沟通，按需衔接跨专业资源。"], documentLabel: "阶段行动计划示意", documentItems: [{ marker: "先", text: "梳理事实、核心诉求与材料清单", note: "准备" }, { marker: "再", text: "筹备沟通、养育安排与专业咨询", note: "推进" }, { marker: "然后", text: "复盘进展，调整计划与生活安排", note: "跟进" }] },
    { key: "followup", stepLabel: "05 / 稳妥推进，降低损耗", titleLines: ["决定由你来做，", "这段路有人陪你走。"], descriptionLines: ["从分居过渡、离婚推进到离婚后重建，", "尊重你的选择与节奏，陪你找回生活的主动权。"], documentLabel: "", documentItems: [] },
  ],
  caption: "焕屿 · 陪你慢慢理清",
};

const ranges = [[".10", ".30"], [".30", ".51"], [".51", ".69"], [".69", ".88"], [".88", "1.12"]] as const;

export function HomeJourney({ content = defaults }: { content?: HomePresentation["journey"] }) {
  return <main id="journey" className="journey"><div className="scene">
    <canvas id="yarn" aria-hidden="true" />
    <div className="opening"><h2>{content.openingTitle}</h2><p>{content.openingBodyLines.map((line, index) => <Fragment key={line}>{index ? <br /> : null}{line}</Fragment>)}</p></div>
    {content.stages.map((stage, index) => <div className={`copy${stage.documentItems.length ? " paper-copy" : ""}`} data-start={ranges[index]?.[0]} data-end={ranges[index]?.[1]} key={stage.key}>
      <span className="step">{stage.stepLabel}</span><h2>{stage.titleLines.map((line, lineIndex) => <Fragment key={line}>{lineIndex ? <br /> : null}<span className="line">{line}</span></Fragment>)}</h2>
      <p>{stage.descriptionLines.map((line, lineIndex) => <Fragment key={line}>{lineIndex ? <br /> : null}{line}</Fragment>)}</p>
      {stage.documentLabel ? <span className="document-label">{stage.documentLabel}</span> : null}
      {stage.documentItems.length ? <div className="document">{stage.documentItems.map(item => <div key={`${item.marker}-${item.text}`}><i>{item.marker}</i><span>{item.text}</span><small>{item.note}</small></div>)}</div> : null}
    </div>)}
    <span className="caption">{content.caption}</span><div className="meter"><span id="percentage">00</span><span className="track"><span className="fill" /></span><span>100</span></div>
  </div></main>;
}
