import { AccessibilitySettingsForm } from "@/features/accessibility/components/accessibility-settings-form";

export default function AccessibilitySettingsPage() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <header>
        <p className="dg-eyebrow">Espace citoyen · Réglages</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-[var(--dg-text)]">
          Accessibilité
        </h1>
        <p className="mt-1 text-sm text-[var(--dg-text-muted)]">
          Adaptez l&apos;affichage de la plateforme à vos besoins : taille du
          texte, contrastes, couleurs et animations. Vos réglages sont
          appliqués immédiatement et conservés sur votre compte.
        </p>
      </header>

      <AccessibilitySettingsForm />
    </div>
  );
}