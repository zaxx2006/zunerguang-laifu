import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Section } from "@/components/content/content-types";

export type TestimonialContent = { intro: string; quotes: string[]; closing: string };

export function parseTestimonialText(text: string): TestimonialContent {
  const paragraphs = text.split(/\n\s*\n/u).map((paragraph) => paragraph.trim()).filter(Boolean);
  const quoteIndexes = paragraphs.map((paragraph, index) => /^“[\s\S]+”$/u.test(paragraph) ? index : -1).filter((index) => index >= 0);
  if (!quoteIndexes.length) return { intro: paragraphs.join("\n\n"), quotes: [], closing: "" };
  const firstQuote = quoteIndexes[0];
  const lastQuote = quoteIndexes.at(-1)!;
  return { intro: paragraphs.slice(0, firstQuote).join("\n\n"), quotes: paragraphs.slice(firstQuote, lastQuote + 1).filter((paragraph) => /^“[\s\S]+”$/u.test(paragraph)).map((paragraph) => paragraph.slice(1, -1)), closing: paragraphs.slice(lastQuote + 1).join("\n\n") };
}

export function Testimonials({ section, sectionId }: { section: Section; sectionId: string }) {
  const text = section.blocks.filter((block) => block.kind === "copy").map((block) => block.text).join("\n\n");
  const content = parseTestimonialText(text);
  const stateName = `${sectionId}-testimonial-view`;
  return <div className="testimonial-rail"><div className="testimonial-rail__intro"><p>{content.intro}</p><div aria-label="浏览来访者反馈" className="testimonial-rail__controls" role="group"><span className="testimonial-rail__control"><input aria-label="查看第一组反馈" className="testimonial-rail__state testimonial-rail__state--first" defaultChecked name={stateName} type="radio" /><ArrowLeft aria-hidden="true" /></span><span className="testimonial-rail__control"><input aria-label="查看最后一组反馈" className="testimonial-rail__state testimonial-rail__state--last" name={stateName} type="radio" /><ArrowRight aria-hidden="true" /></span></div></div><div aria-label="来访者反馈横向列表" className="testimonial-rail__viewport" role="region" tabIndex={0}><ol className="testimonial-rail__track">{content.quotes.map((quote, index) => <li className="testimonial-card" id={`${sectionId}-quote-${index + 1}`} key={quote}><span aria-hidden="true" className="testimonial-card__mark">“</span><blockquote><p>{quote}</p></blockquote><p className="testimonial-card__source">匿名来访者</p></li>)}</ol></div>{content.closing ? <p className="testimonial-rail__closing">{content.closing}</p> : null}</div>;
}
