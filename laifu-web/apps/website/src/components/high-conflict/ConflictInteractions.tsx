"use client";
import { SiteLink } from "@/components/site/SiteLink";

import { useEffect, useId, useState, type KeyboardEvent, type ReactNode } from "react";
import type { HighConflictPresentation as Content } from "@/contracts/cms-high-conflict";

function tabKey(event: KeyboardEvent<HTMLButtonElement>, index: number, count: number, select: (index: number) => void) {
  const target = event.key === "ArrowRight" || event.key === "ArrowDown" ? (index + 1) % count : event.key === "ArrowLeft" || event.key === "ArrowUp" ? (index + count - 1) % count : event.key === "Home" ? 0 : event.key === "End" ? count - 1 : null;
  if (target === null) return;
  event.preventDefault();
  select(target);
  event.currentTarget.closest('[role="tablist"]')?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[target]?.focus();
}

function ViewTabs({ labels, active, onChange, children, label }: { labels: string[]; active: number; onChange: (index: number) => void; children: ReactNode; label: string }) {
  const id = useId();
  return <><div className="hc-view-tabs" role="tablist" aria-label={label}>{labels.map((text, index) => <button type="button" role="tab" id={`${id}-tab-${index}`} aria-controls={`${id}-panel`} aria-selected={active === index} tabIndex={active === index ? 0 : -1} key={text} onClick={() => onChange(index)} onKeyDown={event => tabKey(event, index, labels.length, onChange)}>{text}</button>)}</div><div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${active}`} className="hc-view-content">{children}</div></>;
}

const eventStages = ["原有约定", "发生变更", "说明与回应", "后续安排"];
const eventTracks = [
  { title: "围绕具体事项的分歧", intro: "有不同意见，仍能围绕同一件事核实和协商。", events: ["确认学校接送", "提出时间调整", "核实双方条件", "确认新的安排"], details: ["双方文字确认：周五 17:00，在学校接孩子。", "一方因工作变化提出调整时间，同时说明原因。", "另一方说明自己的工作限制，双方讨论可执行的替代安排。", "时间、地点和负责的成年人重新确认，分歧没有继续扩展。"], impact: ["讨论有具体事项和共同参照。", "变化被清楚表达，原有约定仍可核对。", "可以表达不同意见，也可以提出实际限制。", "争议回到明确安排，孩子与工作计划能够衔接。"] },
  { title: "反复变更与持续施压", intro: "需要了解事件是否反复发生，以及对生活的实际影响。", events: ["确认学校接送", "临时改变地点", "否认已有约定", "争议继续扩展"], details: ["双方同样文字确认了周五的接送时间与地点。", "接送当天临时要求改变地点，却没有确认替代安排。", "讨论变成否认之前的文字约定，并反复指责对方不配合。", "接送未能按计划完成，争执又扩展到旧事与学校联系。"], impact: ["起点可以相同，需要结合后续过程理解。", "需要分别记录原有安排、临时变化与具体时间。", "需要把可核对的事实，与指责和个人感受分开。", "关注孩子等待、工作受影响及同类事件的重复情况。"] },
];

export function EventComparison() {
  const [active, setActive] = useState(0);
  return <div className="hc-event-example"><div className="hc-example-heading"><span>情境示意 · 一次接送安排的变化</span><span>点击节点，查看事件前后</span></div><ViewTabs labels={eventStages} active={active} onChange={setActive} label="查看事件阶段"><div className="hc-event-tracks">{eventTracks.map((track, lane) => <article className={`hc-event-track hc-event-track-${lane}`} key={track.title}><h3>{track.title}</h3><p className="hc-note">{track.intro}</p><ol className="hc-event-path">{track.events.map((text, index) => <li key={text} data-active={active === index} data-past={index < active}><span aria-hidden="true">{index + 1}</span>{text}</li>)}</ol><div className="hc-event-detail"><h4>{eventStages[active]}</h4><p>{track.details[active]}</p><p className="hc-event-impact">{track.impact[active]}</p></div></article>)}</div></ViewTabs><div className="hc-event-footer"><p>虚构情境用于说明差异。单个事件不能判断关系全貌，识别互动模式也不意味着双方承担相同责任。</p><button type="button" onClick={() => setActive((active + 1) % eventStages.length)}>{active === 3 ? "重新查看经过" : "查看下一步"}<span aria-hidden="true">→</span></button></div></div>;
}

type Direction = Content["support"]["directions"][number];

function PatternDemo({ direction }: { direction: Direction }) {
  const [active, setActive] = useState(0);
  return <ViewTabs labels={direction.toolRows.map(row => row.label)} active={active} onChange={setActive} label="查看行为与影响"><div className="hc-pattern-sheet"><span className="hc-document-label">事件记录</span><h4>{direction.toolRows[active].label}</h4><p>{direction.toolRows[active].text}</p><dl><dt>核对线索</dt><dd>{["文字确认的时间、地点与双方安排。", "变更发生的时间、内容与是否得到确认。", "孩子与生活安排受到的具体影响。"][active]}</dd></dl></div></ViewTabs>;
}

function PreparationDemo({ direction }: { direction: Direction }) {
  return <div className="hc-preparation-demo"><span className="hc-document-label">准备范围示意</span><p>把不同事项分开，逐项了解。</p>{direction.toolRows.map((row, index) => <details key={row.label} open={index === 0}><summary><span>{row.label}</span><span className="hc-disclosure-icon" aria-hidden="true" /></summary><p>{row.text}</p></details>)}</div>;
}

function RecordsDemo({ direction }: { direction: Direction }) {
  const [active, setActive] = useState(0);
  return <ViewTabs labels={direction.toolRows.map(row => row.label)} active={active} onChange={setActive} label="查看材料整理方式"><div className={`hc-record-sheet hc-record-sheet-${active}`}><span className="hc-document-label">接送安排 · 材料整理示意</span>{active === 0 ? <div className="hc-record-fragments"><p>周一的确认消息</p><p>周五的变更截图</p><p>学校通知</p><p>个人回忆与待核实信息</p><div>{direction.toolRows[0].text}</div></div> : active === 1 ? <ol className="hc-document-timeline">{direction.toolRows[1].text.split("。").filter(Boolean).map(text => <li key={text}>{text}</li>)}</ol> : <><h4>关于周五接送变更的事实摘要</h4><p>{direction.toolRows[2].text}</p><dl><dt>来源关联</dt><dd>原始文字记录、学校通知</dd><dt>仍待确认</dt><dd>变更原因、后续交接安排</dd></dl></>}<p className="hc-sheet-foot">保留原始记录，区分已确认与待核实信息。</p></div></ViewTabs>;
}

function ExpressionDemo({ direction }: { direction: Direction }) {
  const [active, setActive] = useState(1);
  const [focus, setFocus] = useState(0);
  return <ViewTabs labels={["原始叙述", "结构化表达"]} active={active} onChange={setActive} label="查看表达整理"><div className="hc-expression-sheet">{active === 0 ? <><span className="hc-document-label">未经整理的表达 · 虚构示意</span><blockquote>每次都这样，明明已经说好了，又说没有这回事。我解释了很久，最后什么也没解决，孩子还在等，我也没办法工作。</blockquote><p className="hc-note">感受值得被理解；专业沟通还需要具体的事件、影响和待确认事项。</p></> : <><span className="hc-document-label">点击段落，查看整理重点</span>{direction.toolRows.map((row, index) => <button type="button" className="hc-expression-row" aria-pressed={focus === index} key={row.label} onClick={() => setFocus(index)}><strong>{row.label}</strong><span>{row.text}</span></button>)}<p className="hc-annotation" role="status">{["用时间、约定和记录说明发生了什么。", "说明可以具体描述的影响，避免推断对方动机。", "让这次沟通回到需要确认的具体安排。"][focus]}</p></>}</div></ViewTabs>;
}

function CommunicationDemo({ direction }: { direction: Direction }) {
  const [active, setActive] = useState(0);
  const [reply, setReply] = useState(false);
  return <div className="hc-communication-demo"><span className="hc-document-label">一条消息里的不同内容 · 虚构示意</span><div className="hc-message-parts">{direction.toolRows.slice(0, 2).map((row, index) => <button type="button" aria-pressed={active === index} key={row.label} onClick={() => setActive(index)}>{row.text}</button>)}</div><div className="hc-message-explanation" role="status"><strong>{direction.toolRows[active].label}</strong><p>{active === 0 ? "这是需要核实的接送事项：时间是否可行，地点是否一致。" : "指责与旧争议需要和这次接送安排分开理解，避免混在一次回应里。"}</p></div><button type="button" className="hc-reveal-button" aria-expanded={reply} aria-controls="communication-reply" onClick={() => setReply(!reply)}>{reply ? "收起沟通目标" : "查看怎样聚焦这次沟通"}<span aria-hidden="true">{reply ? "−" : "+"}</span></button><div id="communication-reply" className="hc-response-example" hidden={!reply}><strong>本次沟通目标</strong><p>{direction.toolRows[2].text}</p></div></div>;
}

function ParentingDemo({ direction }: { direction: Direction }) {
  const [active, setActive] = useState(0);
  return <ViewTabs labels={direction.toolRows.map(row => row.label)} active={active} onChange={setActive} label="查看养育安排"><div className="hc-parenting-sheet"><span className="hc-document-label">成年人之间的安排示意</span><div className="hc-schedule"><div><span>事项</span><strong>{direction.toolRows[active].label}</strong></div><div><span>确认</span><strong>由负责的成年人直接联系</strong></div><div><span>变化</span><strong>明确更新，避免让孩子传话</strong></div></div><p>{direction.toolRows[active].text}</p></div></ViewTabs>;
}

function StabilityDemo({ direction }: { direction: Direction }) {
  const [active, setActive] = useState(0);
  return <ViewTabs labels={direction.toolRows.map(row => row.label)} active={active} onChange={setActive} label="查看决策梳理"><div className="hc-stability-sheet"><span className="hc-document-label">把同一件事的不同层面分开</span><div className="hc-paper-lines"><h4>{direction.toolRows[active].label}</h4><p>{direction.toolRows[active].text}</p></div><p className="hc-note">先理解现状，再结合自己的需要与现实条件讨论选择。</p></div></ViewTabs>;
}

const demos: Record<string, (props: { direction: Direction }) => ReactNode> = { pattern: PatternDemo, preparation: PreparationDemo, records: RecordsDemo, expression: ExpressionDemo, communication: CommunicationDemo, parenting: ParentingDemo, stability: StabilityDemo };

export function ServiceExplorer({ content }: { content: Content["support"] }) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    function followHash() {
      const index = content.directions.findIndex(direction => `#service-${direction.key}` === window.location.hash);
      if (index < 0) return;
      setActive(index);
      requestAnimationFrame(() => document.getElementById("support")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" }));
    }
    followHash();
    window.addEventListener("hashchange", followHash);
    return () => window.removeEventListener("hashchange", followHash);
  }, [content.directions]);
  return <div className="hc-explorer"><div className="hc-service-tabs" role="tablist" aria-label="七项专项支持" aria-orientation="vertical">{content.directions.map((direction, index) => <button type="button" role="tab" id={`service-tab-${direction.key}`} aria-controls={`service-panel-${direction.key}`} aria-selected={active === index} tabIndex={active === index ? 0 : -1} key={direction.key} onClick={() => setActive(index)} onKeyDown={event => tabKey(event, index, content.directions.length, setActive)}><span>{direction.label}</span><span aria-hidden="true">↗</span></button>)}</div><div className="hc-service-panels">{content.directions.map((direction, index) => {
    const Demo = demos[direction.key];
    return <div className="hc-service-panel" role="tabpanel" id={`service-panel-${direction.key}`} aria-labelledby={`service-tab-${direction.key}`} hidden={active !== index} inert={active !== index} key={direction.key}><div className="hc-service-copy"><h3><span id={`service-${direction.key}`} />{direction.title}</h3><p>{direction.situation}</p><p className="hc-service-goal">{direction.goal}</p><h4>具体怎样开展</h4><ul>{direction.work.map(text => <li key={text}>{text}</li>)}</ul><SiteLink className="hc-text-link" href="/book-consultation/" target="_blank" rel="noopener noreferrer">了解这项支持怎样开始 <span aria-hidden="true">↗</span></SiteLink></div><div className="hc-material"><div className="hc-material-heading"><span>工作示意</span><span aria-hidden="true">↗</span></div><h4>{direction.toolTitle}</h4>{Demo ? <Demo direction={direction} /> : <dl>{direction.toolRows.map(row => <div key={row.label}><dt>{row.label}</dt><dd>{row.text}</dd></div>)}</dl>}<p className="hc-material-note">{direction.note}</p></div></div>;
  })}</div></div>;
}

const childArrangements = [
  { label: "接送交接", title: "时间、地点与负责人，明确到同一份安排。", rows: [["原有安排", "确认接送时间、地点与负责成年人。"], ["临时变更", "由成年人直接确认变化及替代安排。"], ["孩子的位置", "不要求孩子催促、解释或替大人传话。"]], focus: "把接送这件事和伴侣之间的争议分开。" },
  { label: "学校信息", title: "把与孩子有关的信息，留在清晰的渠道里。", rows: [["需要同步", "学校通知、重要活动和照顾事项。"], ["联系渠道", "讨论如何获得和同步必要信息。"], ["孩子的位置", "不让孩子承担转达通知或收集信息的责任。"]], focus: "围绕孩子的需要同步信息，避免让学校沟通变成新的争执。" },
  { label: "日常联系", title: "讨论具体需要，减少孩子承接大人的情绪。", rows: [["联系内容", "围绕孩子的健康、学习与日常照顾。"], ["联系边界", "结合孩子的年龄和实际情况讨论安排。"], ["孩子的位置", "不要求孩子选边、安慰或保护某一位家长。"]], focus: "孩子可以表达感受，无需负责修复成年人的关系。" },
  { label: "临时变更", title: "事情发生变化时，先确认孩子怎样被照顾。", rows: [["发生变化", "明确原安排中哪一项需要更新。"], ["待确认项", "由谁照顾、如何衔接、何时确认。"], ["孩子的位置", "让需要处理的问题回到成年人之间。"]], focus: "必要时衔接儿童心理、家事法律或其他适当专业支持。" },
];

export function ChildArrangements() {
  const [active, setActive] = useState(0);
  const item = childArrangements[active];
  return <ViewTabs labels={childArrangements.map(item => item.label)} active={active} onChange={setActive} label="查看孩子保护安排"><div className="hc-child-arrangement"><h3>{item.title}</h3><dl>{item.rows.map(([label, text]) => <div key={label}><dt>{label}</dt><dd>{text}</dd></div>)}</dl><p className="hc-child-focus">{item.focus}</p><p className="hc-note">安排示意，需结合孩子的年龄、实际处境与专业意见。</p></div></ViewTabs>;
}

export function PhaseCollaboration({ process, comparison }: { process: Content["process"]; comparison: Content["comparison"] }) {
  const [active, setActive] = useState(0);
  const step = process.steps[active];
  const shortLabels = ["了解现状", "制定计划", "法律程序", "生活重建"];
  return <div className="hc-collaboration"><ViewTabs labels={shortLabels} active={active} onChange={setActive} label="查看四个支持阶段"><div className="hc-phase-content"><div className="hc-phase-main"><span className="hc-document-label">{String(active + 1).padStart(2, "0")} / 04</span><h3>{step.title}</h3><p>{step.discussion}</p><h4>可能形成的工作内容</h4><p>{step.result}</p></div><div className="hc-phase-roles"><h4>这一阶段怎样协作</h4><p>{step.next}</p><dl><dt>焕屿辅导</dt><dd>事实梳理、沟通准备与现实行动衔接。</dd><dt>{active === 0 ? "适当专业支持" : "律师及相关专业"}</dt><dd>{active === 0 ? "安全、法律或身心健康问题，由相应专业评估与处理。" : active === 3 ? "按需要处理法律安排、孩子心理与其他专业问题。" : "法律意见、证据判断、文件与程序由律师负责。"}</dd></dl></div></div></ViewTabs><details className="hc-professional-details"><summary>查看辅导、心理咨询、律师与紧急支持的完整分工<span className="hc-disclosure-icon" aria-hidden="true" /></summary><div className="hc-table-scroll" tabIndex={0} role="region" aria-label={comparison.title}><table><caption>{comparison.caption}</caption><thead><tr>{comparison.headers.map(text => <th key={text} scope="col">{text}</th>)}</tr></thead><tbody>{comparison.rows.map(row => <tr key={row.dimension}><th scope="row">{row.dimension}</th><td>{row.coaching}</td><td>{row.therapy}</td><td>{row.legal}</td><td>{row.urgent}</td></tr>)}</tbody></table></div></details></div>;
}

export function ResilientImage({ src, alt, width, height, srcSet, sizes, eager = false }: { src: string; alt: string; width: number; height: number; srcSet?: string; sizes?: string; eager?: boolean }) {
  const [failed, setFailed] = useState(false);
  return <div className="hc-image" data-failed={failed || undefined}>{failed ? <div role="img" aria-label={alt} className="hc-image-fallback">{alt}</div> : <img src={src} alt={alt} width={width} height={height} srcSet={srcSet} sizes={sizes} loading={eager ? "eager" : "lazy"} fetchPriority={eager ? "high" : "auto"} decoding="async" onError={() => setFailed(true)} />}</div>;
}
