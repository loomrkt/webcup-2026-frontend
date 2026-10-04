"use client";

import { TriangleAlert } from "lucide-react";
import { RequestCreateForm } from "@/features/request-create";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function ReportIssueDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TriangleAlert className="size-4 text-[var(--dg-accent-bright)]" aria-hidden />
            Signaler un problème
          </DialogTitle>
          <DialogDescription>
            Un lampadaire cassé, un espace à nettoyer ? Les services de Terra
            Nova prendront en charge votre demande.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[70dvh] overflow-y-auto px-6 py-5">
          <RequestCreateForm />
        </div>
      </DialogContent>
    </Dialog>
  );
}