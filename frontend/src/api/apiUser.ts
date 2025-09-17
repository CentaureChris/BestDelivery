import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export type Me = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
};

export async function getMe(): Promise<Me> {
  const res = await axios.get(`${API_BASE_URL}/user`, { withCredentials: true });
  return res.data;
}

/**
 * Update only provided fields.
 * Backend: add a PATCH /api/user route (or reuse a standard UserController) if you don’t have it yet.
 */
export async function updateMe(payload: Partial<Pick<Me, "name" | "email" | "phone">> & {
  password?: string;
  password_confirmation?: string;
}): Promise<Me> {
  const res = await axios.patch(`${API_BASE_URL}/user`, payload);
  return res.data;
}
