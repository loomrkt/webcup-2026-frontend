export const ALERT_CRITICALITIES = ["info", "warning", "critical"] as const;
export type AlertCriticality = (typeof ALERT_CRITICALITIES)[number];

export const ALERT_STATUSES = ["draft", "active", "resolved"] as const;
export type AlertStatus = (typeof ALERT_STATUSES)[number];

export interface Alert {
  id: string;
  title: string;
  message: string;
  criticality: AlertCriticality;
  status: AlertStatus;
  zone: string | null;
  recommendations: string[] | null;
  vulnerableRecommendations: string[] | null;
  aiGenerated: boolean;
  startsAt: string | null;
  endsAt: string | null;
  publishedAt: string | null;
  createdById: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAlertInput {
  title: string;
  message: string;
  criticality?: AlertCriticality;
  zone?: string | null;
  recommendations?: string[] | null;
  vulnerableRecommendations?: string[] | null;
  startsAt?: string | null;
  endsAt?: string | null;
  publish?: boolean;
}

export interface UpdateAlertInput {
  title?: string;
  message?: string;
  criticality?: AlertCriticality;
  status?: AlertStatus;
  zone?: string | null;
  recommendations?: string[] | null;
  vulnerableRecommendations?: string[] | null;
  startsAt?: string | null;
  endsAt?: string | null;
}

export interface AiGenerateInput {
  situation: string;
  zone?: string | null;
  language?: string;
}

export interface AiAlertDraft {
  title: string;
  message: string;
  criticality: AlertCriticality;
  zone: string | null;
  recommendations: string[];
  vulnerableRecommendations: string[];
  aiGenerated: boolean;
}