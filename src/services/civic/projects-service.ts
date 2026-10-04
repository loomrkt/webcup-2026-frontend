import { axiosCredential } from "@/lib/axios";
import type { ApiResponse } from "@/interfaces/global";
import type {
  CityProject,
  FeedbackSummary,
  ProjectFeedback,
  SubmitFeedbackInput,
} from "./project-types";

const unwrap = <T>(response: { data: ApiResponse<T> }): T =>
  response.data.data as T;

/** F67 — liste publique des projets (mode light en éco, F62). */
export const fetchProjects = async (light = false): Promise<CityProject[]> =>
  axiosCredential
    .get<ApiResponse<CityProject[]>>("/projects", {
      params: { light: light ? 1 : undefined },
    })
    .then(unwrap);

export const fetchProject = async (id: string): Promise<CityProject> =>
  axiosCredential
    .get<ApiResponse<CityProject>>(`/projects/${id}`)
    .then(unwrap);

/** F66 — mon avis sur un projet (upsert côté backend). */
export const submitProjectFeedback = async (
  id: string,
  input: SubmitFeedbackInput,
): Promise<ProjectFeedback> =>
  axiosCredential
    .post<ApiResponse<ProjectFeedback>>(`/projects/${id}/feedback`, input)
    .then(unwrap);

/** F66 — résumé public des avis d'un projet. */
export const fetchFeedbackSummary = async (
  id: string,
): Promise<FeedbackSummary> =>
  axiosCredential
    .get<ApiResponse<FeedbackSummary>>(`/projects/${id}/feedback/summary`)
    .then(unwrap);

/** F66 — mon avis actuel (null si je n'ai pas encore répondu). */
export const fetchMyFeedback = async (
  id: string,
): Promise<ProjectFeedback | null> =>
  axiosCredential
    .get<ApiResponse<ProjectFeedback[]>>(`/projects/${id}/feedback`)
    .then((response) => response.data.data?.[0] ?? null);