export interface CitizenIdea {
  id: string;
  ref: string;
  userId: string;
  category: string | null;
  title: string;
  description: string;
  status: IdeaStatus;
  adminNote: string | null;
  createdAt: string;
  updatedAt: string;
}

export const IDEA_STATUSES = [
  "received",
  "studied",
  "retained",
  "rejected",
  "realized",
] as const;

export type IdeaStatus = (typeof IDEA_STATUSES)[number];

export const IDEA_STATUS_LABELS: Record<IdeaStatus, string> = {
  received: "Reçue",
  studied: "À l'étude",
  retained: "Retenue",
  rejected: "Refusée",
  realized: "Réalisée",
};

export interface CreateIdeaInput {
  title: string;
  description: string;
  category?: string | null;
}