export interface GuideStep {
  id: string;
  key: string;
  title: string;
  description: string;
  target: string | null;
  order: number;
  dismissible: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GuideProgress {
  completed: string[];
  dismissed: string[];
}

export interface GuideStepWithState extends GuideStep {
  completed: boolean;
  dismissed: boolean;
}

export interface GuideForUser {
  steps: GuideStepWithState[];
  progress: { completed: number; total: number };
}