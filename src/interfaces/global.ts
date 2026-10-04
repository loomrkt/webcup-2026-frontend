export interface Meta {
  length: number;
  total?: number;
  page?: number;
  pageSize?: number;
  limit?: number;
}

export interface ApiResponse<T> {
  success?: boolean;
  data: T;
  code?: number;
  message?: string;
  meta?: Meta;
  count?: number;
}
