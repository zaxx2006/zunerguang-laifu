import { z } from "zod";
import type { Block, PageContent } from "./page-content";

export const sitePageProjectionVersion = "2026-10-23";
const text = z.string().trim().min(1);
export const safeLink = text.refine(value => /^\/(?!\/)|^#[\w:-]+$|^https:\/\/|^tel:\+?[\d -]+$|^mailto:[^\s]+$|^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//.test(value), "请输入站内路径或有效的 HTTPS 链接");
const action = z.object({ label: text, href: safeLink });
export const contentBlockSchema: z.ZodType<Block> = z.lazy(() => z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("copy"), text: z.string() }),
  z.object({ kind: z.literal("notice"), text: z.string() }),
  z.object({ kind: z.literal("actions"), actions: z.array(action) }),
  z.object({ kind: z.literal("table"), headers: z.array(text).min(1), rows: z.array(z.array(z.string())) }).refine(value => value.rows.every(row => row.length === value.headers.length), "表格列数需要一致"),
  z.object({ kind: z.literal("disclosure"), summary: text, text: z.string() }),
  z.object({ kind: z.literal("subsection"), title: text, id: text.optional(), collapsible: z.boolean().optional(), blocks: z.array(contentBlockSchema) }),
  z.object({ kind: z.literal("grid"), mode: z.enum(["cards", "steps"]), columns: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]).optional(), items: z.array(z.object({ title: text, id: text.optional(), href: safeLink.optional(), blocks: z.array(contentBlockSchema) })) }),
  z.object({ kind: z.literal("selfcheck"), id: text, items: z.array(z.object({ title: text, id: text.optional(), href: safeLink.optional(), blocks: z.array(contentBlockSchema) })) }),
  z.object({ kind: z.literal("metrics"), items: z.array(z.object({ value: z.string().optional(), label: text })) }),
  z.object({ kind: z.literal("booking") }),
  z.object({ kind: z.literal("catalog"), items: z.array(z.object({ id: text.optional(), title: text, summary: z.string(), kind: text, stage: text, href: safeLink, duration: z.string().nullable(), attachmentId: z.number().int().positive().optional(), file: z.object({ url: safeLink, filename: text, mimeType: text }).optional() })) }),
]));
export const pageContentSchema: z.ZodType<PageContent> = z.object({
  sourceSheet: text,
  intro: z.array(contentBlockSchema),
  sections: z.array(z.object({ id: text.regex(/^[\w-]+$/), title: text, subtitle: z.string().optional(), blocks: z.array(contentBlockSchema) })).min(1),
  cta: z.object({ title: text, body: z.string(), actions: z.array(action) }).nullable(),
}).refine(value => new Set(value.sections.map(section => section.id.toLowerCase())).size === value.sections.length, "章节标识不能重复");
export const sitePageSchema = z.object({
  route: text.regex(/^\/(?!\/)[\w/-]*\/$/), anchorPrefix: text.regex(/^[\w-]+$/), title: text, description: text,
  image: z.object({ src: safeLink, alt: text, width: z.number().positive(), height: z.number().positive() }),
  content: pageContentSchema,
  booking: z.object({ phone: z.string().regex(/^\+?[\d -]{7,24}$/), wechat: z.string(), questionnaire: z.union([z.literal(""), safeLink]) }).optional(),
});
export type SitePagePresentation = z.infer<typeof sitePageSchema>;
export const sitePageEnvelopeSchema = z.object({ apiVersion: z.literal("v1"), projectionVersion: z.literal(sitePageProjectionVersion), contentVersion: text, data: z.object({ presentation: sitePageSchema }) });
export const consultationSchema = z.object({
  name: z.string().trim().min(1, "请填写称呼").max(40),
  phone: z.string().trim().regex(/^\+?[\d ()-]{7,24}$/, "请填写有效的联系电话"),
  wechat: z.string().trim().max(80),
  consultationType: z.enum(["深度咨询", "轻量咨询", "专项辅导", "合作咨询"]),
  concern: z.string().trim().min(5, "请简要说明主要困扰（至少5个字）").max(2000),
  consent: z.literal(true, { error: "请同意为联系与安排咨询使用所填信息" }),
  website: z.literal("").default(""),
});
