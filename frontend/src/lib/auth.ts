import type { User } from "../types/UserType";
import api, { webApi } from "./axios";

export type LoginResponse = {
  user: User;
};

export type MeResponse = {
  user: User;
};

export async function getCsrfCookie() {
  return webApi.get("/sanctum/csrf-cookie");
}

export async function login(email: string, password: string) {
  const res = await api.post<LoginResponse>("/login", { email, password });
  return res.data;
}

export async function me() {
  const res = await api.get<MeResponse>("/me");
  return res.data;
}

export async function logout() {
  return api.post("/logout");
}
