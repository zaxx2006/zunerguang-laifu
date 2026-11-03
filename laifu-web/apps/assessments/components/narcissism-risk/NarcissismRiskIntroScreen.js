import { NARCISSISM_RISK_LIKERT_OPTIONS } from "../../data/narcissismRiskQuestions.js";
import styles from "./narcissismRisk.module.css";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
const SCENES = [
  {
    title: "长期被否定或贬低",
    text: "对方经常否认您的感受，或把您的正常反应说成“太敏感”“不讲理”。",
  },
  {
    title: "沟通容易升级为攻击",
    text: "普通分歧很快变成指责、羞辱、翻旧账、报复性表达或输赢对抗。",
  },
  {
    title: "存在操控或第三方卷入",
    text: "对方通过亲友、孩子、钱款、共同财产或外部叙事向您施压。",
  },
  {
    title: "分居或离婚协商困难",
    text: "对方反复拖延、改变说法、制造程序性消耗，或在关键议题上持续施压。",
  },
  {
    title: "担心冲突升级或安全风险",
    text: "已出现威胁、骚扰、隐私公开、限制行动、自伤他伤威胁等信号。",
  },
  {
    title: "怀疑伴侣存在 NPD 相关特质",
    text: "对方长期表现出强烈自我中心、低共情、羞耻暴怒或操控施压，让您怀疑其是否存在 NPD / 自恋型人格相关特质。",
  },
];

const OPTION_MEANINGS = {
  完全不符合: "几乎没有出现，或与您的长期观察明显不符",
  不太符合: "偶尔出现，但不是稳定模式",
  一般符合: "有一定出现频率，或您不确定强度",
  基本符合: "较常出现，已经对关系产生影响",
  完全符合: "经常出现，且已成为明显互动模式",
};

export default function NarcissismRiskIntroScreen({ onStart }) {
  return (
    <main className={styles.pageShell}>
      <div className={styles.pageFrame}>
        <section className={styles.introLayout}>
          <div className={styles.heroPanel}>
            <div className={styles.topLabel}><img className="questionnaire-hero-logo" src={`${BASE_PATH}/assets/huanyu-logo.svg`} width="30" height="19" alt="" />配偶高自恋特质与高冲突婚姻风险自测量表</div>
            <h1 className={styles.title}>
              看清互动模式，<br />辨识关系中的风险。
            </h1>
            <p className={styles.subtitle}>
              如果您在婚姻中长期感到被否定、被控制、被操控，或正在经历高压沟通、分居、离婚协商、财产分割、子女安排等冲突场景，可以通过本量表初步梳理关系中的高自恋互动特征与高冲突风险信号。
            </p>

            <div className={styles.actionRow}>
              <button type="button" className={styles.primaryButton} onClick={onStart}>
                开始婚姻互动风险测评 ↗
              </button>
              <a className="intro-text-link" href="#risk-guide">作答前请先了解 ↓</a>
            </div>

            <div className={styles.metaList}>
              <span>全量表 40 题</span>
              <span>约需 5–8 分钟</span>
              <span>请按长期、反复出现的互动模式作答</span>
              <span>不构成诊断或法律意见</span>
            </div>
            <div className={styles.heroIllustration}>
              <img src={`${BASE_PATH}/assets/editorial/p24-high-conflict-hero.webp`} alt="坐在树荫旁整理思绪的女性" width="1280" height="853" fetchPriority="high" />
            </div>
          </div>

          <div id="risk-guide" className={`${styles.contentPanel} ${styles.contentPanelLeft}`}>
            <h2 className={styles.sectionTitle}>适用于哪些情况？</h2>
            <div className={styles.sceneList}>
              {SCENES.map((item) => (
                <details key={item.title} className={styles.sceneItem}>
                  <summary>{item.title}</summary>
                  <p>{item.text}</p>
                </details>
              ))}
            </div>
          </div>
          <div className={`${styles.promptPanel} ${styles.promptPanelLeft}`}>
            <div className={styles.noticeBox}>
              <h3>重要边界提示</h3>
              <p>
                本量表可以帮助您从婚姻互动和高冲突风险角度，初步梳理与 NPD / 自恋型人格相关特质相似的行为信号；但测评结果不能用于诊断对方是否患有 NPD / 自恋型人格障碍，也不构成临床诊断、心理治疗建议或正式法律意见。测评结果仅作为自我梳理与后续是否需要寻求专业支持的参考。
              </p>
            </div>
          </div>

          <div className={`${styles.contentPanel} ${styles.contentPanelRight}`}>
            <h2 className={styles.sectionTitle}>作答前请先了解</h2>
            <p className={styles.bodyText}>
              请根据您对配偶或伴侣在长期婚姻互动中的观察作答。建议以持续、反复出现的行为模式为主要依据，而不是仅凭某一次争吵或单一事件判断。
            </p>
            <p className={styles.bodyText}>
              如果您与对方已经进入分居、离婚协商、调解或诉讼阶段，也可以结合对方在这些阶段中的表现进行判断。本量表共 40 题，全部题目均需作答。
            </p>

            <div className={styles.optionGuide}>
              {NARCISSISM_RISK_LIKERT_OPTIONS.map((option) => (
                <div key={option.value} className={styles.optionGuideRow}>
                  <strong>{option.label}</strong>
                  <span>{OPTION_MEANINGS[option.label]}</span>
                </div>
              ))}
            </div>

            <p className={styles.mutedText}>
              页面计分采用 1–5 分。部分题目为反向计分题，系统会自动换算，您只需根据真实观察作答。
            </p>
          </div>
          <div className={`${styles.promptPanel} ${styles.promptPanelRight}`}>
            <div className={styles.safetyBox}>
              <h3>如果您正在面临现实威胁，请优先保护安全</h3>
              <p>
                如果对方已经出现暴力、限制行动、持续骚扰、公开隐私、自伤他伤威胁，或您与孩子正处于现实危险中，请不要仅依赖线上测评结果。请优先联系可信亲友、报警、寻求庇护、申请保护措施或咨询专业人士。
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
