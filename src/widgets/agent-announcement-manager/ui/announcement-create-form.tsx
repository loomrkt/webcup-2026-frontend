"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateAnnouncementMutation } from "@/entities/announcement";
import { cn } from "@/lib/utils";
import { ANNOUNCEMENT_PRIORITY_LABELS } from "../model/announcement-meta";
import {
  announcementCreateSchema,
  type AnnouncementCreateFormValues,
} from "../model/announcement-create-schema";

const inputClassName =
  "h-12 w-full rounded-xl border border-[var(--dg-border)] bg-[var(--dg-bg-card)] px-4 text-sm text-[var(--dg-text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur transition-all outline-none placeholder:text-[var(--dg-text-faint)] hover:border-[var(--dg-border-strong)] focus:border-[var(--dg-accent)]/70 focus:ring-4 focus:ring-[var(--dg-accent)]/15";

const textareaClassName =
  "min-h-32 w-full rounded-xl border border-[var(--dg-border)] bg-[var(--dg-bg-card)] px-4 py-3 text-sm text-[var(--dg-text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur transition-all outline-none placeholder:text-[var(--dg-text-faint)] hover:border-[var(--dg-border-strong)] focus:border-[var(--dg-accent)]/70 focus:ring-4 focus:ring-[var(--dg-accent)]/15";

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5" htmlFor={htmlFor}>
      <span className="text-xs font-medium tracking-wider text-[var(--dg-text-faint)] uppercase">
        {label}
      </span>
      {children}
    </label>
  );
}

export function AnnouncementCreateForm() {
  const [feedback, setFeedback] = useState<
    { kind: "success" | "error"; message: string } | null
  >(null);
  const createAnnouncement = useCreateAnnouncementMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<AnnouncementCreateFormValues>({
    resolver: zodResolver(announcementCreateSchema),
    defaultValues: {
      title: "",
      content: "",
      priority: "normal",
      zone: "",
      ctaLabel: "",
      ctaUrl: "",
      publish: true,
    },
  });

  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(null), 6000);
    return () => clearTimeout(timer);
  }, [feedback]);

  const submit = handleSubmit((values) => {
    createAnnouncement.mutate(
      {
        title: values.title.trim(),
        content: values.content.trim(),
        priority: values.priority,
        zone: values.zone?.trim() || null,
        ctaLabel: values.ctaLabel?.trim() || null,
        ctaUrl: values.ctaUrl?.trim() || null,
        publish: values.publish,
      },
      {
        onSuccess: (announcement) => {
          reset();
          setFeedback({
            kind: "success",
            message:
              announcement.status === "published"
                ? "Annonce publiée aux habitants."
                : "Annonce enregistrée en brouillon.",
          });
        },
        onError: () => {
          setFeedback({
            kind: "error",
            message: "Impossible de créer l'annonce.",
          });
        },
      },
    );
  });

  return (
    <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
      {feedback && (
        <div
          role="status"
          className={cn(
            "flex items-center gap-2 rounded-xl border px-4 py-3 text-sm backdrop-blur",
            feedback.kind === "success"
              ? "border-[var(--dg-success-border)] bg-[var(--dg-success-soft)] text-[var(--dg-success)]"
              : "border-[var(--dg-danger-border)] bg-[var(--dg-danger-soft)] text-[var(--dg-danger)]",
          )}
        >
          <span
            className={cn(
              "size-1.5 rounded-full",
              feedback.kind === "success"
                ? "bg-[var(--dg-success)] shadow-[0_0_8px_var(--dg-success-glow)]"
                : "bg-[var(--dg-danger)]",
            )}
          />
          <span>{feedback.message}</span>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Titre" htmlFor="ann-title">
          <Input
            id="ann-title"
            className="h-12"
            placeholder="Ex. : Réouverture de la piscine municipale"
            {...register("title")}
          />
        </Field>
        <Field label="Priorité" htmlFor="ann-priority">
          <select
            id="ann-priority"
            className={cn(inputClassName, "cursor-pointer")}
            {...register("priority")}
          >
            {(Object.keys(ANNOUNCEMENT_PRIORITY_LABELS) as Array<
              keyof typeof ANNOUNCEMENT_PRIORITY_LABELS
            >).map((value) => (
              <option key={value} value={value}>
                {ANNOUNCEMENT_PRIORITY_LABELS[value]}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Contenu" htmlFor="ann-content">
        <textarea
          id="ann-content"
          className={textareaClassName}
          placeholder="Contenu de l'annonce…"
          {...register("content")}
        />
      </Field>

      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Zone / quartier" htmlFor="ann-zone">
          <Input
            id="ann-zone"
            className="h-12"
            placeholder="Toute la ville si vide"
            {...register("zone")}
          />
        </Field>
        <Field label="Libellé du bouton" htmlFor="ann-cta-label">
          <Input
            id="ann-cta-label"
            className="h-12"
            placeholder="Ex. : En savoir plus"
            {...register("ctaLabel")}
          />
        </Field>
        <Field label="Lien du bouton" htmlFor="ann-cta-url">
          <Input
            id="ann-cta-url"
            className="h-12"
            placeholder="https://…"
            {...register("ctaUrl")}
          />
        </Field>
      </div>

      <div className="flex items-center gap-3">
        <label className="flex h-12 cursor-pointer items-center gap-2 rounded-xl border border-[var(--dg-border)] bg-[var(--dg-bg-card)] px-4 text-sm text-[var(--dg-text)]">
          <input
            type="checkbox"
            className="size-4 rounded accent-[var(--dg-accent)]"
            {...register("publish")}
          />
          Publier immédiatement
        </label>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="dg-btn-accent cursor-pointer"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          Créer l&apos;annonce
        </Button>
      </div>
    </form>
  );
}