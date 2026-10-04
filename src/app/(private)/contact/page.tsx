"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ContactDialog } from "@/features/quick-actions/contact-dialog";

export default function ContactPage() {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (!open) router.replace("/dashboard");
  }, [open, router]);

  return (
    <ContactDialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setOpen(false);
      }}
    />
  );
}