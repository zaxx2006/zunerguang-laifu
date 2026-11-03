import postcss from "postcss";

export function auditStyles({ sheets, tokens, breakpoints = [], externalTokens = ["--font-noto-sans-sc", "--font-noto-serif-sc"] }) {
  const failures = [];
  const defined = new Set(externalTokens);
  const definitions = new Map();
  const owners = new Map();
  const declarations = new Set();
  const tokenRoot = postcss.parse(tokens, { from: "design-tokens.css" });
  tokenRoot.walkDecls((decl) => {
    if (!decl.prop.startsWith("--")) return;
    defined.add(decl.prop);
    if (!definitions.has(decl.prop)) definitions.set(decl.prop, []);
    definitions.get(decl.prop).push(decl.value);
  });
  const references = (value) => [...value.matchAll(/var\(\s*(--[\w-]+)/g)].map((match) => match[1]);
  const walkReference = (name, trail) => {
    if (trail.includes(name)) {
      failures.push("循环令牌：" + [...trail, name].join(" → "));
      return;
    }
    for (const value of definitions.get(name) || []) for (const reference of references(value)) {
      if (!defined.has(reference)) failures.push("未定义令牌：" + reference);
      else if (!externalTokens.includes(reference)) walkReference(reference, [...trail, name]);
    }
  };
  for (const name of definitions.keys()) walkReference(name, []);
  for (const [file, source] of Object.entries(sheets)) {
    const root = postcss.parse(source, { from: file });
    root.walkAtRules("media", (rule) => {
      for (const match of rule.params.matchAll(/\b([\d.]+px)\b/g)) if (!breakpoints.includes(match[1])) failures.push(file + " 未登记断点：" + match[1]);
    });
    root.walkRules((rule) => {
      if (!rule.parent || rule.parent.type !== "atrule") failures.push(file + " 规则必须位于显式 cascade layer：" + rule.selector);
      let parent = rule.parent;
      let layer = false;
      const context = [];
      while (parent && parent.type !== "root") {
        if (parent.name === "layer") layer = true;
        context.unshift("@" + parent.name + " " + parent.params);
        parent = parent.parent;
      }
      if (!layer) failures.push(file + " 缺少 cascade layer：" + rule.selector);
      for (const selector of rule.selectors) {
        const owner = selector.match(/^\.([\w-]+)/)?.[1];
        if (owner && owners.has(owner) && owners.get(owner) !== file) failures.push("样式跨文件重复归属：" + owner + " in " + owners.get(owner) + " / " + file);
        if (owner) owners.set(owner, file);
        rule.walkDecls((decl) => {
          const key = context.join(" ") + "|" + selector + "|" + decl.prop;
          if (declarations.has(key)) failures.push(file + " 重复声明：" + selector + " " + decl.prop);
          declarations.add(key);
        });
      }
    });
    root.walkDecls((decl) => {
      const location = file + ":" + decl.source.start.line;
      if (decl.important) failures.push(location + " 禁止 !important");
      if (decl.prop.startsWith("--")) failures.push(location + " 令牌只能在设计源中定义：" + decl.prop);
      for (const reference of references(decl.value)) if (!defined.has(reference)) failures.push(location + " 未定义令牌：" + reference);
      const stripped = decl.value.replace(/url\([^)]*\)/g, "").replace(/var\([^)]*\)/g, "");
      if (/(?:^|[\s(,:+-])(?:\d*\.?\d+)(?:px|rem|em|cqi|vw|vh|ms|s)\b/.test(stripped)) failures.push(location + " 硬编码尺寸或动效：" + decl.prop + ": " + decl.value);
      if (/^(?:font-size|font-weight|line-height|letter-spacing|stroke-width)$/.test(decl.prop) && /\d/.test(stripped)) failures.push(location + " 未使用排版/描边令牌：" + decl.prop);
      if (decl.prop === "font-family" && !decl.value.includes("var(") && decl.value !== "inherit") failures.push(location + " 字体必须引用令牌");
      if (/#[\da-f]{3,8}\b|(?:rgb|hsl)a?\(/i.test(stripped)) failures.push(location + " 硬编码颜色");
      if (/\b(?:box-shadow|text-shadow)$/.test(decl.prop) || /(?:drop-shadow|(?:linear|radial|conic)-gradient)\s*\(/.test(decl.value)) failures.push(location + " 禁止阴影或渐变");
      if (decl.prop === "transition" && /\ball\b/.test(decl.value)) failures.push(location + " 禁止 transition: all");
      if (decl.prop === "overflow-x" && decl.value === "hidden") failures.push(location + " 禁止隐藏横向溢出来掩盖布局问题");
    });
  }
  return [...new Set(failures)];
}
