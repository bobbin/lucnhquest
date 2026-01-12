import { ReactNode } from 'react';
import { Menu, Sparkles } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen">
      <nav className="bg-retro-cream border-b-3 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Sparkles className="w-8 h-8" />
              <span className="text-2xl font-display font-bold">LunchQuest</span>
            </div>
            <button className="lg:hidden p-2">
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden lg:flex gap-6">
              <a href="#ranking" className="font-semibold hover:text-retro-purple transition-colors">
                Ranking
              </a>
              <a href="#stats" className="font-semibold hover:text-retro-purple transition-colors">
                Estadísticas
              </a>
              <a href="#admin" className="font-semibold hover:text-retro-purple transition-colors">
                Admin
              </a>
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}
