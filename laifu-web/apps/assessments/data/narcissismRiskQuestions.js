export const NARCISSISM_RISK_ASSESSMENT_TYPE = "spousal_narcissism_risk";

export const NARCISSISM_RISK_DIMENSION_ORDER = ["N1", "N2", "N3", "N4", "N5"];

export const NARCISSISM_RISK_DIMENSIONS = {
  N1: {
    code: "N1",
    name: "自我中心与关系特权",
    shortName: "自我中心",
  },
  N2: {
    code: "N2",
    name: "人设包装与反应升级",
    shortName: "受挫反应",
  },
  N3: {
    code: "N3",
    name: "情感忽视与责任推脱",
    shortName: "情感回应",
  },
  N4: {
    code: "N4",
    name: "控制施压与关系操控",
    shortName: "关系施压",
  },
  N5: {
    code: "N5",
    name: "冲突升级与安全风险",
    shortName: "冲突升级",
  },
};

export const NARCISSISM_RISK_LIKERT_OPTIONS = [
  { label: "完全不符合", value: 1 },
  { label: "不太符合", value: 2 },
  { label: "一般符合", value: 3 },
  { label: "基本符合", value: 4 },
  { label: "完全符合", value: 5 },
];

export const NARCISSISM_RISK_NA_VALUE = "na";

export const NARCISSISM_RISK_ANSWER_OPTIONS = [
  ...NARCISSISM_RISK_LIKERT_OPTIONS,
  { label: "与本人情况无关", value: NARCISSISM_RISK_NA_VALUE },
];

const NARCISSISM_RISK_REVERSE_QUESTION_IDS = [
  "N1_Q07",
  "N2_Q13",
  "N3_Q22",
  "N4_Q32",
  "N5_Q40",
];

export const NARCISSISM_RISK_HIGH_RISK_QUESTION_IDS = [
  "N5_Q34",
  "N5_Q35",
  "N5_Q36",
  "N5_Q37",
];

export const NARCISSISM_RISK_QUESTION_COUNT = 40;
export const NARCISSISM_RISK_LOW_VALID_ANSWER_THRESHOLD = 30;
export const NARCISSISM_RISK_DIMENSION_LOW_VALID_THRESHOLD = 4;

function createNarcissismRiskQuestion({
  question_id,
  dimension_code,
  question_no,
  question_text,
  measurement_focus,
}) {
  const dimension = NARCISSISM_RISK_DIMENSIONS[dimension_code];
  const reverseScored = NARCISSISM_RISK_REVERSE_QUESTION_IDS.includes(question_id);
  const highRiskTrigger =
    NARCISSISM_RISK_HIGH_RISK_QUESTION_IDS.includes(question_id);

  return {
    question_id,
    dimension_code,
    dimension_name: dimension.name,
    question_no,
    question_text,
    option_type: "likert_5",
    reverse_scored: reverseScored,
    high_risk_trigger: highRiskTrigger,
    required: true,
    allow_not_applicable: true,
    included_in_total: true,
    included_in_dimension_avg: true,
    measurement_focus,
    notes: reverseScored
      ? "反向计分"
      : highRiskTrigger
        ? "高风险触发题"
        : "",
  };
}

export const NARCISSISM_RISK_QUESTIONS = [
  createNarcissismRiskQuestion({
    question_id: "N1_Q01",
    dimension_code: "N1",
    question_no: 1,
    question_text:
      "在家庭沟通或重要决策中，对方常默认自己的判断应当成为最终决定。",
    measurement_focus: "决策最终权与单方主导倾向",
  }),
  createNarcissismRiskQuestion({
    question_id: "N1_Q02",
    dimension_code: "N1",
    question_no: 2,
    question_text:
      "对方在婚姻关系中经常期待获得特殊照顾、特殊待遇或更多资源。",
    measurement_focus: "特殊待遇期待与资源优先感",
  }),
  createNarcissismRiskQuestion({
    question_id: "N1_Q03",
    dimension_code: "N1",
    question_no: 3,
    question_text:
      "当家庭规则、共同约定或外部规则限制到对方时，对方容易认为“这些规则不该适用于自己”。",
    measurement_focus: "规则例外心态",
  }),
  createNarcissismRiskQuestion({
    question_id: "N1_Q04",
    dimension_code: "N1",
    question_no: 4,
    question_text:
      "对方习惯把婚姻中的分歧理解为“对方不尊重自己”或“没有把自己放在应有的位置”。",
    measurement_focus: "分歧中的地位受损感",
  }),
  createNarcissismRiskQuestion({
    question_id: "N1_Q05",
    dimension_code: "N1",
    question_no: 5,
    question_text:
      "对方经常强调自己的付出、能力、地位或资源，以证明自己在婚姻中应当拥有更大话语权。",
    measurement_focus: "优越感依据与话语权要求",
  }),
  createNarcissismRiskQuestion({
    question_id: "N1_Q06",
    dimension_code: "N1",
    question_no: 6,
    question_text:
      "对方会把您或孩子的表现与自己的面子、价值或社会评价绑定，一旦不符合其期待就明显不满。",
    measurement_focus: "伴侣/孩子作为自我形象延伸",
  }),
  createNarcissismRiskQuestion({
    question_id: "N1_Q07",
    dimension_code: "N1",
    question_no: 7,
    question_text:
      "对方能够承认婚姻中的重要决定需要双方共同协商，而不是由自己单方面决定。",
    measurement_focus: "平等协商能力",
  }),
  createNarcissismRiskQuestion({
    question_id: "N1_Q08",
    dimension_code: "N1",
    question_no: 8,
    question_text:
      "在涉及财产、住房、子女安排或家庭责任时，对方常认为自己应当获得更优先的安排。",
    measurement_focus: "利益分配中的优先权期待",
  }),

  createNarcissismRiskQuestion({
    question_id: "N2_Q09",
    dimension_code: "N2",
    question_no: 9,
    question_text:
      "对方很在意他人的赞赏和认同，一旦没有得到期待中的肯定，情绪或态度会明显变化。",
    measurement_focus: "赞赏依赖与外部认同敏感",
  }),
  createNarcissismRiskQuestion({
    question_id: "N2_Q10",
    dimension_code: "N2",
    question_no: 10,
    question_text:
      "当您指出对方的问题时，对方很少先理解问题本身，而是迅速进入辩解、反驳或反击状态。",
    measurement_focus: "被指出问题后的防御性反应",
  }),
  createNarcissismRiskQuestion({
    question_id: "N2_Q11",
    dimension_code: "N2",
    question_no: 11,
    question_text: "对方容易把普通的不同意见理解为冒犯、轻视或否定。",
    measurement_focus: "对普通分歧的冒犯化解读",
  }),
  createNarcissismRiskQuestion({
    question_id: "N2_Q12",
    dimension_code: "N2",
    question_no: 12,
    question_text:
      "在争吵、协商或调解中，只要对方感觉自己“输了”或“不占上风”，反应就会明显升级。",
    measurement_focus: "输赢感触发的反应升级",
  }),
  createNarcissismRiskQuestion({
    question_id: "N2_Q13",
    dimension_code: "N2",
    question_no: 13,
    question_text:
      "对方面对批评或质疑时，能够相对平静地听完，并愿意讨论具体问题。",
    measurement_focus: "承受批评与具体讨论能力",
  }),
  createNarcissismRiskQuestion({
    question_id: "N2_Q14",
    dimension_code: "N2",
    question_no: 14,
    question_text:
      "对方在被指出错误后，容易贬低您、翻旧账或质疑您的动机。",
    measurement_focus: "被指出错误后的攻击性防御",
  }),
  createNarcissismRiskQuestion({
    question_id: "N2_Q15",
    dimension_code: "N2",
    question_no: 15,
    question_text:
      "在财产、子女、面子或外界评价相关议题上，对方若没有得到预期结果，容易表现出强烈不甘或报复性表达。",
    measurement_focus: "关键利益与面子受挫后的反击倾向",
  }),
  createNarcissismRiskQuestion({
    question_id: "N2_Q16",
    dimension_code: "N2",
    question_no: 16,
    question_text: "对方事后会反复纠结自己在冲突中是否丢脸、被看低或被否定。",
    measurement_focus: "羞耻敏感与事后反刍",
  }),

  createNarcissismRiskQuestion({
    question_id: "N3_Q17",
    dimension_code: "N3",
    question_no: 17,
    question_text:
      "当您表达压力、委屈或痛苦时，对方常表现出不耐烦、冷漠、嘲讽或指责。",
    measurement_focus: "对伴侣痛苦表达的即时回应",
  }),
  createNarcissismRiskQuestion({
    question_id: "N3_Q18",
    dimension_code: "N3",
    question_no: 18,
    question_text: "对方很少主动关心您或孩子在关系中的真实感受和压力。",
    measurement_focus: "对家庭成员感受与压力的关心程度",
  }),
  createNarcissismRiskQuestion({
    question_id: "N3_Q19",
    dimension_code: "N3",
    question_no: 19,
    question_text:
      "婚姻中出现问题时，对方常把责任主要归咎于您、您的家人或外部环境。",
    measurement_focus: "责任外归因倾向",
  }),
  createNarcissismRiskQuestion({
    question_id: "N3_Q20",
    dimension_code: "N3",
    question_no: 20,
    question_text:
      "对方会把您的正常情绪反应描述成“太敏感”“想太多”“不讲理”或“有问题”。",
    measurement_focus: "对伴侣情绪的贬低与病理化",
  }),
  createNarcissismRiskQuestion({
    question_id: "N3_Q21",
    dimension_code: "N3",
    question_no: 21,
    question_text:
      "在子女议题中，对方更关注孩子是否站在自己一边、维护自己的面子或满足自己的情绪，而较少关注孩子的真实感受。",
    measurement_focus: "子女作为情绪与形象需求承载者",
  }),
  createNarcissismRiskQuestion({
    question_id: "N3_Q22",
    dimension_code: "N3",
    question_no: 22,
    question_text:
      "当您明确表达边界或拒绝某些要求时，对方能够尊重您的感受和决定。",
    measurement_focus: "尊重边界与回应拒绝的能力",
  }),
  createNarcissismRiskQuestion({
    question_id: "N3_Q23",
    dimension_code: "N3",
    question_no: 23,
    question_text:
      "即使对方的行为已经让您或孩子受到伤害，对方仍倾向于否认、淡化或转移责任。",
    measurement_focus: "造成伤害后的否认与推责",
  }),
  createNarcissismRiskQuestion({
    question_id: "N3_Q24",
    dimension_code: "N3",
    question_no: 24,
    question_text:
      "对方经常要求您理解他的压力和立场，却很少同等理解您的处境。",
    measurement_focus: "关系中的单向理解要求",
  }),

  createNarcissismRiskQuestion({
    question_id: "N4_Q25",
    dimension_code: "N4",
    question_no: 25,
    question_text:
      "对方会通过钱款、财产使用或家庭资源安排，对您施加压力，使您作出让步。",
    measurement_focus: "经济与家庭资源施压",
  }),
  createNarcissismRiskQuestion({
    question_id: "N4_Q26",
    dimension_code: "N4",
    question_no: 26,
    question_text: "对方会通过内疚感、道德指责或亲友评价，使您接受其要求。",
    measurement_focus: "情绪、道德与评价压力",
  }),
  createNarcissismRiskQuestion({
    question_id: "N4_Q27",
    dimension_code: "N4",
    question_no: 27,
    question_text:
      "对方常向第三方呈现对自己有利的婚姻叙事，使您难以解释完整事实。",
    measurement_focus: "对外叙事塑造",
  }),
  createNarcissismRiskQuestion({
    question_id: "N4_Q28",
    dimension_code: "N4",
    question_no: 28,
    question_text:
      "对方会让亲友或孩子传话、站队或证明其说法，使他们卷入您与对方的冲突。",
    measurement_focus: "第三方卷入与忠诚冲突制造",
  }),
  createNarcissismRiskQuestion({
    question_id: "N4_Q29",
    dimension_code: "N4",
    question_no: 29,
    question_text:
      "在双方沟通关键争议时，对方常通过转移话题、混淆重点、否认事实或诡辩来绕开核心问题。",
    measurement_focus: "对内沟通中的核心问题回避",
  }),
  createNarcissismRiskQuestion({
    question_id: "N4_Q30",
    dimension_code: "N4",
    question_no: 30,
    question_text:
      "对方经常否认曾经说过或做过的事，并反过来让您怀疑自己的记忆、感受或判断。",
    measurement_focus: "Gaslighting：现实否认与自我怀疑制造",
  }),
  createNarcissismRiskQuestion({
    question_id: "N4_Q31",
    dimension_code: "N4",
    question_no: 31,
    question_text:
      "对方会把孩子、亲友关系或共同财产作为谈判筹码，使您在坚持边界时承受更多压力。",
    measurement_focus: "将关系或共同利益作为筹码",
  }),
  createNarcissismRiskQuestion({
    question_id: "N4_Q32",
    dimension_code: "N4",
    question_no: 32,
    question_text:
      "在婚姻冲突中，对方能够尊重事实，不刻意操控他人对您或关系的看法。",
    measurement_focus: "尊重事实与不操控叙事的能力",
  }),

  createNarcissismRiskQuestion({
    question_id: "N5_Q33",
    dimension_code: "N5",
    question_no: 33,
    question_text: "对方经常把您的正常行为理解为恶意、算计、背叛或故意针对。",
    measurement_focus: "猜疑戒备与恶意归因",
  }),
  createNarcissismRiskQuestion({
    question_id: "N5_Q34",
    dimension_code: "N5",
    question_no: 34,
    question_text:
      "在冲突中，对方曾通过威胁、恐吓、羞辱、持续骚扰或上门纠缠来迫使您让步。",
    measurement_focus: "威胁、骚扰与纠缠施压",
  }),
  createNarcissismRiskQuestion({
    question_id: "N5_Q35",
    dimension_code: "N5",
    question_no: 35,
    question_text:
      "对方曾公开或威胁公开您的隐私、聊天记录、照片、家庭矛盾或其他敏感信息。",
    measurement_focus: "隐私公开与名誉压力风险",
  }),
  createNarcissismRiskQuestion({
    question_id: "N5_Q36",
    dimension_code: "N5",
    question_no: 36,
    question_text:
      "对方在矛盾中曾出现摔东西、破坏财物、堵门、抢夺物品、限制行动等行为。",
    measurement_focus: "物理空间、财物与行动控制风险",
  }),
  createNarcissismRiskQuestion({
    question_id: "N5_Q37",
    dimension_code: "N5",
    question_no: 37,
    question_text:
      "对方曾以自伤、自杀、伤害您、伤害孩子或伤害他人作为威胁，要求您妥协、复合或放弃某些主张。",
    measurement_focus: "自伤他伤威胁与极端施压",
  }),
  createNarcissismRiskQuestion({
    question_id: "N5_Q38",
    dimension_code: "N5",
    question_no: 38,
    question_text:
      "在分居、协商或离婚过程中，对方会反复拖延、改变说法或制造程序性消耗，使问题难以真正解决。",
    measurement_focus: "离婚过程中的程序性消耗与持续控制",
  }),
  createNarcissismRiskQuestion({
    question_id: "N5_Q39",
    dimension_code: "N5",
    question_no: 39,
    question_text:
      "对方会故意触碰您的敏感点或反复挑衅，等您情绪失控后，再指责您不理性或有问题。",
    measurement_focus: "诱导情绪失控与反向指责",
  }),
  createNarcissismRiskQuestion({
    question_id: "N5_Q40",
    dimension_code: "N5",
    question_no: 40,
    question_text:
      "即使发生严重分歧，对方也能避免威胁、骚扰、公开隐私或其他升级冲突的行为。",
    measurement_focus: "冲突中避免升级行为的能力",
  }),
];

export const NARCISSISM_RISK_QUESTION_MAP = Object.fromEntries(
  NARCISSISM_RISK_QUESTIONS.map((question) => [question.question_id, question])
);
