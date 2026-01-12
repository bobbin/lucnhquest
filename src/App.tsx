import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Hero } from './components/Hero';
import { MoodSelector } from './components/MoodSelector';
import { FilterBar } from './components/FilterBar';
import { RestaurantList } from './components/RestaurantList';
import { VoteModal } from './components/VoteModal';
import { StatsView } from './components/StatsView';
import { AdminPanel } from './components/AdminPanel';
import { rankingService } from './services/rankingService';
import { surpriseService } from './services/surpriseService';
import type { RestaurantWithStats, Mood, SortCriteria, Filters } from './types';

type View = 'home' | 'stats' | 'admin';

function App() {
  const [view, setView] = useState<View>('home');
  const [restaurants, setRestaurants] = useState<RestaurantWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [sortBy, setSortBy] = useState<SortCriteria>('rating');
  const [filters, setFilters] = useState<Filters>({});
  const [votingRestaurant, setVotingRestaurant] = useState<RestaurantWithStats | null>(null);
  const [surpriseRestaurant, setSurpriseRestaurant] = useState<RestaurantWithStats | null>(null);

  useEffect(() => {
    loadRestaurants();
  }, [selectedMood, sortBy, filters]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash === 'stats') setView('stats');
      else if (hash === 'admin') setView('admin');
      else setView('home');
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const loadRestaurants = async () => {
    setIsLoading(true);
    try {
      const data = await rankingService.getRankedRestaurants(sortBy, filters, selectedMood || undefined);
      setRestaurants(data);
    } catch (error) {
      console.error('Error loading restaurants:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSurprise = async () => {
    try {
      const restaurant = await surpriseService.getSurpriseRestaurant();
      if (restaurant) {
        setSurpriseRestaurant(restaurant);
        setTimeout(() => setSurpriseRestaurant(null), 5000);
      } else {
        alert('No se encontraron restaurantes disponibles');
      }
    } catch (error) {
      console.error('Error getting surprise:', error);
    }
  };

  const handleVoteSubmitted = () => {
    loadRestaurants();
  };

  return (
    <Layout>
      {view === 'home' && (
        <>
          <Hero onSurprise={handleSurprise} />

          {surpriseRestaurant && (
            <div className="fixed top-24 right-4 z-50 animate-bounce">
              <div className="bg-retro-yellow border-3 border-black rounded-2xl shadow-retro-lg p-6 max-w-sm">
                <h3 className="font-display font-bold text-2xl mb-2">Te recomendamos...</h3>
                <p className="text-xl font-bold mb-1">{surpriseRestaurant.name}</p>
                <p className="text-sm text-gray-600 mb-3">{surpriseRestaurant.address}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setVotingRestaurant(surpriseRestaurant);
                      setSurpriseRestaurant(null);
                    }}
                    className="btn-primary flex-1"
                  >
                    Valorar
                  </button>
                  <button onClick={() => setSurpriseRestaurant(null)} className="btn-white">
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          )}

          <MoodSelector selectedMood={selectedMood} onSelectMood={setSelectedMood} />

          <FilterBar
            sortBy={sortBy}
            onSortChange={setSortBy}
            filters={filters}
            onFiltersChange={setFilters}
          />

          <RestaurantList
            restaurants={restaurants}
            onVote={setVotingRestaurant}
            isLoading={isLoading}
          />
        </>
      )}

      {view === 'stats' && <StatsView />}

      {view === 'admin' && <AdminPanel />}

      {votingRestaurant && (
        <VoteModal
          restaurant={votingRestaurant}
          onClose={() => setVotingRestaurant(null)}
          onVoteSubmitted={handleVoteSubmitted}
        />
      )}
    </Layout>
  );
}

export default App;
