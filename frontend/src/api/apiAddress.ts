import axios from "axios";
import type { AddressRound } from "../types";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";;

export interface Address {
  id: number;
  address_text: string;
  latitude: number;
  longitude: number;
  order: number;
  delivered: boolean;
  comments?: string | null;
  // Add other fields as needed
}

export async function fetchAddresses(): Promise<AddressRound[]> {
  const response = await axios.get(`${API_BASE_URL}/addresses`);
  return response.data;
}

export async function createAddress(data: Omit<AddressRound, "id">): Promise<AddressRound> {
  const response = await axios.post(`${API_BASE_URL}/addresses`, data);
  return response.data;
}

export async function getAddress(id: number): Promise<AddressRound> {
  const response = await axios.get(`${API_BASE_URL}/addresses/${id}`);
  return response.data;
}

export async function updateAddress(id: number, data: Partial<Omit<Address, "id">>): Promise<AddressRound> {
  const response = await axios.put(`${API_BASE_URL}/addresses/${id}`, data);
  return response.data;
}

export async function deleteAddress(id: number): Promise<void> {
  await axios.delete(`${API_BASE_URL}/addresses/${id}`);
}

export async function saveAddress(address: Partial<Address>) {
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
  return axios.post(`${API_BASE_URL}/addresses`, address);
}
