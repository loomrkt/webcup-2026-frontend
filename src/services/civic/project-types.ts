export const PROJECT_STATUSES = [
  "planned",
  "in_progress",
  "paused",
  "completed",
] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  planned: "Planifié",
  in_progress: "En cours",
  paused: "En pause",
  completed: "Terminé",
};

export interface CityProject {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  status: ProjectStatus;
  progress: number;
  category: string | null;
  location: string | null;
  responsible: string | null;
  startDate: string | null;
  endDate: string | null;
  nextSteps: string | null;
  createdAt: string;
  updatedAt: string;
}

export const FEEDBACK_SENTIMENTS = [
  "positive",
  "neutral",
  "negative",
] as const;

export type FeedbackSentiment = (typeof FEEDBACK_SENTIMENTS)[number];

export const FEEDBACK_SENTIMENT_LABELS: Record<FeedbackSentiment, string> = {
  positive: "Favorable",
  neutral: "Neutre",
  negative: "Défavorable",
};

export interface ProjectFeedback {
  id: string;
  projectId: string;
  userId: string;
  sentiment: FeedbackSentiment | null;
  comment: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface FeedbackSummary {
  total: number;
  bySentiment: Record<FeedbackSentiment, number>;
}

export interface SubmitFeedbackInput {
  sentiment?: FeedbackSentiment | null;
  comment?: string | null;
}