export const illustrationFiles = {
  "undraw_key-points_iiic.svg": "key-points.svg",
  "undraw_faq_pgxi.svg": "faq.svg",
  "undraw_team_mmq0.svg": "team.svg",
};

export function applyIllustrationTheme(source, primary) {
  return source.replace(/#(?:FF6B00|FF9447|6C63FF)/gi, primary);
}

export function createDiagonalHatch(color) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path d="M-4 4 4-4M0 16 16 0M12 20 20 12" fill="none" stroke="${color}" stroke-width="1"/></svg>`;
}
