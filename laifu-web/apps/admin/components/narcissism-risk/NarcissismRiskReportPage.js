"use client";

import { useRef, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  ChevronDown,
  ClipboardCheck,
  Download,
  FileCheck2,
  LayoutGrid,
  ShieldAlert,
  Target,
} from "lucide-react";
import AdminDimensionRadarChart from "../AdminDimensionRadarChart";

const REPORT_HEADER_LOGO_SRC = "/assets/ZUNERGUANGLOGO01.png";
const HERO_WATERMARK_SRC = "/assets/report-watermark-hero.png";
const BOUNDARY_WATERMARK_SRC = "/assets/report-watermark-boundary.png";
const REPORT_FOOTER_SLOGAN = "法愈人生，帮你找到适合自己的方式。";
const TEAM_INTRO_PAGE_COUNT = 3;
const REPORT_INTRO_TEXT =
  "本报告基于对您在自我中心、受挫反应、情感回应、关系施压与冲突升级五个维度的评估，结合高风险触发信号与当前阶段个体情况，形成配偶高自恋特质与高冲突婚姻风险结构解读与针对性建议，为您制定下一步行动计划、优化决策与风险防控提供参考。";

const LEVEL_VISUALS = {
  low: {
    main: "var(--color-link-blue)",
    deep: "var(--color-link-blue)",
    soft: "var(--color-canvas)",
    text: "var(--color-link-blue)",
    border: "color-mix(in srgb, var(--color-link-blue) 26%, transparent)",
    gradient: "var(--color-ink)",
    track: "color-mix(in srgb, var(--color-link-blue) 18%, transparent)",
  },
  mild: {
    main: "var(--color-warning)",
    deep: "var(--color-error-deep)",
    soft: "var(--color-surface-soft)",
    text: "var(--color-error-deep)",
    border: "color-mix(in srgb, var(--color-warning) 26%, transparent)",
    gradient: "var(--color-ink)",
    track: "color-mix(in srgb, var(--color-warning) 18%, transparent)",
  },
  moderate: {
    main: "var(--color-warning)",
    deep: "var(--color-error-deep)",
    soft: "var(--color-surface-soft)",
    text: "var(--color-error-deep)",
    border: "color-mix(in srgb, var(--color-warning) 26%, transparent)",
    gradient: "var(--color-ink)",
    track: "color-mix(in srgb, var(--color-warning) 18%, transparent)",
  },
  high: {
    main: "var(--color-error)",
    deep: "var(--color-error-deep)",
    soft: "var(--color-surface-soft)",
    text: "var(--color-error-deep)",
    border: "color-mix(in srgb, var(--color-error) 26%, transparent)",
    gradient: "var(--color-ink)",
    track: "color-mix(in srgb, var(--color-error) 18%, transparent)",
  },
};

const DIMENSION_VISUALS = {
  N1: {
    accent: "var(--color-link-blue)",
    tint: "color-mix(in srgb, var(--color-link-blue) 12%, transparent)",
    Icon: Target,
  },
  N2: {
    accent: "var(--color-warning)",
    tint: "color-mix(in srgb, var(--color-warning) 13%, transparent)",
    Icon: AlertTriangle,
  },
  N3: {
    accent: "var(--color-stone)",
    tint: "color-mix(in srgb, var(--color-stone) 12%, transparent)",
    Icon: ShieldAlert,
  },
  N4: {
    accent: "var(--color-warning)",
    tint: "color-mix(in srgb, var(--color-warning) 12%, transparent)",
    Icon: LayoutGrid,
  },
  N5: {
    accent: "var(--color-error)",
    tint: "color-mix(in srgb, var(--color-error) 12%, transparent)",
    Icon: FileCheck2,
  },
};

function getLevelVisual(level) {
  return LEVEL_VISUALS[level] ?? LEVEL_VISUALS.moderate;
}

function getDimensionVisual(code) {
  return DIMENSION_VISUALS[code] ?? DIMENSION_VISUALS.N1;
}

function formatAverageScore(score) {
  const number = Number(score);
  if (!Number.isFinite(number)) return "-";
  return number.toFixed(2);
}

function formatValidityText(value) {
  return String(value || "").replaceAll("NA", "与本人情况无关作答");
}

function getFocusDimensionItems(summary) {
  if (summary?.dimensions?.length > 0) {
    return summary.dimensions.map((dimension) => dimension.shortName);
  }

  return [summary?.fallbackText || "暂无单独标记"];
}

function getHighRiskPageGroups(details = []) {
  const groups = [];
  for (let index = 0; index < details.length; index += 2) {
    groups.push(details.slice(index, index + 2));
  }

  return groups;
}

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatPercent(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "-";
  return `${number.toFixed(1)}%`;
}

function formatPageNumber(pageNumber, totalPages) {
  return `${String(pageNumber).padStart(2, "0")} / ${String(totalPages).padStart(2, "0")}`;
}

function getScorePercent(report) {
  const scoreRate = Number(report.scoreRate);
  if (Number.isFinite(scoreRate)) return Math.max(0, Math.min(100, scoreRate));

  const averageScore = Number(report.totalAverageScore);
  if (!Number.isFinite(averageScore)) return 0;
  return Math.max(0, Math.min(100, (averageScore / 5) * 100));
}

async function waitForImages(container) {
  const images = Array.from(container.querySelectorAll("img"));
  if (images.length === 0) return;

  await Promise.all(
    images.map((image) => {
      if (image.complete && image.naturalWidth > 0) {
        return Promise.resolve();
      }

      if (typeof image.decode === "function") {
        return image.decode().catch(() => undefined);
      }

      return new Promise((resolve) => {
        image.addEventListener("load", resolve, { once: true });
        image.addEventListener("error", resolve, { once: true });
      });
    })
  );
}

function getExportFileName(report, extension, mode = "") {
  const base = report.exportFilenameBase || "配偶高自恋风险详细报告";
  return `${base}${mode ? `_${mode}` : ""}.${extension}`;
}

function LogoLockup({ compact = false }) {
  return (
    <div className={`report-logo-lockup${compact ? " compact" : ""}`}>
      <img
        src={REPORT_HEADER_LOGO_SRC}
        alt="尊而光律师事务所"
        className="report-logo-image"
        crossOrigin="anonymous"
      />
      <div className="report-logo-text">
        <strong>尊而光律师事务所</strong>
        <span>PRIDE&BRIGHT LAWYERS</span>
      </div>
    </div>
  );
}

function ReportFooterBrand() {
  return (
    <div className="report-footer-brand" aria-label="Sandra婚姻家事团队">
      <span className="report-footer-brand-en">Sandra</span>
      <span className="report-footer-brand-cn">婚姻家事团队</span>
    </div>
  );
}

function renderTeamRichText(parts) {
  return parts.map((part, index) =>
    part.strong ? (
      <strong key={`${part.text}-${index}`}>{part.text}</strong>
    ) : (
      <span key={`${part.text}-${index}`}>{part.text}</span>
    )
  );
}

function SectionHeading({ title, description }) {
  return (
    <div className="a4-report-section-heading">
      <i />
      <div>
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
    </div>
  );
}

function MobileSectionTitle({ children }) {
  return (
    <div className="mobile-report-section-title">
      <i />
      <h2>{children}</h2>
    </div>
  );
}

function ReportMiniIcon({ kind }) {
  const icons = {
    result: <ShieldAlert size={24} strokeWidth={2} />,
    score: <BarChart3 size={24} strokeWidth={2} />,
    answer: <ClipboardCheck size={24} strokeWidth={2} />,
    focus: <Target size={24} strokeWidth={2} />,
    dimension: <LayoutGrid size={24} strokeWidth={2} />,
    boundary: <FileCheck2 size={24} strokeWidth={2} />,
    warning: <AlertTriangle size={24} strokeWidth={2} />,
  };

  return <span className="report-mini-icon">{icons[kind] ?? icons.result}</span>;
}

function DimensionIcon({ dimension }) {
  const visual = getDimensionVisual(dimension.code);
  const Icon = visual.Icon;

  return (
    <span
      className="dimension-icon-badge"
      style={{ color: visual.accent, backgroundColor: visual.tint }}
      aria-hidden="true"
    >
      <Icon size={24} strokeWidth={2.1} />
    </span>
  );
}

function DimensionCodePill({ dimension, large = false }) {
  const visual = getDimensionVisual(dimension.code);
  return (
    <span
      className={`a4-report-dimension-code${large ? " is-large" : ""}`}
      style={{
        color: visual.accent,
        backgroundColor: visual.tint,
        borderColor: `${visual.accent}33`,
      }}
    >
      {dimension.code}
    </span>
  );
}

function LevelTag({ level, label, className = "" }) {
  const visual = getLevelVisual(level);
  return (
    <span
      className={`narcissism-report-level-tag ${className}`.trim()}
      style={{
        color: visual.text,
        backgroundColor: visual.soft,
        borderColor: visual.border,
      }}
    >
      {label}
    </span>
  );
}

function FocusDimensionGrid({ summary, compact = false }) {
  return (
    <div
      className={`narcissism-report-focus-grid${compact ? " is-compact" : ""}`}
    >
      {getFocusDimensionItems(summary).map((item) => (
        <span key={item}>{item}</span>
      ))}
    </div>
  );
}

function A4PageFooter({ label, pageNumber, totalPages }) {
  return (
    <footer className="a4-report-page-footer">
      <span>{label}</span>
      <span>{formatPageNumber(pageNumber, totalPages)}</span>
    </footer>
  );
}

function A4CoverPage({ report }) {
  const visual = getLevelVisual(report.overallLevel);
  const scorePercent = getScorePercent(report);

  return (
    <section className="a4-report-page a4-report-cover">
      <img
        src={HERO_WATERMARK_SRC}
        alt=""
        aria-hidden="true"
        className="a4-report-watermark a4-report-cover-watermark"
      />
      <header className="a4-report-cover-header">
        <LogoLockup />
        <div className="a4-report-badge-row">
          <span className="a4-report-badge">内部资料</span>
          <span className="a4-report-badge is-muted">仅限内部使用</span>
        </div>
      </header>

      <div className="a4-report-cover-main">
        <div className="a4-report-title-block">
          <p className="a4-report-kicker">{report.reportTitle.primary}</p>
          <h1>{report.reportTitle.secondary}</h1>
          <p>{REPORT_INTRO_TEXT}</p>
        </div>

        <div className="a4-report-cover-meta">
          <div>
            <span>用户称呼</span>
            <strong>{report.clientName || "-"}</strong>
          </div>
          <div>
            <span>提交时间</span>
            <strong>{formatDate(report.submittedAt)}</strong>
          </div>
          <div>
            <span>报告版本</span>
            <strong>{report.reportVersion || "v1"}</strong>
          </div>
          <div>
            <span>报告生成时间</span>
            <strong>{formatDate(report.reportGeneratedAt)}</strong>
          </div>
        </div>

        <div className="a4-report-cover-score">
          <div className="a4-report-result-panel" style={{ background: visual.gradient }}>
            <span>综合风险结果</span>
            <strong>{report.overallLevelLabel}</strong>
            <p>{report.executiveSummary[0] || report.overallCopy?.meaning}</p>
          </div>
          <div className="a4-report-rate-panel">
            <span>平均风险得分</span>
            <strong className="narcissism-report-score-nowrap" style={{ color: visual.main }}>
              {report.totalAverageScoreText}
            </strong>
            <div
              className="a4-report-progress-track"
              style={{ backgroundColor: visual.track }}
            >
              <i
                style={{
                  width: `${scorePercent}%`,
                  background: "var(--color-primary)",
                }}
              />
            </div>
            <p style={{ color: visual.text }}>得分方向：分数越高，风险信号越集中</p>
          </div>
        </div>
      </div>

      <footer className="a4-report-cover-footer">
        <ReportFooterBrand />
        <p className="a4-report-footer-slogan">{REPORT_FOOTER_SLOGAN}</p>
      </footer>
    </section>
  );
}

function A4OverviewPage({ report, totalPages }) {
  return (
    <section className="a4-report-page a4-report-overview">
      <header className="a4-report-page-header">
        <LogoLockup compact />
        <span>总体风险评价与五维概览</span>
      </header>

      <main className="a4-report-page-body">
        <SectionHeading
          title="总体评价"
          description="本页汇总综合风险结果、关键指标与维度结构概览。"
        />

        <div className="a4-report-overall-card narcissism-report-single-column-card">
          <p>{report.overallCopy?.meaning || report.degradedReason}</p>
          {report.overallCopy?.relationshipPattern ? (
            <p>{report.overallCopy.relationshipPattern}</p>
          ) : null}
        </div>

        <div className="a4-report-metric-grid">
          <div className="a4-report-metric-card">
            <ReportMiniIcon kind="score" />
            <span>平均风险得分</span>
            <strong>{report.totalAverageScoreText}</strong>
          </div>
          <div className="a4-report-metric-card">
            <ReportMiniIcon kind="answer" />
            <span>有效作答</span>
            <strong>{report.effectiveAnswerCount} 题</strong>
          </div>
          <div className="a4-report-metric-card">
            <ReportMiniIcon kind="warning" />
            <span>高风险触发</span>
            <strong>{report.highRiskTriggerSummary.label}</strong>
          </div>
          <div className="a4-report-metric-card">
            <ReportMiniIcon kind="focus" />
            <span>主要风险维度</span>
            <FocusDimensionGrid summary={report.focusDimensionSummary} compact />
          </div>
        </div>

        <SectionHeading title="维度结构概览" />

        <div className="a4-report-structure-grid">
          <div className="a4-report-radar-panel">
            <AdminDimensionRadarChart dimensions={report.radarData} />
          </div>
          <div className="a4-report-dimension-overview-list">
            {report.dimensionSummaries.map((dimension) => (
              <section key={dimension.code} className="a4-report-dimension-overview-card">
                <div className="a4-report-dimension-overview-name">
                  <DimensionCodePill dimension={dimension} />
                  <DimensionIcon dimension={dimension} />
                  <div>
                    <h3>{dimension.shortName}</h3>
                    <p>{dimension.name}</p>
                  </div>
                </div>
                <div className="a4-report-dimension-overview-score">
                  <strong style={{ color: getLevelVisual(dimension.level).main }}>
                    {formatAverageScore(dimension.averageScore)}
                  </strong>
                  <span>/ 5</span>
                  <LevelTag level={dimension.level} label={dimension.levelLabel} />
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>

      <A4PageFooter
        label={report.reportTitle.secondary}
        pageNumber={2}
        totalPages={totalPages}
      />
    </section>
  );
}

function A4DimensionPage({ dimension, pageNumber, totalPages }) {
  return (
    <section className="a4-report-page a4-report-dimension-page">
      <header className="a4-report-page-header">
        <LogoLockup compact />
        <span>五维度详细解读</span>
      </header>

      <main className="a4-report-page-body">
        <div className="a4-report-dimension-hero">
          <div className="a4-report-dimension-title">
            <div className="narcissism-report-dimension-mark">
              <DimensionIcon dimension={dimension} />
              <DimensionCodePill dimension={dimension} large />
            </div>
            <div>
              <h2>{dimension.name}</h2>
              <p>{dimension.description}</p>
            </div>
          </div>
          <div className="a4-report-dimension-score-card">
            <span>平均风险得分</span>
            <strong style={{ color: getLevelVisual(dimension.level).main }}>
              {formatAverageScore(dimension.averageScore)}
            </strong>
            <em>/ 5</em>
            <LevelTag level={dimension.level} label={dimension.levelLabel} />
          </div>
        </div>

        <div className="a4-report-dimension-copy-grid">
          <section className="a4-report-copy-block">
            <h3>当前状态解读</h3>
            <p>{dimension.analysis || "该维度缺少足够有效作答，本次暂不作正常风险判断。"}</p>
          </section>
          {dimension.suggestion ? (
            <section className="a4-report-copy-block">
              <h3>后续梳理建议</h3>
              <p>{dimension.suggestion}</p>
            </section>
          ) : null}
          <section className="a4-report-copy-block narcissism-report-compact-copy">
            <h3>有效性提示</h3>
            <p>
              有效作答 {dimension.validCount ?? "-"} 题，与本人情况无关作答 {dimension.naCount ?? "-"} 题。
              {dimension.insufficientValidity
                ? "该维度有效作答较少，相关分数仅供参考。"
                : "该维度具备可参考的作答基础。"}
            </p>
          </section>
        </div>
      </main>

      <A4PageFooter
        label={`${dimension.code} ${dimension.name}`}
        pageNumber={pageNumber}
        totalPages={totalPages}
      />
    </section>
  );
}

function A4HighRiskPages({ report, startPageNumber, totalPages }) {
  if (!report.highRiskTriggerSummary.triggered) return null;
  const groups = getHighRiskPageGroups(report.highRiskTriggerDetails);
  const pageGroups = groups.length > 0 ? groups : [[]];

  return (
    <>
      {pageGroups.map((group, groupIndex) => {
        const pageNumber = startPageNumber + groupIndex;
        const isFirstPage = groupIndex === 0;

        return (
          <section
            key={`high-risk-page-${pageNumber}`}
            className="a4-report-page a4-report-boundary-page narcissism-report-high-risk-page"
          >
            <img
              src={BOUNDARY_WATERMARK_SRC}
              alt=""
              aria-hidden="true"
              className="a4-report-watermark a4-report-boundary-watermark"
            />
            <header className="a4-report-page-header">
              <LogoLockup compact />
              <span>高风险触发题专项{isFirstPage ? "" : "（续）"}</span>
            </header>

            <main className="a4-report-page-body">
              <div className="a4-report-boundary-title narcissism-report-warning-title">
                <span className="a4-report-boundary-icon">
                  <AlertTriangle aria-hidden="true" strokeWidth={2} />
                </span>
                <div>
                  <h2>高风险触发题专项{isFirstPage ? "" : "（续）"}</h2>
                  <p>
                    {isFirstPage
                      ? report.highRiskTriggerSummary.text
                      : "以下为本次触发的其余高风险题，请结合现实安全、证据保存和外部支持同步判断。"}
                  </p>
                </div>
              </div>

              <div className="narcissism-report-trigger-list">
                {group.map((trigger) => (
                  <section key={trigger.key} className="a4-report-copy-block">
                    <h3>
                      Q{trigger.questionNo} · {trigger.copy?.title || trigger.questionText}
                    </h3>
                    <p>{trigger.copy?.meaning}</p>
                    <p>{trigger.copy?.risk}</p>
                    <p>{trigger.copy?.suggestion}</p>
                    {trigger.copy?.boundary ? <p>{trigger.copy.boundary}</p> : null}
                  </section>
                ))}
              </div>
            </main>

            <A4PageFooter
              label="高风险触发题专项"
              pageNumber={pageNumber}
              totalPages={totalPages}
            />
          </section>
        );
      })}
    </>
  );
}

function A4ValidityBoundaryPage({ report, pageNumber, totalPages }) {
  const boundaryItems = [
    report.boundaryCopy.admin?.limitation,
    report.boundaryCopy.diagnostic?.text,
    report.boundaryCopy.legal?.text,
    report.boundaryCopy.safety?.recommendedExpression,
    report.boundaryCopy.use?.text,
  ].filter(Boolean);

  return (
    <section className="a4-report-page a4-report-boundary-page">
      <img
        src={BOUNDARY_WATERMARK_SRC}
        alt=""
        aria-hidden="true"
        className="a4-report-watermark a4-report-boundary-watermark"
      />
      <header className="a4-report-page-header">
        <LogoLockup compact />
        <span>有效性说明与报告使用边界</span>
      </header>

      <main className="a4-report-page-body">
        <div className="a4-report-boundary-title">
          <span className="a4-report-boundary-icon">
            <FileCheck2 aria-hidden="true" strokeWidth={2} />
          </span>
          <div>
            <h2>有效性与作答说明</h2>
            <p>
              “与本人情况无关作答”不等于无风险。本页用于标记低有效作答、单维不计分作答和报告使用边界，供内部人员审阅时同步参考。
            </p>
          </div>
        </div>

        <div className="narcissism-report-validity-grid">
          {report.validityMessages.map((message) => (
            <section key={message.key} className="a4-report-copy-block">
              <h3>{formatValidityText(message.title)}</h3>
              <p>{formatValidityText(message.text)}</p>
              {message.suggestion ? <p>{formatValidityText(message.suggestion)}</p> : null}
              {message.dimensions?.length > 0 ? (
                <p>涉及维度：{message.dimensions.join("、")}</p>
              ) : null}
            </section>
          ))}
        </div>

        <ul className="a4-report-boundary-list narcissism-report-boundary-list">
          {boundaryItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </main>

      <A4PageFooter
        label="有效性说明与报告使用边界"
        pageNumber={pageNumber}
        totalPages={totalPages}
      />
    </section>
  );
}

function A4TeamIntroPageFooter({ pageNumber, totalPages }) {
  return (
    <footer className="a4-report-page-footer a4-report-team-footer">
      <span>Sandra 婚姻家事团队介绍附录</span>
      <span>{formatPageNumber(pageNumber, totalPages)}</span>
    </footer>
  );
}

function A4TeamIntroCard({ section, index, compact = false }) {
  return (
    <section className={`a4-report-team-card${compact ? " is-compact" : ""}`}>
      <div className="a4-report-team-card-head">
        <span className="a4-report-team-card-index">
          {String(index).padStart(2, "0")}
        </span>
        <h3>{section.title}</h3>
      </div>
      <div className="a4-report-team-card-copy">
        {section.paragraphs.map((paragraph, paragraphIndex) => (
          <p key={`${section.title}-${paragraphIndex}`}>
            {renderTeamRichText(paragraph)}
          </p>
        ))}
      </div>
    </section>
  );
}

function A4TeamIntroPages({ teamIntro, startPageNumber, totalPages }) {
  const firstPageSections = teamIntro.sections.slice(0, 4);
  const secondPageSections = teamIntro.sections.slice(4);

  return (
    <>
      <section className="a4-report-page a4-report-team-page a4-report-team-intro-page">
        <img
          src={BOUNDARY_WATERMARK_SRC}
          alt=""
          aria-hidden="true"
          className="a4-report-watermark a4-report-team-watermark"
        />
        <header className="a4-report-page-header">
          <LogoLockup compact />
          <span>团队介绍附录</span>
        </header>

        <main className="a4-report-page-body a4-report-team-body">
          <div className="a4-report-team-hero">
            <div>
              <h2>{teamIntro.title}</h2>
              <p>{teamIntro.subtitle}</p>
            </div>
          </div>
          <div className="a4-report-team-lead">
            {teamIntro.introParagraphs.map((paragraph, index) => (
              <p key={`team-intro-${index}`}>{renderTeamRichText(paragraph)}</p>
            ))}
          </div>
        </main>

        <A4TeamIntroPageFooter
          pageNumber={startPageNumber}
          totalPages={totalPages}
        />
      </section>

      <section className="a4-report-page a4-report-team-page a4-report-team-service-page">
        <img
          src={BOUNDARY_WATERMARK_SRC}
          alt=""
          aria-hidden="true"
          className="a4-report-watermark a4-report-team-watermark"
        />
        <header className="a4-report-page-header">
          <LogoLockup compact />
          <span>团队核心服务能力</span>
        </header>

        <main className="a4-report-page-body a4-report-team-body">
          <div className="a4-report-section-heading a4-report-team-heading">
            <i />
            <div>
              <h2>团队核心服务能力</h2>
            </div>
          </div>
          <div className="a4-report-team-section-grid">
            {firstPageSections.map((section, index) => (
              <A4TeamIntroCard
                key={section.title}
                section={section}
                index={index + 1}
              />
            ))}
          </div>
        </main>

        <A4TeamIntroPageFooter
          pageNumber={startPageNumber + 1}
          totalPages={totalPages}
        />
      </section>

      <section className="a4-report-page a4-report-team-page a4-report-team-closing-page">
        <img
          src={BOUNDARY_WATERMARK_SRC}
          alt=""
          aria-hidden="true"
          className="a4-report-watermark a4-report-team-watermark"
        />
        <header className="a4-report-page-header">
          <LogoLockup compact />
          <span>团队核心服务能力</span>
        </header>

        <main className="a4-report-page-body a4-report-team-body">
          <div className="a4-report-section-heading a4-report-team-heading">
            <i />
            <div>
              <h2>团队核心服务能力（续）</h2>
            </div>
          </div>
          <div className="a4-report-team-section-grid">
            {secondPageSections.map((section, index) => (
              <A4TeamIntroCard
                key={section.title}
                section={section}
                index={index + 5}
                compact
              />
            ))}
          </div>
          <section className="a4-report-team-closing">
            <div className="a4-report-team-closing-head">
              <span>结语</span>
              <h3>{teamIntro.closingTitle}</h3>
            </div>
            <div className="a4-report-team-card-copy">
              {teamIntro.closingParagraphs.map((paragraph, index) => (
                <p key={`team-closing-${index}`}>{renderTeamRichText(paragraph)}</p>
              ))}
            </div>
          </section>
        </main>

        <A4TeamIntroPageFooter
          pageNumber={startPageNumber + 2}
          totalPages={totalPages}
        />
      </section>
    </>
  );
}

function A4ReportDocument({ report, reportRef, isHidden = false }) {
  const hasHighRiskPage = report.highRiskTriggerSummary.triggered;
  const highRiskPageCount = hasHighRiskPage
    ? Math.max(1, getHighRiskPageGroups(report.highRiskTriggerDetails).length)
    : 0;
  const highRiskPageNumber = 2 + report.dimensionSummaries.length + 1;
  const validityPageNumber = highRiskPageNumber + highRiskPageCount;
  const teamStartPageNumber = validityPageNumber + 1;
  const totalPages = teamStartPageNumber + TEAM_INTRO_PAGE_COUNT - 1;

  return (
    <div className="report-preview-viewport"><article
      ref={reportRef}
      className={`a4-report-document${isHidden ? " a4-report-export-mount" : ""}`}
      aria-hidden={isHidden}
    >
      <A4CoverPage report={report} />
      <A4OverviewPage report={report} totalPages={totalPages} />
      {report.dimensionSummaries.map((dimension, index) => (
        <A4DimensionPage
          key={dimension.code}
          dimension={dimension}
          pageNumber={index + 3}
          totalPages={totalPages}
        />
      ))}
      <A4HighRiskPages
        report={report}
        startPageNumber={highRiskPageNumber}
        totalPages={totalPages}
      />
      <A4ValidityBoundaryPage
        report={report}
        pageNumber={validityPageNumber}
        totalPages={totalPages}
      />
      <A4TeamIntroPages
        teamIntro={report.teamIntro}
        startPageNumber={teamStartPageNumber}
        totalPages={totalPages}
      />
    </article></div>
  );
}

function MobileDimensionCard({ dimension }) {
  return (
    <section className="mobile-report-dimension-detail-card">
      <div className="mobile-report-dimension-detail-head">
        <div className="mobile-report-dimension-detail-title">
          <span
            className="mobile-report-dimension-code"
            style={{
              color: getDimensionVisual(dimension.code).accent,
              backgroundColor: getDimensionVisual(dimension.code).tint,
              borderColor: `${getDimensionVisual(dimension.code).accent}33`,
            }}
          >
            {dimension.code}
          </span>
          <DimensionIcon dimension={dimension} />
          <h3>{dimension.name}</h3>
        </div>
        <div className="mobile-report-dimension-detail-score">
          <strong style={{ color: getLevelVisual(dimension.level).main }}>
            {formatAverageScore(dimension.averageScore)}
          </strong>
          <span>/ 5</span>
          <LevelTag
            level={dimension.level}
            label={dimension.levelLabel}
            className="mobile-report-score-tag"
          />
        </div>
      </div>
      <div className="mobile-report-dimension-copy-block">
        <h4>维度说明</h4>
        <p>{dimension.description}</p>
      </div>
      <div className="mobile-report-dimension-copy-block">
        <h4>当前状态解读</h4>
        <p>{dimension.analysis}</p>
      </div>
      {dimension.suggestion ? (
        <div className="mobile-report-dimension-copy-block">
          <h4>后续梳理建议</h4>
          <p>{dimension.suggestion}</p>
        </div>
      ) : null}
    </section>
  );
}

function MobileHighRiskCard({ report }) {
  if (!report.highRiskTriggerSummary.triggered) return null;

  return (
    <section className="mobile-report-boundary-card narcissism-report-mobile-high-risk">
      <img
        src={BOUNDARY_WATERMARK_SRC}
        alt=""
        aria-hidden="true"
        className="mobile-report-boundary-watermark"
      />
      <div className="mobile-report-boundary-head">
        <span className="mobile-report-boundary-icon">
          <AlertTriangle aria-hidden="true" strokeWidth={2} />
        </span>
        <h2>高风险触发题专项</h2>
      </div>
      <p className="mobile-report-result-summary">
        {report.highRiskTriggerSummary.text}
      </p>
      <div className="mobile-report-detail-section">
        {report.highRiskTriggerDetails.map((trigger) => (
          <section key={trigger.key} className="narcissism-report-mobile-trigger-card">
            <h3>
              Q{trigger.questionNo} · {trigger.copy?.title || trigger.questionText}
            </h3>
            <p>{trigger.copy?.meaning}</p>
            <p>{trigger.copy?.risk}</p>
            <p>{trigger.copy?.suggestion}</p>
          </section>
        ))}
      </div>
    </section>
  );
}

function MobileValidityBoundary({ report }) {
  const boundaryItems = [
    report.boundaryCopy.admin?.limitation,
    report.boundaryCopy.diagnostic?.text,
    report.boundaryCopy.legal?.text,
    report.boundaryCopy.safety?.recommendedExpression,
    report.boundaryCopy.use?.text,
  ].filter(Boolean);

  return (
    <>
      <section className="mobile-report-card">
        <MobileSectionTitle>有效性与作答说明</MobileSectionTitle>
        <div className="narcissism-report-validity-summary">
          <section>
            <span>有效作答</span>
            <strong>{report.effectiveAnswerCount} 题</strong>
          </section>
          <section>
            <span>与本人情况无关作答</span>
            <strong>{report.naCount} 题</strong>
          </section>
        </div>
        <p className="narcissism-report-validity-lead">
          选择“与本人情况无关”的题目不会计入风险得分，也不等于对应方向一定没有风险。若相关情境之后出现，仍建议结合具体事件、沟通记录和现实安全状态重新判断。
        </p>
        <div className="mobile-report-detail-section">
          {report.validityMessages.length > 0 ? (
            report.validityMessages.map((message) => (
              <section key={message.key} className="narcissism-report-mobile-note">
                <h3>{formatValidityText(message.title)}</h3>
                <p>{formatValidityText(message.text)}</p>
                {message.suggestion ? <p>{formatValidityText(message.suggestion)}</p> : null}
                {message.dimensions?.length > 0 ? (
                  <p>涉及维度：{message.dimensions.join("、")}</p>
                ) : null}
              </section>
            ))
          ) : (
            <section className="narcissism-report-mobile-note">
              <h3>本次作答具备基础参考性</h3>
              <p>
                当前有效作答数量达到报告生成要求，可用于识别关系互动中的主要风险信号。报告仍应与具体事实、证据材料和专业意见结合使用。
              </p>
            </section>
          )}
        </div>
      </section>

      <section className="mobile-report-boundary-card">
        <img
          src={BOUNDARY_WATERMARK_SRC}
          alt=""
          aria-hidden="true"
          className="mobile-report-boundary-watermark"
        />
        <div className="mobile-report-boundary-head">
          <span className="mobile-report-boundary-icon">
            <FileCheck2 aria-hidden="true" strokeWidth={2} />
          </span>
          <h2>报告使用边界</h2>
        </div>
        <ul className="mobile-report-boundary-list">
          {boundaryItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </>
  );
}

function MobileTeamAppendix({ teamIntro }) {
  return (
    <>
      <section className="mobile-report-card mobile-report-team-card">
        <MobileSectionTitle>{teamIntro.title}</MobileSectionTitle>
        <div className="mobile-report-team-copy">
          {teamIntro.introParagraphs.map((paragraph, index) => (
            <p key={`mobile-team-intro-${index}`}>{renderTeamRichText(paragraph)}</p>
          ))}
        </div>
      </section>

      <footer className="mobile-report-brand-footer">
        <ReportFooterBrand />
        <p>{REPORT_FOOTER_SLOGAN}</p>
      </footer>
    </>
  );
}

function MobileReportDocument({ report, reportRef }) {
  const visual = getLevelVisual(report.overallLevel);
  const scorePercent = getScorePercent(report);

  return (
    <div className="report-preview-viewport"><article ref={reportRef} className="mobile-report-sheet">
      <header className="mobile-report-hero">
        <img
          src={HERO_WATERMARK_SRC}
          alt=""
          aria-hidden="true"
          className="mobile-report-hero-watermark"
        />
        <div className="mobile-report-hero-brand">
          <LogoLockup compact />
          <div className="mobile-report-hero-tags">
            <span>内部资料</span>
            <span>仅限内部使用</span>
          </div>
        </div>
        <div className="mobile-report-hero-main">
          <h1>{report.reportTitle.primary}</h1>
          <p className="mobile-report-subtitle">{report.reportTitle.secondary}</p>
          <p className="mobile-report-generated">
            报告生成时间：{formatDate(report.reportGeneratedAt || report.submittedAt)}
          </p>
          <p className="mobile-report-intro">{REPORT_INTRO_TEXT}</p>
        </div>
      </header>

      <section className="mobile-report-result-panel">
        <div className="mobile-report-title-row">
          <ShieldAlert className="report-mini-icon" aria-hidden="true" />
          <h2>综合风险结果</h2>
        </div>
        <strong className="mobile-report-result-label">{report.overallLevelLabel}</strong>
        <div className="mobile-report-rate-lockup" style={{ color: visual.main }}>
          <strong>{report.totalAverageScoreText}</strong>
          <span>{formatPercent(report.scoreRate)}</span>
        </div>
        <div
          className="mobile-report-progress"
          style={{ backgroundColor: visual.track }}
        >
          <span
            style={{
              width: `${scorePercent}%`,
              background: "var(--color-primary)",
            }}
          />
        </div>
        <p className="mobile-report-result-summary">{report.overallCopy?.meaning}</p>
      </section>

      <section className="mobile-report-card">
        <MobileSectionTitle>关键指标</MobileSectionTitle>
        <div className="mobile-report-metrics-grid">
          <div className="mobile-report-metric-card">
            <ReportMiniIcon kind="score" />
            <span>平均风险得分</span>
            <strong>{report.totalAverageScoreText}</strong>
          </div>
          <div className="mobile-report-metric-card">
            <ReportMiniIcon kind="answer" />
            <span>有效作答</span>
            <strong>{report.effectiveAnswerCount} 题</strong>
          </div>
          <div className="mobile-report-metric-card">
            <ReportMiniIcon kind="warning" />
            <span>高风险触发</span>
            <strong>{report.highRiskTriggerSummary.label}</strong>
          </div>
          <div className="mobile-report-metric-card">
            <ReportMiniIcon kind="focus" />
            <span>主要风险维度</span>
            <FocusDimensionGrid summary={report.focusDimensionSummary} />
          </div>
        </div>
      </section>

      <section className="mobile-report-card mobile-report-overall-card">
        <MobileSectionTitle>总体风险评价</MobileSectionTitle>
        <p>{report.overallCopy?.relationshipPattern}</p>
        <p>{report.overallCopy?.suggestion}</p>
      </section>

      <section className="mobile-report-card">
        <MobileSectionTitle>维度结构概览</MobileSectionTitle>
        <div className="mobile-report-radar-panel">
          <AdminDimensionRadarChart dimensions={report.radarData} />
        </div>
        <div className="mobile-report-dimension-score-list">
          {report.dimensionSummaries.map((dimension) => (
            <div key={dimension.code} className="mobile-report-dimension-score-row">
              <div className="mobile-report-dimension-score-name">
                <DimensionIcon dimension={dimension} />
                <h3>{dimension.name}</h3>
              </div>
              <div className="mobile-report-dimension-score-meta">
                <span>
                  平均分{" "}
                  <strong style={{ color: getLevelVisual(dimension.level).main }}>
                    {formatAverageScore(dimension.averageScore)}
                  </strong>{" "}
                  / 5
                </span>
                <LevelTag
                  level={dimension.level}
                  label={dimension.levelLabel}
                  className="mobile-report-score-tag"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mobile-report-detail-section">
        <MobileSectionTitle>五维度详细解读</MobileSectionTitle>
        <div className="mobile-report-dimension-detail-list">
          {report.dimensionSummaries.map((dimension) => (
            <MobileDimensionCard key={dimension.code} dimension={dimension} />
          ))}
        </div>
      </section>

      <MobileHighRiskCard report={report} />
      <MobileValidityBoundary report={report} />
      <MobileTeamAppendix teamIntro={report.teamIntro} />
    </article></div>
  );
}

function DegradedReport({ report }) {
  return (
    <section className="panel">
      <div className="notice error">
        {report.degradedReason || "本次作答缺少有效题目，暂无法生成完整详细报告。"}
      </div>
    </section>
  );
}

export default function NarcissismRiskReportPage({ report }) {
  const webReportRef = useRef(null);
  const mobileReportRef = useRef(null);
  const [previewMode, setPreviewMode] = useState("web");
  const [isPreviewMenuOpen, setIsPreviewMenuOpen] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [exportingType, setExportingType] = useState(null);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const currentPreviewLabel = previewMode === "web" ? "网页端报告" : "移动端报告";
  const isExporting = exportingType !== null;
  const exportButtonLabel =
    exportingType === "png"
      ? "正在导出图片..."
      : exportingType === "pdf"
        ? "正在导出 PDF..."
        : "导出报告";

  function handleSelectPreviewMode(mode) {
    setPreviewMode(mode);
    setIsPreviewMenuOpen(false);
    setIsExportMenuOpen(false);
  }

  async function handleExportImage() {
    if (!report.isRenderable || isExporting) return;
    const activeRef = previewMode === "web" ? webReportRef : mobileReportRef;
    const target = activeRef.current;
    if (!target) {
      setFeedback({ type: "error", message: "暂未找到可导出的报告内容。" });
      return;
    }
    setExportingType("png");
    setIsExportMenuOpen(false);
    setFeedback({ type: "", message: "" });
    try {
      await waitForImages(target);
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(target, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: getComputedStyle(document.documentElement).getPropertyValue("--color-canvas").trim(),
      });
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = getExportFileName(report, "png", previewMode);
      link.click();
      setFeedback({ type: "success", message: "PNG 图片已生成。" });
    } catch (error) {
      console.error("Narcissism risk report PNG export failed:", error);
      setFeedback({ type: "error", message: "PNG 导出失败，请稍后重试。" });
    } finally {
      setExportingType(null);
    }
  }

  async function handleExportPdf() {
    if (!report.isRenderable || isExporting) return;
    const target = webReportRef.current;
    if (!target) {
      setFeedback({ type: "error", message: "暂未找到 A4 报告内容。" });
      return;
    }
    setExportingType("pdf");
    setIsExportMenuOpen(false);
    setFeedback({ type: "", message: "" });
    try {
      await waitForImages(target);
      const pages = Array.from(target.querySelectorAll(".a4-report-page"));
      if (pages.length === 0) {
        throw new Error("No A4 report pages found.");
      }
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF({ orientation: "p", unit: "mm", format: "a4", compress: true });
      const pageWidth = 210;
      const pageHeight = 297;
      for (const [index, page] of pages.entries()) {
        if (index > 0) pdf.addPage();
        const { toPng } = await import("html-to-image");
        const image = await toPng(page, {
          cacheBust: true,
          pixelRatio: 2,
          backgroundColor: getComputedStyle(document.documentElement).getPropertyValue("--color-canvas").trim(),
        });
        pdf.addImage(image, "PNG", 0, 0, pageWidth, pageHeight, undefined, "FAST");
      }
      pdf.save(getExportFileName(report, "pdf"));
      setFeedback({ type: "success", message: "A4 PDF 已生成。" });
    } catch (error) {
      console.error("Narcissism risk report PDF export failed:", error);
      setFeedback({ type: "error", message: "PDF 导出失败，请稍后重试。" });
    } finally {
      setExportingType(null);
    }
  }

  return (
    <div className="report-page-shell narcissism-report-root">
      <section className="panel report-toolbar-panel">
        <div>
          <h2 className="report-toolbar-title">配偶高自恋风险详细报告</h2>
          <p className="subtitle">当前页为后台内部预览页，支持固定版心报告图片导出。</p>
        </div>
        <div className="report-toolbar-actions">
          <div className="report-preview-status" aria-live="polite">
            当前预览：<strong>{currentPreviewLabel}</strong>
          </div>
          <div className="report-preview-menu-wrap">
            <button
              className="btn btn-muted report-preview-button"
              type="button"
              aria-haspopup="menu"
              aria-expanded={isPreviewMenuOpen}
              onClick={() => setIsPreviewMenuOpen((isOpen) => !isOpen)}
            >
              预览报告
              <ChevronDown size={16} strokeWidth={2} aria-hidden="true" />
            </button>
            {isPreviewMenuOpen ? (
              <div className="report-preview-menu" role="menu">
                <button
                  className={previewMode === "web" ? "active" : ""}
                  type="button"
                  role="menuitem"
                  onClick={() => handleSelectPreviewMode("web")}
                >
                  预览网页端报告
                </button>
                <button
                  className={previewMode === "mobile" ? "active" : ""}
                  type="button"
                  role="menuitem"
                  onClick={() => handleSelectPreviewMode("mobile")}
                >
                  预览移动端报告
                </button>
              </div>
            ) : null}
          </div>
          <div className="report-export-menu-wrap">
            <button
              className="btn btn-primary report-export-button"
              type="button"
              aria-haspopup="menu"
              aria-expanded={isExportMenuOpen}
              onClick={() => {
                setIsPreviewMenuOpen(false);
                setIsExportMenuOpen((isOpen) => !isOpen);
              }}
              disabled={!report.isRenderable || isExporting}
            >
              <Download size={16} strokeWidth={2} aria-hidden="true" />
              {exportButtonLabel}
              <ChevronDown size={16} strokeWidth={2} aria-hidden="true" />
            </button>
            {isExportMenuOpen ? (
              <div className="report-export-menu" role="menu">
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleExportImage}
                  disabled={isExporting}
                >
                  导出图片 PNG
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleExportPdf}
                  disabled={isExporting}
                >
                  导出 PDF
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {feedback.type ? (
        <div className={`notice ${feedback.type === "success" ? "success" : "error"}`}>
          {feedback.message}
        </div>
      ) : null}

      {!report.isRenderable ? (
        <DegradedReport report={report} />
      ) : previewMode === "web" ? (
        <A4ReportDocument report={report} reportRef={webReportRef} />
      ) : (
        <>
          <A4ReportDocument report={report} reportRef={webReportRef} isHidden />
          <MobileReportDocument report={report} reportRef={mobileReportRef} />
        </>
      )}
    </div>
  );
}
