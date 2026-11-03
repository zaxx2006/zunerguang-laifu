const chinesePattern = /[\u3400-\u9fff]/u;

export function chineseLabel(value: string) {
  return value.split(/\s*·\s*/u).filter((part) => chinesePattern.test(part)).join(" · ");
}
