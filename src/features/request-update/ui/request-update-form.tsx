"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  PRIORITY_OPTIONS,
  STATUS_OPTIONS,
  useUpdateRequestMutation,
  type Request,
  type RequestUpdateInput,
} from "@/entities/request";
import { fetchUsers } from "@/services/rbac/users-service";
import { cn } from "@/lib/utils";
import {
  requestUpdateSchema,
  type RequestUpdateFormValues,
} from "../model/request-update-schema";

const selectClassName =
  "h-12 w-full cursor-pointer rounded-xl border border-[var(--dg-border)] bg-[var(--dg-bg-card)] px-4 text-sm text-[var(--dg-text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur transition-all outline-none hover:border-[var(--dg-border-strong)] focus:border-[var(--dg-accent)]/70 focus:ring-4 focus:ring-[var(--dg-accent)]/15";

const textareaClassName =
  "min-h-24 w-full rounded-xl border border-[var(--dg-border)] bg-[var(--dg-bg-card)] px-4 py-3 text-sm text-[var(--dg-text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur transition-all outline-none placeholder:text-[var(--dg-text-faint)] hover:border-[var(--dg-border-strong)] focus:border-[var(--dg-accent)]/70 focus:ring-4 focus:ring-[var(--dg-accent)]/15";

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

type Feedback = { kind: "success" | "error"; message: string } | null;

export function RequestUpdateForm({ request }: { request: Request }) {
  const [agents, setAgents] = useState<
    Array<{ id: string; email: string; firstName: string | null }>
  >([]);
  const [agentsError, setAgentsError] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const mutation = useUpdateRequestMutation();

  const { register, handleSubmit, reset } = useForm<RequestUpdateFormValues>({
    resolver: zodResolver(requestUpdateSchema),
    defaultValues: {
      status: request.status,
      priority: request.priority,
      assignedToId: request.assignedToId ?? "",
      comment: "",
      adminNote: request.adminNote ?? "",
    },
  });

  useEffect(() => {
    let cancelled = false;
    fetchUsers()
      .then((users) => {
        if (cancelled) return;
        const agents = users.filter((user) =>
          user.userRoles?.some(
            (ur) =>
              ur.role?.name === "agent_municipal" || ur.role?.isSuperAdmin,
          ),
        );
        setAgents(
          agents.map((user) => ({
            id: user.id,
            email: user.email,
            firstName: user.firstName,
          })),
        );
      })
      .catch(() => {
        if (!cancelled) setAgentsError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(null), 6000);
    return () => clearTimeout(timer);
  }, [feedback]);

  const submit = handleSubmit((values) => {
    const input: RequestUpdateInput = {};
    if (values.status !== request.status) input.status = values.status;
    if (values.priority !== request.priority) input.priority = values.priority;
    const currentAssignee = request.assignedToId ?? "";
    if (values.assignedToId !== currentAssignee) {
      input.assignedToId = values.assignedToId || null;
    }
    const adminNote = values.adminNote?.trim() ?? "";
    if (adminNote !== (request.adminNote ?? "")) {
      input.adminNote = adminNote || null;
    }
    const comment = values.comment?.trim() ?? "";
    if (comment) input.comment = comment;

    if (Object.keys(input).length === 0) {
      setFeedback({ kind: "error", message: "Aucune modification détectée." });
      return;
    }

    mutation.mutate(
      { id: request.id, input },
      {
        onSuccess: (updated) => {
          reset({
            status: updated.status,
            priority: updated.priority,
            assignedToId: updated.assignedToId ?? "",
            comment: "",
            adminNote: updated.adminNote ?? "",
          });
          setFeedback({
            kind: "success",
            message: "Demande mise à jour avec succès.",
          });
        },
        onError: () => {
          setFeedback({
            kind: "error",
            message: "Impossible de mettre à jour la demande.",
          });
        },
      },
    );
  });

  return (
    <form
      onSubmit={submit}
      className="flex flex-col gap-4"
      noValidate
    >
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

      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Statut" htmlFor="update-status">
          <select
            id="update-status"
            className={selectClassName}
            aria-label="Nouveau statut"
            {...register("status")}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Priorité" htmlFor="update-priority">
          <select
            id="update-priority"
            className={selectClassName}
            aria-label="Nouvelle priorité"
            {...register("priority")}
          >
            {PRIORITY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Agent assigné" htmlFor="update-assignee">
          {agentsError ? (
            <div className="flex h-12 items-center rounded-xl border border-[var(--dg-border)] px-4 text-xs text-[var(--dg-text-faint)]">
              Liste des agents indisponible
            </div>
          ) : (
            <select
              id="update-assignee"
              className={selectClassName}
              aria-label="Agent assigné"
              {...register("assignedToId")}
            >
              <option value="">Non assignée</option>
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.firstName || agent.email}
                </option>
              ))}
            </select>
          )}
        </Field>
      </div>

      <Field
        label="Message au citoyen (visible dans le suivi)"
        htmlFor="update-comment"
      >
        <textarea
          id="update-comment"
          className={textareaClassName}
          placeholder="Ex. : votre demande est en cours de traitement…"
          {...register("comment")}
        />
      </Field>

      <Field label="Note interne (non visible par le citoyen)" htmlFor="update-note">
        <textarea
          id="update-note"
          className={textareaClassName}
          placeholder="Éléments de contexte pour les agents…"
          {...register("adminNote")}
        />
      </Field>

      <div className="flex items-center gap-3">
        <Button
          type="submit"
          disabled={mutation.isPending}
          className="dg-btn-accent cursor-pointer"
        >
          {mutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Enregistrer les modifications
        </Button>
        <span className="text-xs text-[var(--dg-text-faint)]">
          Le citoyen est notifié automatiquement en cas de changement de
          statut.
        </span>
      </div>
    </form>
  );
}