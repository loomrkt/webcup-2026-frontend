"use client";

import { useQuickActions } from "./store";
import { ContactDialog } from "./contact-dialog";
import { ReportIssueDialog } from "./report-issue-dialog";

/** Rendu global des modales d'action rapide, piloté par le store. */
export function QuickActionsProvider() {
  const action = useQuickActions((s) => s.action);
  const close = useQuickActions((s) => s.close);

  return (
    <>
      <ReportIssueDialog
        open={action === "report"}
        onOpenChange={(open) => {
          if (!open) close();
        }}
      />
      <ContactDialog
        open={action === "contact"}
        onOpenChange={(open) => {
          if (!open) close();
        }}
      />
    </>
  );
}