"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCheck, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useProfileQuery,
  useUpdateProfileMutation,
} from "@/entities/profile";
import { cn } from "@/lib/utils";
import {
  profileSchema,
  type ProfileFormValues,
} from "../model/profile-schema";

const inputClassName =
  "h-12 w-full rounded-xl border border-[var(--dg-border)] bg-[var(--dg-bg-card)] px-4 text-sm text-[var(--dg-text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur transition-all outline-none placeholder:text-[var(--dg-text-faint)] hover:border-[var(--dg-border-strong)] focus:border-[var(--dg-accent)]/70 focus:ring-4 focus:ring-[var(--dg-accent)]/15";

const EMPTY_VALUES: ProfileFormValues = {
  firstName: "",
  lastName: "",
  phone: "",
  address: "",
  city: "",
};

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
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
      {error ? (
        <p role="alert" className="text-xs text-[var(--dg-danger)]">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function ProfileEditForm() {
  const { data: profile, isLoading } = useProfileQuery();
  const update = useUpdateProfileMutation();
  const hydratedRef = useRef(false);
  const [feedback, setFeedback] = useState<
    { kind: "success" | "error"; message: string } | null
  >(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    mode: "onBlur",
    defaultValues: EMPTY_VALUES,
  });

  useEffect(() => {
    if (!profile || hydratedRef.current) return;
    hydratedRef.current = true;
    reset({
      firstName: profile.profile.firstName ?? "",
      lastName: profile.profile.lastName ?? "",
      phone: profile.profile.phone ?? "",
      address: profile.profile.address ?? "",
      city: profile.profile.city ?? "",
    });
  }, [profile, reset]);

  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(null), 7000);
    return () => clearTimeout(timer);
  }, [feedback]);

  if (isLoading || !profile) {
    return (
      <div className="flex flex-col gap-3">
        {[0, 1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-12 rounded-xl bg-white/10" />
        ))}
      </div>
    );
  }

  const submit = handleSubmit((values) => {
    update.mutate(
      {
        firstName: values.firstName.trim() || null,
        lastName: values.lastName.trim() || null,
        phone: values.phone.trim() || null,
        address: values.address.trim() || null,
        city: values.city.trim() || null,
      },
      {
        onSuccess: () => {
          setFeedback({
            kind: "success",
            message: "Votre profil a été mis à jour.",
          });
        },
        onError: () => {
          setFeedback({
            kind: "error",
            message: "Impossible de mettre à jour votre profil. Réessayez.",
          });
        },
      },
    );
  });

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4">
      {feedback ? (
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
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <Field
          label="Prénom"
          htmlFor="profile-firstName"
          error={errors.firstName?.message}
        >
          <Input
            id="profile-firstName"
            className={inputClassName}
            placeholder="Votre prénom"
            autoComplete="given-name"
            {...register("firstName")}
          />
        </Field>
        <Field
          label="Nom"
          htmlFor="profile-lastName"
          error={errors.lastName?.message}
        >
          <Input
            id="profile-lastName"
            className={inputClassName}
            placeholder="Votre nom"
            autoComplete="family-name"
            {...register("lastName")}
          />
        </Field>
      </div>

      <Field label="Téléphone" htmlFor="profile-phone" error={errors.phone?.message}>
        <Input
          id="profile-phone"
          type="tel"
          className={inputClassName}
          placeholder="+33 6 12 34 56 78"
          autoComplete="tel"
          {...register("phone")}
        />
      </Field>

      <Field
        label="Adresse"
        htmlFor="profile-address"
        error={errors.address?.message}
      >
        <Input
          id="profile-address"
          className={inputClassName}
          placeholder="N° et rue"
          autoComplete="street-address"
          {...register("address")}
        />
      </Field>

      <Field label="Ville" htmlFor="profile-city" error={errors.city?.message}>
        <Input
          id="profile-city"
          className={inputClassName}
          placeholder="Terra Nova"
          autoComplete="address-level2"
          {...register("city")}
        />
      </Field>

      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-[var(--dg-text-faint)]">
          Votre adresse email est :{" "}
          <span className="text-[var(--dg-text-muted)]">{profile.email}</span>
        </p>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="dg-btn-accent h-12 w-fit cursor-pointer"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CheckCheck className="h-4 w-4" />
          )}
          Enregistrer
        </Button>
      </div>
    </form>
  );
}