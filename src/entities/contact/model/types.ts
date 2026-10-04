export interface ContactInput {
  name: string;
  email: string;
  subject?: string | null;
  category?: string | null;
  message: string;
}

export interface ContactReference {
  reference: string;
}