import ResultNavigation from "../ResultNavigation.js";
import { useRef, useState } from "react";
import {
  NARCISSISM_RISK_DIMENSION_ORDER,
  NARCISSISM_RISK_DIMENSIONS,
  NARCISSISM_RISK_QUESTION_COUNT,
} from "../../data/narcissismRiskQuestions.js";
import {
  NARCISSISM_RISK_DISCLAIMER_COPY,
  NARCISSISM_RISK_HIGH_RISK_COPY,
  NARCISSISM_RISK_LEVELS,
  NARCISSISM_RISK_VALIDITY_COPY,
} from "../../data/narcissismRiskResultCopy.js";
import { WECOM_ASSISTANT_QR_PATH } from "../../data/resultPageConfig.js";
import {
  NARCISSISM_RISK_SERVICE_INTENT_OPTIONS,
  buildNarcissismRiskSubmissionPayload,
  resolveNarcissismRiskServiceIntent,
} from "../../lib/buildNarcissismRiskSubmissionPayload.js";
import { submitAssessmentResult } from "../../lib/assessmentDatabaseClient.js";
import NarcissismRiskLeadCapturePanel from "./NarcissismRiskLeadCapturePanel.js";
import NarcissismRiskRadarChart from "./NarcissismRiskRadarChart.js";
import NarcissismRiskSimpleResultExportCard from "./NarcissismRiskSimpleResultExportCard.js";
import styles from "./narcissismRisk.module.css";

const RESULT_HERO_CLASS = {
  low: styles.resultHeroLow,
  mild: styles.resultHeroMild,
  moderate: styles.resultHeroModerate,
  high: styles.resultHeroHigh,
};

const RISK_BADGE_CLASS = {
  low: styles.riskBadgeLow,
  mild: styles.riskBadgeMild,
  moderate: styles.riskBadgeModerate,
  high: styles.riskBadgeHigh,
};

function formatScore(value) {
  return Number.isFinite(value) ? value.toFixed(2) : "0.00";
}

const CONTACT_NAME_PATTERN = /^[\u4e00-\u9fa5A-Za-z·\-\s]{2,30}$/;
const CONTACT_PHONE_PATTERN = /^\+?[0-9\s().-]{7,24}$/;
const CONTACT_NAME_ERROR_MESSAGE = "请输入 2–30 个中英文字的称呼。";
const CONTACT_PHONE_ERROR_MESSAGE = "请输入有效的联系电话。";
const FORM_INCOMPLETE_HINT =
  "请选择服务类型，并填写有效的称呼和联系电话后提交。";
const FORM_FIELD_ERROR_HINT = "请先修正上方标红的信息后再提交。";

function validateContactName(value) {
  return CONTACT_NAME_PATTERN.test(String(value ?? "").trim());
}

function validateContactPhone(value) {
  const phone = String(value ?? "").trim();
  const digitCount = phone.replace(/\D/g, "").length;
  return CONTACT_PHONE_PATTERN.test(phone) && digitCount >= 7 && digitCount <= 15;
}

function NarcissismRiskSubmitSuccessModal({ serviceIntent, onClose }) {
  const isDeepReport = serviceIntent === "deep_report";
  const successMessage =
    serviceIntent === "legal_support"
      ? "您的测评结果已成功提交。工作人员会根据您的个人情况为您匹配专业法律顾问，并于3个工作日内联系您，请留意微信好友申请或保持电话畅通。"
      : serviceIntent === "psychological_support"
        ? "您的测评结果已成功提交。工作人员会根据您的个人情况为您匹配专业心理支持人员，并于3个工作日内联系您，请留意微信好友申请或保持电话畅通。"
        : "您的测评结果已成功提交。请添加小助理微信，获取您的测评结果深度分析报告。";

  return (
    <div className={styles.successModalOverlay}>
      <div
        className={styles.successModalDialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="narcissism-risk-submit-success-title"
      >
        <h2 id="narcissism-risk-submit-success-title">提交成功</h2>
        <p>{successMessage}</p>
        {isDeepReport && (
          <div className={styles.successModalQrPanel}>
            <img src={WECOM_ASSISTANT_QR_PATH} alt="小助理微信二维码" />
          </div>
        )}
        <button type="button" className={styles.primaryButton} onClick={onClose}>
          知道了
        </button>
      </div>
    </div>
  );
}

function getDimensionValidityNotice(dimensionDetails) {
  if (!dimensionDetails) return null;

  const affectedDimensions = NARCISSISM_RISK_DIMENSION_ORDER.filter((code) => {
    const detail = dimensionDetails[code];
    return detail?.insufficient_validity || detail?.no_valid_answers;
  });

  if (affectedDimensions.length === 0) return null;

  const noValidDimensions = affectedDimensions.filter(
    (code) => dimensionDetails[code]?.no_valid_answers
  );
  const hasNoValidAnswers = noValidDimensions.length > 0;
  const affectedDimensionNames = affectedDimensions
    .map((code) => NARCISSISM_RISK_DIMENSIONS[code].shortName)
    .join("、");

  return {
    title: NARCISSISM_RISK_VALIDITY_COPY.dimensionLowValidity.title,
    body: hasNoValidAnswers
      ? "部分维度有效作答不足，相关维度暂无法形成稳定分数。"
      : NARCISSISM_RISK_VALIDITY_COPY.dimensionLowValidity.body,
    affectedDimensionNames,
    hasNoValidAnswers,
  };
}

export default function NarcissismRiskResultScreen({
  scoringResult,
  answers,
  questionOrder,
  onRestart,
}) {
  const exportCardRef = useRef(null);
  const submitLockRef = useRef(false);
  const [serviceIntent, setServiceIntent] = useState("");
  const [submittedServiceIntent, setSubmittedServiceIntent] = useState(null);
  const [isSubmitSuccessModalOpen, setIsSubmitSuccessModalOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    contact_name: "",
    contact_phone: "",
    contact_wechat: "",
  });
  const [contactTouched, setContactTouched] = useState({
    contact_name: false,
    contact_phone: false,
  });
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [contactFeedback, setContactFeedback] = useState({
    type: null,
    message: "",
  });
  const [submitStatus, setSubmitStatus] = useState("idle");
  const [submitFeedback, setSubmitFeedback] = useState({
    type: null,
    message: "",
  });
  const [exportStatus, setExportStatus] = useState("idle");
  const [exportFeedback, setExportFeedback] = useState({
    type: null,
    message: "",
  });

  const levelCopy = NARCISSISM_RISK_LEVELS.find(
    (item) => item.level === scoringResult.result_level
  );
  const highRiskCopy = NARCISSISM_RISK_HIGH_RISK_COPY.triggered;
  const dimensionValidityNotice = getDimensionValidityNotice(
    scoringResult.dimension_details
  );
  const hasNaAnswers = scoringResult.na_answer_count > 0;

  const radarDimensions = NARCISSISM_RISK_DIMENSION_ORDER.map((code) => ({
    code,
    name: NARCISSISM_RISK_DIMENSIONS[code].name,
    shortName: NARCISSISM_RISK_DIMENSIONS[code].shortName,
    score: scoringResult.dimension_scores[code],
    detail: scoringResult.dimension_details?.[code],
  }));

  const isServiceIntentValid = Boolean(
    resolveNarcissismRiskServiceIntent(serviceIntent)
  );
  const isContactNameValid = validateContactName(contactForm.contact_name);
  const isContactPhoneValid = validateContactPhone(contactForm.contact_phone);
  const canSubmitLead =
    isServiceIntentValid && isContactNameValid && isContactPhoneValid;
  const contactFieldErrors = {
    contact_name:
      (contactTouched.contact_name || submitAttempted) && !isContactNameValid
        ? CONTACT_NAME_ERROR_MESSAGE
        : "",
    contact_phone:
      (contactTouched.contact_phone || submitAttempted) && !isContactPhoneValid
        ? CONTACT_PHONE_ERROR_MESSAGE
        : "",
  };
  const hasVisibleContactFieldError = Boolean(
    contactFieldErrors.contact_name || contactFieldErrors.contact_phone
  );
  const leadFormHintMessage = hasVisibleContactFieldError
    ? FORM_FIELD_ERROR_HINT
    : FORM_INCOMPLETE_HINT;

  const handleServiceIntentChange = (value) => {
    if (submitStatus === "submitting" || submitStatus === "success") return;

    const resolvedIntent = resolveNarcissismRiskServiceIntent(value);
    setServiceIntent(resolvedIntent?.value ?? "");
    if (contactFeedback.type) {
      setContactFeedback({
        type: null,
        message: "",
      });
    }
    if (submitFeedback.type) {
      setSubmitFeedback({
        type: null,
        message: "",
      });
    }
  };

  const handleContactFieldChange = (field, value) => {
    if (submitStatus === "success") return;

    if (field === "contact_name" || field === "contact_phone") {
      setContactTouched((previousTouched) => ({
        ...previousTouched,
        [field]: true,
      }));
    }

    setContactForm((previousForm) => ({
      ...previousForm,
      [field]: value,
    }));
    if (contactFeedback.type) {
      setContactFeedback({
        type: null,
        message: "",
      });
    }
    if (submitFeedback.type) {
      setSubmitFeedback({
        type: null,
        message: "",
      });
    }
  };

  const handleContactFieldBlur = (field) => {
    if (field !== "contact_name" && field !== "contact_phone") return;

    setContactTouched((previousTouched) => ({
      ...previousTouched,
      [field]: true,
    }));
  };

  const handleSubmitLead = async () => {
    if (
      submitLockRef.current ||
      submitStatus === "submitting" ||
      submitStatus === "success"
    ) {
      return;
    }

    setSubmitAttempted(true);

    const contact = {
      contact_name: contactForm.contact_name.trim(),
      contact_phone: contactForm.contact_phone.trim(),
      contact_wechat: contactForm.contact_wechat.trim(),
    };
    const resolvedServiceIntent = resolveNarcissismRiskServiceIntent(serviceIntent);

    if (
      !resolvedServiceIntent ||
      !validateContactName(contact.contact_name) ||
      !validateContactPhone(contact.contact_phone)
    ) {
      setContactTouched({
        contact_name: true,
        contact_phone: true,
      });
      return;
    }

    submitLockRef.current = true;
    setSubmitStatus("submitting");
    setContactFeedback({
      type: null,
      message: "",
    });
    setSubmitFeedback({
      type: null,
      message: "",
    });

    try {
      const payload = buildNarcissismRiskSubmissionPayload({
        scoringResult,
        contact,
        serviceIntent: resolvedServiceIntent.value,
        answers,
        questionOrder,
      });

      const { error } = await submitAssessmentResult(payload);

      if (error) {
        throw error;
      }

      setContactForm(contact);
      setServiceIntent(resolvedServiceIntent.value);
      setSubmittedServiceIntent(resolvedServiceIntent.value);
      setSubmitStatus("success");
      setIsSubmitSuccessModalOpen(true);
      setSubmitFeedback({
        type: "success",
        message: "信息已提交成功。",
      });
    } catch (error) {
      console.error("Failed to submit narcissism risk result:", error);
      setSubmitStatus("error");
      setSubmitFeedback({
        type: "error",
        message:
          "提交失败，请检查网络后重试。如多次失败，您可以先截图保存当前结果。",
      });
    } finally {
      submitLockRef.current = false;
    }
  };

  const handleExportSimpleResultImage = async () => {
    if (exportStatus === "exporting") return;
    if (!exportCardRef.current) {
      setExportStatus("error");
      setExportFeedback({
        type: "error",
        message: "结果图生成失败，请稍后重试，或先截图保存当前页面。",
      });
      return;
    }
    setExportStatus("exporting");
    setExportFeedback({
      type: null,
      message: "",
    });
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(exportCardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: getComputedStyle(document.documentElement).getPropertyValue("--color-canvas").trim(),
      });
      const link = document.createElement("a");
      link.download = `narcissism-risk-result-${scoringResult.result_level}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      setExportStatus("idle");
    } catch (error) {
      console.error("Failed to export narcissism risk result image:", error);
      setExportStatus("error");
      setExportFeedback({
        type: "error",
        message: "结果图生成失败，请稍后重试，或先截图保存当前页面。",
      });
    }
  };

  return (
    <main className={styles.pageShell}>
      <div className={styles.pageFrame}>
        <ResultNavigation />
        <section className={styles.resultContainer}>
          <div className={styles.resultLayout}>
            <div
              id="result-overview" className={`${styles.resultHero} ${
                RESULT_HERO_CLASS[scoringResult.result_level] ?? ""
              }`}
            >
              <div className={styles.resultTopline}>
                <span className={`${styles.topLabel} ${styles.resultTopLabel}`}>
                  配偶高自恋特质与高冲突婚姻风险自测结果
                </span>
                <span
                  className={`${styles.riskBadge} ${
                    RISK_BADGE_CLASS[scoringResult.result_level] ?? ""
                  }`}
                >
                  {scoringResult.result_label}
                </span>
              </div>
              <h1>{levelCopy?.shortLabel ?? scoringResult.result_label}</h1>
              <p className={styles.resultSummary}>
                {levelCopy?.summary ?? "本次测评结果已生成，请结合现实事件理解。"}
              </p>

              <div className={styles.metricGrid}>
                <div className={styles.metricItem}>
                  <span>总平均分</span>
                  <strong>{formatScore(scoringResult.average_score)} / 5</strong>
                </div>
                <div className={styles.metricItem}>
                  <span>总分 / 动态满分</span>
                  <strong>
                    {scoringResult.total_score} / {scoringResult.dynamic_full_score}
                  </strong>
                </div>
                <div className={styles.metricItem}>
                  <span>有效作答</span>
                  <strong>
                    {scoringResult.valid_answer_count} /{" "}
                    {NARCISSISM_RISK_QUESTION_COUNT}
                  </strong>
                </div>
                <div className={styles.metricItem}>
                  <span>与本人情况无关</span>
                  <strong>{scoringResult.na_answer_count}</strong>
                </div>
                <div className={styles.metricItem}>
                  <span>高风险触发</span>
                  <strong>{scoringResult.high_risk_triggered ? "是" : "否"}</strong>
                </div>
              </div>

              <p className={styles.directionText}>
                分数越高，代表相关高自恋互动特征与高冲突风险信号越明显。
                {hasNaAnswers
                  ? ` 选择“与本人情况无关”的题目不计入总分和动态满分，本次共 ${scoringResult.na_answer_count} 题。`
                  : ""}
              </p>
            </div>

            {scoringResult.high_risk_triggered && (
              <div className={`${styles.riskCard} ${styles.riskCardTriggered}`}>
                <h2>安全风险提示</h2>
                <p>{highRiskCopy.body}</p>
                {highRiskCopy.footer && (
                  <p className={styles.riskFooter}>{highRiskCopy.footer}</p>
                )}
              </div>
            )}

            <div className={styles.resultMainGrid}>
              <div id="result-dimensions" className={styles.sectionPanel}>
                <h2 className={styles.sectionTitle}>五维雷达图</h2>
                <p className={styles.bodyText}>
                  雷达图用于呈现五类风险信号的相对分布。分数越高，代表该维度相关风险信号越明显；如某维度有效作答不足，雷达图仅供参考。
                </p>
                <div className={styles.radarWrap}>
                  <NarcissismRiskRadarChart dimensions={radarDimensions} />
                </div>
                {scoringResult.low_validity && (
                  <div className={styles.inlineValidityText}>
                    <strong>{NARCISSISM_RISK_VALIDITY_COPY.lowValidity.title}</strong>
                    <span>{NARCISSISM_RISK_VALIDITY_COPY.lowValidity.body}</span>
                  </div>
                )}
                {dimensionValidityNotice && (
                  <div
                    className={`${styles.inlineValidityText} ${
                      dimensionValidityNotice.hasNoValidAnswers
                        ? styles.inlineValidityTextStrong
                        : ""
                    }`}
                  >
                    <strong>{dimensionValidityNotice.title}</strong>
                    <span>{dimensionValidityNotice.body}</span>
                    <span>
                      有效作答不足维度：
                      {dimensionValidityNotice.affectedDimensionNames}
                    </span>
                  </div>
                )}
                <div className={styles.radarActions}>
                  <button
                    type="button"
                    className={styles.secondaryButton}
                    onClick={handleExportSimpleResultImage}
                    disabled={exportStatus === "exporting"}
                  >
                    {exportStatus === "exporting"
                      ? "正在生成..."
                      : "下载简版测评结果"}
                  </button>
                  {exportFeedback?.type === "error" && (
                    <p className={`${styles.formFeedback} ${styles.formFeedbackError}`}>
                      {exportFeedback.message}
                    </p>
                  )}
                </div>
              </div>

              <NarcissismRiskLeadCapturePanel
                serviceIntent={serviceIntent}
                serviceIntentOptions={NARCISSISM_RISK_SERVICE_INTENT_OPTIONS}
                contactForm={contactForm}
                contactFieldErrors={contactFieldErrors}
                contactFeedback={contactFeedback}
                canSubmitLead={canSubmitLead}
                formHintMessage={leadFormHintMessage}
                formHintType={hasVisibleContactFieldError ? "error" : "neutral"}
                submitStatus={submitStatus}
                submitFeedback={submitFeedback}
                onServiceIntentChange={handleServiceIntentChange}
                onSubmit={handleSubmitLead}
                onRestart={onRestart}
                onContactFieldChange={handleContactFieldChange}
                onContactFieldBlur={handleContactFieldBlur}
              />
            </div>

            {isSubmitSuccessModalOpen && (
              <NarcissismRiskSubmitSuccessModal
                serviceIntent={submittedServiceIntent ?? serviceIntent}
                onClose={() => setIsSubmitSuccessModalOpen(false)}
              />
            )}

            <div className={styles.disclaimerPanel}>
              <h2>免责声明</h2>
              <p>{NARCISSISM_RISK_DISCLAIMER_COPY.full}</p>
            </div>

            <div className={styles.exportHiddenWrap} aria-hidden="true">
              <div ref={exportCardRef} className={styles.exportCaptureTarget}>
                <NarcissismRiskSimpleResultExportCard
                  scoringResult={scoringResult}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
