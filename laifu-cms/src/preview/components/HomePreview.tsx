import type { HomePreviewDocument } from "../types";
import { PreviewBrand } from "./PreviewBrand";

export function HomePreview({ document }: { document: HomePreviewDocument }) {
  const hero = document.hero || {};
  const opening = document.opening || {};
  return (
    <main className="home-preview">
      <header className="preview-site-header">
        <PreviewBrand />
        <nav><span>服务</span><span>方法</span><span>洞察</span><span>方案</span><span>关于</span></nav>
        <span className="preview-site-header__action">讨论你的问题</span>
      </header>
      <section className="home-preview__hero">
        <div className="home-preview__grid" />
        <div className="home-preview__copy">
          <p className="preview-eyebrow"><span>{hero.eyebrowIndex || "01"}</span>{hero.eyebrowLabel || "AI DECISION GROWTH"}</p>
          <h1><span>{hero.titleLead || "让品牌成为"}</span><em>{hero.titleEmphasis || "正确答案"}</em><span>{hero.titleTail || "的一部分。"}</span></h1>
          <p className="home-preview__description">{hero.description || "在左侧编辑内容，这里会实时同步官网呈现。"}</p>
          <div className="home-preview__actions"><span>{hero.primaryAction?.label || "主行动"} ↗</span><span>{hero.secondaryAction?.label || "次行动"} ↗</span></div>
          <div className="home-preview__proof">{hero.proofPoints?.map((item, index) => <p key={item.id || index}><b>0{index + 1}</b><span>{item.value}</span></p>)}</div>
        </div>
        <div className="home-preview__instrument">
          <header><span>METHOD PROJECTION / 01</span><b>CONTROLLED VIEW</b></header>
          <div className="home-preview__instrument-body">
            <aside><span>01 / TASK</span><span>02 / CLAIM</span><span className="is-active">03 / EVIDENCE</span><span>04 / CITATION</span><span>05 / ACTION</span></aside>
            <section><p>DECISION SYSTEM</p><h2>从问题到证据，<br />把内容变成可核验的选择。</h2><div className="home-preview__map"><i /><i /><i /><i /><i /></div><footer><span>QUALIFICATION</span><b>READY FOR REVIEW</b></footer></section>
          </div>
        </div>
        <div className="home-preview__rail">{hero.rail?.map((item, index) => <p key={item.id || index}><b>{item.label}</b><span>{item.value}</span></p>)}</div>
      </section>
      <section className="home-preview__opening">
        <p className="preview-eyebrow"><span>{opening.eyebrowIndex || "02"}</span>{opening.eyebrowLabel || "THE SHIFT"}</p>
        <h2>{opening.titleLines?.map((item, index) => <span key={item.id || index}>{item.value}</span>)}</h2>
        <p>{opening.description}</p>
        <a>{opening.action?.label || "继续阅读"} ↗</a>
      </section>
      <div className="home-preview__sections">{document.sections?.map((section, sectionIndex) => <section key={section.id || section.key || sectionIndex} className={sectionIndex % 2 === 0 ? "is-dark" : ""}><header><p className="preview-eyebrow"><span>{section.eyebrowIndex}</span>{section.eyebrowLabel}</p><h2>{section.titleLines?.map((line, lineIndex) => <span key={line.id || lineIndex}>{line.value}</span>)}</h2><p>{section.description}</p></header>{section.items && section.items.length > 0 && <div>{section.items.map((item, itemIndex) => <article key={item.id || item.sourceId || itemIndex}><small>{item.sourceId || item.kicker}</small><h3>{item.title}</h3><p>{item.description}</p>{item.points && item.points.length > 0 && <ul>{item.points.map((point, pointIndex) => <li key={point.id || pointIndex}>{point.value}</li>)}</ul>}</article>)}</div>}</section>)}</div>
    </main>
  );
}
