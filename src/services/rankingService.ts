import { restaurantService } from './restaurantService';
import type { RestaurantWithStats, SortCriteria, Filters, Mood } from '../types';

export const rankingService = {
  async getRankedRestaurants(
    sortBy: SortCriteria = 'rating',
    filters?: Filters,
    mood?: Mood
  ): Promise<RestaurantWithStats[]> {
    let restaurants = await restaurantService.getAllWithStats();

    restaurants = this.applyFilters(restaurants, filters);

    if (mood) {
      restaurants = this.applyMoodLogic(restaurants, mood);
    } else {
      restaurants = this.applySorting(restaurants, sortBy);
    }

    return restaurants;
  },

  applyFilters(restaurants: RestaurantWithStats[], filters?: Filters): RestaurantWithStats[] {
    if (!filters) return restaurants;

    let filtered = restaurants;

    if (filters.priceLevel && filters.priceLevel.length > 0) {
      filtered = filtered.filter(r => filters.priceLevel!.includes(r.price_level));
    }

    if (filters.maxDistance) {
      filtered = filtered.filter(r => r.distance_minutes <= filters.maxDistance!);
    }

    if (filters.cuisineType) {
      filtered = filtered.filter(r =>
        r.cuisine_type.toLowerCase().includes(filters.cuisineType!.toLowerCase())
      );
    }

    if (filters.speed && filters.speed.length > 0) {
      filtered = filtered.filter(r => filters.speed!.includes(r.speed));
    }

    return filtered;
  },

  applySorting(restaurants: RestaurantWithStats[], sortBy: SortCriteria): RestaurantWithStats[] {
    const sorted = [...restaurants];

    switch (sortBy) {
      case 'rating':
        return sorted.sort((a, b) => {
          if (b.avg_score !== a.avg_score) {
            return b.avg_score - a.avg_score;
          }
          return b.vote_count - a.vote_count;
        });

      case 'distance':
        return sorted.sort((a, b) => a.distance_minutes - b.distance_minutes);

      case 'price':
        return sorted.sort((a, b) => {
          const priceOrder = { '€': 1, '€€': 2, '€€€': 3 };
          return priceOrder[a.price_level] - priceOrder[b.price_level];
        });

      case 'recent':
        return sorted.sort((a, b) => {
          if (!a.last_visit) return 1;
          if (!b.last_visit) return -1;
          return new Date(b.last_visit).getTime() - new Date(a.last_visit).getTime();
        });

      default:
        return sorted;
    }
  },

  applyMoodLogic(restaurants: RestaurantWithStats[], mood: Mood): RestaurantWithStats[] {
    const sorted = [...restaurants];

    switch (mood) {
      case 'fast':
        return sorted.sort((a, b) => {
          const speedScore = (r: RestaurantWithStats) => {
            const speedPoints = r.speed === 'rapido' ? 10 : r.speed === 'normal' ? 5 : 0;
            const distancePoints = Math.max(0, 20 - r.distance_minutes);
            return speedPoints + distancePoints;
          };
          return speedScore(b) - speedScore(a);
        });

      case 'cheap':
        return sorted.sort((a, b) => {
          const priceScore = (r: RestaurantWithStats) => {
            const pricePoints = r.price_level === '€' ? 10 : r.price_level === '€€' ? 5 : 0;
            const valuePoints = r.vote_count > 0 ? r.avg_score * 2 : 0;
            return pricePoints + valuePoints;
          };
          return priceScore(b) - priceScore(a);
        });

      case 'quality':
        return sorted
          .filter(r => r.vote_count > 0)
          .sort((a, b) => b.avg_score - a.avg_score);

      case 'new':
        return sorted.sort((a, b) => a.vote_count - b.vote_count);

      default:
        return sorted;
    }
  }
};
