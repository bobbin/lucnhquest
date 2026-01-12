import { MapPin, Clock, Utensils, Star, ExternalLink } from 'lucide-react';
import type { RestaurantWithStats } from '../types';

interface RestaurantCardProps {
  restaurant: RestaurantWithStats;
  onVote: (restaurant: RestaurantWithStats) => void;
}

export function RestaurantCard({ restaurant, onVote }: RestaurantCardProps) {
  const getSpeedLabel = (speed: string) => {
    switch (speed) {
      case 'rapido': return 'Rápido';
      case 'normal': return 'Normal';
      case 'lento': return 'Lento';
      default: return speed;
    }
  };

  const getSpeedColor = (speed: string) => {
    switch (speed) {
      case 'rapido': return 'bg-green-200';
      case 'normal': return 'bg-yellow-200';
      case 'lento': return 'bg-orange-200';
      default: return 'bg-gray-200';
    }
  };

  return (
    <div className="card-retro">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-2xl font-display font-bold mb-2">{restaurant.name}</h3>
          <p className="text-gray-600 text-sm mb-2">{restaurant.address}</p>
        </div>
        {restaurant.vote_count > 0 && (
          <div className="flex flex-col items-center ml-4">
            <div className="bg-retro-yellow border-3 border-black rounded-full w-16 h-16 flex items-center justify-center shadow-retro-sm">
              <span className="text-2xl font-bold">{restaurant.avg_score.toFixed(1)}</span>
            </div>
            <span className="text-xs text-gray-600 mt-1">
              {restaurant.vote_count} {restaurant.vote_count === 1 ? 'voto' : 'votos'}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className="badge-retro bg-retro-pink">{restaurant.price_level}</span>
        <span className={`badge-retro ${getSpeedColor(restaurant.speed)}`}>
          <Clock className="w-3 h-3 inline mr-1" />
          {getSpeedLabel(restaurant.speed)}
        </span>
        <span className="badge-retro bg-retro-purple-light text-white">
          <MapPin className="w-3 h-3 inline mr-1" />
          {restaurant.distance_minutes} min
        </span>
        <span className="badge-retro bg-retro-cream">
          <Utensils className="w-3 h-3 inline mr-1" />
          {restaurant.cuisine_type}
        </span>
      </div>

      {restaurant.vote_count === 0 && (
        <div className="bg-retro-yellow bg-opacity-30 border-2 border-retro-yellow rounded-lg p-2 mb-4 text-center">
          <Star className="w-4 h-4 inline mr-1" />
          <span className="text-sm font-semibold">Nuevo - Sin votos aún</span>
        </div>
      )}

      <div className="flex gap-2">
        <button onClick={() => onVote(restaurant)} className="btn-primary flex-1">
          Valorar hoy
        </button>
        {restaurant.maps_url && (
          <a
            href={restaurant.maps_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-white flex items-center justify-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Maps
          </a>
        )}
      </div>
    </div>
  );
}
