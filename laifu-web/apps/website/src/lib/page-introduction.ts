import type { Action, Block } from "@/components/content/content-types";

export function composePageIntroduction(description: string, intro: Block[], fallbackAction?: Action) {
  const blocks: Block[] = [];
  const actions: Action[] = [];
  for (const [index, block] of intro.entries()) {
    if (block.kind === "actions") {
      actions.push(...block.actions);
      continue;
    }
    if (index === 0 && block.kind === "copy" && (block.text.trim() === description.trim() || block.text.trim().startsWith(`${description.trim()}\n`))) {
      const text = block.text.trim().slice(description.trim().length).trim();
      if (text) blocks.push({ ...block, text });
    } else blocks.push(block);
  }
  if (fallbackAction && !actions.some((action) => action.href.split("#")[0] === fallbackAction.href.split("#")[0])) actions.push(fallbackAction);
  return { blocks, actions };
}
