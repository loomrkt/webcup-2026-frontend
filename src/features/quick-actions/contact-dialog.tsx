"use client";

import { MessageCircle } from "lucide-react";
import { ContactForm } from "@/features/contact-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function ContactDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="size-4 text-[var(--dg-accent-bright)]" aria-hidden />
            Contacter le Haut Conseil
          </DialogTitle>
          <DialogDescription>
            Une question, une suggestion ? Votre message sera transmis aux
            services de Terra Nova.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[70dvh] overflow-y-auto px-6 py-5">
          <ContactForm />
        </div>
      </DialogContent>
    </Dialog>
  );
}