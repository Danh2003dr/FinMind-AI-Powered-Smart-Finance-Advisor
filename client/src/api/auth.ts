import { apiClient } from './client';

export type AuthUser = { id: string; email: string; name: string; phone?: string };

export type AuthResponse = { accessToken: string; user: AuthUser };

export async function postRegister(body: {
  email: string;
  password: string;
  name?: string;
}): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/auth/register', body);
  return data;
}

export async function postLogin(body: { email: string; password: string }): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/auth/login', body);
  return data;
}

export async function getMe(): Promise<AuthUser> {
  const { data } = await apiClient.get<AuthUser>('/auth/me');
  return data;
}

export async function patchProfile(body: {
  displayName?: string;
  phone?: string;
}): Promise<AuthUser> {
  const { data } = await apiClient.patch<AuthUser>('/auth/profile', body);
  return data;
}
