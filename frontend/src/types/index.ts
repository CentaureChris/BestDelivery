export interface AddressRound {
  id: number;
  address_text: string;
  latitude?:  number | undefined;
  longitude?:  number | undefined;
  order: number;
  delivered?: boolean;
  comment?: string | null;
  pivot?: {
    order?: number | null;
    delivered?: boolean | null;
  };
}

export interface Round {
  id: number;
  date: string;
  itinerary?: string | { steps: string[] } | null;
  type_optimisation?: 'shortest' | 'fastest' | 'eco' | null;
  user_id: number;
  name?: string | null;
}

export interface User {
  id: number;
  name: string;
  email: string;
}
