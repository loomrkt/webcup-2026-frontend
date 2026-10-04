export const TEXT_SIZES = ["normal", "large", "xlarge"] as const;
export const LINE_SPACINGS = ["normal", "relaxed", "wide"] as const;
export const COLOR_SCHEMES = ["default", "high-contrast", "dark"] as const;
export const COLOR_BLIND_MODES = [
  "none",
  "protanopia",
  "deuteranopia",
  "tritanopia",
] as const;

export type TextSize = (typeof TEXT_SIZES)[number];
export type LineSpacing = (typeof LINE_SPACINGS)[number];
export type ColorScheme = (typeof COLOR_SCHEMES)[number];
export type ColorBlindMode = (typeof COLOR_BLIND_MODES)[number];

export interface AccessibilityPreferences {
  textSize: TextSize;
  highContrast: boolean;
  reducedMotion: boolean;
  readableFont: boolean;
  lineSpacing: LineSpacing;
  colorScheme: ColorScheme;
  colorBlind: ColorBlindMode;
  plainLanguage: boolean;
}

export const DEFAULT_PREFERENCES: AccessibilityPreferences = {
  textSize: "normal",
  highContrast: false,
  reducedMotion: false,
  readableFont: false,
  lineSpacing: "normal",
  colorScheme: "default",
  colorBlind: "none",
  plainLanguage: false,
};