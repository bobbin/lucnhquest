import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { restaurantService } from '../services/restaurantService';
import type { Restaurant } from '../types';

export function AdminPanel() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<Restaurant>>({
    name: '',
    address: '',
    price_level: '€',
    distance_minutes: 10,
    cuisine_type: '',
    speed: 'normal',
    maps_url: '',
    internal_notes: '',
  });

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      const data = await restaurantService.getAll();
      setRestaurants(data);
    } catch (error) {
      console.error('Error loading restaurants:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setIsAdding(true);
    setFormData({
      name: '',
      address: '',
      price_level: '€',
      distance_minutes: 10,
      cuisine_type: '',
      speed: 'normal',
      maps_url: '',
      internal_notes: '',
    });
  };

  const handleEdit = (restaurant: Restaurant) => {
    setEditingId(restaurant.id);
    setFormData(restaurant);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({});
  };

  const handleSave = async () => {
    try {
      if (isAdding) {
        await restaurantService.create(formData as any);
      } else if (editingId) {
        await restaurantService.update(editingId, formData);
      }
      await loadRestaurants();
      handleCancel();
    } catch (error) {
      console.error('Error saving restaurant:', error);
      alert('Error al guardar el restaurante');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Seguro que quieres eliminar este restaurante?')) return;

    try {
      await restaurantService.delete(id);
      await loadRestaurants();
    } catch (error) {
      console.error('Error deleting restaurant:', error);
      alert('Error al eliminar el restaurante');
    }
  };

  const RestaurantForm = () => (
    <div className="card-retro mb-6">
      <h3 className="font-display font-bold text-xl mb-4">
        {isAdding ? 'Nuevo Restaurante' : 'Editar Restaurante'}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Nombre *</label>
          <input
            type="text"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="input-retro"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Dirección *</label>
          <input
            type="text"
            value={formData.address || ''}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="input-retro"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Precio *</label>
          <select
            value={formData.price_level || '€'}
            onChange={(e) => setFormData({ ...formData, price_level: e.target.value as any })}
            className="input-retro"
          >
            <option value="€">€</option>
            <option value="€€">€€</option>
            <option value="€€€">€€€</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Distancia (minutos) *</label>
          <input
            type="number"
            min="1"
            value={formData.distance_minutes ?? ''}
            onChange={(e) => {
              const value = e.target.value;
              const numValue = parseInt(value);
              setFormData({
                ...formData,
                distance_minutes: !isNaN(numValue) && numValue > 0 ? numValue : 1
              });
            }}
            className="input-retro"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Tipo de cocina *</label>
          <input
            type="text"
            value={formData.cuisine_type || ''}
            onChange={(e) => setFormData({ ...formData, cuisine_type: e.target.value })}
            className="input-retro"
            placeholder="Ej: Italiana, China, Mexicana"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Velocidad *</label>
          <select
            value={formData.speed || 'normal'}
            onChange={(e) => setFormData({ ...formData, speed: e.target.value as any })}
            className="input-retro"
          >
            <option value="rapido">Rápido</option>
            <option value="normal">Normal</option>
            <option value="lento">Lento</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold mb-2">URL de Google Maps</label>
          <input
            type="url"
            value={formData.maps_url || ''}
            onChange={(e) => setFormData({ ...formData, maps_url: e.target.value })}
            className="input-retro"
            placeholder="https://maps.google.com/..."
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold mb-2">Notas internas</label>
          <textarea
            value={formData.internal_notes || ''}
            onChange={(e) => setFormData({ ...formData, internal_notes: e.target.value })}
            className="input-retro min-h-20 resize-none"
            placeholder="Notas para el equipo..."
          />
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button onClick={handleCancel} className="btn-white flex-1">
          <X className="w-4 h-4 inline mr-2" />
          Cancelar
        </button>
        <button onClick={handleSave} className="btn-primary flex-1">
          <Save className="w-4 h-4 inline mr-2" />
          Guardar
        </button>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-black border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-retro-cream py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-display font-bold">Panel de Administración</h2>
          {!isAdding && !editingId && (
            <button onClick={handleAdd} className="btn-primary">
              <Plus className="w-5 h-5 inline mr-2" />
              Añadir Restaurante
            </button>
          )}
        </div>

        {(isAdding || editingId) && <RestaurantForm />}

        <div className="space-y-4">
          {restaurants.map((restaurant) => (
            <div key={restaurant.id} className="card-retro">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">{restaurant.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{restaurant.address}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="badge-retro bg-retro-pink">{restaurant.price_level}</span>
                    <span className="badge-retro bg-retro-yellow">{restaurant.distance_minutes} min</span>
                    <span className="badge-retro bg-retro-purple-light text-white">{restaurant.cuisine_type}</span>
                    <span className="badge-retro bg-retro-cream">
                      {restaurant.speed === 'rapido' ? 'Rápido' : restaurant.speed === 'normal' ? 'Normal' : 'Lento'}
                    </span>
                  </div>
                  {restaurant.internal_notes && (
                    <p className="text-sm text-gray-500 mt-2 italic">{restaurant.internal_notes}</p>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(restaurant)}
                    className="p-2 bg-retro-yellow border-3 border-black rounded-xl shadow-retro-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(restaurant.id)}
                    className="p-2 bg-red-400 border-3 border-black rounded-xl shadow-retro-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
