import { DIMENSION_META, LIKERT_OPTIONS } from "../data/questions.js";

export default function QuestionScreen({
  currentQuestion,
  currentQuestionId,
  currentIndex,
  visibleQuestionIds,
  currentAnswer,
  progress,
  onAnswer,
  onPrev,
  onNext,
}) {
  const isLastQuestion = currentIndex === visibleQuestionIds.length - 1;

  return (
    <main className="page-shell">
      <section className="quiz-card">
        <div className="quiz-head">
          <div>
            <div className="hero-tag">
              {currentQuestion.system
                ? "系统分流题 · 不计分"
                : `当前维度 · ${DIMENSION_META[currentQuestion.dimension].name}`}
            </div>

            <h1 className="quiz-title">{currentQuestion.text}</h1>

            <p className="quiz-copy">
              请您根据自身真实情况如实作答。
              {currentQuestion.system
                ? currentQuestion.helper
                : "若题目与您无关，可直接选择“与本人情况无关”。"}
            </p>
          </div>

          <div className="counter-box">
            第 {currentIndex + 1} / {visibleQuestionIds.length} 题
          </div>
        </div>

        <div className="progress-wrap" role="progressbar" aria-label="答题进度" aria-valuenow={currentIndex + 1} aria-valuemin={0} aria-valuemax={visibleQuestionIds.length}>
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>

        <div className="option-list">
          {(currentQuestion.options || LIKERT_OPTIONS).map((item) => {
            const active = currentAnswer === item.value;

            return (
              <button
                key={item.label}
                type="button"
                aria-pressed={active}
                className={`option-item ${active ? "active" : ""}`}
                onClick={() => onAnswer(currentQuestionId, item.value)}
              >
                <span>{item.label}</span>
                <span className="radio-dot"></span>
              </button>
            );
          })}
        </div>

        <div className="bottom-actions">
          <button
            type="button"
            className="secondary-btn"
            onClick={onPrev}
            disabled={currentIndex === 0}
          >
            上一题
          </button>

          <button
            type="button"
            className="primary-btn"
            onClick={onNext}
            disabled={currentAnswer === undefined}
          >
            {isLastQuestion ? "查看结果" : "下一题"}
          </button>
        </div>
      </section>
    </main>
  );
}
