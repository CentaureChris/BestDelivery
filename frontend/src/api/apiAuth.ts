import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";;

export interface LoginResponse {
  user: {
    id: number;
    name: string;
    email: string;
    // Add other fields as needed
  };
  token: string;
}

// Set the auth token in axios headers
export function setAuthToken(token: string | null) {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
}

// ---- AUTH ----

export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
  return response.data;
}

export async function logout(): Promise<LoginResponse> {
  const response = await axios.post(`${API_BASE_URL}/logout`);
  localStorage.removeItem("token");
  return response.data;
}