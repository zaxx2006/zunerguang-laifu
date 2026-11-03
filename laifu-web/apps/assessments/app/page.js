"use client";

import dynamic from "next/dynamic";
import { useMemo, useRef, useState } from "react";
import { DIMENSION_META, QUESTIONS, QUESTION_MAP } from "../data/questions.js";
import {
    DIMENSION_ADVICE_COPY,
    DIMENSION_ORDER,
    RESULT_COPY,
} from "../data/resultCopy.js";
import { getLevelKey, getScore } from "../lib/scoring.js";
import {
    DIVORCE_READINESS_SERVICE_INTENT_OPTIONS,
    buildSubmissionPayload,
    resolveDivorceReadinessServiceIntent,
} from "../lib/buildSubmissionPayload.js";
import { submitAssessmentResult } from "../lib/assessmentDatabaseClient.js";
import IntroScreen from "../components/IntroScreen.js";
import QuestionScreen from "../components/QuestionScreen.js";

const ResultScreen = dynamic(() => import("../components/ResultScreen.js"), {
    loading: () => null,
});

const SYSTEM_QUESTION_IDS = ["SYS_CHILD_GATE", "SYS_CROSS_BORDER_GATE"];
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

function shuffleQuestionIds(questionIds) {
    const shuffled = [...questionIds];
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function filterInapplicableAnswers(nextAnswers) {
    const filtered = { ...nextAnswers };

    if (filtered.SYS_CHILD_GATE === "no") {
        Object.keys(filtered).forEach((key) => {
            if (key.startsWith("D3_")) delete filtered[key];
        });
    }

    if (filtered.SYS_CROSS_BORDER_GATE === "no") {
        Object.keys(filtered).forEach((key) => {
            if (key.startsWith("D7_")) delete filtered[key];
        });
    }

    return filtered;
}

function buildSessionQuestionIds(answers) {
    const safeAnswers = answers ?? {};
    const hasChildGate =
        safeAnswers.SYS_CHILD_GATE === "yes" || safeAnswers.SYS_CHILD_GATE === "no";
    const hasCrossBorderGate =
        safeAnswers.SYS_CROSS_BORDER_GATE === "yes" ||
        safeAnswers.SYS_CROSS_BORDER_GATE === "no";

    if (!hasChildGate || !hasCrossBorderGate) {
        return SYSTEM_QUESTION_IDS;
    }

    const includeD3 = safeAnswers.SYS_CHILD_GATE !== "no";
    const includeD7 = safeAnswers.SYS_CROSS_BORDER_GATE !== "no";

    const regularQuestionIds = QUESTIONS.filter((q) => {
        if (q.system) return false;
        if (!includeD3 && q.dimension === "D3") return false;
        if (!includeD7 && q.dimension === "D7") return false;
        return true;
    }).map((q) => q.id);

    return [...SYSTEM_QUESTION_IDS, ...shuffleQuestionIds(regularQuestionIds)];
}

function getAdviceBand(avg) {
    if (avg < 3) return "low";
    if (avg < 4) return "mid";
    return "high";
}

function buildPersonalizedAdviceText(validDimensions) {
    const dimensionByCode = Object.fromEntries(
        validDimensions.map((item) => [item.code, item])
    );

    const groupedAdvice = {
        low: [],
        mid: [],
        high: [],
    };

    DIMENSION_ORDER.forEach((code) => {
        const dimension = dimensionByCode[code];
        if (!dimension || !Number.isFinite(dimension.avg)) return;

        const band = getAdviceBand(dimension.avg);
        const advice = DIMENSION_ADVICE_COPY[code]?.[band];
        if (advice) groupedAdvice[band].push(advice);
    });

    const activeGroups = ["low", "mid", "high"]
        .map((band) => groupedAdvice[band])
        .filter((items) => items.length > 0);
    const prefixes = ["建议您", "此外，建议您", "最后，建议您"];

    return activeGroups
        .map((items, index) => `${prefixes[index]}${items.join("；")}。`)
        .join("");
}

export default function HomePage() {
    const [step, setStep] = useState("intro");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [serviceIntent, setServiceIntent] = useState("");
    const [submittedServiceIntent, setSubmittedServiceIntent] = useState(null);
    const [submitFeedback, setSubmitFeedback] = useState({
        type: null,
        message: "",
    });
    const [contactForm, setContactForm] = useState({
        contact_name: "",
        contact_phone: "",
        contact_wechat: "",
    });
    const [contactFeedback, setContactFeedback] = useState({
        type: null,
        message: "",
    });
    const [contactTouched, setContactTouched] = useState({
        contact_name: false,
        contact_phone: false,
    });
    const [submitAttempted, setSubmitAttempted] = useState(false);
    const [sessionQuestionIds, setSessionQuestionIds] = useState(SYSTEM_QUESTION_IDS);

    const submitLockRef = useRef(false);
    const autoNextTimerRef = useRef(null);

    const currentQuestionId = sessionQuestionIds[currentIndex];
    const currentQuestion = QUESTION_MAP[currentQuestionId];
    const currentAnswer = answers[currentQuestionId];
    const isLastQuestion = currentIndex === sessionQuestionIds.length - 1;

    const resultData = useMemo(() => {
        const skippedDimensions = {
            D3: answers.SYS_CHILD_GATE === "no",
            D7: answers.SYS_CROSS_BORDER_GATE === "no",
        };

        const dimensions = {};
        Object.keys(DIMENSION_META).forEach((code) => {
            dimensions[code] = {
                code,
                name: DIMENSION_META[code].name,
                total: 0,
                count: 0,
                avg: null,
                skipped: Boolean(skippedDimensions[code]),
            };
        });

        let totalScore = 0;
        let effectiveCount = 0;

        QUESTIONS.forEach((q) => {
            if (q.system) return;
            if (dimensions[q.dimension]?.skipped) return;

            const value = answers[q.id];
            const score = getScore(value, q.reverse);

            if (score === null) return;

            totalScore += score;
            effectiveCount += 1;
            dimensions[q.dimension].total += score;
            dimensions[q.dimension].count += 1;
        });

        Object.values(dimensions).forEach((item) => {
            if (!item.skipped && item.count > 0) {
                item.avg = item.total / item.count;
            }
        });

        const dynamicFullScore = effectiveCount * 5;
        const scoreRate =
            dynamicFullScore > 0 ? (totalScore / dynamicFullScore) * 100 : 0;
        const levelKey = getLevelKey(scoreRate);
        const isCrossBorderMarriage = answers.SYS_CROSS_BORDER_GATE === "yes";

        const validDimensions = Object.values(dimensions).filter(
            (item) => !item.skipped && item.avg !== null
        );
        const radarDimensions = validDimensions.map((item) => ({
            code: item.code,
            name: item.name,
            avg: item.avg,
        }));
        const dimensionScores = Object.fromEntries(
            radarDimensions.map((item) => [item.code, Number(item.avg.toFixed(2))])
        );

        let weaknesses = validDimensions
            .filter((item) => item.avg < 3)
            .sort((a, b) => a.avg - b.avg);

        if (weaknesses.length === 0) {
            weaknesses = [...validDimensions]
                .sort((a, b) => a.avg - b.avg)
                .slice(0, Math.min(2, validDimensions.length));
        }

        weaknesses = weaknesses.slice(0, 3).map((item) => ({
            ...item,
            hint: DIMENSION_META[item.code].hint,
            action: DIMENSION_META[item.code].action,
        }));

        const baseLevelCopy = RESULT_COPY[levelKey];
        const level = {
            ...baseLevelCopy,
            subtitle:
                baseLevelCopy.description[
                    isCrossBorderMarriage ? "crossBorder" : "standard"
                ],
        };

        return {
            totalScore,
            dynamicFullScore,
            scoreRate,
            levelKey,
            level,
            isCrossBorderMarriage,
            radarDimensions,
            dimensionScores,
            weaknesses,
            personalizedAdviceText: buildPersonalizedAdviceText(validDimensions),
        };
    }, [answers]);

    const isServiceIntentValid = Boolean(
        resolveDivorceReadinessServiceIntent(serviceIntent)
    );
    const isContactNameValid = validateContactName(contactForm.contact_name);
    const isContactPhoneValid = validateContactPhone(contactForm.contact_phone);
    const canSubmitLead =
        isServiceIntentValid &&
        isContactNameValid &&
        isContactPhoneValid &&
        !isSubmitting &&
        !hasSubmitted;
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

    const resetLeadState = () => {
        setIsSubmitting(false);
        setHasSubmitted(false);
        setServiceIntent("");
        setSubmittedServiceIntent(null);
        setContactForm({
            contact_name: "",
            contact_phone: "",
            contact_wechat: "",
        });
        setContactTouched({
            contact_name: false,
            contact_phone: false,
        });
        setSubmitAttempted(false);
        setContactFeedback({
            type: null,
            message: "",
        });
        setSubmitFeedback({
            type: null,
            message: "",
        });
        submitLockRef.current = false;
    };

    const handleStart = () => {
        window.scrollTo({ top: 0, behavior: "instant" });
        setStep("question");
        setCurrentIndex(0);
        setAnswers({});
        setSessionQuestionIds(SYSTEM_QUESTION_IDS);
        resetLeadState();
        if (autoNextTimerRef.current) {
            clearTimeout(autoNextTimerRef.current);
            autoNextTimerRef.current = null;
        }
    };

    const handleAnswer = (questionId, value) => {
        const nextAnswers = filterInapplicableAnswers({ ...answers, [questionId]: value });
        setAnswers(nextAnswers);

        const isSystemQuestion = SYSTEM_QUESTION_IDS.includes(questionId);
        const nextSessionQuestionIds = isSystemQuestion
            ? buildSessionQuestionIds(nextAnswers)
            : sessionQuestionIds;

        if (isSystemQuestion) {
            setSessionQuestionIds(nextSessionQuestionIds);
        }

        const nextLength = nextSessionQuestionIds.length;
        const shouldAutoAdvance = currentIndex < nextLength - 1;

        if (autoNextTimerRef.current) {
            clearTimeout(autoNextTimerRef.current);
            autoNextTimerRef.current = null;
        }

        if (shouldAutoAdvance) {
            autoNextTimerRef.current = setTimeout(() => {
                setCurrentIndex((prev) => Math.min(prev + 1, nextLength - 1));
                autoNextTimerRef.current = null;
            }, 150);
        }
    };

    const handlePrev = () => {
        if (autoNextTimerRef.current) {
            clearTimeout(autoNextTimerRef.current);
            autoNextTimerRef.current = null;
        }
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
    };

    const handleNext = () => {
        if (currentAnswer === undefined) return;

        if (isLastQuestion) {
            window.scrollTo({ top: 0, behavior: "instant" });
            setStep("result");
            return;
        }

        setCurrentIndex((prev) =>
            Math.min(prev + 1, sessionQuestionIds.length - 1)
        );
    };

    const handleRestart = () => {
        window.scrollTo({ top: 0, behavior: "instant" });
        setStep("intro");
        setCurrentIndex(0);
        setAnswers({});
        setSessionQuestionIds(SYSTEM_QUESTION_IDS);
        resetLeadState();
        if (autoNextTimerRef.current) {
            clearTimeout(autoNextTimerRef.current);
            autoNextTimerRef.current = null;
        }
    };

    const handleSubmitResult = async () => {
        if (submitLockRef.current || isSubmitting || hasSubmitted) return;

        setSubmitAttempted(true);

        const contact = {
            contact_name: contactForm.contact_name.trim(),
            contact_phone: contactForm.contact_phone.trim(),
            contact_wechat: contactForm.contact_wechat.trim(),
        };
        const resolvedServiceIntent =
            resolveDivorceReadinessServiceIntent(serviceIntent);

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
        setIsSubmitting(true);
        setContactFeedback({
            type: null,
            message: "",
        });
        setSubmitFeedback({
            type: null,
            message: "",
        });

        try {
            const payload = buildSubmissionPayload({
                answers,
                resultData,
                serviceIntent: resolvedServiceIntent.value,
            });

            const { error } = await submitAssessmentResult({
                assessment_type: payload.assessmentType,
                total_score: payload.totalScore,
                dynamic_full_score: payload.dynamicFullScore,
                score_rate: payload.scoreRate,
                result_level: payload.resultLevel,
                result_label: payload.resultLabel,
                child_gate_answer: payload.childGateAnswer,
                cross_border_gate_answer: payload.crossBorderGateAnswer,
                weaknesses: payload.weaknesses,
                dimension_scores: payload.dimensionScores,
                answers: payload.answers,
                contact_name: contact.contact_name,
                contact_phone: contact.contact_phone,
                contact_wechat: contact.contact_wechat,
                service_intent: payload.serviceIntent,
                submission_source: payload.submissionSource,
                follow_up_status: "new",
                result_payload: payload.resultPayload,
            });

            if (error) {
                console.error("Submit failed:", error);
                setSubmitFeedback({
                    type: "error",
                    message: "\u63d0\u4ea4\u5931\u8d25\uff0c\u8bf7\u68c0\u67e5\u7f51\u7edc\u6216\u7a0d\u540e\u91cd\u8bd5\u3002",
                });
                return;
            }

            setContactForm(contact);
            setServiceIntent(resolvedServiceIntent.value);
            setSubmittedServiceIntent(resolvedServiceIntent.value);
            setHasSubmitted(true);
            setSubmitFeedback({
                type: "success",
                message: "信息已提交成功。",
            });
        } catch (error) {
            console.error("Submit failed:", error);
            setSubmitFeedback({
                type: "error",
                message: "提交失败，请检查网络或稍后重试。",
            });
        } finally {
            setIsSubmitting(false);
            submitLockRef.current = false;
        }
    };

    const handleContactFieldChange = (field, value) => {
        if (hasSubmitted) return;

        if (field === "contact_name" || field === "contact_phone") {
            setContactTouched((prev) => ({
                ...prev,
                [field]: true,
            }));
        }

        setContactForm((prev) => ({
            ...prev,
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

        setContactTouched((prev) => ({
            ...prev,
            [field]: true,
        }));
    };

    const handleServiceIntentChange = (value) => {
        if (isSubmitting || hasSubmitted) return;

        const resolvedIntent = resolveDivorceReadinessServiceIntent(value);
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

    const progress =
        sessionQuestionIds.length > 0
            ? ((currentIndex + 1) / sessionQuestionIds.length) * 100
            : 0;

    if (step === "intro") {
        return <IntroScreen onStart={handleStart} />;
    }

    if (step === "question" && currentQuestion) {
        return (
            <QuestionScreen
                currentQuestion={currentQuestion}
                currentQuestionId={currentQuestionId}
                currentIndex={currentIndex}
                visibleQuestionIds={sessionQuestionIds}
                currentAnswer={currentAnswer}
                progress={progress}
                onAnswer={handleAnswer}
                onPrev={handlePrev}
                onNext={handleNext}
            />
        );
    }

    return (
        <>
            <ResultScreen
                resultData={resultData}
                onRestart={handleRestart}
                onSubmitResult={handleSubmitResult}
                isSubmitting={isSubmitting}
                hasSubmitted={hasSubmitted}
                submitFeedback={submitFeedback}
                serviceIntent={serviceIntent}
                submittedServiceIntent={submittedServiceIntent}
                serviceIntentOptions={DIVORCE_READINESS_SERVICE_INTENT_OPTIONS}
                contactForm={contactForm}
                contactFieldErrors={contactFieldErrors}
                contactFeedback={contactFeedback}
                canSubmitLead={canSubmitLead}
                formHintMessage={leadFormHintMessage}
                formHintType={hasVisibleContactFieldError ? "error" : "neutral"}
                onServiceIntentChange={handleServiceIntentChange}
                onContactFieldChange={handleContactFieldChange}
                onContactFieldBlur={handleContactFieldBlur}
                onCloseSubmitSuccessModal={() => setSubmittedServiceIntent(null)}
            />
        </>
    );
}
