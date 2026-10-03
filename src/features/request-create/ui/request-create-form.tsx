"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCheck, Loader2, MapPin, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PRIORITY_OPTIONS,
  useCreateRequestMutation,
} from "@/entities/request";
import { useServicesQuery } from "@/entities/service";
import { cn } from "@/lib/utils";
import {
  createRequestSchema,
  REQUEST_CATEGORIES,
  type CreateRequestFormValues,
} from "../model/create-request-schema";

const inputClassName =
  "h-12 w-full rounded-xl border border-[var(--dg-border)] bg-[var(--dg-bg-card)] px-4 text-sm text-[var(--dg-text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur transition-all outline-none placeholder:text-[var(--dg-text-faint)] hover:border-[var(--dg-border-strong)] focus:border-[var(--dg-accent)]/70 focus:ring-4 focus:ring-[var(--dg-accent)]/15";

function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor}>
        <span className="text-xs font-medium tracking-wider text-[var(--dg-text-faint)] uppercase">
          {label}
        </span>
      </label>
      {children}
      {hint ? (
        <p className="text-[11px] text-[var(--dg-text-faint)]">{hint}</p>
      ) : null}
      {error ? (
        <p role="alert" className="text-xs text-[var(--dg-danger)]">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function RequestCreateForm() {
  const [reference, setReference] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<
    { kind: "success" | "error"; message: string } | null
  >(null);
  const create = useCreateRequestMutation();
  const { data: services, isLoading: servicesLoading } = useServicesQuery();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<CreateRequestFormValues>({
    resolver: zodResolver(createRequestSchema),
    mode: "onBlur",
    defaultValues: {
      title: "",
      description: "",
      category: "",
      location: "",
      priority: "",
      serviceId: "",
    },
  });

  const submit = handleSubmit((values) => {
    create.mutate(
      {
        title: values.title.trim(),
        description: values.description.trim(),
        category: values.category || null,
        location: values.location?.trim() || null,
        priority: values.priority || undefined,
        serviceId: values.serviceId || null,
      },
      {
        onSuccess: (request) => {
          setReference(request.ref);
          setFeedback(null);
          reset();
        },
        onError: () => {
          setFeedback({
            kind: "error",
            message: "Impossible d'envoyer votre signalement. Réessayez.",
          });
        },
      },
    );
  });

  if (reference) {
    return (
      <div className="flex flex-col gap-4 rounded-2xl border border-[var(--dg-success-border)] bg-[var(--dg-success-soft)] p-6 backdrop-blur">
        <div className="flex items-center gap-3">
          <span className="flex size-12 items-center justify-center rounded-xl bg-[var(--dg-success)]/20 text-[var(--dg-success)] shadow-[0_0_16px_var(--dg-success-glow)]">
            <CheckCheck className="h-6 w-6" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-semibold text-[var(--dg-text)]">
              Signalement envoyé
            </h2>
            <p className="text-sm text-[var(--dg-text-muted)]">
              Votre demande a bien été transmise aux services de Terra Nova.
            </p>
          </div>
        </div>
        <p className="mt-2 text-sm text-[var(--dg-text)]">
          Votre référence de suivi :{" "}
          <span className="font-mono font-semibold text-[var(--dg-success)]">
            {reference}
          </span>
        </p>
        <p className="text-xs text-[var(--dg-text-muted)]">
          Vous pouvez suivre l&apos;avancement de cette demande dans{" "}
          <Link
            href="/requests"
            className="text-[var(--dg-accent-bright)] underline decoration-[var(--dg-accent-border)] underline-offset-2 transition-opacity hover:opacity-80"
          >
            Mes demandes
          </Link>
          .
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={() => setReference(null)}
          className="h-12 w-fit cursor-pointer border-[var(--dg-border)] text-[var(--dg-text-muted)]"
        >
          <TriangleAlert className="h-4 w-4" />
          Signaler un autre problème
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4">
      {feedback ? (
        <div
          role="alert"
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
                ? "bg-[var(--dg-success)]"
                : "bg-[var(--dg-danger)]",
            )}
          />
          <span>{feedback.message}</span>
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Service concerné" htmlFor="report-service">
          {servicesLoading ? (
            <Skeleton className="h-12 rounded-xl bg-white/10" />
          ) : (
            <select
              id="report-service"
              className={cn(inputClassName, "cursor-pointer")}
              {...register("serviceId")}
            >
              <option value="">
                Service concerné (facultatif)
              </option>
              {services?.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
          )}
        </Field>
        <Field label="Catégorie" htmlFor="report-category" error={errors.category?.message}>
          <select
            id="report-category"
            className={cn(inputClassName, "cursor-pointer")}
            {...register("category")}
          >
            {REQUEST_CATEGORIES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field
        label="Titre du problème"
        htmlFor="report-title"
        error={errors.title?.message}
      >
        <Input
          id="report-title"
          className={inputClassName}
          placeholder="Ex. Lampadaire cassé rue des Astres"
          {...register("title")}
        />
      </Field>

      <Field
        label="Lieu"
        htmlFor="report-location"
        error={errors.location?.message}
        hint="Rue, quartier ou point de repère."
      >
        <div className="relative">
          <MapPin
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-4 size-4.5 -translate-y-1/2 text-[var(--dg-text-faint)]"
          />
          <Input
            id="report-location"
            className={cn(inputClassName, "pl-11")}
            placeholder="Ex. Angle avenue Nova et rue Kepler"
            {...register("location")}
          />
        </div>
      </Field>

      <Field
        label="Description"
        htmlFor="report-description"
        error={errors.description?.message}
      >
        <textarea
          id="report-description"
          rows={5}
          className={cn(inputClassName, "resize-y py-3")}
          placeholder="Décrivez le problème et son contexte (10 caractères minimum)."
          {...register("description")}
        />
      </Field>

      <Field label="Priorité" htmlFor="report-priority" error={errors.priority?.message}>
        <select
          id="report-priority"
          className={cn(inputClassName, "cursor-pointer")}
          {...register("priority")}
        >
          <option value="">Priorité (facultatif)</option>
          {PRIORITY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </Field>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="dg-btn-accent h-12 w-fit cursor-pointer"
      >
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <TriangleAlert className="h-4 w-4" />
        )}
        Envoyer le signalement
      </Button>
    </form>
  );
}