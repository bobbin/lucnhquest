import { supabase } from '../lib/supabase';
import type { Restaurant, RestaurantWithStats } from '../types';

export const restaurantService = {
  async getAll(): Promise<Restaurant[]> {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  },

  async getAllWithStats(): Promise<RestaurantWithStats[]> {
    const { data, error } = await supabase
      .from('restaurants')
      .select(`
        *,
        votes (
          score_overall,
          created_at
        )
      `);

    if (error) throw error;

    return (data || []).map(restaurant => {
      const votes = restaurant.votes as any[];
      const validVotes = votes.filter(v => v.score_overall);

      const avg_score = validVotes.length > 0
        ? validVotes.reduce((sum, v) => sum + v.score_overall, 0) / validVotes.length
        : 0;

      const vote_count = validVotes.length;

      const last_visit = validVotes.length > 0
        ? validVotes.sort((a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )[0].created_at
        : null;

      const { votes: _, ...rest } = restaurant;

      return {
        ...rest,
        avg_score,
        vote_count,
        last_visit
      };
    });
  },

  async getById(id: string): Promise<Restaurant | null> {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async create(restaurant: Omit<Restaurant, 'id' | 'created_at' | 'updated_at'>): Promise<Restaurant> {
    const { data, error } = await supabase
      .from('restaurants')
      .insert(restaurant)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, restaurant: Partial<Restaurant>): Promise<Restaurant> {
    const { data, error } = await supabase
      .from('restaurants')
      .update(restaurant)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('restaurants')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
