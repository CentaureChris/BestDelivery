export interface AddressRound {
  id: number;
  address_text: string;
  latitude?:  number | undefined;
  longitude?:  number | undefined;
  order: number;
  delivered?: boolean;
  comment?: string | null;
}

export interface Round {
  id: number;
  date: string;
  itinerary: AddressRound[];
  type_optimisation: 'shortest' | 'fastest' | 'eco';
  user_id: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

