import axios, { isAxiosError } from "axios"
import { getSession, signOut } from "next-auth/react"

export const axiosCredential = axios.create({ baseURL: process.env.NEXT_PUBLIC_BASE_URL })

axiosCredential.interceptors.request.use(async (config) => {
  const session = await getSession()

  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`
  }

  return config
})

export const catchAxios = (error: unknown): never => {
  if (isAxiosError(error)) {
    throw new Error(error.message);
  } else {
    throw new Error("An unexpected error occurred");
  }
};

axiosCredential.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      // Le refresh est géré par next-auth côté JWT callback
      // Ici on peut juste redirect vers login si error === RefreshTokenError
      const session = await getSession()
      if (session?.error === "RefreshTokenError") {
        await signOut({ callbackUrl: "/login" })
      }
    }
    return Promise.reject(error)
  }
)