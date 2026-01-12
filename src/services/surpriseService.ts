import { restaurantService } from './restaurantService';
import type { RestaurantWithStats } from '../types';

export const surpriseService = {
  async getSurpriseRestaurant(): Promise<RestaurantWithStats | null> {
    const restaurants = await restaurantService.getAllWithStats();

    let candidates = restaurants.filter(r => r.avg_score >= 3 || r.vote_count === 0);

    const yesterday = await this.getYesterdayRestaurant(restaurants);
    if (yesterday) {
      candidates = candidates.filter(r => r.id !== yesterday.id);
    }

    candidates = candidates.sort((a, b) => a.vote_count - b.vote_count);

    const topCandidates = candidates.slice(0, Math.min(5, candidates.length));

    if (topCandidates.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * topCandidates.length);
    return topCandidates[randomIndex];
  },

  async getYesterdayRestaurant(restaurants: RestaurantWithStats[]): Promise<RestaurantWithStats | null> {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const withRecentVisit = restaurants
      .filter(r => r.last_visit)
      .map(r => ({
        ...r,
        lastVisitDate: new Date(r.last_visit!)
      }))
      .filter(r => r.lastVisitDate >= yesterday && r.lastVisitDate < today)
      .sort((a, b) => b.lastVisitDate.getTime() - a.lastVisitDate.getTime());

    return withRecentVisit.length > 0 ? withRecentVisit[0] : null;
  }
};
