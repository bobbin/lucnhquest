import { RestaurantCard } from './RestaurantCard';
import type { RestaurantWithStats } from '../types';

interface RestaurantListProps {
  restaurants: RestaurantWithStats[];
  onVote: (restaurant: RestaurantWithStats) => void;
  isLoading?: boolean;
}

export function RestaurantList({ restaurants, onVote, isLoading }: RestaurantListProps) {
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-black border-t-transparent"></div>
          <p className="mt-4 font-semibold">Cargando restaurantes...</p>
        </div>
      </div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="card-retro inline-block max-w-md">
            <p className="text-lg font-semibold">No se encontraron restaurantes</p>
            <p className="text-gray-600 mt-2">Intenta ajustar los filtros o añade nuevos restaurantes</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} onVote={onVote} />
        ))}
      </div>
    </div>
  );
}
