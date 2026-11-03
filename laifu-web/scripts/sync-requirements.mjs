import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const website = path.join(root, "apps/website");
const snapshot = JSON.parse(fs.readFileSync(path.join(root, "docs/requirements/workbook-2026-09-03.json"), "utf8"));
const sheets = snapshot.sheets;
const pages = {};
const selected = new Map();
const routes = { home: "", services: "services", about: "about", founder: "about/founder", divorceCoaching: "services/divorce-coaching", coParenting: "services/co-parenting", mediation: "services/mediation-preparation", recovery: "services/post-divorce-recovery", collaboration: "collaborative-law", highConflict: "services/high-conflict-divorce", highNetWorth: "services/nuptial-agreements", academy: "academy", courses: "courses-workshops", community: "retreats-workshops", resources: "resources", articles: "blog", media: "media", faq: "faq", booking: "book-consultation", remarriage: "services/remarriage-preparation" };
let currentKey = "";
const rowFor = (index, id) => typeof id === "number" ? sheets[index].rows.find((row) => row.row === id) : sheets[index].rows.find((row) => row.cells[`A${row.row}`] === id);
const cell = (row, column) => row?.cells[`${column}${row.row}`]?.trim() || "";
const anchor = (key, id) => `/${routes[key]}/#${key}-${id.toLowerCase()}`;
const copy = (text) => ({ kind: "copy", text });
const actions = (...items) => ({ kind: "actions", actions: items.map(([label, href]) => ({ label, href })) });
const subsection = (title, blocks, collapsible = false) => ({ kind: "subsection", title, blocks, collapsible });
const grid = (items, mode = "cards") => ({ kind: "grid", mode, items });
function get(index, id, column) {
  const row = rowFor(index, id);
  if (!row) throw new Error(`Missing ${index}:${id}`);
  const override = cell(row, "H");
  const useH = (index === 1 || index === 2 || index === 11) && override && !/^(?:【|备注|删|内置|\/)/.test(override);
  const chosen = column || (useH ? "H" : "G");
  const value = cell(row, chosen).replace(/\u200c/g, "");
  if (value && value !== "/" && !/^删(?:除|掉)?$/.test(value)) {
    const key = `${index}:${chosen}${row.row}`;
    if (!selected.has(key)) selected.set(key, { sheet: sheets[index].sheet, cell: `${chosen}${row.row}`, text: value, pages: [] });
    const item = selected.get(key);
    if (!item.pages.includes(currentKey)) item.pages.push(currentKey);
    return value;
  }
  return "";
}
function target(label) {
  if (/精品文章|前往.*文章/.test(label)) return "/blog/";
  if (/收听|观看|回放/.test(label)) return "/media/#media-availability";
  if (/分开谈话|分开谈话准备支持/.test(label) && !/预约/.test(label)) return anchor("coParenting", "Q44");
  if (/查看孩子适应/.test(label)) return anchor("coParenting", "Q46");
  if (/准备共同养育方案/.test(label)) return anchor("coParenting", "Q16");
  if (/查看高冲突与平行/.test(label)) return anchor("coParenting", "Q48");
  if (/查看子女安排/.test(label)) return anchor("coParenting", "Q53");
  if (/查看协议后/.test(label)) return anchor("coParenting", "Q55");
  if (/自测|测评/.test(label) && !/解读|讲解|报告/.test(label)) return currentKey === "remarriage" ? anchor("remarriage", "Q11") : currentKey === "coParenting" ? anchor("coParenting", "Q22") : "https://laifu-assessments.pages.dev/";
  if (/适合我/.test(label)) return anchor("collaboration", "Q26");
  if (/自恋|婚姻高冲突风险/.test(label)) return "https://laifu-assessments.pages.dev/narcissism-risk/";
  if (/预约|报名|提交|申请|登记|咨询|洽谈/.test(label)) return "/book-consultation/#booking-channel";
  if (/创始人/.test(label)) return "/about/founder/";
  if (/全部服务|完整服务|我们的服务/.test(label)) return "/services/";
  if (/学院|培训合作/.test(label)) return "/academy/";
  if (/近期活动|近期小组|近期工作坊|活动社群/.test(label)) return "/retreats-workshops/#community-availability";
  if (/课程|工作坊/.test(label)) return "/courses-workshops/";
  if (/领取|获取|下载|全部指南/.test(label)) return "/resources/#resources-availability";
  if (/免费指南/.test(label)) return anchor("resources", "Q06");
  if (/资源/.test(label)) return "/resources/";
  if (/文章|专题/.test(label)) return anchor("articles", "Q09");
  if (/高冲突/.test(label)) return "/services/high-conflict-divorce/";
  if (/调解|谈判/.test(label)) return "/services/mediation-preparation/";
  if (/家事协同/.test(label)) return "/collaborative-law/";
  if (/一对一|离婚辅导|离婚陪跑|起步包/.test(label)) return "/services/divorce-coaching/";
  return "/book-consultation/#booking-channel";
}
function parseActions(text) {
  return text.split(/[\n｜]/).map((line) => line.trim().replace(/^[·•]\s*/, "").replace(/^(?:(?:主|次|辅助)按钮|按钮文案|按钮)[：:]?\s*/, "")).filter(Boolean).map((line) => {
    const [label, url] = line.split(/\s*→\s*(?=https?:)/);
    return { label, href: url ? new URL(url).pathname : target(label) };
  });
}
function blocks(text) {
  const output = [];
  let pending = [];
  let buttonMode = false;
  const flush = () => {
    if (pending.length) output.push(buttonMode ? { kind: "actions", actions: parseActions(pending.join("\n")) } : copy(pending.join("\n").trim()));
    pending = [];
  };
  for (const line of text.split("\n")) {
    if (/^[·\s]*(?:(?:主|次|辅助)按钮|按钮文案|按钮)[：:]/.test(line)) {
      flush();
      buttonMode = true;
      pending.push(line);
    } else if (buttonMode && /^\s*$/.test(line)) {
      flush();
      buttonMode = false;
    } else pending.push(line);
  }
  flush();
  return output.filter((block) => block.kind !== "copy" || block.text);
}
function pageFrom(index, key, sectionIds, options = {}) {
  currentKey = key;
  const page = { sourceSheet: sheets[index].sheet, intro: [], sections: [], cta: null };
  pages[key] = page;
  const headings = new Map(sectionIds.map((id) => [rowFor(index, id).row, id]));
  const skip = new Set(options.skip || []);
  const subIds = new Set(options.sub || []);
  let container = page.intro;
  let section;
  for (const row of sheets[index].rows) {
    const id = cell(row, "A");
    if (/^(?:SEO|CTA|页面呈现)/.test(id)) continue;
    if (row.row < (options.start || 3) || row.row > (options.end || 999) || skip.has(id) || skip.has(row.row)) continue;
    if (!id.startsWith("Q") && !headings.has(row.row) && !cell(row, "G") && !cell(row, "H")) continue;
    if (cell(row, "D").startsWith("删除") || cell(row, "H").startsWith("删")) continue;
    const text = get(index, row.row);
    if (!text || (id && !id.startsWith("Q") && text === "解决方案/备注")) continue;
    if (headings.has(row.row)) {
      const [title, ...rest] = text.split("\n");
      const sectionId = String(headings.get(row.row));
      section = { id: sectionId, title: title.replace(/^第七板块｜/, ""), blocks: blocks(rest.join("\n")) };
      page.sections.push(section);
      container = section.blocks;
    } else if (subIds.has(id) || /小标题/.test(cell(row, "D"))) {
      const sub = { ...subsection(text, [], Boolean(options.collapse) || /【建议】/.test(cell(row, "H"))), id: `${key}-${id.toLowerCase()}` };
      (section?.blocks || page.intro).push(sub);
      container = sub.blocks;
    } else if (/按钮/.test(cell(row, "D"))) container.push({ kind: "actions", actions: parseActions(text) });
    else container.push(...blocks(text));
  }
  return page;
}
function section(page, id) {
  const found = page.sections.find((item) => item.id === id);
  if (!found) throw new Error(`Missing section ${id}`);
  return found;
}
function cardText(text) {
  const [title, ...rest] = text.split("\n");
  if (title.length > 28 && title.includes("：")) {
    const split = title.indexOf("：");
    return { title: title.slice(0, split), blocks: blocks([title.slice(split + 1), ...rest].join("\n")) };
  }
  if (/^模块[一二三四五六]：$/.test(title) && rest[0]?.startsWith("主题：")) return { title: `${title}${rest.shift()}`, blocks: blocks(rest.join("\n")) };
  return { title: title.replace(/^卡片[一二三四五六]｜/, ""), blocks: blocks(rest.join("\n")) };
}
function appendix(index, key) {
  currentKey = key;
  const row = sheets[index].rows.find((item) => cell(item, "A").startsWith("CTA"));
  if (!row) return;
  const source = get(index, row.row, "A").split(/SEO\s*(?:设置|优化)/)[0].trim();
  const lines = source.split("\n");
  const first = lines.shift();
  const title = first.includes("｜") ? first.split("｜").slice(1).join("｜") : lines.shift();
  const remaining = lines.join("\n");
  const [body, buttonText = ""] = remaining.split(/按钮文案/);
  pages[key].cta = { title, body: body.trim(), actions: buttonText.trim() ? parseActions(buttonText) : [{ label: "了解预约方式", href: "/book-consultation/#booking-channel" }] };
}

pageFrom(2, "about", ["Q06", "Q08", "Q23", "Q35", "Q41", "Q56", "Q59"], { skip: ["Q01", "Q02"], sub: ["Q10", "Q12", "Q14", "Q16", "Q27", "Q29", "Q31", "Q37", "Q39", "Q45", "Q48", "Q50", "Q52", "Q54", "Q60", "Q63", "Q66", "Q69"] });
const team = section(pages.about, "Q41").blocks.find((block) => block.title === "01团队与服务数据");
team.blocks = [actions([get(2, "Q46"), "/about/founder/"]), { kind: "metrics", items: get(2, "Q47").split("\n").map((label) => ({ label })) }];
pageFrom(3, "founder", ["Q04", "Q06", "Q08", "Q13", "Q15", "Q17", "Q19"], { skip: ["Q01"], sub: ["Q09", "Q11"] });
const practice = get(3, "Q07").split(/\n{2,}/);
section(pages.founder, "Q06").blocks = [{ kind: "metrics", items: practice.slice(0, 4).map((text) => { const [value, label] = text.split("\n"); return { value, label }; }) }, ...blocks(practice.slice(4).join("\n\n"))];
pageFrom(4, "divorceCoaching", ["Q03", "Q05", "Q07", "Q25", "Q30", "Q33", "Q35", "Q37"], { skip: ["Q01", "Q02", "Q31"], sub: ["Q11", "Q13", "Q15", "Q17", "Q19", "Q21", "Q23"], collapse: true });
const coachingFlow = get(4, "Q27").split(/\n(?=第[一二三]步：)/);
section(pages.divorceCoaching, "Q25").blocks = [copy(coachingFlow[0]), ...coachingFlow.slice(1).map((text) => { const [summary, ...body] = text.split("\n"); return { kind: "disclosure", summary, text: body.join("\n") }; }), subsection(get(4, "Q28"), blocks(get(4, "Q29")))];
section(pages.divorceCoaching, "Q25").subtitle = get(4, "Q26");
section(pages.divorceCoaching, "Q30").blocks.unshift({ kind: "table", headers: ["I", "J", "K", "L"].map((col) => get(4, 33, col)), rows: [34, 35, 36, 37, 38].map((row) => ["I", "J", "K", "L"].map((col) => get(4, row, col))) });
pageFrom(6, "coParenting", ["Q06", "Q16", "Q22", "Q30", "Q38", "Q43", "Q57", "Q59", "Q63", "Q67", "Q69", "Q71", "Q73", "Q75", "Q78"], { skip: ["Q01", "Q02", "Q03", "Q04", "Q31"], sub: ["Q44", "Q46", "Q48", "Q53", "Q55", "Q61", "Q65"], collapse: true });
section(pages.coParenting, "Q30").blocks = [grid(["Q32", "Q33", "Q34", "Q35", "Q36", "Q37"].map((id) => cardText(get(6, id))))];
section(pages.coParenting, "Q38").blocks = [grid(["Q39", "Q40", "Q41", "Q42"].map((id) => cardText(get(6, id))), "steps")];
const parentingQuestions = get(6, "Q27").split(/\n{2,}/).slice(1).map((text, index) => ({ ...cardText(text), href: [anchor("coParenting", "Q44"), anchor("coParenting", "Q46"), anchor("coParenting", "Q16"), anchor("coParenting", "Q48"), anchor("coParenting", "Q53"), anchor("coParenting", "Q55"), anchor("coParenting", "Q69")][index] }));
section(pages.coParenting, "Q22").blocks = [copy(get(6, "Q25")), copy(get(6, "Q26")), { kind: "selfcheck", id: "parenting", items: parentingQuestions }, actions(["预约自测结果讲解", "/book-consultation/#booking-channel"])];
const faqBlocks = (text) => text.split(/\n{2,}(?=[（(]\d+[）)])/).map((part) => { const [summary, ...body] = part.split("\n"); return { kind: "disclosure", summary, text: body.join("\n") }; });
section(pages.coParenting, "Q78").blocks = faqBlocks(get(6, "Q79"));
pageFrom(7, "mediation", ["Q05", "Q07", "Q09", "Q11", "Q27", "Q32", "Q37"], { skip: ["Q01", "Q02", "Q03", "Q04"], collapse: true });
pageFrom(8, "recovery", ["Q05", "Q06", "Q16", "Q21", "Q32", "Q34"], { skip: ["Q01", "Q02", "Q03", "Q04"], collapse: true });
section(pages.recovery, "Q16").blocks = [...blocks(get(8, "Q19")), actions([get(8, "Q20"), "/services/remarriage-preparation/"])];
pageFrom(10, "collaboration", ["Q05", "Q11", "Q17", "Q24", "Q26", "Q28", "Q30", "Q35", "Q41", "Q43", "Q45", "Q47", 58], { skip: ["Q01", "Q02", "Q03", "Q04"] });
const labeledTable = (index, ids, labels) => ({ kind: "table", headers: labels, rows: ids.map((id) => { const text = get(index, id); return labels.map((label, i) => text.split(`${label}：`)[1]?.split(i < labels.length - 1 ? `${labels[i + 1]}：` : "\u0000")[0].trim() || ""); }) });
section(pages.collaboration, "Q17").blocks = [labeledTable(10, ["Q18", "Q19", "Q20"], ["支持方式", "谁参加、怎样参加", "需先说明的规则与承诺"])];
section(pages.collaboration, "Q35").blocks = [labeledTable(10, ["Q36", "Q37", "Q38", "Q39", "Q40"], ["角色", "主要负责", "不负责"])];
section(pages.collaboration, "Q30").blocks = [grid(["Q31", "Q32", "Q33", "Q34"].map((id) => cardText(get(10, id))))];
const relatedTargets = ["/services/high-conflict-divorce/", "/services/mediation-preparation/", "/services/co-parenting/", "/services/nuptial-agreements/", anchor("highNetWorth", "Q32"), anchor("coParenting", "Q55"), anchor("collaboration", "Q30"), "/services/remarriage-preparation/"];
section(pages.collaboration, "Q47").blocks = [grid(Array.from({ length: 8 }, (_, index) => {
  const text = get(10, 50 + index);
  const title = text.split("\n")[0].replace("主要问题：", "");
  const label = text.match(/建议跳转页面：(.*)/)[1];
  return { title, blocks: [actions([label, relatedTargets[index]])] };
}))];
pageFrom(11, "highConflict", ["Q04", 11, "Q09", "Q19", "Q21", "Q23", "Q39", "Q49", "Q51", "Q53", "Q55", "Q57"], { skip: ["Q01", "Q02", "Q03", 14], collapse: true });
section(pages.highConflict, "11").blocks.push(actions([get(11, 14), "https://laifu-assessments.pages.dev/narcissism-risk/"]), copy("本工具用于自我观察与风险梳理，不作人格障碍诊断，也不能替代专业安全评估。"));
pageFrom(12, "highNetWorth", ["Q05", "Q09", "Q19", "Q24", "Q32", "Q34", "Q36", "Q38", "Q40"], { skip: ["Q01", "Q02", "Q03", "Q04"], collapse: true });
pageFrom(13, "academy", ["Q05", "Q08", "Q12", "Q14", "Q21", "Q23", "Q25", "Q27"], { skip: ["Q01", "Q02", "Q04"], collapse: true });
pageFrom(14, "courses", ["Q05", "Q14", "Q19", "Q24", "Q28"], { skip: ["Q01", "Q02", "Q03", "Q04"] });
const courseDisclosures = (items) => items.map((block) => block.kind === "copy" && /^\d+\. /.test(block.text) ? subsection(block.text.split("\n")[0], blocks(block.text.split("\n").slice(1).join("\n")), true) : block.blocks ? { ...block, blocks: courseDisclosures(block.blocks) } : block);
for (const item of pages.courses.sections) item.blocks = courseDisclosures(item.blocks);
currentKey = "courses";
pages.courses.intro = blocks(get(14, "Q04"));
section(pages.courses, "Q14").blocks.push(subsection("新增亲职课程与专题活动", blocks(get(6, "Q74")), true));
pages.courses.sections.push({ id: "remarriage", title: "再婚前的财务边界与协议准备", blocks: [actions(["了解婚前协议与财务边界培训", "/services/remarriage-preparation/"])] });
pageFrom(15, "community", ["Q05", "Q08", "Q12", "Q17", "Q28", "Q30", "Q32"], { skip: ["Q01", "Q02", "Q03", "Q04"], collapse: true });
pages.community.intro.push(actions(["查看课程与工作坊", "/courses-workshops/"]));
pageFrom(16, "resources", ["Q02", "Q06", "Q14", "Q16", "Q18", "Q20", "Q22", "Q27", "Q29", "Q31"], { skip: ["Q01"], sub: ["Q09", "Q10", "Q11", "Q12", "Q23", "Q25"] });
currentKey = "resources";
pages.resources.intro = blocks(get(16, "Q01").split("\n").slice(1).join("\n"));
pageFrom(17, "articles", ["Q04", "Q07", "Q09", "Q23", "Q30", "Q32"], { skip: ["Q01", "Q02", "Q03"] });
currentKey = "articles";
pages.articles.intro = blocks(get(17, "Q03").split("\n").slice(1).join("\n"));
const topicNames = ["high-conflict", "decision", "separation", "co-parenting", "finances", "rebuilding"];
const topicCards = [];
for (const [index, name] of topicNames.entries()) {
  const key = `topic${index}`;
  routes[key] = `blog/topics/${name}`;
  currentKey = key;
  const title = get(17, `Q${String(11 + index * 2).padStart(2, "0")}`);
  const text = get(17, `Q${String(12 + index * 2).padStart(2, "0")}`);
  const [body] = text.split(/\n按钮：/);
  pages[key] = { sourceSheet: sheets[17].sheet, intro: [copy("以下为专题导读和选题目录；文章全文、作者审核信息与阅读时长尚未提供，暂不标注为已发布文章。")], sections: [{ id: "overview", title, blocks: blocks(body) }], cta: { title: "从了解走向准备", body: "先了解相关支持，再决定自己的下一步。", actions: [{ label: "查看相关支持", href: ["/services/high-conflict-divorce/", "/services/divorce-coaching/", "/services/divorce-coaching/", "/services/co-parenting/", "/services/nuptial-agreements/", "/services/post-divorce-recovery/"][index] }, { label: "返回文章专栏", href: "/blog/" }] } };
  const preview = body.split("你将了解：")[0];
  const titles = [...body.matchAll(/《[^》]+》/g)].slice(0, 3).map((match) => match[0]).join("\n");
  topicCards.push({ title, blocks: [copy(preview), copy(titles), actions([text.match(/按钮：(.*)/)[1], `/${routes[key]}/`])] });
}
section(pages.articles, "Q09").blocks = [copy(get(17, "Q10")), grid(topicCards)];
currentKey = "articles";
const latestArticles = get(17, "Q08").split(/\n{2,}/).filter((text) => !text.startsWith("按钮"));
section(pages.articles, "Q07").blocks = [grid(latestArticles.map((text) => {
  const lines = text.split("\n");
  const category = /^[（(]/.test(lines[0]) ? lines.shift() : "";
  const title = lines.shift();
  return { title, blocks: [...(category ? [copy(category)] : []), copy(lines.join("\n")), copy("摘要预览 · 全文待发布")] };
}))];
section(pages.articles, "Q07").blocks.push(copy("查看最新文章：以上为摘要预览，文章全文待正式发布。"));
section(pages.articles, "Q04").blocks = [grid(get(17, "Q06").split(/\n{2,}(?=[（(]\d+[）)])/).map(cardText))];
pageFrom(18, "media", ["Q05", "Q09", "Q13", "Q16", "Q22", "Q24", "Q26", "Q28"], { skip: ["Q01", "Q02", "Q03", "Q04"], collapse: true });
pages.media.intro = [copy(get(18, "Q04"))];
pageFrom(19, "faq", ["Q02", "Q11", "Q26", "Q47", "Q60", "Q72", "Q83"], { skip: ["Q01", "Q03", "Q27", "Q28", "Q48", "Q49", "Q61", "Q62", "Q71"] });
currentKey = "faq";
const faqGroups = [["Q02", [[null, "Q04", "焕屿是律师事务所吗？"], [null, "Q05", "离婚辅导和心理治疗有什么不同？"], ["Q06", "Q07"], ["Q08", "Q09"], [null, "Q10", cell(rowFor(19, "Q10"), "F")]]], ["Q11", [12, 14, 16, 18, 20, 22, 24]], ["Q26", [29, 31, 33, 35, 37, 39, 41, 43, 45]], ["Q47", [50, 52, 54, 56, 58]], ["Q60", [63, 65, 67, 69]], ["Q72", [73, 75, 77, 79, 81]]];
for (const [id, pairs] of faqGroups) section(pages.faq, id).blocks = pairs.map((pair) => {
  const [question, answer, fallback] = Array.isArray(pair) ? pair : [`Q${String(pair).padStart(2, "0")}`, `Q${String(pair + 1).padStart(2, "0")}`];
  return { kind: "disclosure", summary: question ? get(19, question) : fallback, text: get(19, answer) };
});
for (const [id, subtitles] of [["Q02", ["Q03"]], ["Q26", ["Q27", "Q28"]], ["Q47", ["Q48", "Q49"]], ["Q60", ["Q61", "Q62"]]]) section(pages.faq, id).subtitle = subtitles.map((part) => get(19, part)).join(" · ");
section(pages.faq, "Q60").blocks.push(actions([get(19, "Q71"), "/services/high-conflict-divorce/"]));
pageFrom(20, "booking", ["Q02", "Q11", "Q15", "Q19", "Q21", "Q23", "Q25"], { skip: ["Q01", "Q09", "Q10"], sub: ["Q17"] });
currentKey = "booking";
const deep = get(20, "Q16").split(/\n{2,}/);
section(pages.booking, "Q15").blocks = [copy(deep.shift()), grid([cardText(deep.join("\n\n")), { title: get(20, "Q17"), blocks: blocks(get(20, "Q18")) }])];
const situation = get(20, "Q14").split(/\n{2,}/);
section(pages.booking, "Q11").blocks = [grid(situation.slice(0, 3).map(cardText)), ...blocks(situation.slice(3).join("\n\n"))];
section(pages.booking, "Q19").blocks.push(actions(["了解家事协同支持", "/collaborative-law/"]));
pages.booking.sections.splice(5, 0, { id: "channel", title: "预约申请", blocks: [{ kind: "booking" }, ...blocks(get(20, "Q26"))] });
pageFrom(23, "remarriage", ["Q07", "Q09", "Q11", "Q15", "Q20", "Q26", "Q28", "Q34", "Q36", "Q38", "Q41", "Q43"], { skip: ["Q01", "Q02", "Q03", "Q04", "Q13", 16, 17, 18, 19, 20, 21, 22] });
currentKey = "remarriage";
section(pages.remarriage, "Q11").blocks = [copy(get(23, "Q12")), { kind: "selfcheck", id: "remarriage", items: [16, 17, 18, 19, 20, 21, 22].map((row) => ({ title: get(23, row, "G"), blocks: [copy(get(23, row, "H"))], href: anchor("remarriage", "Q20") })) }, actions(["领取再婚前财务边界清单", "/resources/#resources-availability"], ["预约报告解读", "/book-consultation/#booking-channel"] )];
section(pages.remarriage, "Q15").blocks = [grid(["Q16", "Q17", "Q18", "Q19"].map((id) => cardText(get(23, id))), "steps")];
section(pages.remarriage, "Q20").blocks = [grid(["Q21", "Q22", "Q23", "Q24", "Q25"].map((id) => cardText(get(23, id))))];
section(pages.remarriage, "Q28").blocks = [grid(["Q29", "Q30", "Q31", "Q32", "Q33"].map((id) => cardText(get(23, id))))];
section(pages.remarriage, "Q41").blocks = faqBlocks(get(23, "Q42"));
section(pages.remarriage, "Q43").title = "为下一段婚姻做好准备";
for (const [index, key] of [[7, "mediation"], [8, "recovery"], [13, "academy"], [14, "courses"], [15, "community"]]) appendix(index, key);
currentKey = "media";
const mediaCta = get(18, 32, "A").split("\n").filter(Boolean);
pages.media.cta = { title: mediaCta[1], body: "音视频、报道与手册尚待发布；可以先浏览栏目规划、支持路径与隐私说明。", actions: mediaCta.slice(2).filter((label) => !["主要按钮", "服务入口"].includes(label)).map((label, index) => ({ label, href: [anchor("media", "Q05"), anchor("media", "Q09"), "/resources/#resources-availability", "/book-consultation/#booking-channel", "/services/", anchor("media", "Q24")][index] })) };

currentKey = "home";
const homepage = { sourceSheet: sheets[1].sheet, intro: [], sections: [], cta: { title: get(1, "Q53"), body: get(1, "Q54"), actions: [{ label: "了解预约方式", href: "/book-consultation/" }] } };
pages.home = homepage;
const homeServiceRows = [["Q12", "Q13", 16, "divorceCoaching"], ["Q26", "Q27", "Q28", "coParenting"], ["Q23", "Q24", "Q25", "mediation"], ["Q29", "Q30", "Q31", "recovery"], ["Q32", "Q33", "Q34", "collaboration"], ["Q17", "Q18", "Q19", "highConflict"], ["Q20", "Q21", "Q22", "highNetWorth"], ["Q35", "Q36", "Q37", "academy"]];
homepage.sections.push({ id: "assessment", title: get(1, "Q04"), subtitle: get(1, "Q05"), blocks: [...blocks(get(1, "Q06")), actions([get(1, "Q07"), "https://laifu-assessments.pages.dev/"]), ...blocks(get(1, "Q08"))] });
homepage.sections.push({ id: "services", title: get(1, "Q09"), subtitle: get(1, "Q10"), blocks: [...blocks(get(1, "Q11")), grid(homeServiceRows.map(([title, body, button, key]) => ({ title: get(1, title), blocks: [copy(get(1, body)), actions([get(1, button), `/${routes[key]}/`])] })))] });
homepage.sections.push({ id: "approach", title: get(1, 41, "H"), subtitle: get(1, 42, "H"), blocks: [grid([["Q38", "Q39"], ["Q40", "Q41"], ["Q42", "Q43"]].map(([title, body]) => ({ title: get(1, title), blocks: [copy(get(1, body))] })), "steps")] });
homepage.sections.push({ id: "learn", title: get(1, 49), subtitle: get(1, 50), blocks: [...blocks(get(1, "Q44")), grid([{ title: "资源中心", blocks: [copy(get(1, "Q45")), actions([get(1, "Q46"), "/resources/"])] }, { title: get(1, "Q50"), blocks: [copy(get(1, "Q51")), actions([get(1, "Q52"), "/retreats-workshops/"])] }])] });
pageFrom(1, "services", ["Q90", "Q93", "Q122", "Q133", "Q135", "Q160", "Q196", "Q198", "Q202", "Q206", "Q209"], { start: 97, skip: ["Q132", "Q116", "Q117", "Q118"], sub: ["Q137", "Q140", "Q143", "Q146", "Q150", "Q152", "Q154", "Q156", "Q158", "Q161", "Q165", "Q167", "Q169", "Q170", "Q172", "Q174", "Q176", "Q177", "Q179", "Q180", "Q182", "Q184", "Q185", "Q187", "Q188", "Q190", "Q191", "Q193"], collapse: true });
currentKey = "services";
section(pages.services, "Q90").blocks = [grid(get(1, "Q91").split("\n").map((text) => ({ title: text, blocks: [] })), "steps"), { kind: "disclosure", summary: "按阶段与现实需要，找到合适的支持", text: get(1, "Q92") }];
const overviewRows = [["Q95", "Q96", "Q97", "divorceCoaching"], ["Q98", "Q99", "Q100", "coParenting"], ["Q101", "Q102", "Q103", "mediation"], ["Q104", "Q105", "Q106", "recovery"], ["Q107", "Q108", "Q109", "collaboration"], ["Q110", "Q111", "Q112", "highConflict"], ["Q113", "Q114", "Q115", "highNetWorth"], ["Q119", "Q120", "Q121", "academy"]];
section(pages.services, "Q93").blocks = [copy(get(1, "Q94")), grid(overviewRows.map(([title, body, button, key]) => ({ title: get(1, title), blocks: [copy(get(1, body)), actions([get(1, button), `/${routes[key]}/`])] }))), actions(["再婚女性婚前协议与财务边界培训", "/services/remarriage-preparation/"])];
section(pages.services, "Q122").blocks = [copy(get(1, "Q123")), grid([["Q124", "Q125"], ["Q126", "Q127"], ["Q128", "Q129"], ["Q130", "Q131"]].map(([title, body]) => ({ title: get(1, title), blocks: [copy(get(1, body))] })), "steps")];
section(pages.services, "Q122").title = get(1, "Q122").replace(/\n/g, "");

const availability = {
  resources: "目前可浏览资源介绍、主题目录及已上线自测。指南、清单、表格的原始下载文件尚未提供，因此暂不开放资料下载，也不收集邮箱。",
  articles: "目前展示栏目导读、文章摘要与选题目录；文章全文、阅读时长及专业审核信息尚未提供。这里的摘要不等同于已发布全文。",
  courses: "课程体系与学习内容已列明。具体开课日期、导师、价格、名额与报名方式待正式确认；当前不开放购买或报名。",
  community: "活动形式与参与规则可先了解。近期场次、日期、地点、导师与费用尚未确认，当前不开放报名。",
  media: "本栏目按需求表标注为待开发。以下为栏目规划与内容示例，暂未提供可播放音视频、报道链接或活动记录，不代表已经发布。",
};
for (const [key, text] of Object.entries(availability)) pages[key].sections.unshift({ id: "availability", title: key === "community" ? "近期活动安排" : "当前可用内容", blocks: [{ kind: "notice", text }] });
currentKey = "resources";
const resourceItems = [];
const stageFor = (text) => /孩子|亲子|养育/.test(text) ? "parenting" : /重建|离婚后|独立生活/.test(text) ? "recovery" : /律师|法律|谈判|财产|债务|材料/.test(text) ? "procedure" : /分居|分离|启动|初期/.test(text) ? "separation" : "decision";
for (const [id, kind, sectionId] of [["Q09", "guide", "Q06"], ["Q10", "guide", "Q06"], ["Q11", "guide", "Q06"], ["Q12", "guide", "Q06"], ["Q17", "checklist", "Q16"], ["Q19", "worksheet", "Q18"], ["Q21", "media", "Q20"], ["Q26", "replay", "Q22"]]) {
  const text = get(16, id);
  const entries = [...text.matchAll(/^(《[^》]+》|·[^\n]+)\n?([^\n《·]*)/gm)];
  for (const match of entries.slice(0, kind === "guide" ? 2 : 4)) {
    const title = match[1].replace(/^·/, "");
    const summary = match[2]?.trim() || "查看该分类的主题介绍与完整目录。";
    resourceItems.push({ title, summary, kind, stage: stageFor(title), href: anchor("resources", sectionId), duration: title.match(/(\d+)\s*分钟/)?.[1] || null });
  }
}
resourceItems.push({ title: "离婚力自我梳理", summary: "围绕当前处境、准备情况和支持需要进行梳理，不作诊断。", kind: "assessment", stage: "decision", href: "https://laifu-assessments.pages.dev/", duration: "5" });
resourceItems.splice(6, 2);
resourceItems.push({ title: "离婚后生活重整表", summary: "从日常节奏、社交关系、自我认同与未来计划入手，搭建新的生活框架。", kind: "worksheet", stage: "recovery", href: anchor("resources", "Q18"), duration: null });
pages.resources.sections.splice(1, 0, { id: "catalog", title: "按形式与阶段，找到一个起点", blocks: [{ kind: "catalog", items: resourceItems }] });
for (const item of pages.resources.sections) {
  if (["Q06", "Q14", "Q16", "Q18", "Q20", "Q22"].includes(item.id)) item.blocks = [subsection("查看本类完整介绍与资源目录", item.blocks, true)];
}
pages.resources.intro.unshift(actions(["找一份指南", anchor("resources", "catalog")], ["做一次自测", "https://laifu-assessments.pages.dev/"], ["查看实用清单", anchor("resources", "Q16")]));
pages.resources.sections.splice(2, 0, { id: "safety", title: "如果你或孩子正面临紧急危险", blocks: [{ kind: "notice", text: "请优先联系当地警方、医疗机构、妇女权益保护机构、庇护资源或紧急援助服务。不要等待自助资源、测评结果或预约回复；如怀疑设备被监控，请使用安全设备和渠道求助。" }] });

const registryPath = path.join(website, "src/lib/page-registry.ts");
const registrySource = fs.readFileSync(registryPath, "utf8");
const raw = Function(`return (${registrySource.match(/const rawPages = (\[[\s\S]*?\]) satisfies/)[1]})`)();
const getMeta = (key) => raw.find((item) => item.slug === routes[key]);
function meta(key, index, title, en, description, eyebrow) {
  currentKey = key;
  let page = getMeta(key);
  if (!page) {
    page = { ...getMeta("about"), slug: routes[key], contentFile: `${key}.mdx`, layout: key === "founder" ? "editorial" : "service", group: key === "founder" ? "company" : "service" };
    raw.push(page);
  }
  if (title) page.titleZh = get(index, title).replace(/\($/, "").split("\n")[0];
  if (en) page.titleEn = get(index, en).replace(/^页面英文名[：:]\s*/, "");
  if (description) page.description = get(index, description);
  if (eyebrow) page.eyebrow = get(index, eyebrow);
  const notes = sheets[index].rows.map((row) => cell(row, "A") + "\n" + cell(row, "G")).find((text) => /SEO\s*标题/.test(text));
  if (notes) {
    page.seoTitle = notes.match(/SEO\s*标题\s*\n([^\n]+)/)?.[1] || page.seoTitle;
    page.seoDescription = notes.match(/SEO\s*描述\s*\n([^\n]+)/)?.[1] || page.seoDescription;
    const keywords = notes.match(/(?:建议关键词|SEO\s*关键词建议)\s*\n([^\n]+)/)?.[1];
    if (keywords) page.keywords = keywords.split(/[、，,]/).map((word) => word.trim());
  }
  page.status = key === "media" ? "prelaunch" : "published";
  return page;
}
meta("home", 1, "Q01", "Q02", "Q03");
meta("services", 1, 95, null, "Q89");
meta("about", 2, null, null, "Q02").titleZh = "关于焕屿";
meta("founder", 3, "Q01", null, "Q02").titleEn = "Founder · Ying Shi";
meta("divorceCoaching", 4, "Q01", null, "Q02");
const parentingMeta = meta("coParenting", 6, "Q01", "Q03", "Q04", "Q02");
parentingMeta.seoTitle = "孩子养育支持辅导｜分开谈话、共同养育与平行养育｜焕屿";
parentingMeta.seoDescription = get(6, "Q09").split("\n")[0];
parentingMeta.keywords = ["孩子养育支持", "共同养育", "平行养育", "分开谈话", "孩子适应", "协议执行支持"];
meta("mediation", 7, "Q01", "Q03", "Q04", "Q02");
meta("recovery", 8, "Q01", "Q03", "Q04", "Q02");
meta("collaboration", 10, "Q01", "Q02", "Q04", "Q03");
meta("highConflict", 11, "Q01", "Q02", "Q03");
meta("highNetWorth", 12, "Q01", "Q03", "Q04", "Q02");
meta("academy", 13, "Q01", "Q02", "Q04");
meta("courses", 14, "Q01", "Q02", null).description = get(14, "Q04").split("\n")[0];
getMeta("courses").eyebrow = get(14, "Q03");
getMeta("courses").parentSlug = "retreats-workshops";
meta("community", 15, "Q01", "Q03", "Q04");
const resourceMeta = meta("resources", 16, null, null, null);
resourceMeta.description = get(16, "Q01").split("\n")[1];
resourceMeta.eyebrow = get(16, "Q01").split("\n")[0];
meta("articles", 17, "Q01", "Q02", null).description = get(17, "Q03").split("\n")[2];
getMeta("articles").eyebrow = get(17, "Q03").split("\n")[0];
meta("media", 18, "Q01", "Q02", null).description = get(18, "Q04").split("\n")[0];
getMeta("media").eyebrow = get(18, "Q03");
const faqMeta = meta("faq", 19, null, null, null);
const faqIntro = get(19, "Q01").split("\n");
faqMeta.titleZh = faqIntro[0];
faqMeta.titleEn = faqIntro[1];
faqMeta.description = faqIntro.slice(2).join("\n");
meta("booking", 20, null, null, null).description = get(20, "Q01");
meta("remarriage", 23, "Q01", "Q02", "Q04").eyebrow = get(23, "Q03");
for (const key of ["about", "academy", "community"]) getMeta(key).eyebrow = "";
for (const [index] of topicNames.entries()) {
  const key = `topic${index}`;
  raw.push(...(getMeta(key) ? [] : [{ ...getMeta("articles"), slug: routes[key], contentFile: `${key}.mdx`, titleZh: pages[key].sections[0].title, titleEn: "Topic Guide", description: pages[key].sections[0].blocks.find((block) => block.kind === "copy").text.split("\n")[0], seoTitle: `${pages[key].sections[0].title}｜文章专题导读｜焕屿`, seoDescription: "从专题导读了解相关议题、适用情形与学习方向；文章全文尚待发布，具体法律或心理问题请咨询相应专业人士。" }]));
  if (getMeta(key).description.length < 20) getMeta(key).description += "。先了解当前处境，再选择适合自己的支持方向。";
}
const aliasData = [["services/decision-support", "服务入口已调整", "/services/", "离婚启动期辅导已从独立服务中移除。请前往服务总览，按当前处境选择离婚陪伴、课程或其他支持。"], ["signature-program", "家事协同支持", "/collaborative-law/", "离婚全周期辅导服务已更新为家事协同支持。请查看最新的角色分工、书面授权与协同服务说明。"]];
for (const [slug, title, href, description] of aliasData) {
  const page = raw.find((item) => item.slug === slug);
  Object.assign(page, { titleZh: title, titleEn: "Updated Service", description, seoTitle: title, seoDescription: description });
  const key = slug === "signature-program" ? "fullCycleAlias" : "decisionAlias";
  routes[key] = slug;
  pages[key] = { sourceSheet: "版本迁移", intro: [], sections: [{ id: "updated", title, blocks: [copy(description), actions(["查看最新服务", href])] }], cta: null };
}
for (const key of Object.keys(pages)) {
  const registry = raw.find((item) => item.slug === routes[key]);
  if (!registry) throw new Error(`Unregistered page ${key}`);
  fs.writeFileSync(path.join(website, "src/content/published", registry.contentFile), `<StructuredContent pageKey="${key}" />\n`);
}
const serialize = (value) => "{ " + Object.entries(value).map(([key, item]) => `${key}: ${JSON.stringify(item)}`).join(", ") + " }";
fs.writeFileSync(registryPath, `import { pageMetaSchema, type PageMeta } from "@/lib/page-schema";\n\nconst rawPages = [\n${raw.map((page) => `  ${serialize(page)},`).join("\n")}\n] satisfies PageMeta[];\n\nexport const pageRegistry = rawPages.map((page) => pageMetaSchema.parse(page));\nconst pageBySlug = new Map(pageRegistry.map((page) => [page.slug, page]));\n\nexport function getPage(slug: string) {\n  return pageBySlug.get(slug);\n}\n\nexport function getPublicPath(page: PageMeta) {\n  return page.slug ? \`/\${page.slug}/\` : "/";\n}\n`);
fs.writeFileSync(path.join(website, "src/content/structured-pages.json"), JSON.stringify(pages, null, 2)+"\n");
fs.writeFileSync(path.join(root, "docs/requirements/selected-content.json"), JSON.stringify({ sha256: snapshot.sha256, routes, selected: [...selected.values()] }, null, 2)+"\n");
console.log(`Synchronized ${Object.keys(pages).length} page bodies, ${selected.size} source cells, ${raw.length} routes.`);
