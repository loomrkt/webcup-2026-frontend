"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ReportIssueDialog } from "@/features/quick-actions/report-issue-dialog";

export default function ReportIssuePage() {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (!open) router.replace("/requests");
  }, [open, router]);

  return (
    <ReportIssueDialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setOpen(false);
      }}
    />
  );
}