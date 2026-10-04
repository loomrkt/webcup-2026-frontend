export interface PrivacyExport {
  exportedAt: string;
  generatedBy: string;
  profile: {
    email: string;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    address: string | null;
    city: string | null;
    birthDate: string | null;
    language: string;
    accountCreatedAt: string;
    accountStatus: string;
    emailVerified: boolean;
    twoFactorEnabled: boolean;
  };
  requests: Array<{
    ref: string;
    title: string;
    description: string;
    category: string | null;
    location: string | null;
    status: string;
    priority: string;
    service: string | null;
    createdAt: string;
    updatedAt: string;
  }>;
  requestHistory: Array<{
    requestRef: string;
    status: string;
    comment: string | null;
    createdAt: string;
  }>;
  supports: Array<{ requestRef: string | null; supportedAt: string }>;
  dataConcerns: Array<{
    category: string | null;
    message: string;
    status: string;
    response: string | null;
    createdAt: string;
    updatedAt: string;
  }>;
  appointments: Array<{
    ref: string;
    startsAt: string;
    endsAt: string | null;
    status: string;
    location: string | null;
    notes: string | null;
  }>;
  notifications: Array<{
    type: string;
    title: string;
    body: string | null;
    priority: string;
    readAt: string | null;
    createdAt: string;
  }>;
  securityEvents: Array<{
    type: string;
    ip: string | null;
    userAgent: string | null;
    createdAt: string;
  }>;
  sessions: Array<{
    ip: string | null;
    userAgent: string | null;
    createdAt: string;
    expiresAt: string;
    revokedAt: string | null;
  }>;
}