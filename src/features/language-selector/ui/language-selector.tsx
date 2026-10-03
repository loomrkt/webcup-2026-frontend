"use client";

import { Globe } from "lucide-react";
import { useEffect } from "react";
import { useUiStringsQuery } from "@/entities/i18n";
import { useProfileQuery, useUpdateLanguageMutation } from "@/entities/profile";
import { cn } from "@/lib/utils";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "../model/language-meta";
import { useLanguageStore } from "../model/language-store";

const selectClassName =
  "h-10 w-full cursor-pointer rounded-xl border border-[var(--dg-border)] bg-[var(--dg-bg-card)] pl-9 pr-3 text-xs font-medium text-[var(--dg-text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur transition-all outline-none hover:border-[var(--dg-border-strong)] focus:border-[var(--dg-accent)]/70 focus:ring-4 focus:ring-[var(--dg-accent)]/15";

export function LanguageSelector() {
  const locale = useLanguageStore((s) => s.locale);
  const setLocale = useLanguageStore((s) => s.setLocale);
  const setUiStrings = useLanguageStore((s) => s.setUiStrings);

  const { data: profile } = useProfileQuery();
  const update = useUpdateLanguageMutation();
  const { data: uiStrings } = useUiStringsQuery(locale);

  useEffect(() => {
    if (!profile?.language) return;
    if (profile.language === locale) return;
    if (locale !== DEFAULT_LOCALE) return;
    setLocale(profile.language);
  }, [profile, locale, setLocale]);

  useEffect(() => {
    if (uiStrings) setUiStrings(uiStrings);
  }, [uiStrings, setUiStrings]);

  const handleChange = (value: string) => {
    if (value === locale) return;
    setLocale(value);
    update.mutate(value, {
      onSuccess: () => setLocale(value),
      onError: () => setLocale(profile?.language ?? DEFAULT_LOCALE),
    });
  };

  return (
    <div className="relative">
      <Globe
        aria-hidden
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--dg-text-faint)]"
      />
      <select
        aria-label="Langue de l'interface"
        value={locale}
        onChange={(event) => handleChange(event.target.value)}
        className={cn(selectClassName, "cursor-pointer")}
      >
        {SUPPORTED_LOCALES.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}