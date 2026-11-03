export { homeFooterColumns, type FooterColumn } from "../../../../../shared/site-navigation";

export const homeServices = [
  { href: "/services/divorce-coaching/", title: ["离婚陪伴辅导"], description: "一对一稳定状态、梳理局势与核心诉求，把复杂困境拆成可以执行的步骤。", action: "了解陪伴辅导", image: { src: "/images/editorial/p01-home-coaching.webp", alt: "两位成年人在木桌旁交谈，其中一人用笔记录", width: 1280, height: 853 } },
  { href: "/services/high-conflict-divorce/", title: ["高冲突婚姻", "专项支持"], description: "面对反复拉扯、情绪操控、亲子对立或财产阻碍，建立边界并降低风险。", action: "查看专项支持", image: { src: "/images/editorial/p02-home-high-conflict.webp", alt: "一位女性沿树荫下的河岸石阶行走", width: 1280, height: 853 } },
  { href: "/courses-workshops/", title: ["课程 工作坊", "与疗愈营"], description: "围绕离婚规划、沟通谈判、共同养育和自我重建，选择适合自己的学习与支持方式。", action: "查看课程与项目", image: { src: "/images/editorial/p03-home-courses.webp", alt: "学员在膝上的练习册中用铅笔记录", width: 1280, height: 853 } },
  { href: "/retreats-workshops/", title: ["线下活动", "与社群陪伴"], description: "查看近期讲座、主题工作坊、成长小组及沉浸式线下活动。", action: "查看近期活动", image: { src: "/images/editorial/p04-home-community.webp", alt: "四位成年人在活动室里进行小组交流", width: 1280, height: 853 } },
  { href: "/academy/", title: ["焕屿学院"], description: "面向家事律师、心理咨询师、财富顾问等从业者，提供专业培训与跨领域协作。", action: "进入焕屿学院", image: { src: "/images/editorial/p05-home-academy.webp", alt: "三位成年人在教室里共同讨论案例资料", width: 1280, height: 853 } },
] as const;

