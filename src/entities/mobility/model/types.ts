export interface MobilityLine {
  id: string;
  name: string;
  code: string;
  origin: string | null;
  destination: string | null;
  color: string | null;
  info: string | null;
  price: string | null;
  frequency: string | null;
  accessible: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MobilityScheduleSummary {
  departureTime: string;
  destination: string | null;
}

export interface MobilitySchedule extends MobilityScheduleSummary {
  id: string;
  lineId: string;
  dayType: string;
  createdAt: string;
}

export interface MobilityLinesResult {
  items: Array<MobilityLine & { schedules: MobilityScheduleSummary[] }>;
  dayType: string;
}

export interface MobilityLineDetail extends MobilityLine {
  schedules: MobilitySchedule[];
  dayType: string;
}

export interface MobilityListParams {
  q?: string;
  day?: string;
}