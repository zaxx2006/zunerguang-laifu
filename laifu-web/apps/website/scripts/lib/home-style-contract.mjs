import postcss from "postcss";

// The approved homepage has a separate palette and five-column service layout.
export function auditHomeStyles({ tokens, styles }) {
  const failures = [];
  const tokenRoot = postcss.parse(tokens);
  const styleRoot = postcss.parse(styles);
  const definitions = new Map();
  tokenRoot.walkDecls((decl) => definitions.set(decl.prop, decl.value));
  const references = (value) => [...value.matchAll(/var\(\s*(--[\w-]+)/g)].map((match) => match[1]);
  function validateReference(name, trail = []) {
    if (!definitions.has(name)) { failures.push(`首页未定义令牌：${name}`); return; }
    if (trail.includes(name)) { failures.push(`首页循环令牌：${name}`); return; }
    for (const reference of references(definitions.get(name))) validateReference(reference, [...trail, name]);
  }
  for (const name of definitions.keys()) validateReference(name);
  styleRoot.walkDecls((decl) => {
    for (const name of references(decl.value)) validateReference(name);
    if (/#[\da-f]{3,8}\b|rgba?\(|hsla?\(/i.test(decl.value)) failures.push(`首页颜色必须引用令牌：${decl.prop}`);
    if (decl.important) failures.push("首页禁止 !important");
    if (decl.prop.startsWith("--")) failures.push("首页令牌必须位于 home-design-tokens.css");
    if (!/^(font|font-size)$/.test(decl.prop) && /var\(--home-type-/.test(decl.value)) failures.push("首页字号令牌不能用于布局尺寸");
  });
  styleRoot.walkRules((rule) => {
    let parent = rule.parent;
    while (parent && !(parent.type === "atrule" && parent.name === "scope")) parent = parent.parent;
    if (!parent && !rule.selector.includes(".home-preview")) failures.push(`首页样式泄漏：${rule.selector}`);
  });
  styleRoot.walkAtRules("media", (rule) => {
    if (!["(prefers-reduced-motion:reduce)", "(prefers-reduced-transparency:reduce)", "(max-height:700px) and (min-width:701px)", "(max-width:900px)", "(max-width:560px)"].includes(rule.params.replace(/:\s+/g, ":"))) failures.push(`首页未登记响应式规则：${rule.params}`);
  });
  if (!styleRoot.nodes.some((node) => node.type === "atrule" && node.name === "scope" && node.params === "(.home-preview)")) failures.push("首页缺少主题作用域");
  return [...new Set(failures)];
}
