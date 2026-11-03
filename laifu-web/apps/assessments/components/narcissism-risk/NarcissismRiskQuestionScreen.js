import { NARCISSISM_RISK_ANSWER_OPTIONS } from "../../data/narcissismRiskQuestions.js";
import styles from "./narcissismRisk.module.css";

export default function NarcissismRiskQuestionScreen({
  currentQuestion,
  currentIndex,
  totalCount,
  answeredCount,
  currentAnswer,
  errorMessage,
  onAnswer,
  onPrev,
  onNext,
}) {
  const isLastQuestion = currentIndex === totalCount - 1;
  const progress = totalCount > 0 ? ((currentIndex + 1) / totalCount) * 100 : 0;

  return (
    <main className={styles.pageShell}>
      <div className={styles.pageFrame}>
        <section className={styles.quizPanel}>
          <div className={styles.quizHeader}>
            <div>
              <div className={styles.topLabel}>配偶高自恋特质与高冲突风险自测</div>
              <h1 className={styles.quizTitle}>{currentQuestion.question_text}</h1>
            </div>

            <div className={styles.counterBox}>
              第 {currentIndex + 1} / {totalCount} 题
            </div>
          </div>

          <div className={styles.progressTrack} role="progressbar" aria-label="答题进度" aria-valuenow={currentIndex + 1} aria-valuemin={0} aria-valuemax={totalCount}>
            <div
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className={styles.answerMeta}>
            <span>已完成 {answeredCount} / {totalCount}</span>
            <span>请根据长期、反复出现的互动模式作答</span>
          </div>

          <div className={styles.optionList}>
            {NARCISSISM_RISK_ANSWER_OPTIONS.map((item) => {
              const active = currentAnswer === item.value;
              return (
                <button
                  key={item.value}
                  type="button"
                  aria-pressed={active}
                  className={`${styles.optionButton} ${
                    active ? styles.optionButtonActive : ""
                  }`}
                  onClick={() => onAnswer(currentQuestion.question_id, item.value)}
                >
                  <span>{item.label}</span>
                  <span className={styles.radioDot} />
                </button>
              );
            })}
          </div>

          {errorMessage && <p className={styles.errorText}>{errorMessage}</p>}

          <div className={styles.quizActions}>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={onPrev}
              disabled={currentIndex === 0}
            >
              上一题
            </button>

            <button
              type="button"
              className={styles.primaryButton}
              onClick={onNext}
              disabled={currentAnswer === undefined}
            >
              {isLastQuestion ? "提交查看结果" : "下一题"}
            </button>
          </div>

          <p className={styles.footerNote}>
            测评结果仅用于风险识别参考，不构成临床诊断、心理治疗建议或正式法律意见。
          </p>
        </section>
      </div>
    </main>
  );
}
