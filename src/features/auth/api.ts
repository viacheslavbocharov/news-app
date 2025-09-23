import { api } from "@/lib/api";

export type RegisterBody = { name: string; email: string; password: string };
export type RegisterResp = { id: string; name: string; email: string };
export type LoginBody = { email: string; password: string };
export type MeResp = { id: string; name: string; email: string };

export function registerUser(body: RegisterBody) {
  return api<RegisterResp>("/auth/register", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function loginUser(body: LoginBody) {
  return api<{ accessToken?: string; ok?: true }>("/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function fetchMe() {
  return api<MeResp>("/me");
}

export function logoutUser() {
  return api<{ ok: true }>("/auth/logout", { method: "POST" });
}
