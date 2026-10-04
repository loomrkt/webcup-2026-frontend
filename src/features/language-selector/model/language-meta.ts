export const SUPPORTED_LOCALES = [
  { value: "fr", label: "Français", flag: "🇫🇷" },
  { value: "en", label: "English", flag: "🇬🇧" },
  { value: "pt-BR", label: "Português", flag: "🇧🇷" },
] as const;

export const DEFAULT_LOCALE = "fr";

export function localeLabel(locale: string): string {
  return (
    SUPPORTED_LOCALES.find((option) => option.value === locale)?.label ??
    locale
  );
}