import { z } from "zod";
import type { Field } from "payload";
import { highConflictPresentationSchema } from "@/contracts/cms-high-conflict";

type Node = { type?: string; properties?: Record<string, Node>; items?: Node; enum?: string[]; const?: string; minItems?: number; maxItems?: number; required?: string[] };
const labels: Record<string, string> = {
  hero: "首屏", title: "标题", statement: "核心表达", audience: "用户处境", value: "服务价值", image: "图片", caption: "说明", primaryAction: "主要行动", secondaryAction: "次要行动", label: "标签", href: "链接", openInNewTab: "新窗口打开",
  situations: "常见情境", intro: "引导说明", note: "补充说明", empty: "未选择提示", resultLabel: "结果标题", items: "内容列表", key: "固定标识", priority: "建议优先事项", cycle: "冲突循环", steps: "步骤", description: "描述", response: "可尝试的调整",
  support: "专项支持", directions: "专项服务（新版七项）", situation: "适用情境", goal: "支持目标", work: "具体工作", toolTitle: "示意标题", toolRows: "示意材料", text: "正文", priorities: "旧版优先事项工具（新版不展示）", privacy: "隐私说明", summaryTitle: "提纲标题", summaryIntro: "提纲开头", copyLabel: "复制按钮", copiedLabel: "复制成功", copyFailed: "复制失败提示", clearLabel: "清空按钮", guidance: "建议方向", prompt: "咨询问题",
  process: "支持流程", discussion: "主要讨论", result: "形成结果", next: "下一步", children: "孩子保护", comparison: "专业对比", headers: "表头", rows: "表格行", dimension: "维度", coaching: "专项辅导", therapy: "心理咨询", legal: "律师服务", urgent: "紧急支持", outcomes: "可能的改变", boundaries: "服务边界", finalCta: "页尾邀请", actions: "行动入口", ui: "界面文案", navLabel: "导航名称", navigation: "本页导航", section: "目标区块", situationLabel: "情境标题", goalLabel: "目标标题", workLabel: "工作标题", discussionLabel: "讨论标题", nextLabel: "下一步标题", selectedLabel: "选择状态", emergencyLabel: "安全提示标题", previewLabel: "预览提示", exitPreview: "退出预览",
};

// Derive editor fields from the approved website contract, keeping one content shape.
export function highConflictFields(): Field {
  let index = 0;
  function field(name: string, node: Node): Field {
    const label = labels[name] ?? name;
    if (name === "directions") name = "dirs";
    if (name === "toolRows") name = "tool";
    if (name === "image") return { name, label, type: "relationship", relationTo: "media", required: true, filterOptions: { and: [{ publicApproved: { equals: true } }, { mimeType: { contains: "image/" } }] } };
    if (node.type === "object") return { name, label, type: "group", fields: Object.entries(node.properties ?? {}).filter(([key]) => key !== "key" || name !== "highConflict").map(([key, child]) => field(key, child)) };
    if (node.type === "array") {
      const arrayID = ++index;
      return { name, label, type: "array", dbName: `hc_a${arrayID}`, minRows: node.minItems, maxRows: node.maxItems, required: true, admin: { initCollapsed: true }, fields: node.items?.type === "object" ? Object.entries(node.items.properties ?? {}).map(([key, child]) => field(key, child)) : [field("value", node.items ?? {})] };
    }
    if (node.type === "boolean") return { name, label, type: "checkbox", defaultValue: false };
    if (node.enum) return { name, label, type: "select", enumName: `hc_enum_${++index}`, required: true, options: node.enum };
    if (["key", "label", "href", "section"].includes(name)) return { name, label, type: "text", required: true };
    return { name, label: name === "value" ? "内容" : label, type: "textarea", required: true };
  }
  const schema = z.toJSONSchema(highConflictPresentationSchema, { unrepresentable: "any" }) as Node;
  const result = field("highConflict", schema);
  result.admin = { condition: data => data.key === "high-conflict-divorce" };
  return result;
}

export function expandHighConflict(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(item => item && typeof item === "object" && "value" in item ? item.value : expandHighConflict(item));
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, item]) => [key === "dirs" ? "directions" : key === "tool" ? "toolRows" : key, expandHighConflict(item)]));
  return value;
}
