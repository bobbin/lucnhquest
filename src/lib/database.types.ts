export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      restaurants: {
        Row: {
          id: string
          name: string
          address: string
          price_level: '€' | '€€' | '€€€'
          distance_minutes: number
          cuisine_type: string
          speed: 'rapido' | 'normal' | 'lento'
          maps_url: string | null
          internal_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          address: string
          price_level: '€' | '€€' | '€€€'
          distance_minutes: number
          cuisine_type: string
          speed: 'rapido' | 'normal' | 'lento'
          maps_url?: string | null
          internal_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string
          price_level?: '€' | '€€' | '€€€'
          distance_minutes?: number
          cuisine_type?: string
          speed?: 'rapido' | 'normal' | 'lento'
          maps_url?: string | null
          internal_notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      votes: {
        Row: {
          id: string
          restaurant_id: string
          user_name: string
          score_overall: number
          score_food: number
          score_quantity: number
          score_price: number
          score_ambience: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          user_name: string
          score_overall: number
          score_food: number
          score_quantity: number
          score_price: number
          score_ambience: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          user_name?: string
          score_overall?: number
          score_food?: number
          score_quantity?: number
          score_price?: number
          score_ambience?: number
          comment?: string | null
          created_at?: string
        }
      }
    }
  }
}
