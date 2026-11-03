"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  NARCISSISM_RISK_QUESTION_MAP,
  NARCISSISM_RISK_QUESTIONS,
} from "../../data/narcissismRiskQuestions.js";
import { calculateNarcissismRiskResult } from "../../lib/narcissismRiskScoring.js";
import NarcissismRiskIntroScreen from "../../components/narcissism-risk/NarcissismRiskIntroScreen.js";
import NarcissismRiskQuestionScreen from "../../components/narcissism-risk/NarcissismRiskQuestionScreen.js";

const NarcissismRiskResultScreen = dynamic(
  () => import("../../components/narcissism-risk/NarcissismRiskResultScreen.js"),
  { loading: () => null }
);

function createRandomQuestionOrder() {
  const questionIds = NARCISSISM_RISK_QUESTIONS.map(
    (question) => question.question_id
  );

  for (let index = questionIds.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [questionIds[index], questionIds[swapIndex]] = [
      questionIds[swapIndex],
      questionIds[index],
    ];
  }

  return questionIds;
}

function scrollToTop() {
  if (typeof window !== "undefined") {
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }
}

export default function NarcissismRiskPage() {
  const [step, setStep] = useState("intro");
  const [questionOrder, setQuestionOrder] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scoringResult, setScoringResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const autoNextTimerRef = useRef(null);

  const orderedQuestions = useMemo(
    () =>
      questionOrder
        .map((questionId) => NARCISSISM_RISK_QUESTION_MAP[questionId])
        .filter(Boolean),
    [questionOrder]
  );

  const currentQuestion = orderedQuestions[currentIndex];
  const currentAnswer = currentQuestion
    ? answers[currentQuestion.question_id]
    : undefined;

  const answeredCount = useMemo(
    () =>
      NARCISSISM_RISK_QUESTIONS.reduce(
        (count, question) =>
          answers[question.question_id] === undefined ? count : count + 1,
        0
      ),
    [answers]
  );

  const clearAutoNextTimer = () => {
    if (autoNextTimerRef.current) {
      clearTimeout(autoNextTimerRef.current);
      autoNextTimerRef.current = null;
    }
  };

  useEffect(() => clearAutoNextTimer, []);

  const startTest = () => {
    clearAutoNextTimer();
    setQuestionOrder(createRandomQuestionOrder());
    setAnswers({});
    setCurrentIndex(0);
    setScoringResult(null);
    setErrorMessage("");
    setStep("test");
    scrollToTop();
  };

  const handleAnswer = (questionId, value) => {
    clearAutoNextTimer();
    setAnswers((previousAnswers) => ({
      ...previousAnswers,
      [questionId]: value,
    }));
    setErrorMessage("");

    if (currentIndex < orderedQuestions.length - 1) {
      const indexAtSelection = currentIndex;
      autoNextTimerRef.current = setTimeout(() => {
        setCurrentIndex((previousIndex) => {
          if (previousIndex !== indexAtSelection) return previousIndex;
          return Math.min(previousIndex + 1, orderedQuestions.length - 1);
        });
        autoNextTimerRef.current = null;
        scrollToTop();
      }, 180);
    }
  };

  const handlePrev = () => {
    clearAutoNextTimer();
    setCurrentIndex((previousIndex) => Math.max(previousIndex - 1, 0));
    setErrorMessage("");
    scrollToTop();
  };

  const handleNext = () => {
    clearAutoNextTimer();
    if (!currentQuestion || currentAnswer === undefined) {
      setErrorMessage("请选择最符合实际情况的一项后再继续。");
      return;
    }

    const isLastQuestion = currentIndex === orderedQuestions.length - 1;
    if (!isLastQuestion) {
      setCurrentIndex((previousIndex) =>
        Math.min(previousIndex + 1, orderedQuestions.length - 1)
      );
      setErrorMessage("");
      scrollToTop();
      return;
    }

    const missingQuestionIds = NARCISSISM_RISK_QUESTIONS.filter(
      (question) => answers[question.question_id] === undefined
    ).map((question) => question.question_id);

    if (missingQuestionIds.length > 0) {
      const firstMissingIndex = questionOrder.findIndex(
        (questionId) => questionId === missingQuestionIds[0]
      );
      if (firstMissingIndex >= 0) setCurrentIndex(firstMissingIndex);
      setErrorMessage("还有题目未完成，请完成全部 40 题后再查看结果。");
      scrollToTop();
      return;
    }

    try {
      const result = calculateNarcissismRiskResult(answers, questionOrder);
      setScoringResult(result);
      setStep("result");
      setErrorMessage("");
      scrollToTop();
    } catch (error) {
      if (error?.message?.includes("有效作答题数为 0")) {
        setErrorMessage(
          "有效作答题数为 0，无法生成测评结果。请至少对部分适用题目作答后再查看结果。"
        );
        return;
      }
      console.error("Failed to calculate narcissism risk result:", error);
      setErrorMessage("结果生成失败，请检查是否已完成全部题目后再试。");
    }
  };

  if (step === "intro") {
    return <NarcissismRiskIntroScreen onStart={startTest} />;
  }

  if (step === "test" && currentQuestion) {
    return (
      <NarcissismRiskQuestionScreen
        currentQuestion={currentQuestion}
        currentIndex={currentIndex}
        totalCount={orderedQuestions.length}
        answeredCount={answeredCount}
        currentAnswer={currentAnswer}
        errorMessage={errorMessage}
        onAnswer={handleAnswer}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    );
  }

  if (step === "result" && scoringResult) {
    return (
      <NarcissismRiskResultScreen
        scoringResult={scoringResult}
        answers={answers}
        questionOrder={questionOrder}
        onRestart={startTest}
      />
    );
  }

  return <NarcissismRiskIntroScreen onStart={startTest} />;
}
