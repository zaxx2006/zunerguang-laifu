import { ArrowRight, ChevronDown } from "lucide-react";
import { SectionBody } from "@/components/content/StructuredContent";
import { RichText } from "@/components/content/RichText";
import type { SubsectionBlock } from "@/contracts/page-content";

const topicTitle = (title: string) => title.replace(/^0\d\s*/, "");

export function TeamTopics({ entries }: { entries: SubsectionBlock[] }) {
  return <div className="team-explorer" data-tabs="about-team">
    <div className="team-topic-nav" role="tablist" aria-label="了解专业团队" aria-orientation="vertical">
      {entries.map((entry, index) => <button type="button" role="tab" data-tab={index} id={`about-team-tab-${index}`} aria-controls={`about-team-panel-${index}`} aria-selected={index === 0} tabIndex={index === 0 ? 0 : -1} key={entry.id ?? index}>
        <span>{topicTitle(entry.title).split("：")[0]}</span><ArrowRight aria-hidden="true" />
      </button>)}
    </div>
    {entries.map((entry, index) => {
      const paragraphs = entry.blocks.flatMap(block => block.kind === "copy" ? block.text.split(/\n\s*\n/).filter(Boolean) : []);
      const summary = paragraphs[0];
      const points = paragraphs.find(paragraph => /^\s*[·•]/u.test(paragraph));
      const flow = paragraphs.find(paragraph => paragraph.includes("→"));
      const pointsIntro = points && paragraphs.indexOf(points) > 1 ? paragraphs[paragraphs.indexOf(points) - 1] : undefined;
      const remaining = paragraphs.filter(paragraph => paragraph !== summary && paragraph !== points && paragraph !== flow && paragraph !== pointsIntro);
      const otherBlocks = entry.blocks.filter(block => block.kind !== "copy");
      return <div className="team-topic-panel" role="tabpanel" id={`about-team-panel-${index}`} aria-labelledby={`about-team-tab-${index}`} hidden={index !== 0} tabIndex={0} key={entry.id ?? index}>
        <div id={entry.id} className="team-topic-content">
          <h3>{topicTitle(entry.title)}</h3>
          {summary ? <p className="team-topic-summary">{summary}</p> : null}
          {pointsIntro ? <p className="team-topic-points-intro">{pointsIntro}</p> : null}
          {points ? <ul className="team-topic-points">{points.split("\n").filter(Boolean).map((point, pointIndex) => <li key={pointIndex}>{point.replace(/^\s*[·•]\s*/u, "")}</li>)}</ul> : null}
          {flow ? <ol className="team-topic-flow">{flow.split("→").map((step, stepIndex) => <li key={stepIndex}><span>{step.trim()}</span></li>)}</ol> : null}
          {remaining.length || otherBlocks.length ? <details className="team-topic-details"><summary><span>阅读完整说明</span><ChevronDown aria-hidden="true" /></summary><div className="team-topic-details-body coaching-detail-body">
            {remaining.length ? <RichText text={remaining.join("\n\n")} /> : null}
            {otherBlocks.length ? <SectionBody blocks={otherBlocks} columns={1} /> : null}
          </div></details> : null}
        </div>
      </div>;
    })}
  </div>;
}
