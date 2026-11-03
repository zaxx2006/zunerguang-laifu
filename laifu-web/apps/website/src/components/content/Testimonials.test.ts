import { describe, expect, it } from "vitest";
import { parseTestimonialText } from "@/components/content/Testimonials";

describe("testimonial content", () => {
  it("separates context, quotes and closing note without changing their order", () => {
    const result = parseTestimonialText("匿名摘录说明。\n\n“第一条反馈。”\n\n“第二条反馈。”\n\n变化从重新获得方向感开始。");
    expect(result).toEqual({ intro: "匿名摘录说明。", quotes: ["第一条反馈。", "第二条反馈。"], closing: "变化从重新获得方向感开始。" });
  });
});
