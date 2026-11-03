"use client";

import { useRef, useState } from "react";
import {
  BrainCircuit,
  ChevronDown,
  Crown,
  ClipboardCheck,
  Coins,
  Download,
  FileCheck2,
  Globe2,
  HeartCrack,
  LayoutGrid,
  Lightbulb,
  Lock,
  BarChart3,
  Scale,
  Target,
  UsersRound,
} from "lucide-react";
import AdminDimensionRadarChart from "./AdminDimensionRadarChart";
import { teamIntroContent } from "../lib/teamIntroContent";

const REPORT_HEADER_LOGO_SRC = "/assets/ZUNERGUANGLOGO01.png";
const HERO_WATERMARK_SRC = "/assets/report-watermark-hero.png";
const BOUNDARY_WATERMARK_SRC = "/assets/report-watermark-boundary.png";
const REPORT_FOOTER_SLOGAN = "法愈人生，帮你找到适合自己的方式。";
const TEAM_INTRO_PAGE_COUNT = 3;
const TEAM_INTRO_FIRST_PAGE_SECTIONS = teamIntroContent.sections.slice(0, 4);
const TEAM_INTRO_SECOND_PAGE_SECTIONS = teamIntroContent.sections.slice(4);

const DIMENSION_META = {
  D1: {
    shortLabel: "心理",
    accent: "var(--color-accent-purple)",
    tint: "color-mix(in srgb, var(--color-accent-purple) 12%, transparent)",
    Icon: BrainCircuit,
  },
  D2: {
    shortLabel: "经济",
    accent: "var(--color-link-blue)",
    tint: "color-mix(in srgb, var(--color-link-blue) 12%, transparent)",
    Icon: Coins,
  },
  D3: {
    shortLabel: "亲权",
    accent: "var(--color-link-blue)",
    tint: "color-mix(in srgb, var(--color-link-blue) 12%, transparent)",
    Icon: UsersRound,
  },
  D4: {
    shortLabel: "财权",
    accent: "var(--color-warning-bright)",
    tint: "color-mix(in srgb, var(--color-warning-bright) 13%, transparent)",
    Icon: Lock,
  },
  D5: {
    shortLabel: "知法",
    accent: "var(--color-link-blue)",
    tint: "color-mix(in srgb, var(--color-link-blue) 12%, transparent)",
    Icon: Scale,
  },
  D6: {
    shortLabel: "情感",
    accent: "var(--color-accent-coral)",
    tint: "color-mix(in srgb, var(--color-accent-coral) 13%, transparent)",
    Icon: HeartCrack,
  },
  D7: {
    shortLabel: "域外",
    accent: "var(--color-accent-purple)",
    tint: "color-mix(in srgb, var(--color-accent-purple) 13%, transparent)",
    Icon: Globe2,
  },
};

function getDimensionScoreVisual(score) {
  const safeScore = Number(score);

  if (!Number.isFinite(safeScore)) {
    return {
      level: "mid",
      label: "中等",
      main: "var(--color-warning)",
      deep: "var(--color-warning)",
      soft: "var(--color-surface-soft)",
      text: "var(--color-warning)",
      border: "color-mix(in srgb, var(--color-warning) 22%, transparent)",
    };
  }

  if (safeScore < 3) {
    return {
      level: "low",
      label: "待补强",
      main: "var(--color-error)",
      deep: "var(--color-error)",
      soft: "var(--color-surface-soft)",
      text: "var(--color-error)",
      border: "color-mix(in srgb, var(--color-error) 22%, transparent)",
    };
  }

  if (safeScore < 4) {
    return {
      level: "mid",
      label: "中等",
      main: "var(--color-warning)",
      deep: "var(--color-warning)",
      soft: "var(--color-surface-soft)",
      text: "var(--color-warning)",
      border: "color-mix(in srgb, var(--color-warning) 22%, transparent)",
    };
  }

  if (safeScore < 4.5) {
    return {
      level: "good",
      label: "较高",
      main: "var(--color-mute)",
      deep: "var(--color-mute)",
      soft: "var(--color-surface-soft)",
      text: "var(--color-mute)",
      border: "color-mix(in srgb, var(--color-mute) 22%, transparent)",
    };
  }

  return {
    level: "high",
    label: "优势",
    main: "var(--color-link-blue)",
    deep: "var(--color-link-blue)",
    soft: "var(--color-canvas)",
    text: "var(--color-link-blue)",
    border: "color-mix(in srgb, var(--color-link-blue) 22%, transparent)",
  };
}

function formatScore(score) {
  return Number(score).toFixed(1);
}

function getProgressWidth(scoreRateText) {
  const value = Number.parseFloat(scoreRateText);
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, value));
}

function getScoreRateStatus(scoreRateText) {
  const value = Number.parseFloat(scoreRateText);
  if (!Number.isFinite(value)) return "结果待补充";
  if (value < 60) return "需重点补强";
  if (value < 70) return "中等（建议尽快优化）";
  if (value < 80) return "良好（建议持续优化）";
  return "优势（建议保持并巩固）";
}

function getOverallScoreVisual(scoreRateText) {
  const value = Number.parseFloat(scoreRateText);

  if (!Number.isFinite(value)) {
    return {
      theme: "mid",
      main: "var(--color-warning)",
      deep: "var(--color-warning)",
      soft: "var(--color-surface-soft)",
      text: "var(--color-warning)",
      border: "color-mix(in srgb, var(--color-warning) 22%, transparent)",
      gradient: "var(--color-ink)",
      track: "color-mix(in srgb, var(--color-warning) 18%, transparent)",
    };
  }

  if (value < 60) {
    return {
      theme: "low",
      main: "var(--color-error)",
      deep: "var(--color-error)",
      soft: "var(--color-surface-soft)",
      text: "var(--color-error)",
      border: "color-mix(in srgb, var(--color-error) 22%, transparent)",
      gradient: "var(--color-ink)",
      track: "color-mix(in srgb, var(--color-error) 18%, transparent)",
    };
  }

  if (value < 80) {
    return {
      theme: "mid",
      main: "var(--color-warning)",
      deep: "var(--color-warning)",
      soft: "var(--color-surface-soft)",
      text: "var(--color-warning)",
      border: "color-mix(in srgb, var(--color-warning) 22%, transparent)",
      gradient: "var(--color-ink)",
      track: "color-mix(in srgb, var(--color-warning) 18%, transparent)",
    };
  }

  if (value < 90) {
    return {
      theme: "good",
      main: "var(--color-mute)",
      deep: "var(--color-mute)",
      soft: "var(--color-surface-soft)",
      text: "var(--color-mute)",
      border: "color-mix(in srgb, var(--color-mute) 22%, transparent)",
      gradient: "var(--color-ink)",
      track: "color-mix(in srgb, var(--color-mute) 18%, transparent)",
    };
  }

  return {
    theme: "high",
    main: "var(--color-link-blue)",
    deep: "var(--color-link-blue)",
    soft: "var(--color-canvas)",
    text: "var(--color-link-blue)",
    border: "color-mix(in srgb, var(--color-link-blue) 22%, transparent)",
    gradient: "var(--color-ink)",
    track: "color-mix(in srgb, var(--color-link-blue) 18%, transparent)",
  };
}

function getPriorityDimensions(dimensions) {
  return [...dimensions]
    .sort((a, b) => a.avg - b.avg)
    .slice(0, Math.min(2, dimensions.length))
    .map((item) => item.shortName || item.code)
    .join("、");
}

function getExecutiveSummary(level) {
  if (level === "high") {
    return "整体基础较强，建议保持优势并持续巩固关键准备。";
  }

  if (level === "low") {
    return "当前短板较为集中，建议优先补强关键维度后再稳步推进。";
  }

  return "具备较好基础，建议针对短板进行结构性补强，稳步推进。";
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

function sanitizeFileNamePart(value) {
  return String(value || "")
    .trim()
    .replace(/[\\/:*?"<>|]/g, "")
    .replace(/\s+/g, " ")
    .slice(0, 80);
}

function getPdfReportFileName(report) {
  const identity = sanitizeFileNamePart(report.contactName || report.id);

  if (!identity) {
    return "离婚力量表详细报告.pdf";
  }

  return `离婚力量表详细报告-${identity}.pdf`;
}

function LogoLockup({ compact = false, src }) {
  return (
    <div className={`report-logo-lockup${compact ? " compact" : ""}`}>
      <img
        src={src}
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
    ),
  );
}

function A4TeamIntroPageFooter({ pageNumber, totalPages }) {
  return (
    <footer className="a4-report-page-footer a4-report-team-footer">
      <span>Sandra 婚姻家事团队介绍附录</span>
      <span>
        {String(pageNumber).padStart(2, "0")} /{" "}
        {String(totalPages).padStart(2, "0")}
      </span>
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
        {section.paragraphs.map((paragraph, index) => (
          <p key={`${section.title}-${index}`}>{renderTeamRichText(paragraph)}</p>
        ))}
      </div>
    </section>
  );
}

function A4TeamIntroPages({ startPageNumber, totalPages }) {
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
          <LogoLockup compact src={REPORT_HEADER_LOGO_SRC} />
          <span>团队介绍附录</span>
        </header>

        <main className="a4-report-page-body a4-report-team-body">
          <div className="a4-report-team-hero">
            <div>
              <h2>{teamIntroContent.title}</h2>
              <p>{teamIntroContent.subtitle}</p>
            </div>
          </div>

          <div className="a4-report-team-lead">
            {teamIntroContent.introParagraphs.map((paragraph, index) => (
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
          <LogoLockup compact src={REPORT_HEADER_LOGO_SRC} />
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
            {TEAM_INTRO_FIRST_PAGE_SECTIONS.map((section, index) => (
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
          <LogoLockup compact src={REPORT_HEADER_LOGO_SRC} />
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
            {TEAM_INTRO_SECOND_PAGE_SECTIONS.map((section, index) => (
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
              <h3>{teamIntroContent.closingTitle}</h3>
            </div>
            <div className="a4-report-team-card-copy">
              {teamIntroContent.closingParagraphs.map((paragraph, index) => (
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

function StatIcon({ kind, className = "", style }) {
  const icons = {
    result: <Crown size={24} strokeWidth={2} />,
    score: <ClipboardCheck size={24} strokeWidth={2} />,
    total: <BarChart3 size={24} strokeWidth={2} />,
    dimension: <LayoutGrid size={24} strokeWidth={2} />,
    priority: <Target size={24} strokeWidth={2} />,
    tip: <Lightbulb size={20} strokeWidth={2} />,
  };

  return (
    <span className={`report-mini-icon ${className}`.trim()} style={style}>
      {icons[kind] || <ClipboardCheck size={24} strokeWidth={2} />}
    </span>
  );
}

function MobileLeadReportView({
  report,
  reportRef,
  priorityDimensions,
  overallVisual,
  scoreRateValue,
}) {
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
          <LogoLockup compact src={REPORT_HEADER_LOGO_SRC} />
          <div className="mobile-report-hero-tags">
            <span>内部资料</span>
            <span>仅限内部使用</span>
          </div>
        </div>

        <div className="mobile-report-hero-main">
          <h1>测评结果详细解读报告</h1>
          <p className="mobile-report-subtitle">离婚准备度综合评估</p>
          <p className="mobile-report-generated">
            报告生成时间：{report.reportGeneratedAtText || "-"}
          </p>
          <p className="mobile-report-intro">
            本报告基于对您在心理、经济、亲权、财权、知法、情感与域外七个维度的评估，
            结合当前阶段个体情况，形成离婚准备度综合评估结果与针对性建议，
            为您制定下一步行动计划、优化决策与风险防控提供参考。
          </p>
        </div>
      </header>

      <section className="mobile-report-result-panel">
        <div className="mobile-report-title-row">
          <StatIcon kind="result" />
          <span>您的综合评估结果</span>
        </div>
        <strong className="mobile-report-result-label">{report.totalResult.label}</strong>
        <div className="mobile-report-rate-lockup">
          <strong style={{ color: overallVisual.main }}>{report.scoreRateText}</strong>
          <span>综合得分率</span>
        </div>
        <div
          className="mobile-report-progress"
          style={{ backgroundColor: overallVisual.track }}
          aria-hidden="true"
        >
          <span
            style={{
              width: `${scoreRateValue}%`,
              background: "var(--color-primary)",
            }}
          />
        </div>
        <p className="mobile-report-status" style={{ color: overallVisual.text }}>
          {getScoreRateStatus(report.scoreRateText)}
        </p>
        <p className="mobile-report-result-summary">
          {getExecutiveSummary(report.resultLevel)}
        </p>
      </section>

      <section className="mobile-report-card">
        <div className="mobile-report-section-title">
          <i />
          <h2>关键指标</h2>
        </div>
        <div className="mobile-report-metrics-grid">
          <div className="mobile-report-metric-card">
            <StatIcon kind="score" />
            <span>总分</span>
            <strong>{report.totalScore}</strong>
          </div>
          <div className="mobile-report-metric-card">
            <StatIcon kind="total" />
            <span>动态满分</span>
            <strong>{report.dynamicFullScore}</strong>
          </div>
          <div className="mobile-report-metric-card">
            <StatIcon kind="dimension" />
            <span>纳入维度</span>
            <strong>{report.dimensions.length} 项</strong>
          </div>
          <div className="mobile-report-metric-card">
            <StatIcon kind="priority" />
            <span>优先补强维度</span>
            <strong>{priorityDimensions || "-"}</strong>
          </div>
        </div>
      </section>

      <section className="mobile-report-card mobile-report-overall-card">
        <div className="mobile-report-title-row">
          <StatIcon kind="tip" />
          <h2>总体评价</h2>
        </div>
        <p>{report.totalResult.summary}</p>
      </section>

      <section className="mobile-report-card mobile-report-structure-card">
        <div className="mobile-report-section-title">
          <i />
          <h2>维度结构概览</h2>
        </div>
        <div className="mobile-report-radar-panel">
          <AdminDimensionRadarChart dimensions={report.dimensions} />
        </div>
        <div className="mobile-report-dimension-score-list">
          {report.dimensions.map((dimension) => {
            const scoreMeta = getDimensionScoreVisual(dimension.avg);

            return (
              <div key={dimension.code} className="mobile-report-dimension-score-row">
                <div className="mobile-report-dimension-score-name">
                  <DimensionIcon code={dimension.code} />
                  <h3>{dimension.name}</h3>
                </div>
                <div className="mobile-report-dimension-score-meta">
                  <span>
                    平均分{" "}
                    <strong style={{ color: scoreMeta.main }}>
                      {formatScore(dimension.avg)}
                    </strong>{" "}
                    / 5
                  </span>
                  <span
                    className="mobile-report-score-tag"
                    style={{
                      color: scoreMeta.text,
                      backgroundColor: scoreMeta.soft,
                      borderColor: scoreMeta.border,
                    }}
                  >
                    {scoreMeta.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mobile-report-detail-section">
        <div className="mobile-report-section-title">
          <i />
          <h2>七维度详细解读</h2>
        </div>
        <div className="mobile-report-dimension-detail-list">
          {report.dimensions.map((dimension) => {
            const meta = DIMENSION_META[dimension.code] || DIMENSION_META.D1;
            const scoreMeta = getDimensionScoreVisual(dimension.avg);

            return (
              <section
                key={dimension.code}
                className="mobile-report-dimension-detail-card"
              >
                <div className="mobile-report-dimension-detail-head">
                  <div className="mobile-report-dimension-detail-title">
                    <span
                      className="mobile-report-dimension-code"
                      style={{
                        color: meta.accent,
                        backgroundColor: meta.tint,
                        borderColor: `${meta.accent}33`,
                      }}
                    >
                      {dimension.code}
                    </span>
                    <DimensionIcon code={dimension.code} />
                    <h3>{dimension.name}</h3>
                  </div>
                  <div className="mobile-report-dimension-detail-score">
                    <strong style={{ color: scoreMeta.main }}>
                      {formatScore(dimension.avg)}
                    </strong>
                    <span>/ 5</span>
                    <span
                      className="mobile-report-score-tag"
                      style={{
                        color: scoreMeta.text,
                        backgroundColor: scoreMeta.soft,
                        borderColor: scoreMeta.border,
                      }}
                    >
                      {scoreMeta.label}
                    </span>
                  </div>
                </div>

                <div className="mobile-report-dimension-copy-block">
                  <h4>维度功能说明</h4>
                  <p>{dimension.functionText}</p>
                </div>
                <div className="mobile-report-dimension-copy-block">
                  <h4>当前状态解读</h4>
                  <p>{dimension.analysis}</p>
                </div>
                <div className="mobile-report-dimension-copy-block">
                  <h4>后续提升建议</h4>
                  <p>{dimension.advice}</p>
                </div>
              </section>
            );
          })}
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
          <li>本报告仅用于提供结构化评估与准备方向参考，不构成正式法律、心理、医疗等专业意见。</li>
          <li>报告内容基于当前测评作答生成，可能受个人情况变化和补充信息影响。</li>
          <li>涉及离婚诉讼、抚养权、财产处理、跨境身份等重大决策时，仍建议结合律师等专业人士意见综合判断。</li>
        </ul>
      </section>

      <section className="mobile-report-card mobile-report-team-card">
        <div className="mobile-report-section-title">
          <i />
          <h2>{teamIntroContent.title}</h2>
        </div>
        <div className="mobile-report-team-copy">
          {teamIntroContent.introParagraphs.map((paragraph, index) => (
            <p key={`mobile-team-intro-${index}`}>
              {renderTeamRichText(paragraph)}
            </p>
          ))}
        </div>
      </section>

      <footer className="mobile-report-brand-footer">
        <ReportFooterBrand />
        <p>{REPORT_FOOTER_SLOGAN}</p>
      </footer>
    </article></div>
  );
}

export default function LeadReportPage({ report }) {
  const webReportRef = useRef(null);
  const mobileReportRef = useRef(null);
  const [previewMode, setPreviewMode] = useState("web");
  const [isPreviewMenuOpen, setIsPreviewMenuOpen] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [exportingType, setExportingType] = useState(null);
  const [feedback, setFeedback] = useState({ type: null, message: "" });
  const scoreRateValue = getProgressWidth(report.scoreRateText);
  const priorityDimensions = getPriorityDimensions(report.dimensions);
  const overallVisual = getOverallScoreVisual(report.scoreRateText);
  const currentPreviewLabel = previewMode === "web" ? "网页端报告" : "移动端报告";
  const isExporting = exportingType !== null;
  const exportButtonLabel =
    exportingType === "png"
      ? "正在导出图片..."
      : exportingType === "pdf"
        ? "正在导出 PDF..."
        : "导出报告";
  const includedDimensionText =
    report.dimensions.map((dimension) => dimension.shortName || dimension.code).join("、") ||
    "-";
  const totalA4Pages = report.dimensions.length + 3 + TEAM_INTRO_PAGE_COUNT;
  const teamIntroStartPageNumber = report.dimensions.length + 4;

  function handleSelectPreviewMode(mode) {
    setPreviewMode(mode);
    setIsPreviewMenuOpen(false);
    setIsExportMenuOpen(false);
    setFeedback({ type: null, message: "" });
  }

  async function handleExportImage() {
    const activeExportRef = previewMode === "web" ? webReportRef : mobileReportRef;
    if (!activeExportRef.current || isExporting) return;
    setIsExportMenuOpen(false);
    setExportingType("png");
    setFeedback({ type: null, message: "" });
    try {
      await waitForImages(activeExportRef.current);
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(activeExportRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: getComputedStyle(document.documentElement).getPropertyValue("--color-canvas").trim(),
      });
      const link = document.createElement("a");
      link.download = `lead-report-${previewMode}-${report.id}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      setFeedback({ type: "success", message: "已导出详细解读报告图片。" });
    } catch (error) {
      console.error("Report export failed:", error);
      setFeedback({ type: "error", message: "导出失败，请稍后重试。" });
    } finally {
      setExportingType(null);
    }
  }

  async function handleExportPdf() {
    const reportNode = webReportRef.current;
    if (!reportNode || isExporting) return;
    setIsExportMenuOpen(false);
    setExportingType("pdf");
    setFeedback({ type: null, message: "" });
    try {
      const pageNodes = Array.from(reportNode.querySelectorAll(".a4-report-page"));
      if (pageNodes.length === 0) {
        console.error("PDF export failed: no .a4-report-page nodes found.");
        setFeedback({ type: "error", message: "未找到可导出的 A4 报告页面。" });
        return;
      }
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF({ orientation: "p", unit: "mm", format: "a4", compress: true });
      const pageWidth = 210;
      const pageHeight = 297;
      for (const [index, pageNode] of pageNodes.entries()) {
        await waitForImages(pageNode);
        const { toPng } = await import("html-to-image");
        const dataUrl = await toPng(pageNode, {
          cacheBust: true,
          pixelRatio: 2,
          backgroundColor: getComputedStyle(document.documentElement).getPropertyValue("--color-canvas").trim(),
        });
        if (index > 0) {
          pdf.addPage();
        }
        pdf.addImage(dataUrl, "PNG", 0, 0, pageWidth, pageHeight, undefined, "FAST");
      }
      pdf.save(getPdfReportFileName(report));
      setFeedback({ type: "success", message: "已导出详细解读报告 PDF。" });
    } catch (error) {
      console.error("PDF export failed:", error);
      setFeedback({ type: "error", message: "PDF 导出失败，请稍后重试。" });
    } finally {
      setExportingType(null);
    }
  }

  return (
    <div className="report-page-shell">
      <section className="panel report-toolbar-panel">
        <div>
          <h2 className="report-toolbar-title">用户测评详细解读报告</h2>
          <p className="subtitle">当前页为后台内部预览页，支持固定版心报告图片导出。</p>
        </div>
        <div className="report-toolbar-actions">
          <div className="report-preview-status" aria-live="polite">
            当前预览：<strong>{currentPreviewLabel}</strong>
          </div>
          <div className="toolbar">
            <div className="report-preview-menu-wrap">
              <button
                className="btn btn-muted report-preview-button"
                type="button"
                aria-haspopup="menu"
                aria-expanded={isPreviewMenuOpen}
                onClick={() => {
                  setIsExportMenuOpen(false);
                  setIsPreviewMenuOpen((isOpen) => !isOpen);
                }}
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
                disabled={isExporting}
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
        </div>
      </section>

      {feedback.type ? (
        <div
          className={`notice ${feedback.type === "success" ? "success" : "error"}`}
        >
          {feedback.message}
        </div>
      ) : null}

      <div className="report-preview-viewport"><article
        ref={webReportRef}
        className={`a4-report-document${previewMode === "mobile" ? " a4-report-export-mount" : ""}`}
        aria-hidden={previewMode === "mobile"}
      >
          <section className="a4-report-page a4-report-cover">
            <img
              src={HERO_WATERMARK_SRC}
              alt=""
              aria-hidden="true"
              className="a4-report-watermark a4-report-cover-watermark"
            />
            <header className="a4-report-cover-header">
              <LogoLockup src={REPORT_HEADER_LOGO_SRC} />
              <div className="a4-report-badge-row">
                <span className="a4-report-badge">内部资料</span>
                <span className="a4-report-badge is-muted">仅限内部使用</span>
              </div>
            </header>

            <div className="a4-report-cover-main">
              <div className="a4-report-title-block">
                <p className="a4-report-kicker">离婚准备度综合评估</p>
                <h1>测评结果详细解读报告</h1>
                <p>
                  本报告基于对您在心理、经济、亲权、财权、知法、情感与域外七个维度的评估，
                  结合当前阶段个体情况，形成离婚准备度综合评估结果与针对性建议，
                  为您制定下一步行动计划、优化决策与风险防控提供参考。
                </p>
              </div>

              <div className="a4-report-cover-meta">
                <div>
                  <span>用户称呼</span>
                  <strong>{report.contactName || "-"}</strong>
                </div>
                <div>
                  <span>报告生成时间</span>
                  <strong>{report.reportGeneratedAtText || "-"}</strong>
                </div>
              </div>

              <div className="a4-report-cover-score">
                <div
                  className="a4-report-result-panel"
                  style={{ background: overallVisual.gradient }}
                >
                  <span>您的综合评估结果</span>
                  <strong>{report.totalResult.label}</strong>
                  <p>{getExecutiveSummary(report.resultLevel)}</p>
                </div>
                <div className="a4-report-rate-panel">
                  <span>综合得分率</span>
                  <strong style={{ color: overallVisual.main }}>{report.scoreRateText}</strong>
                  <div
                    className="a4-report-progress-track"
                    style={{ backgroundColor: overallVisual.track }}
                  >
                    <i
                      style={{
                        width: `${scoreRateValue}%`,
                        background: "var(--color-primary)",
                      }}
                    />
                  </div>
                  <p style={{ color: overallVisual.text }}>
                    {getScoreRateStatus(report.scoreRateText)}
                  </p>
                </div>
              </div>
            </div>

            <footer className="a4-report-cover-footer">
              <ReportFooterBrand />
              <p className="a4-report-footer-slogan">{REPORT_FOOTER_SLOGAN}</p>
            </footer>
          </section>

          <section className="a4-report-page a4-report-overview">
            <header className="a4-report-page-header">
              <LogoLockup compact src={REPORT_HEADER_LOGO_SRC} />
              <span>总体评价与维度概览</span>
            </header>

            <main className="a4-report-page-body">
              <div className="a4-report-section-heading">
                <i />
                <div>
                  <h2>总体评价</h2>
                </div>
              </div>

              <div className="a4-report-overall-card">
                <StatIcon kind="tip" className="a4-report-overall-icon" />
                <p>{report.totalResult.summary}</p>
              </div>

              <div className="a4-report-metric-grid">
                <div className="a4-report-metric-card">
                  <StatIcon kind="score" />
                  <span>总分</span>
                  <strong>{report.totalScore}</strong>
                </div>
                <div className="a4-report-metric-card">
                  <StatIcon kind="total" />
                  <span>动态满分</span>
                  <strong>{report.dynamicFullScore}</strong>
                </div>
                <div className="a4-report-metric-card">
                  <StatIcon kind="score" />
                  <span>得分率</span>
                  <strong>{report.scoreRateText}</strong>
                </div>
                <div className="a4-report-metric-card">
                  <StatIcon kind="result" />
                  <span>结果等级</span>
                  <strong>{report.totalResult.label}</strong>
                </div>
                <div className="a4-report-metric-card">
                  <StatIcon kind="dimension" />
                  <span>纳入报告维度</span>
                  <strong>{report.dimensions.length} 项</strong>
                </div>
              </div>

              <div className="a4-report-included-panel">
                <span>纳入报告维度</span>
                <strong>{includedDimensionText}</strong>
              </div>

              <div className="a4-report-section-heading">
                <i />
                <div>
                  <h2>维度结构概览</h2>
                </div>
              </div>

              <div className="a4-report-structure-grid">
                <div className="a4-report-radar-panel">
                  <AdminDimensionRadarChart dimensions={report.dimensions} />
                </div>

                <div className="a4-report-dimension-overview-list">
                  {report.dimensions.map((dimension) => {
                    const meta = DIMENSION_META[dimension.code] || DIMENSION_META.D1;
                    const scoreMeta = getDimensionScoreVisual(dimension.avg);

                    return (
                      <section key={dimension.code} className="a4-report-dimension-overview-card">
                        <div className="a4-report-dimension-overview-name">
                          <span
                            className="a4-report-dimension-code"
                            style={{
                              color: meta.accent,
                              backgroundColor: meta.tint,
                              borderColor: `${meta.accent}33`,
                            }}
                          >
                            {dimension.code}
                          </span>
                          <div>
                            <h3>{dimension.shortName || meta.shortLabel}</h3>
                            <p>{dimension.name}</p>
                          </div>
                        </div>
                        <div className="a4-report-dimension-overview-score">
                          <strong style={{ color: scoreMeta.main }}>
                            {formatScore(dimension.avg)}
                          </strong>
                          <span>/ 5</span>
                        </div>
                      </section>
                    );
                  })}
                </div>
              </div>
            </main>

            <footer className="a4-report-page-footer">
              <span>测评结果详细解读报告</span>
              <span>02 / {String(totalA4Pages).padStart(2, "0")}</span>
            </footer>
          </section>

          {report.dimensions.map((dimension, index) => {
            const meta = DIMENSION_META[dimension.code] || DIMENSION_META.D1;
            const scoreMeta = getDimensionScoreVisual(dimension.avg);
            const pageNumber = index + 3;

            return (
              <section
                key={dimension.code}
                className="a4-report-page a4-report-dimension-page"
              >
                <header className="a4-report-page-header">
                  <LogoLockup compact src={REPORT_HEADER_LOGO_SRC} />
                  <span>维度详细解读</span>
                </header>

                <main className="a4-report-page-body">
                  <div className="a4-report-dimension-hero">
                    <div className="a4-report-dimension-title">
                      <span
                        className="a4-report-dimension-code is-large"
                        style={{
                          color: meta.accent,
                          backgroundColor: meta.tint,
                          borderColor: `${meta.accent}33`,
                        }}
                      >
                        {dimension.code}
                      </span>
                      <div>
                        <h2>{dimension.name}</h2>
                        <p>{dimension.functionText}</p>
                      </div>
                    </div>
                    <div className="a4-report-dimension-score-card">
                      <span>平均分</span>
                      <strong style={{ color: scoreMeta.main }}>
                        {formatScore(dimension.avg)}
                      </strong>
                      <em>/ 5</em>
                      <i
                        style={{
                          color: scoreMeta.text,
                          backgroundColor: scoreMeta.soft,
                          borderColor: scoreMeta.border,
                        }}
                      >
                        {scoreMeta.label}
                      </i>
                    </div>
                  </div>

                  <div className="a4-report-dimension-copy-grid">
                    <section className="a4-report-copy-block">
                      <h3>维度功能说明</h3>
                      <p>{dimension.functionText}</p>
                    </section>
                    <section className="a4-report-copy-block">
                      <h3>当前状态解读</h3>
                      <p>{dimension.analysis}</p>
                    </section>
                    <section className="a4-report-copy-block">
                      <h3>后续提升建议</h3>
                      <p>{dimension.advice}</p>
                    </section>
                  </div>
                </main>

                <footer className="a4-report-page-footer">
                  <span>{dimension.code} · {dimension.name}</span>
                  <span>
                    {String(pageNumber).padStart(2, "0")} /{" "}
                    {String(totalA4Pages).padStart(2, "0")}
                  </span>
                </footer>
              </section>
            );
          })}

          <section className="a4-report-page a4-report-boundary-page">
            <img
              src={BOUNDARY_WATERMARK_SRC}
              alt=""
              aria-hidden="true"
              className="a4-report-watermark a4-report-boundary-watermark"
            />
            <header className="a4-report-page-header">
              <LogoLockup compact src={REPORT_HEADER_LOGO_SRC} />
              <span>报告使用边界</span>
            </header>

            <main className="a4-report-page-body">
              <div className="a4-report-boundary-title">
                <span className="a4-report-boundary-icon">
                  <FileCheck2 aria-hidden="true" strokeWidth={2} />
                </span>
                <div>
                  <h2>报告使用边界</h2>
                </div>
              </div>

              <ul className="a4-report-boundary-list">
                <li>本报告仅用于提供结构化评估与准备方向参考，不构成正式法律意见或诉讼策略。</li>
                <li>报告内容基于当前测评作答生成，可能受个人情况变化和补充信息影响。</li>
                <li>涉及离婚诉讼、抚养权、财产处理、跨境身份等重大决策时，仍建议结合律师等专业人士意见综合判断。</li>
              </ul>
            </main>

            <footer className="a4-report-final-footer">
              <ReportFooterBrand />
              <p className="a4-report-footer-slogan">{REPORT_FOOTER_SLOGAN}</p>
            </footer>
          </section>

          <A4TeamIntroPages
            startPageNumber={teamIntroStartPageNumber}
            totalPages={totalA4Pages}
          />
      </article></div>

      {previewMode === "mobile" ? (
        <MobileLeadReportView
          report={report}
          reportRef={mobileReportRef}
          priorityDimensions={priorityDimensions}
          overallVisual={overallVisual}
          scoreRateValue={scoreRateValue}
        />
      ) : null}
    </div>
  );
}
