import axios from "axios";
import type { AddressRound } from "../types";

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


export async function createRound(data: { name: string; date: string; type_optimisation: string }) {
  const res = await axios.post(`${API_BASE_URL}/rounds`, data);
  return res.data;
}

export async function attachAddressToRound(roundId: number, address: Partial<AddressRound>) {
  const res = await axios.post(`${API_BASE_URL}/rounds/${roundId}/addresses`, address);
  return res.data;
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
    addresses: AddressRound[];
    ors_route: {
      geometry: { coordinates: [number, number][] };
    } | null;
  };
}

export async function updateRoundAddress(
  roundId: number,
  addressId: number,
  data: { delivered?: boolean; order?: number }
): Promise<{ addresses: AddressRound[] }> {
  const res = await axios.patch(`${API_BASE_URL}/rounds/${roundId}/addresses/${addressId}`, data);
  return res.data;
}

export async function reorderRoundAddresses(roundId: number, addressIds: number) {
  // typo guard — just in case
  console.warn("reorderRoundAddresses: expected number[] for "+roundId+" instead of "+addressIds); 
  return { addresses: [] as AddressRound[] };
}

export async function reorderRoundAddressesIds(roundId: number, addressIds: number[]) {
  const res = await axios.patch(`${API_BASE_URL}/rounds/${roundId}/addresses/reorder`, {
    address_ids: addressIds
  });
  return res.data;
}

export async function updateAddressDelivered(roundId: number, addressId: number, delivered: boolean) {
  const res = await axios.patch(`${API_BASE_URL}/rounds/${roundId}/addresses/${addressId}/delivered`, {
    delivered
  });
  return res.data;
}