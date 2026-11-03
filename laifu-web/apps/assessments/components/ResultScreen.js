import ResultNavigation from "./ResultNavigation.js";
import { useRef, useState } from "react";
import { formatRate } from "../lib/scoring.js";
import { WECOM_ASSISTANT_QR_PATH } from "../data/resultPageConfig.js";
import DimensionRadarChart from "./DimensionRadarChart.js";
import SimpleResultExportCard from "./SimpleResultExportCard.js";

function getPrimaryButtonText(isSubmitting, hasSubmitted) {
    if (hasSubmitted) return "已提交";
    if (isSubmitting) return "提交中...";
    return "保存结果并提交信息";
}

function SubmitSuccessModal({ serviceIntent, onClose }) {
    const isDeepReport = serviceIntent === "deep_report";
    const successMessage =
        serviceIntent === "legal_support"
            ? "您的测评结果已成功提交。法律支持人员将在 3 个工作日内结合您的测评结果与具体情况联系您，请保持电话或微信畅通。"
            : serviceIntent === "psychological_support"
            ? "您的测评结果已成功提交。心理支持人员将在 3 个工作日内结合您的测评结果与具体情况联系您，请保持电话或微信畅通。"
            : "您的测评结果已成功提交。请添加小助理微信，获取您的测评结果深度分析报告。";

    return (
        <div className="success-modal-overlay">
            <div
                className="success-modal-dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="divorce-readiness-submit-success-title"
            >
                <h2 id="divorce-readiness-submit-success-title">{"提交成功"}</h2>
                <p>{successMessage}</p>
                {isDeepReport && (
                    <div className="success-modal-qr-panel">
                        <img src={WECOM_ASSISTANT_QR_PATH} alt="小助理微信二维码" />
                    </div>
                )}
                <button type="button" className="primary-btn" onClick={onClose}>
                    {"知道了"}
                </button>
            </div>
        </div>
    );
}

export default function ResultScreen({
    resultData,
    onRestart,
    onSubmitResult,
    isSubmitting,
    hasSubmitted,
    submitFeedback,
    serviceIntent,
    submittedServiceIntent,
    serviceIntentOptions,
    contactForm,
    contactFieldErrors,
    contactFeedback,
    canSubmitLead,
    formHintMessage,
    formHintType,
    onServiceIntentChange,
    onContactFieldChange,
    onContactFieldBlur,
    onCloseSubmitSuccessModal,
}) {
    const exportCardRef = useRef(null);
    const [isExporting, setIsExporting] = useState(false);
    const [exportFeedback, setExportFeedback] = useState({
        type: null,
        message: "",
    });
    const shouldShowFormHint = !hasSubmitted && !isSubmitting && !canSubmitLead;

    const handleExportSimpleResultImage = async () => {
        if (!exportCardRef.current || isExporting) return;
        setIsExporting(true);
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
            const fileName = `result-simple-${resultData.levelKey}-${Date.now()}.png`;
            const link = document.createElement("a");
            link.download = fileName;
            link.href = dataUrl;
            link.click();
            setExportFeedback({
                type: "success",
                message: "已生成简洁版结果图。",
            });
        } catch (error) {
            console.error("Export image failed:", error);
            setExportFeedback({
                type: "error",
                message: "导出失败，请稍后重试。",
            });
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <main className="page-shell">
            <ResultNavigation />
            <section className="result-layout">
                <div id="result-overview" className={`result-hero theme-${resultData.levelKey}`}>
                    <div className="result-label">{"您的离婚准备评估结果"}</div>
                    <h1>{resultData.level.label}</h1>
                    <p>{resultData.level.subtitle}</p>

                    <div className="result-metrics">
                        <div className="metric-card">
                            <span>{"总分"}</span>
                            <strong>{resultData.totalScore}</strong>
                        </div>
                        <div className="metric-card">
                            <span>{"动态满分"}</span>
                            <strong>{resultData.dynamicFullScore}</strong>
                        </div>
                        <div className="metric-card">
                            <span>{"得分率"}</span>
                            <strong>{formatRate(resultData.scoreRate)}</strong>
                        </div>
                    </div>
                </div>

                <div id="result-dimensions" className="result-main-card">
                    <div className="radar-section">
                        <h2>{"维度雷达图"}</h2>
                        <DimensionRadarChart dimensions={resultData.radarDimensions} />
                    </div>

                    <div className="result-export-actions">
                        <button
                            className="secondary-btn"
                            onClick={handleExportSimpleResultImage}
                            disabled={isExporting}
                        >
                            {isExporting ? "导出中..." : "下载简要测评报告"}
                        </button>
                        {exportFeedback.type && (
                            <p
                                className={`submit-feedback ${
                                    exportFeedback.type === "success"
                                        ? "submit-feedback-success"
                                        : "submit-feedback-error"
                                }`}
                            >
                                {exportFeedback.message}
                            </p>
                        )}
                    </div>
                </div>

                <div id="result-support" className="result-side-card">
                    <h2>{"获取后续支持"}</h2>
                    <p className="result-submit-tip">
                        {
                            "如果您正在考虑离婚、已经进入分居或协商阶段，或正在面对财产分割、子女抚养、跨境身份、情绪压力等问题，希望获取深度分析报告、法律支持或心理支持，可以留下您的联系方式，并选择您希望获得的后续服务类型。我们将根据您的测评结果与选择，为您提供相应的后续服务。"
                        }
                    </p>

                    <div className="contact-form-wrap">
                        <div className="contact-form-grid">
                            <label className="contact-form-field">
                                <span>{"您希望获得的帮助"}</span>
                                <select
                                    value={serviceIntent}
                                    onChange={(e) =>
                                        onServiceIntentChange(e.target.value)
                                    }
                                    disabled={isSubmitting || hasSubmitted}
                                >
                                    <option value="" disabled>
                                        {"请选择"}
                                    </option>
                                    {serviceIntentOptions.map((item) => (
                                        <option key={item.value} value={item.value}>
                                            {item.label}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label className="contact-form-field">
                                <span>{"称呼（必填）"}</span>
                                <input
                                    type="text"
                                    value={contactForm.contact_name}
                                    className={
                                        contactFieldErrors.contact_name
                                            ? "field-input-error"
                                            : ""
                                    }
                                    onChange={(e) =>
                                        onContactFieldChange(
                                            "contact_name",
                                            e.target.value
                                        )
                                    }
                                    onBlur={() => onContactFieldBlur("contact_name")}
                                    placeholder="请输入您的称呼"
                                    disabled={isSubmitting || hasSubmitted}
                                    aria-invalid={Boolean(
                                        contactFieldErrors.contact_name
                                    )}
                                    aria-describedby={
                                        contactFieldErrors.contact_name
                                            ? "divorce-contact-name-error"
                                            : undefined
                                    }
                                />
                                {contactFieldErrors.contact_name && (
                                    <p
                                        id="divorce-contact-name-error"
                                        className="field-error"
                                    >
                                        {contactFieldErrors.contact_name}
                                    </p>
                                )}
                            </label>
                            <label className="contact-form-field">
                                <span>{"联系电话（必填）"}</span>
                                <input
                                    type="tel"
                                    value={contactForm.contact_phone}
                                    className={
                                        contactFieldErrors.contact_phone
                                            ? "field-input-error"
                                            : ""
                                    }
                                    onChange={(e) =>
                                        onContactFieldChange(
                                            "contact_phone",
                                            e.target.value
                                        )
                                    }
                                    onBlur={() => onContactFieldBlur("contact_phone")}
                                    placeholder="手机号或国际号码"
                                    inputMode="tel"
                                    disabled={isSubmitting || hasSubmitted}
                                    aria-invalid={Boolean(
                                        contactFieldErrors.contact_phone
                                    )}
                                    aria-describedby={
                                        contactFieldErrors.contact_phone
                                            ? "divorce-contact-phone-error"
                                            : undefined
                                    }
                                />
                                {contactFieldErrors.contact_phone && (
                                    <p
                                        id="divorce-contact-phone-error"
                                        className="field-error"
                                    >
                                        {contactFieldErrors.contact_phone}
                                    </p>
                                )}
                            </label>
                            <label className="contact-form-field">
                                <span>{"微信号（选填）"}</span>
                                <input
                                    type="text"
                                    value={contactForm.contact_wechat}
                                    onChange={(e) =>
                                        onContactFieldChange(
                                            "contact_wechat",
                                            e.target.value
                                        )
                                    }
                                    placeholder="请输入微信号"
                                    disabled={isSubmitting || hasSubmitted}
                                />
                            </label>
                        </div>
                        {contactFeedback?.type === "error" && (
                            <p className="submit-feedback submit-feedback-error">
                                {contactFeedback.message}
                            </p>
                        )}
                    </div>

                    <div className="intro-actions contact-form-actions">
                        <button
                            className="primary-btn"
                            onClick={onSubmitResult}
                            disabled={isSubmitting || hasSubmitted || !canSubmitLead}
                        >
                            {getPrimaryButtonText(isSubmitting, hasSubmitted)}
                        </button>

                        <button className="secondary-btn" onClick={onRestart}>
                            {"重新测评"}
                        </button>
                    </div>
                    {shouldShowFormHint && (
                        <p
                            className={`form-hint ${
                                formHintType === "error" ? "form-hint-error" : ""
                            }`}
                        >
                            {formHintMessage}
                        </p>
                    )}
                    {submitFeedback?.type && (
                        <p
                            className={`submit-feedback ${
                                submitFeedback.type === "success"
                                    ? "submit-feedback-success"
                                    : "submit-feedback-error"
                            }`}
                        >
                            {submitFeedback.message}
                        </p>
                    )}
                </div>

                {submittedServiceIntent && (
                    <SubmitSuccessModal
                        serviceIntent={submittedServiceIntent}
                        onClose={onCloseSubmitSuccessModal}
                    />
                )}

                <div className="export-hidden-wrap" aria-hidden="true">
                    <div ref={exportCardRef} className="export-capture-target">
                        <SimpleResultExportCard resultData={resultData} />
                    </div>
                </div>
            </section>
        </main>
    );
}
