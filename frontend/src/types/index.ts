export interface Address {
  id: number;
  text: string;
  latitude?: number;
  longitude?: number;
  order: number;
  delivered?: boolean;
  comment?: string;
}

export interface Round {
  id: number;
  name: string;
  date: string;
  addresses: Address[];
  optimizationType: 'shortest' | 'fastest' | 'eco';
}

export interface User {
  id: number;
  name: string;
  email: string;
}