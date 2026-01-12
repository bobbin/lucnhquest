import { SlidersHorizontal } from 'lucide-react';
import type { SortCriteria, Filters } from '../types';

interface FilterBarProps {
  sortBy: SortCriteria;
  onSortChange: (sort: SortCriteria) => void;
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

export function FilterBar({ sortBy, onSortChange, filters, onFiltersChange }: FilterBarProps) {
  const handlePriceLevelToggle = (price: '€' | '€€' | '€€€') => {
    const current = filters.priceLevel || [];
    const updated = current.includes(price)
      ? current.filter(p => p !== price)
      : [...current, price];
    onFiltersChange({ ...filters, priceLevel: updated.length > 0 ? updated : undefined });
  };

  const handleSpeedToggle = (speed: 'rapido' | 'normal' | 'lento') => {
    const current = filters.speed || [];
    const updated = current.includes(speed)
      ? current.filter(s => s !== speed)
      : [...current, speed];
    onFiltersChange({ ...filters, speed: updated.length > 0 ? updated : undefined });
  };

  return (
    <div className="bg-white border-y-3 border-black py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-4">
          <SlidersHorizontal className="w-5 h-5" />
          <h3 className="font-bold text-lg">Filtros</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Ordenar por</label>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortCriteria)}
              className="input-retro"
            >
              <option value="rating">Mejor valorados</option>
              <option value="distance">Más cercanos</option>
              <option value="price">Más baratos</option>
              <option value="recent">Visitados recientemente</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Precio</label>
            <div className="flex gap-2">
              {(['€', '€€', '€€€'] as const).map((price) => (
                <button
                  key={price}
                  type="button"
                  onClick={() => handlePriceLevelToggle(price)}
                  className={`px-4 py-2 rounded-xl border-3 border-black font-bold transition-all ${
                    filters.priceLevel?.includes(price)
                      ? 'bg-retro-pink shadow-retro'
                      : 'bg-white shadow-retro-sm'
                  }`}
                >
                  {price}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Velocidad</label>
            <div className="flex gap-2">
              {(['rapido', 'normal', 'lento'] as const).map((speed) => (
                <button
                  key={speed}
                  type="button"
                  onClick={() => handleSpeedToggle(speed)}
                  className={`px-3 py-2 rounded-xl border-3 border-black font-bold text-xs transition-all ${
                    filters.speed?.includes(speed)
                      ? 'bg-retro-yellow shadow-retro'
                      : 'bg-white shadow-retro-sm'
                  }`}
                >
                  {speed === 'rapido' ? 'Rápido' : speed === 'normal' ? 'Normal' : 'Lento'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Distancia máx. (min)</label>
            <input
              type="number"
              min="1"
              max="60"
              value={filters.maxDistance || ''}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  maxDistance: e.target.value ? parseInt(e.target.value) : undefined,
                })
              }
              className="input-retro"
              placeholder="Sin límite"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
