export const DIMENSION_META = {
  D1: {
    name: "心理素质与执行能力",
    hint: "该维度偏弱时，容易在冲突、拖延、情绪波动或外界干扰中消耗大量精力，影响离婚推进节奏。",
    action:
      "建议先梳理情绪承受与行动安排，在必要时借助律师或支持系统降低被动感。",
  },
  D2: {
    name: "经济独立与财务规划能力",
    hint: "该维度偏弱时，离婚后的生活安排、财务稳定性与资产应对能力可能不足。",
    action:
      "建议尽快梳理财务现状、居住安排与基本生活支撑条件，并在必要时咨询律师评估财产策略。",
  },
  D3: {
    name: "子女抚养与亲子关系处理",
    hint: "该维度偏弱时，抚养权安排、共同养育协商与后续亲子关系维持可能面临更大压力。",
    action:
      "建议尽早明确自身目标，并结合子女利益与现实资源咨询律师制定安排方案。",
  },
  D4: {
    name: "婚姻中的经济控制感知",
    hint: "该维度偏弱时，您可能在共同财产控制、资产知情或债务风险方面处于不利位置。",
    action:
      "建议尽快在律师指导下梳理财产线索、识别控制风险，并视情况提前做好证据与保全准备。",
  },
  D5: {
    name: "法律认知与风险应对能力",
    hint: "该维度偏弱时，您可能对离婚流程、证据准备、维权路径与对方策略识别不足。",
    action: "建议尽早咨询律师，避免因程序、证据或判断失误导致推进受阻。",
  },
  D6: {
    name: "婚姻亲密关系与离婚动因",
    hint: "该维度偏弱时，离婚动因、关系牵制或亲密因素可能仍对您的判断和行动形成影响。",
    action:
      "建议先看清自己当前真正的推进动力与阻力，再决定后续节奏，必要时与专业人士讨论更稳妥的处理方式。",
  },
  D7: {
    name: "跨境婚姻特别事项",
    hint: "该维度偏弱时，身份、签证、跨境子女安排或境外资产披露等问题可能成为离婚中的高风险环节。",
    action:
      "建议优先咨询具备跨境婚姻经验的律师，先明确身份与法律风险，再推进实质安排。",
  },
};

export const LIKERT_OPTIONS = [
  { label: "完全不符合", value: 1 },
  { label: "不太符合", value: 2 },
  { label: "一般", value: 3 },
  { label: "基本符合", value: 4 },
  { label: "完全符合", value: 5 },
  { label: "与本人情况无关", value: "na" },
];

export const QUESTIONS = [
  {
    id: "D1_Q01",
    dimension: "D1",
    text: "面对离婚相关的争执或言语攻击，我能稳定情绪，聚焦问题解决而非情绪消耗。",
    reverse: false,
  },
  {
    id: "D1_Q02",
    dimension: "D1",
    text: "决定离婚后，我能拆解目标并稳步执行，同时坚定个人边界，抵御来自对方或家人的干扰。",
    reverse: false,
  },
  {
    id: "D1_Q03",
    dimension: "D1",
    text: "因离婚事宜，我常情绪低落、失眠，难以集中精力处理相关事务。",
    reverse: true,
  },
  {
    id: "D1_Q04",
    dimension: "D1",
    text: "我能高效处理递交材料、信息核对等离婚相关的简单事务。",
    reverse: false,
  },
  {
    id: "D1_Q05",
    dimension: "D1",
    text: "我仍对对方抱有感情，难以下定决心提出或推进离婚。",
    reverse: true,
  },
  {
    id: "D1_Q06",
    dimension: "D1",
    text: "即便担心对方的态度，我也能直面并主动推进离婚相关的讨论和行动。",
    reverse: false,
  },

  {
    id: "D2_Q01",
    dimension: "D2",
    text: "我对于家庭名下的房产、车辆存放信息，存款以及投资产品的具体登记信息（如登记在谁名下、密码）非常清楚。",
    reverse: false,
  },
  {
    id: "D2_Q02",
    dimension: "D2",
    text: "当家庭遇到收入中断、需要紧急用钱等突发财务危机时，我有信心主导应对方案。",
    reverse: false,
  },
  {
    id: "D2_Q03",
    dimension: "D2",
    text: "我参与甚至主导家庭的资本配置，包括投资、储蓄及结余资金的使用决策。",
    reverse: false,
  },
  {
    id: "D2_Q04",
    dimension: "D2",
    text: "我无法独立制定清晰的离婚后个人财务收支与资产规划方案。",
    reverse: true,
  },
  {
    id: "D2_Q05",
    dimension: "D2",
    text: "我有稳定的独立住所，或已制定清晰、可执行的分居居住方案。",
    reverse: false,
  },
  {
    id: "D2_Q06",
    dimension: "D2",
    text: "若失去对方的经济支持，我难以凭借自身维持当前的生活水准。",
    reverse: true,
  },

  {
    id: "SYS_CHILD_GATE",
    system: true,
    text: "您当前是否存在需要在离婚中一并考虑抚养、探望或共同养育安排的未成年子女？",
    options: [
      { label: "是", value: "yes" },
      { label: "否", value: "no" },
    ],
    helper: "该问题仅用于判断是否需要进入子女相关评估，不计入结果分数。",
  },

  {
    id: "D3_Q01",
    dimension: "D3",
    text: "我清楚自己争取或放弃抚养权的真实意愿，并能理性说明理由。",
    reverse: false,
  },
  {
    id: "D3_Q02",
    dimension: "D3",
    text: "在争取抚养权方面，我认为自己的资源、准备和应对能力弱于对方。",
    reverse: true,
  },
  {
    id: "D3_Q03",
    dimension: "D3",
    text: "我认为对方存在明显不利于子女成长的因素，子女由对方抚养风险较大。",
    reverse: false,
  },
  {
    id: "D3_Q04",
    dimension: "D3",
    text: "即使未获抚养权，我也有信心平和处理与前配偶的关系，并维持与子女的良好互动。",
    reverse: false,
  },

  {
    id: "D4_Q01",
    dimension: "D4",
    text: "我能自由支配夫妻共同财产中属于自己的合法份额。",
    reverse: false,
  },
  {
    id: "D4_Q02",
    dimension: "D4",
    text: "对方隐匿或独占公司股权、分红信息，我无法知晓相关资产真实情况及收益明细。",
    reverse: true,
  },
  {
    id: "D4_Q03",
    dimension: "D4",
    text: "家庭重大资产处置（如股权、房产、大额投资）需经我协商同意。",
    reverse: false,
  },
  {
    id: "D4_Q04",
    dimension: "D4",
    text: "我能及时察觉并掌握夫妻共同财产的处置、转移等相关情况。",
    reverse: false,
  },
  {
    id: "D4_Q05",
    dimension: "D4",
    text: "对方擅自以家庭名义对外举债、制造虚假债务，将债务压力转嫁于我并以此限制我的财务自由。",
    reverse: true,
  },

  {
    id: "D5_Q01",
    dimension: "D5",
    text: "我清楚离婚的法定流程和办理方式。",
    reverse: false,
  },
  {
    id: "D5_Q02",
    dimension: "D5",
    text: "我已经主动整理关键证据（如家暴记录、转账凭证、聊天记录等）和重要证件信息（银行卡、结婚证、护照等）并妥善保存。",
    reverse: false,
  },
  {
    id: "D5_Q03",
    dimension: "D5",
    text: "我能识别对方拖延离婚的策略，并知道依法采取应对措施。",
    reverse: false,
  },
  {
    id: "D5_Q04",
    dimension: "D5",
    text: "若对方在网络上散布我的隐私或诽谤，我知道如何取证、并维权。",
    reverse: false,
  },
  {
    id: "D5_Q05",
    dimension: "D5",
    text: "我能接受法院判决的财产分割结果可能远低于我的预期，不会因此放弃离婚或采取极端行为。",
    reverse: false,
  },

  {
    id: "D6_Q01",
    dimension: "D6",
    text: "我与对方存在稳定的性亲密互动。",
    options: [
      { label: "基本无性生活（完全不符合）", value: 1 },
      { label: "每月少于 2 次（不太符合）", value: 2 },
      { label: "每月 2 次（一般）", value: 3 },
      { label: "每月 3 次（基本符合）", value: 4 },
      { label: "每周约 1 次（完全符合）", value: 5 },
      { label: "与本人情况无关", value: "na" },
    ],
    reverse: true,
  },
  {
    id: "D6_Q02",
    dimension: "D6",
    text: "跟对方的亲密关系偶尔会让我重新思考或者拖延离婚的决心。",
    reverse: true,
  },
  {
    id: "D6_Q03",
    dimension: "D6",
    text: "因生理因素导致的性欲减退或性生活困难，增强了我考虑离婚的倾向。",
    reverse: false,
  },
  {
    id: "D6_Q04",
    dimension: "D6",
    text: "婚外亲密关系的存在让我更倾向于结束当前婚姻关系。",
    reverse: false,
  },

  {
    id: "SYS_CROSS_BORDER_GATE",
    system: true,
    text: "您的婚姻是否涉及跨境因素，例如中外婚姻、境外身份或居留、境外资产、子女境外身份或跨境居住安排等？",
    options: [
      { label: "是", value: "yes" },
      { label: "否", value: "no" },
    ],
    helper: "该问题仅用于判断是否需要进入跨境事项评估，不计入结果分数。",
  },

  {
    id: "D7_Q01",
    dimension: "D7",
    text: "即便离婚可能导致我的配偶签证或居留许可失效，但我也不会为此太过担心。",
    reverse: false,
  },
  {
    id: "D7_Q02",
    dimension: "D7",
    text: "离婚基本不会影响到子女的国外留居身份，也不会阻碍我带孩子跨境探亲、往返国内外。",
    reverse: false,
  },
  {
    id: "D7_Q03",
    dimension: "D7",
    text: "即便对方利用语言文化优势，通过藏匿证件或虚假举报、虚假诉讼等方式来要挟我，我也不会放弃离婚或接受不利条件。",
    reverse: false,
  },
  {
    id: "D7_Q04",
    dimension: "D7",
    text: "对方可能会利用跨境离婚财产披露制度，获取我在其他国家或地区的财产线索。",
    reverse: true,
  },
];

export const QUESTION_MAP = Object.fromEntries(
  QUESTIONS.map((question) => [question.id, question])
);
