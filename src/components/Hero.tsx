import { Dices } from 'lucide-react';

interface HeroProps {
  onSurprise: () => void;
}

export function Hero({ onSurprise }: HeroProps) {
  return (
    <div className="relative overflow-hidden bg-retro-purple py-20">
      <div className="absolute inset-0 opacity-10">
        <svg className="absolute top-10 left-10 w-20 h-20" viewBox="0 0 100 100">
          <path d="M50 10 L90 90 L10 90 Z" fill="currentColor" />
        </svg>
        <svg className="absolute bottom-20 right-20 w-32 h-32" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="4" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl font-bold mb-4">
            <span className="bg-gradient-to-r from-retro-pink via-retro-pink-light to-retro-pink bg-clip-text text-transparent drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              RETRO
            </span>
            <br />
            <span className="bg-gradient-to-r from-retro-pink via-retro-pink-light to-retro-pink bg-clip-text text-transparent drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              LUNCH
            </span>
            <br />
            <span className="bg-gradient-to-r from-retro-purple-light via-retro-purple to-retro-purple-dark bg-clip-text text-transparent drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              QUEST
            </span>
          </h1>

          <p className="text-white text-lg sm:text-xl mb-8 max-w-2xl mx-auto font-medium">
            El sistema definitivo para elegir donde comer con tu equipo
          </p>

          <button onClick={onSurprise} className="btn-primary text-lg inline-flex items-center gap-2">
            <Dices className="w-6 h-6" />
            Sorpréndeme
          </button>
        </div>
      </div>
    </div>
  );
}
