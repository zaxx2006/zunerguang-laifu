export const ANSWER_DISPLAY_ORDER = [
  "D1_Q01",
  "D1_Q02",
  "D1_Q03",
  "D1_Q04",
  "D1_Q05",
  "D1_Q06",
  "D2_Q01",
  "D2_Q02",
  "D2_Q03",
  "D2_Q04",
  "D2_Q05",
  "D2_Q06",
  "SYS_CHILD_GATE",
  "D3_Q01",
  "D3_Q02",
  "D3_Q03",
  "D3_Q04",
  "D4_Q01",
  "D4_Q02",
  "D4_Q03",
  "D4_Q04",
  "D4_Q05",
  "D5_Q01",
  "D5_Q02",
  "D5_Q03",
  "D5_Q04",
  "D5_Q05",
  "D6_Q01",
  "D6_Q02",
  "D6_Q03",
  "D6_Q04",
  "SYS_CROSS_BORDER_GATE",
  "D7_Q01",
  "D7_Q02",
  "D7_Q03",
  "D7_Q04",
];

export const LIKERT_LABELS = new Map([
  [1, "完全不符合"],
  [2, "不太符合"],
  [3, "一般"],
  [4, "基本符合"],
  [5, "完全符合"],
  ["na", "与本人情况无关"],
]);

export const QUESTION_DISPLAY_MAP = {
  D1_Q01: {
    dimension: "D1",
    text: "面对离婚相关的争执或言语攻击，我能稳定情绪，聚焦问题解决而非情绪消耗。",
  },
  D1_Q02: {
    dimension: "D1",
    text: "决定离婚后，我能拆解目标并稳步执行，同时坚定个人边界，抵御来自对方或家人的干扰。",
  },
  D1_Q03: {
    dimension: "D1",
    text: "因离婚事宜，我常情绪低落、失眠，难以集中精力处理相关事务。",
    reverse: true,
  },
  D1_Q04: {
    dimension: "D1",
    text: "我能高效处理递交材料、信息核对等离婚相关的简单事务。",
  },
  D1_Q05: {
    dimension: "D1",
    text: "我仍对对方抱有感情，难以下定决心提出或推进离婚。",
    reverse: true,
  },
  D1_Q06: {
    dimension: "D1",
    text: "即便担心对方的态度，我也能直面并主动推进离婚相关的讨论和行动。",
  },
  D2_Q01: {
    dimension: "D2",
    text: "我对于家庭名下的房产、车辆存放信息，存款以及投资产品的具体登记信息（如登记在谁名下、密码）非常清楚。",
  },
  D2_Q02: {
    dimension: "D2",
    text: "当家庭遇到收入中断、需要紧急用钱等突发财务危机时，我有信心主导应对方案。",
  },
  D2_Q03: {
    dimension: "D2",
    text: "我参与甚至主导家庭的资本配置，包括投资、储蓄及结余资金的使用决策。",
  },
  D2_Q04: {
    dimension: "D2",
    text: "我无法独立制定清晰的离婚后个人财务收支与资产规划方案。",
    reverse: true,
  },
  D2_Q05: {
    dimension: "D2",
    text: "我有稳定的独立住所，或已制定清晰、可执行的分居居住方案。",
  },
  D2_Q06: {
    dimension: "D2",
    text: "若失去对方的经济支持，我难以凭借自身维持当前的生活水准。",
    reverse: true,
  },
  SYS_CHILD_GATE: {
    system: true,
    text: "您当前是否存在需要在离婚中一并考虑抚养、探望或共同养育安排的未成年子女？",
  },
  D3_Q01: {
    dimension: "D3",
    text: "我清楚自己争取或放弃抚养权的真实意愿，并能理性说明理由。",
  },
  D3_Q02: {
    dimension: "D3",
    text: "在争取抚养权方面，我认为自己的资源、准备和应对能力弱于对方。",
    reverse: true,
  },
  D3_Q03: {
    dimension: "D3",
    text: "我认为对方存在明显不利于子女成长的因素，子女由对方抚养风险较大。",
  },
  D3_Q04: {
    dimension: "D3",
    text: "即使未获抚养权，我也有信心平和处理与前配偶的关系，并维持与子女的良好互动。",
  },
  D4_Q01: {
    dimension: "D4",
    text: "我能自由支配夫妻共同财产中属于自己的合法份额。",
  },
  D4_Q02: {
    dimension: "D4",
    text: "对方隐匿或独占公司股权、分红信息，我无法知晓相关资产真实情况及收益明细。",
    reverse: true,
  },
  D4_Q03: {
    dimension: "D4",
    text: "家庭重大资产处置（如股权、房产、大额投资）需经我协商同意。",
  },
  D4_Q04: {
    dimension: "D4",
    text: "我能及时察觉并掌握夫妻共同财产的处置、转移等相关情况。",
  },
  D4_Q05: {
    dimension: "D4",
    text: "对方擅自以家庭名义对外举债、制造虚假债务，将债务压力转嫁于我并以此限制我的财务自由。",
    reverse: true,
  },
  D5_Q01: {
    dimension: "D5",
    text: "我清楚离婚的法定流程和办理方式。",
  },
  D5_Q02: {
    dimension: "D5",
    text: "我已经主动整理关键证据（如家暴记录、转账凭证、聊天记录等）和重要证件信息（银行卡、结婚证、护照等）并妥善保存。",
  },
  D5_Q03: {
    dimension: "D5",
    text: "我能识别对方拖延离婚的策略，并知道依法采取应对措施。",
  },
  D5_Q04: {
    dimension: "D5",
    text: "若对方在网络上散布我的隐私或诽谤，我知道如何取证、并维权。",
  },
  D5_Q05: {
    dimension: "D5",
    text: "我能接受法院判决的财产分割结果可能远低于我的预期，不会因此放弃离婚或采取极端行为。",
  },
  D6_Q01: {
    dimension: "D6",
    text: "我与对方存在稳定的性亲密互动。（一周一次：完全符合；每月3次：基本符合；每月2次：一般；每月少于2次：不太符合；基本无性生活：完全不符合）",
    reverse: true,
  },
  D6_Q02: {
    dimension: "D6",
    text: "跟对方的亲密关系偶尔会让我重新思考或者拖延离婚的决心。",
    reverse: true,
  },
  D6_Q03: {
    dimension: "D6",
    text: "因生理因素导致的性欲减退或性生活困难，增强了我考虑离婚的倾向。",
  },
  D6_Q04: {
    dimension: "D6",
    text: "婚外亲密关系的存在让我更倾向于结束当前婚姻关系。",
  },
  SYS_CROSS_BORDER_GATE: {
    system: true,
    text: "您的婚姻是否涉及跨境因素，例如中外婚姻、境外身份或居留、境外资产、子女境外身份或跨境居住安排等？",
  },
  D7_Q01: {
    dimension: "D7",
    text: "即便离婚可能导致我的配偶签证或居留许可失效，但我也不会为此太过担心。",
  },
  D7_Q02: {
    dimension: "D7",
    text: "离婚基本不会影响到子女的国外留居身份，也不会阻碍我带孩子跨境探亲、往返国内外。",
  },
  D7_Q03: {
    dimension: "D7",
    text: "即便对方利用语言文化优势，通过藏匿证件或虚假举报、虚假诉讼等方式来要挟我，我也不会放弃离婚或接受不利条件。",
  },
  D7_Q04: {
    dimension: "D7",
    text: "对方可能会利用跨境离婚财产披露制度，获取我在其他国家或地区的财产线索。",
    reverse: true,
  },
};

export function getDisplayScore(value, reverse = false) {
  if (value === "na" || value === undefined || value === null) return null;
  if (typeof value !== "number") return null;
  return reverse ? 6 - value : value;
}

export function calculateDimensionScoresFromAnswers(answers) {
  if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
    return {};
  }

  const buckets = {};

  for (const [questionId, answer] of Object.entries(answers)) {
    const question = QUESTION_DISPLAY_MAP[questionId];
    if (!question || question.system || !question.dimension) continue;

    const score = getDisplayScore(answer, question.reverse);
    if (score === null || score === undefined) continue;

    if (!buckets[question.dimension]) {
      buckets[question.dimension] = { sum: 0, count: 0 };
    }

    buckets[question.dimension].sum += score;
    buckets[question.dimension].count += 1;
  }

  return Object.fromEntries(
    Object.entries(buckets)
      .filter(([, bucket]) => bucket.count > 0)
      .map(([dimension, bucket]) => [
        dimension,
        Number((bucket.sum / bucket.count).toFixed(2)),
      ])
  );
}
