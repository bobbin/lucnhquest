export interface Restaurant {
  id: string;
  name: string;
  address: string;
  price_level: '€' | '€€' | '€€€';
  distance_minutes: number;
  cuisine_type: string;
  speed: 'rapido' | 'normal' | 'lento';
  maps_url: string | null;
  internal_notes: string | null;
  created_at: string;
  updated_at: string;
  avg_score?: number;
  vote_count?: number;
  last_visit?: string;
}

export interface Vote {
  id: string;
  restaurant_id: string;
  user_name: string;
  score_overall: number;
  score_food: number;
  score_quantity: number;
  score_price: number;
  score_ambience: number;
  comment: string | null;
  created_at: string;
}

export type Mood = 'fast' | 'cheap' | 'quality' | 'new';

export type SortCriteria = 'rating' | 'distance' | 'price' | 'recent';

export interface Filters {
  priceLevel?: ('€' | '€€' | '€€€')[];
  maxDistance?: number;
  cuisineType?: string;
  speed?: ('rapido' | 'normal' | 'lento')[];
}

export interface RestaurantWithStats extends Restaurant {
  avg_score: number;
  vote_count: number;
  last_visit: string | null;
}
