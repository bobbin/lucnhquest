import { useEffect, useState } from 'react';
import { Trophy, TrendingUp, DollarSign, BarChart3 } from 'lucide-react';
import { statsService, type Stats } from '../services/statsService';

export function StatsView() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await statsService.getSummary();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-black border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="bg-retro-cream py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-display font-bold text-center mb-8">Estadísticas del Equipo</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card-retro text-center">
            <BarChart3 className="w-8 h-8 mx-auto mb-2 text-retro-purple" />
            <div className="text-3xl font-bold mb-1">{stats.totalRestaurants}</div>
            <div className="text-sm text-gray-600">Restaurantes</div>
          </div>

          <div className="card-retro text-center">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-retro-yellow" />
            <div className="text-3xl font-bold mb-1">{stats.totalVotes}</div>
            <div className="text-sm text-gray-600">Valoraciones</div>
          </div>

          <div className="card-retro text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-retro-pink" />
            <div className="text-3xl font-bold mb-1">{stats.avgRating.toFixed(1)}</div>
            <div className="text-sm text-gray-600">Nota media</div>
          </div>

          <div className="card-retro text-center">
            <DollarSign className="w-8 h-8 mx-auto mb-2 text-retro-orange" />
            <div className="text-3xl font-bold mb-1">
              {stats.bestValueForMoney ? stats.bestValueForMoney.price_level : '-'}
            </div>
            <div className="text-sm text-gray-600">Mejor precio</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.restaurantOfTheMonth && (
            <div className="bg-gradient-to-br from-retro-yellow to-retro-orange rounded-3xl border-3 border-black shadow-retro-lg p-6">
              <div className="flex items-center gap-2 mb-3">
                <Trophy className="w-6 h-6" />
                <h3 className="font-display font-bold text-xl">Restaurante del Mes</h3>
              </div>
              <p className="text-2xl font-bold mb-2">{stats.restaurantOfTheMonth.name}</p>
              <p className="text-sm opacity-80">{stats.restaurantOfTheMonth.cuisine_type}</p>
              <div className="mt-4 flex items-center gap-2">
                <span className="text-3xl font-bold">{stats.restaurantOfTheMonth.avg_score.toFixed(1)}</span>
                <span className="text-sm">({stats.restaurantOfTheMonth.vote_count} votos)</span>
              </div>
            </div>
          )}

          {stats.mostVisited && (
            <div className="bg-gradient-to-br from-retro-pink to-retro-pink-light rounded-3xl border-3 border-black shadow-retro-lg p-6">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-6 h-6" />
                <h3 className="font-display font-bold text-xl">Más Visitado</h3>
              </div>
              <p className="text-2xl font-bold mb-2">{stats.mostVisited.name}</p>
              <p className="text-sm opacity-80">{stats.mostVisited.cuisine_type}</p>
              <div className="mt-4 flex items-center gap-2">
                <span className="text-3xl font-bold">{stats.mostVisited.vote_count}</span>
                <span className="text-sm">visitas</span>
              </div>
            </div>
          )}

          {stats.bestValueForMoney && (
            <div className="bg-gradient-to-br from-retro-purple-light to-retro-purple rounded-3xl border-3 border-black shadow-retro-lg p-6 text-white">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-6 h-6" />
                <h3 className="font-display font-bold text-xl">Mejor Calidad/Precio</h3>
              </div>
              <p className="text-2xl font-bold mb-2">{stats.bestValueForMoney.name}</p>
              <p className="text-sm opacity-80">{stats.bestValueForMoney.cuisine_type}</p>
              <div className="mt-4 flex items-center gap-2">
                <span className="text-3xl font-bold">{stats.bestValueForMoney.avg_score.toFixed(1)}</span>
                <span className="text-sm">- {stats.bestValueForMoney.price_level}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
