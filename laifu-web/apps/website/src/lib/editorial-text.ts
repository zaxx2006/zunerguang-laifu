export type EditorialListLayout = "index" | "prompts" | "statements";
export type EditorialRun = { kind: "paragraph" | "heading" | "label" | "note" | "list" | "reading" | "media" | "entries" | "recommendations"; lines: string[]; layout?: EditorialListLayout; sourceBullets?: number };

const bulletPattern = /^[·•🔹]\s*/u;
const labelPattern = /^(?:适合你，如果|推荐内容|核心表格|精选文章|推荐指南|近期主题|推荐课程|主题包括|适用对象|内容包含|覆盖内容|常见主题|活动形式|主要内容|服务特点|常见小组方向|小组特点)[：:]?$/u;
const notePattern = /^(?:摘要预览|查看最新文章|更多深度对谈|自测结果仅供|本工具用于)/u;
export const recommendationLabelPattern = /^(?:推荐指南|近期主题|推荐课程)[：:]?$/u;
const scheduleNotePattern = /^线上及线下场次以/u;
const entryPattern = /^([^：:，,。！？；;\d\n]{2,18}[：:])\s*([^\s/].*)$/u;

export function editorialListLayout(items: string[]): EditorialListLayout {
  if (items.every((item) => /[？?]$/u.test(item) || /^(?:哪些|哪一|是否|怎样|如何|何时|谁|由谁|什么时候)/u.test(item))) return "prompts";
  const short = items.every((item) => item.replace(/[；;。]$/u, "").length <= 26);
  const clauses = items.filter((item) => /[，,]/u.test(item)).length;
  return short && clauses * 2 < items.length ? "index" : "statements";
}

export function isEditorialListLabel(line: string): boolean {
  return labelPattern.test(line);
}

export function splitEditorialStatement(line: string): readonly [string, string] {
  const clauses = line.match(/^(.{5,28}?[，,])\s*(.{5,})$/u);
  return clauses ? [clauses[1], clauses[2]] : [line, ""];
}

export function parseEditorialRuns(text: string): EditorialRun[] {
  const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);
  const runs: EditorialRun[] = [];
  for (let index = 0; index < lines.length;) {
    const line = lines[index];
    if (recommendationLabelPattern.test(line)) {
      runs.push({ kind: "label", lines: [line] });
      const items: string[] = [];
      let sourceBullets = 0;
      index += 1;
      while (index < lines.length && !labelPattern.test(lines[index]) && !scheduleNotePattern.test(lines[index].replace(bulletPattern, ""))) {
        sourceBullets += Number(bulletPattern.test(lines[index]));
        items.push(lines[index++].replace(bulletPattern, ""));
      }
      if (items.length) runs.push({ kind: "recommendations", lines: items, sourceBullets });
      if (lines[index] && scheduleNotePattern.test(lines[index].replace(bulletPattern, ""))) runs.push({ kind: "note", sourceBullets: Number(bulletPattern.test(lines[index])), lines: [lines[index++].replace(bulletPattern, "")] });
      continue;
    }
    if (bulletPattern.test(line)) {
      const items: string[] = [];
      const paired = lines[index + 1] && !bulletPattern.test(lines[index + 1]) && bulletPattern.test(lines[index + 2] || "");
      while (index < lines.length && bulletPattern.test(lines[index])) {
        const title = lines[index++].replace(bulletPattern, "");
        items.push(paired && lines[index] && !bulletPattern.test(lines[index]) ? `${title}\n${lines[index++]}` : title);
      }
      const entries = !paired && items.length > 1 ? items.map((item) => item.match(entryPattern)) : [];
      const named = entries.length > 0 && entries.every(Boolean);
      const kind = paired || named ? "entries" : items.every((item) => /^\d+\s*分钟[｜|]/u.test(item)) ? "media" : items.every((item) => /^《.*》[；;。]?$/u.test(item)) ? "reading" : "list";
      runs.push({ kind, lines: named ? entries.map((entry) => `${entry![1]}\n${entry![2]}`) : items, layout: kind === "list" ? editorialListLayout(items) : undefined, sourceBullets: items.length });
      continue;
    }
    if (/^《.*》$/u.test(line) && (!lines[index + 1] || /^《.*》$/u.test(lines[index + 1]))) {
      const titles: string[] = [];
      while (index < lines.length && /^《.*》$/u.test(lines[index])) titles.push(lines[index++]);
      runs.push({ kind: "reading", lines: titles });
      continue;
    }
    const next = lines[index + 1];
    const isLabel = labelPattern.test(line);
    const isHeading = index === 0 && next && !isLabel && line.length <= 36 && !/[。！？：:]$/u.test(line) && !bulletPattern.test(next) && (next.length > line.length || labelPattern.test(next));
    runs.push({ kind: notePattern.test(line) ? "note" : isLabel ? "label" : isHeading ? "heading" : "paragraph", lines: [line] });
    index += 1;
  }
  return runs;
}
