"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle2,
  CircleAlert,
  Loader2,
  RotateCcw,
  Settings2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { HudPanel } from "@/components/ui/hud-panel";
import { cn } from "@/lib/utils";
import { debounce } from "@/lib/debounce-utils";
import {
  DEFAULT_PREFERENCES,
  type AccessibilityPreferences,
} from "@/interfaces/accessibility";
import {
  preferencesSchema,
  type PreferencesFormInput,
} from "@/schemas/accessibility/preferences-schema";
import { updatePreferences } from "@/services/auth/preferences-service";
import { getAuthErrorMessage } from "@/services/auth/types";
import { useAccessibilityStore } from "@/stores/accessibility-store";
import { useEcoStore } from "@/stores/eco-store";

const TEXT_SIZE_OPTIONS = [
  { value: "normal", label: "Normale" },
  { value: "large", label: "Grande" },
  { value: "xlarge", label: "Très grande" },
];

const LINE_SPACING_OPTIONS = [
  { value: "normal", label: "Normal" },
  { value: "relaxed", label: "Détendu" },
  { value: "wide", label: "Large" },
];

const COLOR_SCHEME_OPTIONS = [
  { value: "default", label: "Défaut" },
  { value: "high-contrast", label: "Contraste élevé" },
  { value: "dark", label: "Sombre" },
];

const COLOR_BLIND_OPTIONS = [
  { value: "none", label: "Aucun" },
  { value: "protanopia", label: "Protanopie" },
  { value: "deuteranopia", label: "Deutéranopie" },
  { value: "tritanopia", label: "Tritanopie" },
];

type SaveStatus = "idle" | "saving" | "saved" | "error";

function SegmentedField({
  label,
  description,
  options,
  value,
  onChange,
}: {
  label: string;
  description?: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-sm font-medium text-[var(--dg-text)]">
        {label}
      </legend>
      {description ? (
        <p className="text-xs text-[var(--dg-text-muted)]">{description}</p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <label
              key={option.value}
              className={cn(
                "hud-chip relative cursor-pointer rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors",
                "focus-within:ring-3 focus-within:ring-[var(--dg-accent)]/40 focus-within:outline-none",
                selected
                  ? "border-[var(--dg-accent-border)] bg-[var(--dg-accent)]/15 text-[var(--dg-accent-bright)] shadow-[0_0_12px_var(--dg-accent-glow-soft)]"
                  : "border-[var(--dg-border)] bg-[var(--dg-bg-card)] text-[var(--dg-text-muted)] hover:border-[var(--dg-border-strong)] hover:text-[var(--dg-text)]",
              )}
            >
              <input
                type="radio"
                name={label}
                value={option.value}
                checked={selected}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              {option.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function ToggleField({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors",
        "focus-within:ring-3 focus-within:ring-[var(--dg-accent)]/30 focus-within:outline-none",
        checked
          ? "border-[var(--dg-accent-border)] bg-[var(--dg-accent)]/10"
          : "border-[var(--dg-border)] bg-[var(--dg-bg-card)] hover:border-[var(--dg-border-strong)]",
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 size-4 shrink-0 accent-[var(--dg-accent)]"
      />
      <span className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-[var(--dg-text)]">
          {label}
        </span>
        <span className="text-xs text-[var(--dg-text-muted)]">
          {description}
        </span>
      </span>
    </label>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <HudPanel className="p-5">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg border border-[var(--dg-accent-border)] bg-[var(--dg-accent)]/10 text-[var(--dg-accent-bright)]">
            {icon}
          </span>
          <h2 className="text-base font-semibold text-[var(--dg-text)]">
            {title}
          </h2>
        </div>
        {children}
      </div>
    </HudPanel>
  );
}

export function AccessibilitySettingsForm() {
  const setPreferences = useAccessibilityStore((s) => s.setPreferences);
  const storeReset = useAccessibilityStore((s) => s.reset);
  const hydrated = useAccessibilityStore((s) => s.hydrated);
  const ecoMode = useEcoStore((s) => s.ecoMode);
  const setEcoMode = useEcoStore((s) => s.setEcoMode);

  const form = useForm<PreferencesFormInput>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: DEFAULT_PREFERENCES,
  });
  const { reset, getValues, watch } = form;
  const values = watch();

  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const savedValues = useRef<string>("");

  const scheduleSave = useMemo(
    () =>
      debounce((next: PreferencesFormInput) => {
        setSaveStatus("saving");
        updatePreferences(next)
          .then(() => {
            savedValues.current = JSON.stringify(next);
            setSaveStatus("saved");
            setErrorMessage(null);
          })
          .catch((error: unknown) => {
            setSaveStatus("error");
            setErrorMessage(
              getAuthErrorMessage(
                error,
                "Impossible d'enregistrer les réglages.",
              ),
            );
          });
      }, 600),
    [],
  );

  /** Application immédiate (store → classes CSS) + sauvegarde différée. */
  const applyAndSave = useCallback(
    (patch: Partial<AccessibilityPreferences>) => {
      const next = { ...getValues(), ...patch } as PreferencesFormInput;
      setPreferences(next);
      void scheduleSave(next);
    },
    [getValues, scheduleSave, setPreferences],
  );

  /** Synchronisation initiale : prefs persistées localement → formulaire. */
  useEffect(() => {
    reset(useAccessibilityStore.getState().preferences);
  }, [reset]);

  /** Hydratation serveur (GET /auth/me) → formulaire. */
  useEffect(() => {
    if (!hydrated) return;
    reset(useAccessibilityStore.getState().preferences);
  }, [hydrated, reset]);

  /** Statut "enregistré" : ré-affiche uniquement si les valeurs ont changé. */
  useEffect(() => {
    if (saveStatus !== "saved") return;
    if (JSON.stringify(values) !== savedValues.current) {
      setSaveStatus("idle");
    }
  }, [values, saveStatus]);

  const handleReset = () => {
    storeReset();
    reset(DEFAULT_PREFERENCES);
    setErrorMessage(null);
    void scheduleSave(DEFAULT_PREFERENCES);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {saveStatus === "saving" && (
            <p
              role="status"
              className="flex items-center gap-2 text-xs text-[var(--dg-text-muted)]"
            >
              <Loader2 className="size-3.5 animate-spin" aria-hidden />
              Enregistrement…
            </p>
          )}
          {saveStatus === "saved" && (
            <p
              role="status"
              className="flex items-center gap-2 text-xs text-[var(--dg-success)]"
            >
              <CheckCircle2 className="size-3.5" aria-hidden />
              Modifications enregistrées
            </p>
          )}
          {saveStatus === "error" && errorMessage && (
            <p
              role="alert"
              className="flex items-center gap-2 text-xs text-[var(--dg-danger)]"
            >
              <CircleAlert className="size-3.5" aria-hidden />
              {errorMessage}
            </p>
          )}
          {saveStatus === "idle" && (
            <p className="text-xs text-[var(--dg-text-faint)]">
              Les réglages sont appliqués immédiatement.
            </p>
          )}
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="hud-chip border border-[var(--dg-border)] text-[var(--dg-text-muted)] hover:text-[var(--dg-text)]"
        >
          <RotateCcw aria-hidden />
          Réinitialiser
        </Button>
      </div>

      <Section title="Texte et lecture" icon={<Settings2 aria-hidden />}>
        <SegmentedField
          label="Taille du texte"
          description="Augmente la taille des caractères dans toute la plateforme, sans casser l'affichage."
          options={TEXT_SIZE_OPTIONS}
          value={values.textSize}
          onChange={(textSize) =>
            applyAndSave({ textSize: textSize as PreferencesFormInput["textSize"] })
          }
        />
        <ToggleField
          label="Police lisible"
          description="Remplace la police par une police sans empattements plus facile à lire."
          checked={values.readableFont}
          onChange={(readableFont) => applyAndSave({ readableFont })}
        />
        <SegmentedField
          label="Interligne"
          description="Élargit l'espace entre les lignes pour une lecture plus confortable."
          options={LINE_SPACING_OPTIONS}
          value={values.lineSpacing}
          onChange={(lineSpacing) =>
            applyAndSave({
              lineSpacing: lineSpacing as PreferencesFormInput["lineSpacing"],
            })
          }
        />
      </Section>

      <Section title="Couleurs et contraste" icon={<Settings2 aria-hidden />}>
        <SegmentedField
          label="Schéma de couleurs"
          description="Choisit la palette de couleurs de la plateforme."
          options={COLOR_SCHEME_OPTIONS}
          value={values.colorScheme}
          onChange={(colorScheme) =>
            applyAndSave({
              colorScheme: colorScheme as PreferencesFormInput["colorScheme"],
            })
          }
        />
        <ToggleField
          label="Contraste élevé"
          description="Renforce le contraste des textes et des éléments importants (noir, blanc, jaune)."
          checked={values.highContrast}
          onChange={(highContrast) => applyAndSave({ highContrast })}
        />
        <SegmentedField
          label="Daltonisme"
          description="Adapte les couleurs de l'interface pour les personnes daltoniennes."
          options={COLOR_BLIND_OPTIONS}
          value={values.colorBlind}
          onChange={(colorBlind) =>
            applyAndSave({
              colorBlind: colorBlind as PreferencesFormInput["colorBlind"],
            })
          }
        />
      </Section>

      <Section title="Confort et mouvement" icon={<Settings2 aria-hidden />}>
        <ToggleField
          label="Réduire les animations"
          description="Désactive les animations et les transitions de l'interface."
          checked={values.reducedMotion}
          onChange={(reducedMotion) => applyAndSave({ reducedMotion })}
        />
        <ToggleField
          label="Langage simple"
          description="Privilégie des formulations simples dans les contenus de la plateforme."
          checked={values.plainLanguage}
          onChange={(plainLanguage) => applyAndSave({ plainLanguage })}
        />
      </Section>

      <Section title="Éco-responsabilité" icon={<Settings2 aria-hidden />}>
        <ToggleField
          label="Mode léger / éco"
          description="Allège les pages : décors et animations désactivés, données réduites. Recommandé sur connexion lente ou appareil peu puissant."
          checked={ecoMode}
          onChange={(enabled) => setEcoMode(enabled)}
        />
        {ecoMode && (
          <p role="status" className="text-xs text-[var(--dg-success)]">
            Mode éco actif — la plateforme s&apos;affiche en version allégée.
          </p>
        )}
      </Section>
    </div>
  );
}