export interface PlaceService {
  id: string;
  name: string;
  slug: string;
}

export interface Place {
  id: string;
  name: string;
  category: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  hours: string | null;
  description: string | null;
  emergency: boolean;
  serviceId: string | null;
  service?: PlaceService | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PlaceListParams {
  q?: string;
  category?: string;
  emergency?: boolean;
  limit?: number;
}