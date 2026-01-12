import { Zap, DollarSign, Star, Compass } from 'lucide-react';
import type { Mood } from '../types';

interface MoodSelectorProps {
  selectedMood: Mood | null;
  onSelectMood: (mood: Mood | null) => void;
}

export function MoodSelector({ selectedMood, onSelectMood }: MoodSelectorProps) {
  const moods = [
    { id: 'fast' as Mood, label: 'Rápido', icon: Zap, color: 'bg-retro-yellow' },
    { id: 'cheap' as Mood, label: 'Barato', icon: DollarSign, color: 'bg-retro-pink' },
    { id: 'quality' as Mood, label: 'Calidad', icon: Star, color: 'bg-retro-orange' },
    { id: 'new' as Mood, label: 'Nuevo', icon: Compass, color: 'bg-retro-purple-light' },
  ];

  return (
    <div className="bg-retro-cream border-y-3 border-black py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-display font-bold text-center mb-6">
          ¿Qué te apetece hoy?
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          {moods.map((mood) => {
            const Icon = mood.icon;
            const isSelected = selectedMood === mood.id;
            return (
              <button
                key={mood.id}
                onClick={() => onSelectMood(isSelected ? null : mood.id)}
                className={`${mood.color} ${
                  isSelected ? 'ring-4 ring-black scale-105' : ''
                } px-6 py-3 rounded-full border-3 border-black font-bold shadow-retro transition-all duration-200 hover:translate-x-1 hover:translate-y-1 hover:shadow-retro-sm flex items-center gap-2`}
              >
                <Icon className="w-5 h-5" />
                {mood.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
