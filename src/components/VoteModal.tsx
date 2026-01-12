import { useState } from 'react';
import { X, Star } from 'lucide-react';
import type { RestaurantWithStats } from '../types';
import { voteService } from '../services/voteService';

interface VoteModalProps {
  restaurant: RestaurantWithStats;
  onClose: () => void;
  onVoteSubmitted: () => void;
}

export function VoteModal({ restaurant, onClose, onVoteSubmitted }: VoteModalProps) {
  const [userName, setUserName] = useState('');
  const [scoreOverall, setScoreOverall] = useState(3);
  const [scoreFood, setScoreFood] = useState(3);
  const [scoreQuantity, setScoreQuantity] = useState(3);
  const [scorePrice, setScorePrice] = useState(3);
  const [scoreAmbience, setScoreAmbience] = useState(3);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!userName.trim()) {
      setError('Por favor, introduce tu nombre');
      return;
    }

    setIsSubmitting(true);

    try {
      await voteService.createVote({
        restaurant_id: restaurant.id,
        user_name: userName.trim(),
        score_overall: scoreOverall,
        score_food: scoreFood,
        score_quantity: scoreQuantity,
        score_price: scorePrice,
        score_ambience: scoreAmbience,
        comment: comment.trim() || null,
      });

      onVoteSubmitted();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar la valoración');
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = ({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) => (
    <div className="mb-4">
      <label className="block text-sm font-semibold mb-2">{label}</label>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((score) => (
          <button
            key={score}
            type="button"
            onClick={() => onChange(score)}
            className={`w-12 h-12 rounded-full border-3 border-black font-bold transition-all ${
              score <= value
                ? 'bg-retro-yellow shadow-retro scale-110'
                : 'bg-white shadow-retro-sm'
            }`}
          >
            {score}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-retro-cream rounded-3xl border-3 border-black shadow-retro-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-retro-cream border-b-3 border-black p-6 flex justify-between items-center">
          <h2 className="text-3xl font-display font-bold">Valorar {restaurant.name}</h2>
          <button onClick={onClose} className="p-2 hover:bg-black hover:bg-opacity-10 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="bg-red-100 border-3 border-red-500 rounded-xl p-4 mb-4">
              <p className="text-red-700 font-semibold">{error}</p>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">Tu nombre</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="input-retro"
              placeholder="Escribe tu nombre"
              required
            />
          </div>

          <StarRating
            value={scoreOverall}
            onChange={setScoreOverall}
            label="Valoración general"
          />

          <div className="bg-white rounded-2xl border-3 border-black p-4 mb-4">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <Star className="w-5 h-5" />
              Valoración detallada
            </h3>

            <StarRating value={scoreFood} onChange={setScoreFood} label="Comida" />
            <StarRating value={scoreQuantity} onChange={setScoreQuantity} label="Cantidad" />
            <StarRating value={scorePrice} onChange={setScorePrice} label="Precio" />
            <StarRating value={scoreAmbience} onChange={setScoreAmbience} label="Ambiente" />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">Comentario (opcional)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="input-retro min-h-24 resize-none"
              placeholder="Cuéntanos tu experiencia..."
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-white flex-1"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar valoración'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
