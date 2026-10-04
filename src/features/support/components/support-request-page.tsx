"use client";

import { useState } from "react";
import { CircleAlert, Link2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { requestIdSchema } from "@/schemas/concerns/concern-schema";
import { RequestSupportButton } from "./request-support-button";

const UUID_PATTERN =
  /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

/** Accepte un UUID nu ou un lien contenant un UUID (ex. notification). */
function extractRequestId(value: string): string {
  const match = value.trim().match(UUID_PATTERN);
  return match ? match[0] : value.trim();
}

export function SupportRequestPage() {
  const [input, setInput] = useState("");
  const [requestId, setRequestId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLookup = () => {
    const extracted = extractRequestId(input);
    const parsed = requestIdSchema.safeParse(extracted);
    if (!parsed.success) {
      setError(
        "Entrez l'identifiant (UUID) de la demande, tel qu'il figure dans le lien partagé ou la notification.",
      );
      setRequestId(null);
      return;
    }
    setError(null);
    setRequestId(parsed.data.toLowerCase());
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label
          htmlFor="request-lookup"
          className="text-xs font-medium uppercase tracking-wider text-[var(--dg-text-faint)]"
        >
          Identifiant ou lien de la demande
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Link2
              aria-hidden
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--dg-text-faint)]"
            />
            <Input
              id="request-lookup"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Collez le lien ou l'identifiant de la demande…"
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? "request-lookup-error" : undefined}
              className="pl-9!"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleLookup();
                }
              }}
            />
          </div>
          <Button
            type="button"
            onClick={handleLookup}
            className="dg-btn-accent"
          >
            <Search aria-hidden />
            Voir le soutien
          </Button>
        </div>
        {error && (
          <p
            id="request-lookup-error"
            role="alert"
            className="flex items-center gap-2 text-xs text-[var(--dg-danger)]"
          >
            <CircleAlert className="size-3.5 shrink-0" aria-hidden />
            {error}
          </p>
        )}
      </div>

      {requestId && (
        <div className="flex flex-col gap-1.5 rounded-xl border border-[var(--dg-border)] bg-[var(--dg-bg-card)] px-4 py-4">
          <p className="font-mono text-xs tracking-wider text-[var(--dg-text-faint)]">
            Demande {requestId}
          </p>
          <RequestSupportButton requestId={requestId} />
          <p className="text-xs text-[var(--dg-text-faint)]">
            En soutenant cette demande, votre contribution est comptabilisée
            et visible par le Haut Conseil.
          </p>
        </div>
      )}
    </div>
  );
}