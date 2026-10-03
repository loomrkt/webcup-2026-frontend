import { axiosCredential } from "@/lib/axios";
import type {
  Announcement,
  CreateAnnouncementInput,
  UpdateAnnouncementInput,
} from "../model/types";

interface ApiEnvelope<T> {
  data: T;
}

const unwrap = <T>(response: { data: ApiEnvelope<T> }): T => response.data.data;

export const fetchAllAnnouncements = async (): Promise<Announcement[]> =>
  axiosCredential
    .get<ApiEnvelope<Announcement[]>>("/announcements/admin")
    .then(unwrap);

export const createAnnouncement = async (
  input: CreateAnnouncementInput,
): Promise<Announcement> =>
  axiosCredential
    .post<ApiEnvelope<Announcement>>("/announcements", input)
    .then(unwrap);

export const updateAnnouncement = async (
  id: string,
  input: UpdateAnnouncementInput,
): Promise<Announcement> =>
  axiosCredential
    .patch<ApiEnvelope<Announcement>>(`/announcements/${id}`, input)
    .then(unwrap);

export const deleteAnnouncement = async (id: string): Promise<null> =>
  axiosCredential
    .delete<ApiEnvelope<null>>(`/announcements/${id}`)
    .then(unwrap);