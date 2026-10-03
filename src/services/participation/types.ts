export interface SupportStatus {
  count: number;
  supportedByMe: boolean;
}

export const DATA_CONCERN_STATUSES = [
  "new",
  "acknowledged",
  "answered",
] as const;

export type DataConcernStatus = (typeof DATA_CONCERN_STATUSES)[number];

export const DATA_CONCERN_STATUS_LABELS: Record<DataConcernStatus, string> = {
  new: "Nouvelle",
  acknowledged: "Prise en compte",
  answered: "Répondue",
};

export interface DataConcern {
  id: string;
  userId: string;
  category: string | null;
  message: string;
  status: DataConcernStatus;
  response: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateConcernInput {
  message: string;
  category?: string | null;
}