import type { ReactNode } from "react";
import type { ContentPresentation } from "@/components/content/content-types";
import { editorialListLayout, isEditorialListLabel, parseEditorialRuns, splitEditorialStatement, type EditorialRun } from "@/lib/editorial-text";

type CopyGroup = { kind: "copy"; lines: string[] };
type StepGroup = { kind: "step"; marker: string; title: string; lines: string[] };
type ListGroup = { kind: "list"; lead: string[]; items: string[] };
type FactGroup = { kind: "fact"; label: string; value: string };
type CalloutGroup = { kind: "callout"; title: string; lines: string[]; risk: boolean };
type RichGroup = CopyGroup | StepGroup | ListGroup | FactGroup | CalloutGroup;
const listKinds = new Set(["list", "reading", "media", "entries", "recommendations"]);

function renderEditorialList(run: EditorialRun, key: string): ReactNode {
  const design = run.kind === "list" ? run.layout ?? editorialListLayout(run.lines) : run.kind;
  if (run.kind === "entries") return <dl className="rich-entry-list" data-list-design={design} data-source-bullets={run.sourceBullets || undefined} key={key}>{run.lines.map((line, item) => {
    const [title, description] = line.split("\n");
    return <div key={item}><dt>{title}</dt>{description ? <dd>{description}</dd> : null}</div>;
  })}</dl>;
  const className = run.kind === "list" ? "rich-point-list" : run.kind === "recommendations" ? "rich-recommendation-list" : `rich-${run.kind}-list`;
  return <ul className={className} data-list-design={design} data-source-bullets={run.sourceBullets || undefined} role="list" key={key}>{run.lines.map((line, item) => {
    const duration = run.kind === "media" ? line.match(/^(\d+\s*分钟)([｜|])(.*)$/u) : null;
    if (design === "statements") {
      const [lead, detail] = splitEditorialStatement(line);
      return <li key={item}>{detail ? <><span className="rich-point-list__lead">{lead}</span><span>{detail}</span></> : line}</li>;
    }
    return <li key={item}>{duration ? <><span className="rich-media-list__duration">{duration[1]}<span className="rich-media-list__separator">{duration[2]}</span></span><span>{duration[3]}</span></> : line}</li>;
  })}</ul>;
}

function renderEditorialGroup(group: string, key: string): ReactNode {
  const runs = parseEditorialRuns(group);
  return <div className="rich-group" key={key}>{runs.map((run, index) => {
    const next = runs[index + 1];
    if (run.kind === "label" && next && listKinds.has(next.kind)) return <div className="rich-list-section" key={index}><p className="rich-list-section__label">{run.lines[0]}</p>{renderEditorialList(next, `${key}-${index}-list`)}</div>;
    if (listKinds.has(run.kind)) return runs[index - 1]?.kind === "label" ? null : renderEditorialList(run, `${key}-${index}`);
    return <p className={`rich-${run.kind}`} data-list-design={run.sourceBullets ? "note" : undefined} data-source-bullets={run.sourceBullets || undefined} key={index}>{run.kind === "heading" ? <strong>{run.lines[0]}</strong> : run.lines[0]}</p>;
  })}</div>;
}

function renderLineGroup(group: string, key: string, presentation: ContentPresentation = "default"): ReactNode {
  if (presentation === "editorial") return renderEditorialGroup(group, key);
  const lines = group.split("\n").map((line) => line.trim()).filter(Boolean);
  const runs: { bullet: boolean; lines: string[] }[] = [];
  for (const line of lines) {
    const bullet = /^[·•🔹]/u.test(line);
    if (runs.at(-1)?.bullet === bullet) runs.at(-1)!.lines.push(line);
    else runs.push({ bullet, lines: [line] });
  }
  return <div className="rich-group" key={key}>{runs.map((run, index) => run.bullet ? renderEditorialList({ kind: "list", lines: run.lines.map((line) => line.replace(/^[·•🔹]\s*/u, "")), sourceBullets: run.lines.length }, `${key}-${index}`) : <p key={index}>{run.lines.map((line, item) => <span key={item}>{line}{item < run.lines.length - 1 ? <br /> : null}</span>)}</p>)}</div>;
}

function parseRichGroup(group: string): RichGroup {
  const lines = group.split("\n").map((line) => line.trim()).filter(Boolean);
  const first = lines[0] || "";
  const step = first.match(/^((?:第[一二三四五六七八九十]+(?:步|阶段)|[（(]\d+[）)]|\d+\.\d+|\d+[.．]|0\d|[SIFT](?=｜)|[一二三四五六七八九十]+、))\s*[：:｜、.．]?\s*(.*)$/);
  if (step) return { kind: "step", marker: step[1], title: step[2], lines: lines.slice(1) };
  const risk = /即时人身危险|自伤|暴力|威胁|风险/.test(group);
  if (/^(?:专业边界|边界说明|说明[:：]|以下情况应优先寻求专业支持)/.test(first)) return { kind: "callout", title: first.replace(/[：:]$/, ""), lines: lines.slice(1), risk };
  const bulletIndex = lines.findIndex((line) => line.startsWith("·"));
  if (bulletIndex >= 0 && lines.slice(bulletIndex).every((line) => line.startsWith("·"))) return { kind: "list", lead: lines.slice(0, bulletIndex), items: lines.slice(bulletIndex).map((line) => line.replace(/^·/, "").trim()) };
  const fact = first.match(/^([^：:]{2,12})[：:]\s*(.+)$/);
  if (lines.length === 1 && fact && /^(?:服务形式|服务周期|适合|形式|频率|支持方式|交付方式|适用人群)/.test(fact[1])) return { kind: "fact", label: fact[1], value: fact[2] };
  return { kind: "copy", lines };
}

function renderStepGroup(group: StepGroup, key: string, presentation: ContentPresentation) {
  return <article className="structured-step-card" key={key}><span aria-hidden="true" className="structured-step-card__marker">{group.marker}</span><div className="structured-step-card__content">{group.title ? <h4>{group.title}</h4> : null}{group.lines.length ? renderLineGroup(group.lines.join("\n"), `${key}-body`, presentation) : null}</div></article>;
}

function renderListGroup(group: ListGroup, key: string, presentation: ContentPresentation) {
  if (presentation === "editorial") return renderLineGroup([...group.lead, ...group.items.map((item) => `·${item}`)].join("\n"), key, presentation);
  return <article className="structured-list-card" key={key}>{group.lead.length ? <p className="structured-list-card__lead">{group.lead.map((line, index) => <span key={`${key}-lead-${index}`}>{line}{index < group.lead.length - 1 ? <br /> : null}</span>)}</p> : null}{renderEditorialList({ kind: "list", lines: group.items, sourceBullets: group.items.length }, `${key}-list`)}</article>;
}

export function RichText({ text, presentation = "default" }: { text: string; presentation?: ContentPresentation }) {
  const groups = text.replace(/\n(?=(?:第[一二三四五六七八九十]+(?:步|阶段)|[（(]\d+[）)]|0\d[｜ ]|\d+[.．](?!\d)))/g, "\n\n").split(/\n{2,}/).filter((group) => group.trim()).map(parseRichGroup);
  if (presentation === "editorial") for (let index = 1; index < groups.length; index += 1) {
    const group = groups[index];
    const previous = groups[index - 1];
    if (group.kind !== "list" || group.lead.length || previous.kind !== "copy" || !isEditorialListLabel(previous.lines.at(-1) || "")) continue;
    group.lead.push(previous.lines.pop()!);
    if (!previous.lines.length) groups.splice(--index, 1);
  }
  if (presentation === "editorial") for (let index = 0; index < groups.length; index += 1) {
    const group = groups[index];
    if (group.kind !== "step") continue;
    while (groups[index + 1]?.kind === "copy") group.lines.push(...(groups.splice(index + 1, 1)[0] as CopyGroup).lines);
  }
  const output: ReactNode[] = [];
  for (let index = 0; index < groups.length;) {
    const group = groups[index];
    if (presentation === "editorial" && group.kind === "step" && groups.length === 1 && !group.lines.length) {
      output.push(<p className="rich-label" key={`label-${index}`}>{group.marker}{group.title}</p>);
      index += 1;
      continue;
    }
    if (group.kind === "step") {
      const run: StepGroup[] = [];
      while (groups[index]?.kind === "step") run.push(groups[index++] as StepGroup);
      output.push(<div className="structured-flow" key={`flow-${index}`}>{run.map((item, itemIndex) => renderStepGroup(item, `step-${index}-${itemIndex}`, presentation))}</div>);
      continue;
    }
    if (group.kind === "list") {
      const run: ListGroup[] = [];
      while (groups[index]?.kind === "list") run.push(groups[index++] as ListGroup);
      output.push(<div className="structured-list-grid" key={`lists-${index}`}>{run.map((item, itemIndex) => renderListGroup(item, `list-${index}-${itemIndex}`, presentation))}</div>);
      continue;
    }
    if (group.kind === "fact") {
      const run: FactGroup[] = [];
      while (groups[index]?.kind === "fact") run.push(groups[index++] as FactGroup);
      output.push(<dl className="structured-facts" key={`facts-${index}`}>{run.map((item, itemIndex) => <div key={`fact-${index}-${itemIndex}`}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl>);
      continue;
    }
    if (group.kind === "callout") output.push(<aside className={`structured-callout${group.risk ? " structured-callout--risk" : ""}`} key={`callout-${index}`}><strong>{group.title}</strong>{group.lines.length ? renderLineGroup(group.lines.join("\n"), `callout-${index}-body`, presentation) : null}</aside>);
    else output.push(renderLineGroup(group.lines.join("\n"), `copy-${index}`, presentation));
    index += 1;
  }
  return <div className="structured-rich-text">{output}</div>;
}
