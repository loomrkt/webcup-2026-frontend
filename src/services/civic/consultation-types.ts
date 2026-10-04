export const CONSULTATION_STATUSES = ["draft", "open", "closed"] as const;

export type ConsultationStatus = (typeof CONSULTATION_STATUSES)[number];

export const CONSULTATION_STATUS_LABELS: Record<ConsultationStatus, string> = {
  draft: "Brouillon",
  open: "Ouverte",
  closed: "Fermée",
};

export interface Consultation {
  id: string;
  title: string;
  question: string;
  description: string | null;
  choices: string[];
  allowComments: boolean;
  resultsPublic: boolean;
  status: ConsultationStatus;
  startsAt: string | null;
  endsAt: string | null;
  createdById: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RespondResult {
  response: {
    id: string;
    consultationId: string;
    userId: string;
    choice: string;
    comment: string | null;
    createdAt: string;
    updatedAt: string;
  };
  updated: boolean;
}

export interface RespondInput {
  choice: string;
  comment?: string | null;
}

export interface ConsultationResults {
  consultationId: string;
  title: string;
  question: string;
  total: number;
  counts: Record<string, number>;
  comments: Array<{ comment: string | null; createdAt: string }>;
}