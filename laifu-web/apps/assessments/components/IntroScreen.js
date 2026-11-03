const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

export default function IntroScreen({ onStart }) {
  return (
    <main className="page-shell">
      <section className="hero-card">
        <div className="hero-tag"><img className="questionnaire-hero-logo" src={`${BASE_PATH}/assets/huanyu-logo.svg`} width="30" height="19" alt="" />焕屿 · 离婚准备测评</div>
        <h1>先看清现在，<br />再决定下一步。</h1>
        <p>
          从心理承受、经济准备、法律认知、子女安排到跨境风险，系统评估您当前的离婚准备状态。测评结果可用于自我梳理，也可作为后续律师咨询的前置信息。
        </p>

        <div className="intro-actions">
          <button className="primary-btn" onClick={onStart}>
            开始离婚准备测评 <span aria-hidden="true">↗</span>
          </button>
          <a className="intro-text-link" href="#assessment-guide">了解测评内容 <span aria-hidden="true">↓</span></a>
        </div>

        <div className="intro-meta">
          <span>测试时长：约 5–8 分钟</span>
          <span>按最近一个月的实际情况作答</span>
          <span>结果可生成图片保存</span>
          <span>仅用于个人评估与咨询参考</span>
        </div>
        <div className="hero-illustration">
          <img
            src={`${BASE_PATH}/assets/editorial/p03-home-courses.webp`}
            alt="膝上的练习册与正在记录的手"
            width="1280" height="853" fetchPriority="high"
          />
        </div>
      </section>
      <section className="assessment-guide" id="assessment-guide">
        <div className="assessment-section-heading">
          <h2>从你现在的问题出发</h2>
          <p>两种测评，帮助你从不同角度梳理处境。无需先有答案，也不需要为了测评作出决定。</p>
        </div>
        <div className="assessment-choices">
          <article className="assessment-choice">
            <span className="assessment-choice-number">01 / 当前测评</span>
            <h3>我为离婚准备好了吗？</h3>
            <p>从心理、经济、子女安排、财产、法律认知、情感与跨境风险等维度，看看已有的准备与仍需关注的部分。</p>
            <button className="intro-text-link" onClick={onStart}>开始离婚准备测评 <span aria-hidden="true">↗</span></button>
          </article>
          <article className="assessment-choice">
            <span className="assessment-choice-number">02 / 婚姻互动</span>
            <h3>反复的冲突，意味着什么？</h3>
            <p>通过 40 道题，梳理关系中长期反复出现的互动特征与高冲突风险信号，帮助你判断需要怎样的支持。</p>
            <a className="intro-text-link" href={`${BASE_PATH}/narcissism-risk/`}>了解婚姻互动风险测评 <span aria-hidden="true">↗</span></a>
          </article>
        </div>
      </section>
      <section className="assessment-faq">
        <h2>开始之前，你可能想了解</h2>
        <div>
          <details><summary>测评会替我决定是否离婚吗？</summary><p>不会。结果帮助你整理当前的准备状态，不替你决定关系的去留，也不构成法律意见、心理治疗或医疗诊断。</p></details>
          <details><summary>遇到与自己无关的问题怎么办？</summary><p>请按真实情况作答。系统会根据子女与跨境情况调整适用题目；其他题目中，也可以选择“与本人情况无关”。</p></details>
          <details><summary>完成之后，可以怎样使用结果？</summary><p>可以查看维度分析，下载简要测评报告，也可以按自己的需要留下联系方式，申请后续支持。</p></details>
        </div>
      </section>
    </main>
  );
}
