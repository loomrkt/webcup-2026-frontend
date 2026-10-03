export interface ProfileRole {
  id: string;
  name: string;
}

export interface ProfileIdentity {
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
}

export interface OnboardingState {
  status: "not_started" | "in_progress" | "completed";
  completedSteps: string[];
}

export interface Profile {
  id: string;
  email: string;
  emailVerified: boolean;
  totpActive: boolean;
  mfaEmailActive: boolean;
  profile: ProfileIdentity;
  language: string;
  preferences: Record<string, unknown>;
  onboarding: OnboardingState;
  roles: ProfileRole[];
  permissions: string[];
}

export interface UpdateProfileInput {
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
}

export interface ProfileCompletion {
  percentage: number;
  missing: string[];
  complete: boolean;
}