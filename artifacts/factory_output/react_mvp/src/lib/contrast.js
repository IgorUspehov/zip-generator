/** Relative luminance (sRGB) for a hex color. */
export function relativeLuminance(hex) {
  const raw = String(hex || "").replace("#", "").trim();
  if (!raw) return 0;
  const full =
    raw.length === 3
      ? raw
          .split("")
          .map((c) => c + c)
          .join("")
      : raw.slice(0, 6);
  if (full.length < 6 || !/^[0-9a-fA-F]{6}$/.test(full)) return 0;
  const channels = [0, 2, 4].map((i) => {
    const c = parseInt(full.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

export function contrastRatio(hexA, hexB) {
  const L1 = relativeLuminance(hexA);
  const L2 = relativeLuminance(hexB);
  const hi = Math.max(L1, L2);
  const lo = Math.min(L1, L2);
  return (hi + 0.05) / (lo + 0.05);
}

const WHITE = "#ffffff";
const DARK = "#0f172a";

/**
 * Pick white or dark text for a solid background so contrast stays readable.
 * Prefer white when both pass; otherwise pick the stronger ratio.
 */
export function contrastOn(bgHex, { white = WHITE, dark = DARK } = {}) {
  const cw = contrastRatio(bgHex, white);
  const cd = contrastRatio(bgHex, dark);
  if (cw >= 4.5 && cd >= 4.5) return cw >= cd ? white : dark;
  if (cw >= 4.5) return white;
  if (cd >= 4.5) return dark;
  return cw >= cd ? white : dark;
}

export function resolveContrastTokens(theme = {}) {
  const primary = theme.primary || "#8a271e";
  const secondary = theme.secondary || "#c27b75";
  const accent = theme.accent || "#b14020";
  const text = theme.text || DARK;
  return {
    fg: text,
    fgMuted: "#475569",
    border: theme.border || "#e2e8f0",
    onPrimary: contrastOn(primary),
    onSecondary: contrastOn(secondary),
    onAccent: contrastOn(accent),
    onHero: WHITE,
  };
}
