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
  date: string;
  itinerary: Address[];
  type_optimisation: 'shortest' | 'fastest' | 'eco';
  user_id: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

