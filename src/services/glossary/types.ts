export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  category: string | null;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GlossaryQuery {
  q?: string;
  limit?: number;
}