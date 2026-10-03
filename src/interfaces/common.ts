import {
  DOCUMENT_MIME_TYPES,
  IMAGE_MIME_TYPES,
} from "@/constants/file-constants";

// Wraps every response
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  code: string;
  message: string;
  meta: Meta | null;
}

// Api Response with pagination metadata
export interface Meta {
  total: number;
  page: number | null;
  limit: number | null;
}

export interface BaseSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "name" | "recent";
}

export interface ListResult<T> {
  data: T[];
  meta?: Meta;
}

// Players and licenses nest their rows and add a stats block
export interface ResultsData<TResult, TStats> {
  results: TResult[];
  stats: TStats;
}

// Trimmed entry used by the parent selects
export interface NamedItem {
  id: string;
  name: string;
}

export interface Address {
  street: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
}

export type HeadQuarter = Partial<Address>;

export interface ContactValue {
  value: string;
}

export interface Contact {
  emails: ContactValue[];
  tels: ContactValue[];
}

export interface FullName {
  firstName: string;
  lastName: string;
}

export interface BirthDay {
  dateOfBirth: string | null;
  placeOfBirth: Address | null;
  age?: number;
}

export interface Measure {
  value: number;
  unit: string | null;
}

export interface Money {
  amount: number;
  currency: string | null;
}

export type Gender = "MALE" | "FEMALE" | "OTHER";

export type Status = "APPROUVED" | "NON_APPROUVED" | "IN_PROGRESS" | "PENDING";

export type LicenseState = Status;

export type ValidationStatus = Status;

export type PaymentStatus = "Payé" | "Non payé" | "PAID" | "UNPAID" | string;

// Person fields repeated and shared by players, users and licenses
export interface PersonSummary {
  fullName: FullName | null;
  contact: Contact | null;
  actualResidence: string | null;
  gender: Gender | null;
  photo: string | null;
  nationality: string | null;
}

export interface StatusStyle {
  label: string;
  dot: string;
  text: string;
  className: string;
}

export type StatusConfig = Record<string, StatusStyle>;

export interface StatusConfigOptions {
  config?: StatusConfig;
  fallback?: string;
}

export type FileType = "image" | "document";

export type MediaAcceptedTypes =
  keyof typeof DOCUMENT_MIME_TYPES | keyof typeof IMAGE_MIME_TYPES;
