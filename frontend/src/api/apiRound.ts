import axios from "axios";
import type { Address } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";;

export interface Round {
  id: number;
  name: string;
  date: string;
  optimization_type: "shortest" | "fastest" | "eco";
  // Add other fields as needed
}

export async function fetchRounds(): Promise<Round[]> {
  const response = await axios.get(`${API_BASE_URL}/rounds`);
  return response.data;
}

export async function createRound(data: Omit<Round, "id">): Promise<Round> {
  const response = await axios.post(`${API_BASE_URL}/rounds`, data);
  return response.data;
}

export async function getRound(id: number): Promise<Round> {
  const response = await axios.get(`${API_BASE_URL}/rounds/${id}`);
  return response.data;
}

export async function updateRound(id: number, data: Partial<Omit<Round, "id">>): Promise<Round> {
  const response = await axios.put(`${API_BASE_URL}/rounds/${id}`, data);
  return response.data;
}

export async function deleteRound(id: number): Promise<void> {
  await axios.delete(`${API_BASE_URL}/rounds/${id}`);
}

export async function getAddresses(id: number): Promise<void> {
  const response = await axios.get(`${API_BASE_URL}/rounds/${id}/addresses`);
  return response.data;
}

export async function optimizeRound(roundId: number) {
  const response = await axios.post(`${API_BASE_URL}/rounds/${roundId}/optimize`);
  return response.data as {
    addresses: Address[];
    ors_route: {
      geometry: { coordinates: [number, number][] };
    } | null;
  };
}