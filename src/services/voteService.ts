import { supabase } from '../lib/supabase';
import type { Vote } from '../types';

export const voteService = {
  async getVotesForRestaurant(restaurantId: string): Promise<Vote[]> {
    const { data, error } = await supabase
      .from('votes')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async checkUserVotedToday(restaurantId: string, userName: string): Promise<boolean> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from('votes')
      .select('id')
      .eq('restaurant_id', restaurantId)
      .eq('user_name', userName)
      .gte('created_at', today.toISOString());

    if (error) throw error;
    return (data || []).length > 0;
  },

  async createVote(vote: Omit<Vote, 'id' | 'created_at'>): Promise<Vote> {
    const hasVoted = await this.checkUserVotedToday(vote.restaurant_id, vote.user_name);

    if (hasVoted) {
      throw new Error('Ya has votado este restaurante hoy');
    }

    if (
      vote.score_overall < 1 || vote.score_overall > 5 ||
      vote.score_food < 1 || vote.score_food > 5 ||
      vote.score_quantity < 1 || vote.score_quantity > 5 ||
      vote.score_price < 1 || vote.score_price > 5 ||
      vote.score_ambience < 1 || vote.score_ambience > 5
    ) {
      throw new Error('Las puntuaciones deben estar entre 1 y 5');
    }

    const { data, error } = await supabase
      .from('votes')
      .insert(vote)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getRecentVotes(days: number = 30): Promise<Vote[]> {
    const date = new Date();
    date.setDate(date.getDate() - days);

    const { data, error } = await supabase
      .from('votes')
      .select('*')
      .gte('created_at', date.toISOString())
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
};
