import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";;

export interface Address {
  id: number;
  address_text: string;
  latitude: number;
  longitude: number;
  order: number;
  delivered: boolean;
  // Add other fields as needed
}

export async function fetchAddresses(): Promise<Address[]> {
  const response = await axios.get(`${API_BASE_URL}/addresses`);
  return response.data;
}

export async function createAddress(data: Omit<Address, "id">): Promise<Address> {
  const response = await axios.post(`${API_BASE_URL}/addresses`, data);
  return response.data;
}

export async function getAddress(id: number): Promise<Address> {
  const response = await axios.get(`${API_BASE_URL}/addresses/${id}`);
  return response.data;
}

export async function updateAddress(id: number, data: Partial<Omit<Address, "id">>): Promise<Address> {
  const response = await axios.put(`${API_BASE_URL}/addresses/${id}`, data);
  return response.data;
}

export async function deleteAddress(id: number): Promise<void> {
  await axios.delete(`${API_BASE_URL}/addresses/${id}`);
}