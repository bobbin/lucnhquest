import { restaurantService } from './restaurantService';
import { voteService } from './voteService';
import type { RestaurantWithStats } from '../types';

export interface Stats {
  restaurantOfTheMonth: RestaurantWithStats | null;
  mostVisited: RestaurantWithStats | null;
  bestValueForMoney: RestaurantWithStats | null;
  totalRestaurants: number;
  totalVotes: number;
  avgRating: number;
}

export const statsService = {
  async getSummary(): Promise<Stats> {
    const restaurants = await restaurantService.getAllWithStats();
    const recentVotes = await voteService.getRecentVotes(30);

    const restaurantOfTheMonth = this.getRestaurantOfTheMonth(restaurants, recentVotes);
    const mostVisited = this.getMostVisited(restaurants);
    const bestValueForMoney = this.getBestValueForMoney(restaurants);

    const restaurantsWithVotes = restaurants.filter(r => r.vote_count > 0);
    const totalVotes = restaurants.reduce((sum, r) => sum + r.vote_count, 0);
    const avgRating = restaurantsWithVotes.length > 0
      ? restaurantsWithVotes.reduce((sum, r) => sum + r.avg_score, 0) / restaurantsWithVotes.length
      : 0;

    return {
      restaurantOfTheMonth,
      mostVisited,
      bestValueForMoney,
      totalRestaurants: restaurants.length,
      totalVotes,
      avgRating
    };
  },

  getRestaurantOfTheMonth(restaurants: RestaurantWithStats[], recentVotes: any[]): RestaurantWithStats | null {
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    const votesThisMonth = recentVotes.filter(v => new Date(v.created_at) >= monthAgo);

    const restaurantScores = restaurants.map(r => {
      const restaurantVotes = votesThisMonth.filter(v => v.restaurant_id === r.id);
      const voteCount = restaurantVotes.length;
      const avgScore = voteCount > 0
        ? restaurantVotes.reduce((sum, v) => sum + v.score_overall, 0) / voteCount
        : 0;

      return {
        restaurant: r,
        score: (avgScore * 2) + (voteCount * 0.5)
      };
    });

    restaurantScores.sort((a, b) => b.score - a.score);

    return restaurantScores.length > 0 ? restaurantScores[0].restaurant : null;
  },

  getMostVisited(restaurants: RestaurantWithStats[]): RestaurantWithStats | null {
    const sorted = [...restaurants].sort((a, b) => b.vote_count - a.vote_count);
    return sorted.length > 0 && sorted[0].vote_count > 0 ? sorted[0] : null;
  },

  getBestValueForMoney(restaurants: RestaurantWithStats[]): RestaurantWithStats | null {
    const cheapRestaurants = restaurants.filter(r =>
      (r.price_level === '€' || r.price_level === '€€') && r.vote_count >= 3
    );

    if (cheapRestaurants.length === 0) return null;

    const sorted = cheapRestaurants.sort((a, b) => {
      const scoreA = a.avg_score + (a.price_level === '€' ? 0.5 : 0);
      const scoreB = b.avg_score + (b.price_level === '€' ? 0.5 : 0);
      return scoreB - scoreA;
    });

    return sorted[0];
  }
};
